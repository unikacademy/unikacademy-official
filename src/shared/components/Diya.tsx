// Small glowing diya (clay oil lamp) for the festive banner. Original SVG art.
// The `diya-flame` / `diya-glow` classes are animated by the <style> block in
// SaleBanner.tsx (and disabled there for reduced motion).

export default function Diya({ delayed = false }: { delayed?: boolean }) {
  const id = delayed ? "diya-b" : "diya-a";

  return (
    <svg
      aria-hidden
      viewBox="0 0 64 56"
      className={`h-9 w-10 flex-shrink-0 overflow-visible ${delayed ? "diya-alt" : ""}`}
    >
      <defs>
        <radialGradient id={`${id}-glow`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fde68a" stopOpacity="0.9" />
          <stop offset="60%" stopColor="#f59e0b" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-flame`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#f97316" />
          <stop offset="55%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#fef9c3" />
        </linearGradient>
        <linearGradient id={`${id}-clay`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ea580c" />
          <stop offset="100%" stopColor="#7c2d12" />
        </linearGradient>
      </defs>

      {/* halo */}
      <circle className="diya-glow" cx="32" cy="20" r="18" fill={`url(#${id}-glow)`} />

      {/* flame */}
      <g className="diya-flame">
        <path d="M32 6 C37 14 38 20 32 30 C26 20 27 14 32 6 Z" fill={`url(#${id}-flame)`} />
        <path d="M32 16 C34 20 34 24 32 28 C30 24 30 20 32 16 Z" fill="#fff7ed" opacity="0.9" />
      </g>

      {/* wick */}
      <rect x="31" y="28" width="2" height="4" rx="1" fill="#451a03" />

      {/* clay bowl with a pointed spout */}
      <path
        d="M6 32 H50 L60 28 C58 36 54 40 50 42 C44 48 20 48 14 42 C9 38 6 36 6 32 Z"
        fill={`url(#${id}-clay)`}
      />
      <path d="M8 32 H50" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" />
      {/* painted dots */}
      <circle cx="18" cy="38" r="1.6" fill="#fde68a" />
      <circle cx="26" cy="40" r="1.6" fill="#fde68a" />
      <circle cx="34" cy="40" r="1.6" fill="#fde68a" />
      <circle cx="42" cy="38" r="1.6" fill="#fde68a" />
    </svg>
  );
}
