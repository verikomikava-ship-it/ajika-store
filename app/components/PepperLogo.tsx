export default function PepperLogo({ size = 64 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Left pepper - curves from top-right to bottom-left */}
      <g transform="rotate(-15, 50, 60)">
        {/* Stem */}
        <path
          d="M 44 8 Q 46 2, 48 0"
          stroke="#2D8B3A"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        {/* Pepper body */}
        <path
          d="M 38 18 Q 32 10, 44 8 Q 56 10, 50 18 Q 48 28, 44 45 Q 40 62, 36 78 Q 33 88, 30 95 Q 28 100, 32 98 Q 36 94, 38 88 Q 42 74, 44 60 Q 46 48, 48 36 Q 50 24, 50 18 Z"
          fill="#C1331E"
        />
        {/* Highlight */}
        <path
          d="M 42 20 Q 40 28, 39 40 Q 38 50, 36 62"
          stroke="rgba(255,255,255,0.25)"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        {/* Seeds */}
        <circle cx="43" cy="24" r="2" fill="rgba(255,220,180,0.6)" />
        <circle cx="41" cy="32" r="1.8" fill="rgba(255,220,180,0.5)" />
        <circle cx="42" cy="40" r="1.5" fill="rgba(255,220,180,0.4)" />
      </g>

      {/* Right pepper - curves from top-left to bottom-right (mirrored & crossed) */}
      <g transform="translate(100, 0) scale(-1, 1) rotate(-15, 50, 60)">
        {/* Stem */}
        <path
          d="M 44 8 Q 46 2, 48 0"
          stroke="#2D8B3A"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        {/* Pepper body */}
        <path
          d="M 38 18 Q 32 10, 44 8 Q 56 10, 50 18 Q 48 28, 44 45 Q 40 62, 36 78 Q 33 88, 30 95 Q 28 100, 32 98 Q 36 94, 38 88 Q 42 74, 44 60 Q 46 48, 48 36 Q 50 24, 50 18 Z"
          fill="#8B1A1A"
        />
        {/* Highlight */}
        <path
          d="M 42 20 Q 40 28, 39 40 Q 38 50, 36 62"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        {/* Seeds */}
        <circle cx="43" cy="24" r="2" fill="rgba(255,220,180,0.5)" />
        <circle cx="41" cy="32" r="1.8" fill="rgba(255,220,180,0.4)" />
      </g>
    </svg>
  );
}
