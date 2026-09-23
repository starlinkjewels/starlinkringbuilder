/**
 * Loading state for the 3D viewer: the Starlink diamond drawing itself in,
 * a twinkling star, and a progress bar driven by real load stages.
 *
 * `overlay` is the compact variant shown over the previous ring while a new
 * configuration loads; the full variant covers the very first load.
 */
export function RingLoader({
  progress,
  label,
  overlay = false,
}: {
  progress: number;
  label: string;
  overlay?: boolean;
}) {
  const pct = Math.round(Math.min(100, Math.max(0, progress)));

  return (
    <div
      className={`ring-loader ${overlay ? "ring-loader--overlay" : ""}`}
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={pct}
    >
      <div className="ring-loader__mark">
        <span className="ring-loader__halo" aria-hidden />
        <svg viewBox="0 0 64 64" aria-hidden>
          {/* Facets first, so the outline draws over them. */}
          <path
            className="ring-loader__facets"
            d="M6 24 H58 M18 10 L26 24 L32 56 M46 10 L38 24 L32 56 M26 24 L32 10 L38 24"
            pathLength={1}
          />
          <path
            className="ring-loader__outline"
            d="M18 10 H46 L58 24 L32 56 L6 24 Z"
            pathLength={1}
          />
          <path
            className="ring-loader__star"
            d="M52 1 C52.6 5.4 53.6 6.4 58 7 C53.6 7.6 52.6 8.6 52 13 C51.4 8.6 50.4 7.6 46 7 C50.4 6.4 51.4 5.4 52 1 Z"
          />
        </svg>
      </div>

      <p className="ring-loader__label">{label}</p>
      <div className="ring-loader__track" aria-hidden>
        <span className="ring-loader__fill" style={{ width: `${pct}%` }} />
      </div>
      <span className="ring-loader__pct" aria-hidden>
        {pct}%
      </span>
    </div>
  );
}
