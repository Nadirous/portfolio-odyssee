import { useId } from 'react';
import { useStore } from '../../store/useStore';

export const MAP_WIDTH = 800;
export const MAP_HEIGHT = 3100;

export default function SeaPath() {
  const filterId = useId();
  const seaPath = useStore((s) => s.seaPath);

  return (
    <>
      <defs>
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
        d={seaPath}
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
    </>
  );
}
