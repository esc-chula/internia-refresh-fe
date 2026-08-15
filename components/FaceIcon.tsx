export type Score = 1 | 2 | 3 | 4 | 5;

export const scoreFills: Record<Score, string> = {
  1: "#ea4335",
  2: "#f2994a",
  3: "#f2c94c",
  4: "#7cb342",
  5: "#27ae60",
};

export const scoreTextClass: Record<Score, string> = {
  1: "text-[#ea4335]",
  2: "text-[#f2994a]",
  3: "text-[#f2c94c]",
  4: "text-[#7cb342]",
  5: "text-[#27ae60]",
};

export function scoreToFace(score: number): Score {
  if (score >= 4.5) return 5;
  if (score >= 4) return 4;
  if (score >= 3) return 3;
  if (score >= 2) return 2;
  return 1;
}

export function FaceIcon({ score, className = "h-[18px] w-[18px] shrink-0 rounded-[5px]" }: { score: Score; className?: string }) {
  return (
    <svg className={`block overflow-hidden ${className}`} viewBox="0 0 100 100" aria-hidden="true">
      <rect width="100" height="100" rx="20" fill={scoreFills[score]} />
      {score === 1 && (
        <>
          <path d="M 30,35 Q 35,42 40,38" stroke="#111" strokeWidth="4" strokeLinecap="round" fill="none" />
          <path d="M 70,35 Q 65,42 60,38" stroke="#111" strokeWidth="4" strokeLinecap="round" fill="none" />
          <circle cx="35" cy="45" r="3.5" fill="#111" />
          <circle cx="65" cy="45" r="3.5" fill="#111" />
          <path d="M 33,72 Q 50,55 67,72" stroke="#111" strokeWidth="5" strokeLinecap="round" fill="none" />
        </>
      )}
      {score === 2 && (
        <>
          <circle cx="35" cy="42" r="4" fill="#111" />
          <circle cx="65" cy="42" r="4" fill="#111" />
          <path d="M 33,68 Q 50,55 67,68" stroke="#111" strokeWidth="5" strokeLinecap="round" fill="none" />
        </>
      )}
      {score === 3 && (
        <>
          <circle cx="35" cy="42" r="4" fill="#111" />
          <circle cx="65" cy="42" r="4" fill="#111" />
          <line x1="33" y1="65" x2="67" y2="65" stroke="#111" strokeWidth="5" strokeLinecap="round" />
        </>
      )}
      {score === 4 && (
        <>
          <circle cx="35" cy="42" r="4" fill="#111" />
          <circle cx="65" cy="42" r="4" fill="#111" />
          <path d="M 32,60 Q 50,75 68,60" stroke="#111" strokeWidth="5" strokeLinecap="round" fill="none" />
        </>
      )}
      {score === 5 && (
        <>
          <path d="M 28,38 Q 35,32 42,38" stroke="#111" strokeWidth="4" strokeLinecap="round" fill="none" />
          <path d="M 58,38 Q 65,32 72,38" stroke="#111" strokeWidth="4" strokeLinecap="round" fill="none" />
          <path d="M 30,55 Q 50,82 70,55 Z" fill="#fff" stroke="#111" strokeWidth="4" strokeLinejoin="round" />
        </>
      )}
    </svg>
  );
}
