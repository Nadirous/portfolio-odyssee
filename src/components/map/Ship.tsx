import { forwardRef } from 'react';

// Ship is a pure SVG visual — positioning is handled by MapContainer
const Ship = forwardRef<SVGGElement>((_props, ref) => {
  return (
    <g ref={ref} id="ship">
      {/* Wake trail */}
      <g opacity="0.4">
        <ellipse cx="0" cy="8" rx="12" ry="3" fill="rgba(255,255,255,0.3)">
          <animate attributeName="rx" values="12;20;12" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.4;0.1;0.4" dur="2s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="-5" cy="14" rx="8" ry="2" fill="rgba(255,255,255,0.2)">
          <animate attributeName="rx" values="8;15;8" dur="2.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.3;0.05;0.3" dur="2.5s" repeatCount="indefinite" />
        </ellipse>
      </g>

      {/* Ship hull */}
      <path
        d="M -15 5 Q -18 0 -12 -8 L 12 -8 Q 18 0 15 5 Z"
        fill="#8B4513"
        stroke="#5C2E0A"
        strokeWidth="1"
      />
      {/* Deck */}
      <rect x="-8" y="-10" width="16" height="4" rx="1" fill="#A0522D" />
      {/* Mast */}
      <line x1="0" y1="-10" x2="0" y2="-30" stroke="#5C2E0A" strokeWidth="2" />
      {/* Sail */}
      <path
        d="M 1 -28 Q 14 -22 1 -12"
        fill="#FDF8E8"
        stroke="#D4A854"
        strokeWidth="0.5"
      >
        <animate
          attributeName="d"
          values="M 1 -28 Q 14 -22 1 -12;M 1 -28 Q 12 -20 1 -12;M 1 -28 Q 14 -22 1 -12"
          dur="3s"
          repeatCount="indefinite"
        />
      </path>
      {/* Flag */}
      <path d="M 0 -30 L 6 -28 L 0 -26" fill="#c0392b">
        <animate
          attributeName="d"
          values="M 0 -30 L 6 -28 L 0 -26;M 0 -30 L 5 -27 L 0 -26;M 0 -30 L 6 -28 L 0 -26"
          dur="1.5s"
          repeatCount="indefinite"
        />
      </path>
    </g>
  );
});

Ship.displayName = 'Ship';
export default Ship;
