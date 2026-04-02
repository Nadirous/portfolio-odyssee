import { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger } from '../../hooks/useGSAP';
import { useStore } from '../../store/useStore';
import SeaPath, { MAP_WIDTH, MAP_HEIGHT } from './SeaPath';
import OceanBackground from './OceanBackground';
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
  const seaPath = useStore((s) => s.seaPath);
  const setScrollProgress = useStore((s) => s.setScrollProgress);
  const setShipPosition = useStore((s) => s.setShipPosition);
  const setSpyglass = useStore((s) => s.setSpyglass);
  const [visible, setVisible] = useState(false);

  // (Re)create the hidden path element whenever seaPath changes
  useEffect(() => {
    pathElRef.current = createPathElement(seaPath);
  }, [seaPath]);

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

    const projectPositions = projects.map((p) => p.position / 100);

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

        // Spyglass zoom: detect proximity to any island
        let minDist = Infinity;
        for (const pos of projectPositions) {
          minDist = Math.min(minDist, Math.abs(progress - pos));
        }
        const spyglassThreshold = 0.04; // 4% of path length
        const isNearIsland = minDist < spyglassThreshold;
        const spyProgress = isNearIsland
          ? 1 - minDist / spyglassThreshold
          : 0;

        setSpyglass(isNearIsland, spyProgress);

        // Camera zoom when near island
        const zoomScale = isNearIsland ? 1 + spyProgress * 0.3 : 1;
        camera.style.transform = `translate(${-x}px, ${-y}px) scale(${zoomScale})`;
        camera.style.transition = 'transform 0.3s ease-out';

        setShipPosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
      },
    });

    return () => {
      trigger.kill();
      bobTl.kill();
    };
  }, [seaPath, projects, setScrollProgress, setShipPosition, setSpyglass]);

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
            transformOrigin: '0 0',
          }}
        >
          <svg
            viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
            width={MAP_WIDTH}
            height={MAP_HEIGHT}
          >
            <OceanBackground />
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
