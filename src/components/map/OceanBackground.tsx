import { useId } from 'react';
import { MAP_WIDTH, MAP_HEIGHT } from './SeaPath';

/** Layered ocean with waves, foam patches, depth gradient, and caustic shimmer */
export default function OceanBackground() {
  const id = useId();
  const gradId = `ocean-depth-${id}`;
  const causticId = `caustic-${id}`;
  const foamId = `foam-${id}`;

  // Generate wave layers (3 layers at different speeds/amplitudes)
  const waveLayers = [
    { amp: 6, freq: 0.008, ySpacing: 80, opacity: 0.08, dur: 8, color: 'rgba(255,255,255,' },
    { amp: 4, freq: 0.012, ySpacing: 120, opacity: 0.05, dur: 12, color: 'rgba(180,220,255,' },
    { amp: 8, freq: 0.006, ySpacing: 60, opacity: 0.06, dur: 15, color: 'rgba(255,255,255,' },
  ];

  // Generate foam clusters near random spots
  const foamClusters = Array.from({ length: 18 }, (_, i) => ({
    cx: (i * 173 + 50) % MAP_WIDTH,
    cy: (i * 271 + 100) % MAP_HEIGHT,
    r: 15 + (i % 4) * 8,
    delay: (i % 6) * 1.5,
  }));

  return (
    <>
      <defs>
        {/* Depth gradient — lighter at top, darker at bottom */}
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0d7fb3" stopOpacity="0.15" />
          <stop offset="40%" stopColor="#074d6d" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#021a27" stopOpacity="0.25" />
        </linearGradient>

        {/* Caustic light filter */}
        <filter id={causticId} x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.02 0.03" numOctaves="3" seed="5" result="noise">
            <animate attributeName="seed" values="1;10;1" dur="8s" repeatCount="indefinite" />
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="6" />
        </filter>

        {/* Foam glow */}
        <radialGradient id={foamId}>
          <stop offset="0%" stopColor="white" stopOpacity="0.15" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Depth overlay */}
      <rect x="0" y="0" width={MAP_WIDTH} height={MAP_HEIGHT} fill={`url(#${gradId})`} />

      {/* Caustic shimmer overlay */}
      <rect
        x="0" y="0"
        width={MAP_WIDTH} height={MAP_HEIGHT}
        fill="rgba(100,200,255,0.03)"
        filter={`url(#${causticId})`}
      />

      {/* Wave layers */}
      {waveLayers.map((layer, li) => {
        const paths: React.ReactNode[] = [];
        const numWaves = Math.floor(MAP_HEIGHT / layer.ySpacing);
        for (let w = 0; w < numWaves; w++) {
          const y = w * layer.ySpacing + 30;
          // Build a sine wave path
          let d = `M 0 ${y}`;
          for (let x = 0; x <= MAP_WIDTH; x += 20) {
            const dy = Math.sin(x * layer.freq + w * 1.5) * layer.amp;
            d += ` L ${x} ${y + dy}`;
          }
          paths.push(
            <path
              key={`wave-${li}-${w}`}
              d={d}
              fill="none"
              stroke={`${layer.color}${layer.opacity})`}
              strokeWidth="1.5"
              strokeLinecap="round"
            >
              <animateTransform
                attributeName="transform"
                type="translate"
                values={`0,0;${layer.amp * 3},${layer.amp * 0.5};0,0`}
                dur={`${layer.dur + w * 0.3}s`}
                repeatCount="indefinite"
              />
            </path>
          );
        }
        return <g key={`layer-${li}`}>{paths}</g>;
      })}

      {/* Foam clusters */}
      {foamClusters.map((f, i) => (
        <circle
          key={`foam-${i}`}
          cx={f.cx}
          cy={f.cy}
          r={f.r}
          fill={`url(#${foamId})`}
        >
          <animate
            attributeName="opacity"
            values="0.3;0.7;0.3"
            dur={`${4 + (i % 3)}s`}
            begin={`${f.delay}s`}
            repeatCount="indefinite"
          />
          <animate
            attributeName="r"
            values={`${f.r};${f.r + 5};${f.r}`}
            dur={`${5 + (i % 4)}s`}
            begin={`${f.delay}s`}
            repeatCount="indefinite"
          />
        </circle>
      ))}

      {/* Decorative sea creatures / kelp hints scattered lightly */}
      {[200, 800, 1400, 2000, 2600].map((y, i) => (
        <g key={`decor-${i}`} opacity="0.06">
          <path
            d={`M ${100 + i * 120} ${y} q 10 -20 0 -40 q -10 -20 0 -40`}
            fill="none"
            stroke="rgba(100,180,100,0.5)"
            strokeWidth="2"
          >
            <animate
              attributeName="d"
              values={`M ${100 + i * 120} ${y} q 10 -20 0 -40 q -10 -20 0 -40;M ${100 + i * 120} ${y} q -10 -20 0 -40 q 10 -20 0 -40;M ${100 + i * 120} ${y} q 10 -20 0 -40 q -10 -20 0 -40`}
              dur={`${6 + i}s`}
              repeatCount="indefinite"
            />
          </path>
        </g>
      ))}
    </>
  );
}
