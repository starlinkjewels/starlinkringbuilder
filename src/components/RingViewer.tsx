import { useEffect, useState } from "react";
import type { Metal, RingModelAssets, ViewName } from "@/types/ring";
import { ThreeRingViewer } from "./ThreeRingViewer";
import { Rotate360Icon } from "./RingIcons";

export type ViewerMode = "360" | ViewName;

/** The GLB viewer, plus the message shown if WebGL or a model fails. */
export function RingViewer({
  models,
  mode,
  metal,
  onModeChange,
}: {
  models: RingModelAssets;
  mode: ViewerMode;
  metal: Metal;
  onModeChange: (m: ViewerMode) => void;
}) {
  const [failed, setFailed] = useState(false);
  // Bumped by "Try again" to remount the viewer with a fresh WebGL context.
  const [attempt, setAttempt] = useState(0);

  // A new configuration is a new chance: its parts may load where the last did not.
  useEffect(() => setFailed(false), [models]);

  return (
    <div className="viewer-stage" data-testid="ring-viewer">
      {failed ? (
        <div className="viewer-fallback">
          <Rotate360Icon size={28} />
          <p>The 3D preview could not load.</p>
          <span>Your selections are saved — try again, or pick another combination.</span>
          <button
            type="button"
            className="link-btn"
            onClick={() => {
              setFailed(false);
              setAttempt((n) => n + 1);
            }}
          >
            Try again
          </button>
        </div>
      ) : (
        <ThreeRingViewer
          key={attempt}
          assets={models}
          mode={mode}
          metal={metal}
          onError={() => setFailed(true)}
        />
      )}

      {!failed && mode === "360" && (
        <button type="button" className="drag-hint" onClick={() => onModeChange("360")}>
          <Rotate360Icon size={18} />
          Drag to rotate
        </button>
      )}
    </div>
  );
}
