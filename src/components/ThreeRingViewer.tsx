import { useEffect, useMemo, useRef, useState } from "react";
import type { Metal, RingModelAssets, ViewName } from "@/types/ring";
import { RingLoader } from "./RingLoader";

export type ViewerMode = "360" | ViewName;

type RingRendererInstance = import("@/three/RingRenderer").RingRenderer;

/** Where the load currently is; each stage maps onto a slice of the progress bar. */
type Phase = "studio" | "model" | "finishing" | "ready";

const PHASE_LABEL: Record<Phase, string> = {
  studio: "Setting up the studio",
  model: "Crafting your ring",
  finishing: "Polishing the diamond",
  ready: "Ready",
};

/**
 * React shell around the three.js scene in src/three/RingRenderer.ts.
 *
 * The renderer is created once and then *told* about changes — it is never
 * rebuilt for a new metal or view. three.js is pulled in with a dynamic import
 * so it stays out of the SSR bundle and off the critical path; RingLoader
 * covers the gap.
 */
export function ThreeRingViewer({
  assets,
  mode,
  metal,
  onError,
}: {
  assets: RingModelAssets;
  mode: ViewerMode;
  metal: Metal;
  onError: () => void;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<RingRendererInstance | null>(null);
  // Settled by the mount effect, so the load effect can await the renderer
  // however long the environment maps take, instead of polling for it.
  const rendererReady = useMemo(() => deferred<RingRendererInstance | null>(), []);
  const [phase, setPhase] = useState<Phase>("studio");
  const [partsLoaded, setPartsLoaded] = useState(0);
  const [partsTotal, setPartsTotal] = useState(1);
  // Once a ring has been on screen, later loads dim it rather than hiding it.
  const [hasShown, setHasShown] = useState(false);

  // The callback is an inline arrow at the call site, so a new identity
  // arrives on every parent render. Holding it in a ref keeps it out of effect
  // deps, which would otherwise tear the WebGL context down and rebuild it.
  const onErrorRef = useRef(onError);
  onErrorRef.current = onError;

  // Identity for the set of parts, so a re-render with an equivalent assets
  // object does not trigger a reload.
  const partsKey = useMemo(
    () =>
      [
        assets.bandPath,
        assets.headPath,
        assets.diamondPath,
        assets.bandDiamondPath,
        assets.headDiamondPath,
      ].join("|"),
    [assets],
  );

  // Create the renderer once, and tear it down on unmount.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let cancelled = false;

    void (async () => {
      try {
        const { RingRenderer } = await import("@/three/RingRenderer");
        if (cancelled) return;
        // Async: the HDRI environments have to be fetched before anything can
        // be lit or traced.
        const renderer = await RingRenderer.create(container, metal);
        if (cancelled) {
          renderer.dispose();
          return;
        }
        rendererRef.current = renderer;
        rendererReady.resolve(renderer);
      } catch {
        // No WebGL, a lost context, or a chunk that failed to load.
        if (cancelled) return;
        rendererReady.resolve(null);
        onErrorRef.current();
      }
    })();

    return () => {
      // The promise is left pending here: StrictMode runs this effect twice,
      // and settling it now would starve the second, real mount.
      cancelled = true;
      rendererRef.current?.dispose();
      rendererRef.current = null;
    };
    // Deliberately empty: `metal` is only the initial value here and every later
    // change is pushed through setMetal below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load / swap the model.
  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const renderer = await rendererReady.promise;
      if (!renderer || cancelled) return;
      try {
        const { ringPartSources } = await import("@/three/ringGeometry");
        if (cancelled) return;
        const sources = ringPartSources(assets);
        setPartsTotal(sources.length);
        setPartsLoaded(0);
        setPhase("model");

        let loaded = 0;
        await renderer.setParts(sources, () => {
          if (cancelled) return;
          loaded += 1;
          setPartsLoaded(loaded);
          if (loaded === sources.length) setPhase("finishing");
        });
        if (cancelled) return;
        setPhase("ready");
        setHasShown(true);
      } catch {
        if (!cancelled) onErrorRef.current();
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [partsKey, assets, rendererReady]);

  const ready = phase === "ready";

  useEffect(() => {
    rendererRef.current?.setMetal(metal);
  }, [metal, ready]);

  useEffect(() => {
    rendererRef.current?.setMode(mode);
  }, [mode, ready]);

  // Idle the render loop when the viewer is offscreen or the tab is hidden.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let visible = true;
    let onscreen = true;
    const sync = () => rendererRef.current?.setRunning(visible && onscreen);

    const observer = new IntersectionObserver(([entry]) => {
      onscreen = entry?.isIntersecting ?? true;
      sync();
    });
    observer.observe(container);

    const onVisibility = () => {
      visible = document.visibilityState === "visible";
      sync();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  const progress = {
    studio: 12,
    model: 30 + (60 * partsLoaded) / Math.max(1, partsTotal),
    finishing: 94,
    ready: 100,
  }[phase];

  const canvasState = ready ? "glb-canvas--ready" : hasShown ? "glb-canvas--dim" : "";

  return (
    <div className="glb-viewer-shell">
      <div
        ref={containerRef}
        className={`glb-canvas ${canvasState}`}
        role="img"
        aria-label="Interactive custom ring 3D preview"
      />
      {!ready && <RingLoader progress={progress} label={PHASE_LABEL[phase]} overlay={hasShown} />}
    </div>
  );
}

/** A promise with its resolver exposed; later resolve calls are no-ops. */
function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((r) => {
    resolve = r;
  });
  return { promise, resolve };
}
