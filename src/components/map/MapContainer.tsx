import { useEffect, useRef, useMemo, useState } from 'react';
import { gsap, ScrollTrigger } from '../../hooks/useGSAP';
import { useStore } from '../../store/useStore';
import SeaPath, { MAP_WIDTH, MAP_HEIGHT, SEA_PATH_D } from './SeaPath';
import Ship from './Ship';
import Island from './Island';

function createPathElement(d: string): SVGPathElement {
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', d);
  return path;
}

function getPointAndAngle(
  pathEl: SVGPathElement,
  progress: number
): { x: number; y: number; angle: number } {
  const len = pathEl.getTotalLength();
  const t = Math.min(1, Math.max(0, progress));
  const p = pathEl.getPointAtLength(len * t);
  const delta = Math.min(1, len * 0.0005);
  const p2 = pathEl.getPointAtLength(Math.min(len, len * t + delta));
  const angle = (Math.atan2(p2.y - p.y, p2.x - p.x) * 180) / Math.PI;
  return { x: p.x, y: p.y, angle };
}

export default function MapContainer() {
  const cameraRef = useRef<HTMLDivElement>(null);
  const shipRef = useRef<SVGGElement>(null);
  const pathElRef = useRef<SVGPathElement | null>(null);
  const projects = useStore((s) => s.projects);
  const biome = useStore((s) => s.biome);
  const setScrollProgress = useStore((s) => s.setScrollProgress);
  const setShipPosition = useStore((s) => s.setShipPosition);
  const [visible, setVisible] = useState(false);

  const waveData = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => ({
      x: Math.floor((i * 137.5 + 42) % MAP_WIDTH),
      y: Math.floor((i * 103.7 + 17) % MAP_HEIGHT),
      dur: 3 + (i % 5) * 0.4,
      delay: (i % 7) * 0.6,
    }));
  }, []);

  useEffect(() => {
    pathElRef.current = createPathElement(SEA_PATH_D);
  }, []);

  useEffect(() => {
    if (!cameraRef.current || !shipRef.current || !pathElRef.current) return;

    const pathEl = pathElRef.current;
    const ship = shipRef.current;
    const camera = cameraRef.current;

    let bobY = 0;
    let bobR = 0;
    const bobTl = gsap.to({}, {
      duration: 2.5,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      onUpdate: function () {
        const p = this.progress();
        bobY = Math.sin(p * Math.PI * 2) * 3;
        bobR = Math.sin(p * Math.PI * 2) * 1.5;
      },
    });

    const trigger = ScrollTrigger.create({
      trigger: '#map-container',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1.5,
      onToggle: (self) => setVisible(self.isActive),
      onUpdate: (self) => {
        const progress = self.progress;
        setScrollProgress(progress);

        const { x, y, angle } = getPointAndAngle(pathEl, progress);

        // Position ship on the SVG path
        ship.setAttribute(
          'transform',
          `translate(${x}, ${y + bobY}) rotate(${angle + bobR + 90})`
        );

        // Camera: fixed overlay, origin at viewport center.
        // translate(-x, -y) brings the ship SVG coord to center.
        camera.style.transform = `translate(${-x}px, ${-y}px)`;

        setShipPosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
      },
    });

    return () => {
      trigger.kill();
      bobTl.kill();
    };
  }, [setScrollProgress, setShipPosition]);

  return (
    <>
      {/* Scroll spacer — drives ScrollTrigger */}
      <div
        id="map-container"
        className="relative"
        style={{ height: `${MAP_HEIGHT * 1.8}px` }}
      />

      {/* Fixed viewport overlay — visible only during the map section */}
      <div
        className="fixed inset-0 overflow-hidden pointer-events-none"
        style={{
          zIndex: 10,
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.3s',
          pointerEvents: visible ? 'auto' : 'none',
        }}
      >
        {/* Ocean background */}
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at 50% 50%, ${biome.oceanLightColor}22, ${biome.oceanColor})`,
          }}
        />

        {/* Camera: pinned at viewport center, translates to follow ship */}
        <div
          ref={cameraRef}
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
          }}
        >
          <svg
            viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
            width={MAP_WIDTH}
            height={MAP_HEIGHT}
          >
            {waveData.map((w, i) => (
              <g key={i} transform={`translate(${w.x}, ${w.y})`}>
                <path
                  d="M -8 0 Q -4 -3 0 0 Q 4 3 8 0"
                  fill="none"
                  stroke="rgba(255,255,255,0.15)"
                  strokeWidth="1"
                >
                  <animate
                    attributeName="opacity"
                    values="0.1;0.3;0.1"
                    dur={`${w.dur}s`}
                    begin={`${w.delay}s`}
                    repeatCount="indefinite"
                  />
                </path>
              </g>
            ))}

            <SeaPath />

            {projects.map((project, i) => (
              <Island key={project.id} project={project} index={i} />
            ))}

            <Ship ref={shipRef} />
          </svg>
        </div>
      </div>
    </>
  );
}
