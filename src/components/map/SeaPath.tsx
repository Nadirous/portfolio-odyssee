import { useId } from 'react';

// The main SVG path the ship follows — a sinuous route across the map
export const SEA_PATH_D =
  'M 400 50 C 250 200, 550 350, 350 500 S 150 700, 400 850 S 650 1000, 350 1150 S 100 1350, 400 1500 S 700 1650, 350 1800 S 50 2000, 400 2150 S 750 2300, 400 2450 S 100 2600, 400 2750 S 650 2900, 400 3050';

export const MAP_WIDTH = 800;
export const MAP_HEIGHT = 3100;

export default function SeaPath() {
  const filterId = useId();

  return (
    <svg
      className="absolute inset-0 w-full h-full"
      viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
      preserveAspectRatio="xMidYMid slice"
      style={{ pointerEvents: 'none' }}
    >
      <defs>
        {/* Dotted path style for treasure map */}
        <filter id={filterId}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.015"
            numOctaves="3"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="3"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>

      {/* Dashed route line */}
      <path
        d={SEA_PATH_D}
        fill="none"
        stroke="rgba(212, 160, 23, 0.25)"
        strokeWidth="4"
        strokeDasharray="12 8"
        filter={`url(#${filterId})`}
      />

      {/* Decorative compass rose at start */}
      <g transform="translate(400, 50)" opacity="0.3">
        <circle r="20" fill="none" stroke="var(--color-gold)" strokeWidth="1" />
        <line x1="0" y1="-25" x2="0" y2="25" stroke="var(--color-gold)" strokeWidth="1" />
        <line x1="-25" y1="0" x2="25" y2="0" stroke="var(--color-gold)" strokeWidth="1" />
        <text y="-30" textAnchor="middle" fill="var(--color-gold)" fontSize="10" fontFamily="serif">N</text>
      </g>
    </svg>
  );
}
