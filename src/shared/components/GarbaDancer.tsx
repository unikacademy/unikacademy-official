// Small chibi-style garba dancers for the festive banner. Original SVG art.
// The `garba-dancer` / `garba-arm` / `garba-braid` classes are animated by the
// <style> block in SaleBanner.tsx (and disabled there for reduced motion).

const SKIN = "#fcd5b0";
const INK = "#1f1020";

function Face({ boy }: { boy?: boolean }) {
  return (
    <>
      <circle cx="32" cy="24" r="14" fill={SKIN} />
      {/* eyes */}
      <ellipse cx="26.5" cy="26" rx="2.6" ry="3.4" fill={INK} />
      <ellipse cx="37.5" cy="26" rx="2.6" ry="3.4" fill={INK} />
      <circle cx="27.3" cy="24.8" r="1" fill="#fff" />
      <circle cx="38.3" cy="24.8" r="1" fill="#fff" />
      {/* blush */}
      <ellipse cx="22.5" cy="31" rx="3" ry="1.8" fill="#fb7185" opacity="0.5" />
      <ellipse cx="41.5" cy="31" rx="3" ry="1.8" fill="#fb7185" opacity="0.5" />
      {boy ? (
        <path d="M28 31 Q32 37 36 31 Z" fill="#9f1239" />
      ) : (
        <path d="M29 32 Q32 35 35 32" stroke="#9f1239" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      )}
    </>
  );
}

function Dandiya({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  return (
    <>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" />
      <circle cx={x1} cy={y1} r="2" fill="#dc2626" />
      <circle cx={x2} cy={y2} r="2" fill="#dc2626" />
    </>
  );
}

function Girl() {
  return (
    <>
      {/* braid */}
      <path className="garba-braid" d="M44 22 Q55 30 49 48" stroke={INK} strokeWidth="4.5" strokeLinecap="round" fill="none" />
      {/* raised arm with dandiya */}
      <g className="garba-arm">
        <path d="M24 42 L12 29" stroke={SKIN} strokeWidth="4.5" strokeLinecap="round" />
        <Dandiya x1={8} y1={37} x2={16} y2={19} />
        <circle cx="12" cy="28" r="2.6" fill={SKIN} />
      </g>
      {/* lower arm */}
      <path d="M40 43 L52 52" stroke={SKIN} strokeWidth="4.5" strokeLinecap="round" />
      <Dandiya x1={50} y1={60} x2={56} y2={43} />
      <circle cx="52" cy="52" r="2.6" fill={SKIN} />
      {/* chaniya (skirt) */}
      <path d="M22 48 L42 48 L57 78 Q32 85 7 78 Z" fill="#ec4899" />
      <path d="M9.5 74 Q32 81 54.5 74" stroke="#fde047" strokeWidth="2.5" fill="none" />
      {[[22, 63], [32, 68], [42, 63], [28, 57], [37, 58]].map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="1.3" fill="#fde047" />
      ))}
      {/* choli + dupatta sash */}
      <path d="M24 38 Q32 36 40 38 L42 50 L22 50 Z" fill="#2dd4bf" />
      <path d="M25 38 L40 50" stroke="#fef3c7" strokeWidth="3" strokeLinecap="round" />
      <Face />
      {/* hair */}
      <path d="M17.5 24 Q17.5 7.5 32 7.5 Q46.5 7.5 46.5 24 Q42 15.5 32 15.5 Q22 15.5 17.5 24 Z" fill={INK} />
      <ellipse cx="18.5" cy="28" rx="2.5" ry="6" fill={INK} />
      <ellipse cx="45.5" cy="28" rx="2.5" ry="6" fill={INK} />
      {/* marigold + bindi */}
      <circle cx="42" cy="11" r="3.6" fill="#f97316" />
      <circle cx="42" cy="11" r="1.5" fill="#fde047" />
      <circle cx="32" cy="19.5" r="1.2" fill="#dc2626" />
    </>
  );
}

function Boy() {
  return (
    <>
      {/* legs + shoes */}
      <path d="M22 60 L32 60 L31 79 L23 79 Z" fill="#fff7ed" />
      <path d="M32 60 L42 60 L41 79 L33 79 Z" fill="#fff7ed" />
      <ellipse cx="27" cy="80.5" rx="5.5" ry="2.5" fill="#7c2d12" />
      <ellipse cx="37" cy="80.5" rx="5.5" ry="2.5" fill="#7c2d12" />
      {/* kurta */}
      <path d="M22 38 Q32 35 42 38 L46 64 L18 64 Z" fill="#38bdf8" />
      <path d="M32 37 L32 64" stroke="#fde047" strokeWidth="1.6" />
      <path d="M18 62 L46 62" stroke="#fde047" strokeWidth="2" />
      {/* raised arm with dandiya */}
      <g className="garba-arm">
        <path d="M24 42 L12 29" stroke="#38bdf8" strokeWidth="5.5" strokeLinecap="round" />
        <Dandiya x1={8} y1={37} x2={16} y2={19} />
        <circle cx="12" cy="28" r="2.6" fill={SKIN} />
      </g>
      {/* lower arm */}
      <path d="M40 43 L52 52" stroke="#38bdf8" strokeWidth="5.5" strokeLinecap="round" />
      <Dandiya x1={50} y1={60} x2={56} y2={43} />
      <circle cx="52" cy="52" r="2.6" fill={SKIN} />
      <Face boy />
      {/* safa (turban) */}
      <path d="M17.5 22 Q17.5 6 32 6 Q46.5 6 46.5 22 Q40 16.5 32 16.5 Q24 16.5 17.5 22 Z" fill="#fde047" />
      <path d="M18.5 18.5 Q32 11 45.5 18.5" stroke="#dc2626" strokeWidth="2.6" fill="none" />
      <path d="M44 9 Q54 6 55 16 Q50 12 44 13 Z" fill="#fde047" />
      <circle cx="32" cy="12" r="2" fill="#dc2626" />
    </>
  );
}

export default function GarbaDancer({
  variant,
  className = "h-12 w-auto",
}: {
  variant: "girl" | "boy";
  className?: string;
}) {
  return (
    <span
      aria-hidden
      // The boy is mirrored so the pair face each other across the message.
      className={`inline-block flex-shrink-0 ${variant === "boy" ? "-scale-x-100" : ""}`}
    >
      <svg
        viewBox="0 0 64 84"
        className={`garba-dancer ${variant === "boy" ? "garba-dancer-alt" : ""} ${className}`}
      >
        {variant === "girl" ? <Girl /> : <Boy />}
      </svg>
    </span>
  );
}
