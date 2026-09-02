import { useId } from "react";

/**
 * The interlocking rings that stand in for the two O's. Drawn as three
 * strokes so the second ring passes over the first at the top and under it
 * at the bottom.
 */
export function Mark({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  const id = useId();
  const clip = `oo-${id.replace(/[^a-zA-Z0-9]/g, "")}`;
  return (
    <svg viewBox="0 0 124 72" className={className} style={style} aria-hidden="true" focusable="false">
      <defs>
        <clipPath id={clip}>
          <rect x="0" y="36" width="124" height="36" />
        </clipPath>
      </defs>
      <g fill="none" stroke="currentColor" strokeWidth="13">
        <circle cx="36" cy="36" r="29.5" />
        <circle cx="88" cy="36" r="29.5" />
        <circle cx="36" cy="36" r="29.5" clipPath={`url(#${clip})`} />
      </g>
    </svg>
  );
}

/** GOOD SORT wordmark, set in the display face with the interlocking OO. */
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span
      role="img"
      aria-label="Good Sort"
      className={`display inline-flex items-baseline whitespace-nowrap ${className}`}
    >
      <span aria-hidden="true">G</span>
      <Mark className="mx-[0.035em] shrink-0" style={{ height: "0.72em", width: "auto" }} />
      <span aria-hidden="true">D</span>
      <span aria-hidden="true" className="inline-block w-[0.24em]" />
      <span aria-hidden="true">SORT</span>
    </span>
  );
}
