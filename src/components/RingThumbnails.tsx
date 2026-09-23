import type { ViewName } from "@/types/ring";
import { Rotate360Icon } from "./RingIcons";
import type { ViewerMode } from "./RingViewer";

const VIEWS: { value: ViewName; label: string }[] = [
  { value: "front", label: "Front" },
  { value: "side", label: "Side" },
  { value: "top", label: "Top" },
  { value: "angle", label: "Angle" },
];

/**
 * Camera presets for the 3D viewer: a rail beside the stage on desktop, a row
 * beneath it on small screens.
 *
 * Deliberately outside the viewer rather than floating on top of it: sat over
 * the render the buttons covered the ring at exactly the width where the ring
 * was largest.
 */
export function RingThumbnails({
  mode,
  onSelect,
}: {
  mode: ViewerMode;
  onSelect: (m: ViewerMode) => void;
}) {
  return (
    <div className="thumb-rail" data-testid="preview-strip" role="tablist" aria-label="Ring views">
      <button
        type="button"
        role="tab"
        aria-selected={mode === "360"}
        onClick={() => onSelect("360")}
        className={`thumb thumb--label ${mode === "360" ? "thumb--selected" : ""}`}
      >
        <Rotate360Icon />
        <span>360°</span>
      </button>

      {VIEWS.map((view) => (
        <button
          key={view.value}
          type="button"
          role="tab"
          aria-selected={mode === view.value}
          onClick={() => onSelect(view.value)}
          aria-label={`${view.label} view`}
          className={`thumb thumb--label ${mode === view.value ? "thumb--selected" : ""}`}
        >
          <span>{view.label}</span>
        </button>
      ))}
    </div>
  );
}
