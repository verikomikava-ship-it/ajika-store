export default function PepperLogo({ size = 64 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Pepper 1 - top-left to bottom-right */}
      <g>
        {/* Stem */}
        <path
          d="M 28 5 Q 32 0, 35 -2"
          stroke="#2D8B3A"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="35" cy="-2" r="2" fill="#3DA84A" />
        {/* Body - curves from top-left down to bottom-right */}
        <path
          d="M 22 15 Q 18 8, 28 5 Q 38 8, 35 15
             Q 33 25, 38 40
             Q 44 55, 55 72
             Q 62 82, 68 92
             Q 72 98, 75 105
             Q 77 110, 73 108
             Q 69 104, 65 96
             Q 58 84, 50 70
             Q 42 56, 35 40
             Q 30 28, 28 20 Z"
          fill="#C1331E"
        />
        {/* Highlight */}
        <path
          d="M 27 18 Q 30 30, 36 45 Q 42 58, 50 72"
          stroke="rgba(255,255,255,0.25)"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        {/* Seeds */}
        <circle cx="30" cy="22" r="2" fill="rgba(255,220,180,0.6)" />
        <circle cx="33" cy="32" r="1.8" fill="rgba(255,220,180,0.5)" />
        <circle cx="37" cy="42" r="1.5" fill="rgba(255,220,180,0.4)" />
      </g>

      {/* Pepper 2 - top-right to bottom-left (crosses over pepper 1) */}
      <g>
        {/* Stem */}
        <path
          d="M 72 5 Q 68 0, 65 -2"
          stroke="#2D8B3A"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="65" cy="-2" r="2" fill="#3DA84A" />
        {/* Body - curves from top-right down to bottom-left */}
        <path
          d="M 78 15 Q 82 8, 72 5 Q 62 8, 65 15
             Q 67 25, 62 40
             Q 56 55, 45 72
             Q 38 82, 32 92
             Q 28 98, 25 105
             Q 23 110, 27 108
             Q 31 104, 35 96
             Q 42 84, 50 70
             Q 58 56, 65 40
             Q 70 28, 72 20 Z"
          fill="#8B1A1A"
        />
        {/* Highlight */}
        <path
          d="M 73 18 Q 70 30, 64 45 Q 58 58, 50 72"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        {/* Seeds */}
        <circle cx="70" cy="22" r="2" fill="rgba(255,220,180,0.5)" />
        <circle cx="67" cy="32" r="1.8" fill="rgba(255,220,180,0.4)" />
      </g>
    </svg>
  );
}
