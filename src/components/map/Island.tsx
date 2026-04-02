import { useMemo } from 'react';
import { useStore, type Project } from '../../store/useStore';
import {
  PalmtreeIcon, ServerIcon, TowerControlIcon, BrainIcon,
  CodeIcon, DatabaseIcon, GlobeIcon, RocketIcon,
  SmartphoneIcon, ShieldIcon, LayoutIcon, BoxIcon,
} from 'lucide-react';

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  'palm-tree': PalmtreeIcon,
  server: ServerIcon,
  lighthouse: TowerControlIcon,
  brain: BrainIcon,
  code: CodeIcon,
  database: DatabaseIcon,
  globe: GlobeIcon,
  rocket: RocketIcon,
  smartphone: SmartphoneIcon,
  shield: ShieldIcon,
  layout: LayoutIcon,
  box: BoxIcon,
};

function getPointOnPath(pathD: string, progress: number): { x: number; y: number } {
  const tempPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  tempPath.setAttribute('d', pathD);
  const totalLength = tempPath.getTotalLength();
  const point = tempPath.getPointAtLength(totalLength * progress);
  return { x: point.x, y: point.y };
}

interface IslandProps {
  project: Project;
  index: number;
}

export default function Island({ project, index }: IslandProps) {
  const openLogbook = useStore((s) => s.openLogbook);
  const scrollProgress = useStore((s) => s.scrollProgress);
  const seaPath = useStore((s) => s.seaPath);

  const IconComponent = ICON_MAP[project.icon] || GlobeIcon;

  // Compute position along path
  const pos = useMemo(() => {
    const point = getPointOnPath(seaPath, project.position / 100);
    const offsetX = index % 2 === 0 ? 80 : -80;
    return { x: point.x + offsetX, y: point.y };
  }, [seaPath, project.position, index]);

  // Visibility: show when scroll progress is near the island's position
  const proximity = Math.abs(scrollProgress * 100 - project.position);
  const isNear = proximity < 15;
  const isVeryNear = proximity < 8;

  const scale = isNear ? 1 : 0.5;
  const opacity = isNear ? 1 : 0;
  const labelOpacity = isVeryNear ? 1 : 0;

  return (
    <g
      transform={`translate(${pos.x}, ${pos.y})`}
      style={{
        cursor: 'pointer',
        transition: 'opacity 0.5s ease, transform 0.5s ease',
      }}
      opacity={opacity}
      onClick={() => openLogbook(project.id)}
    >
      {/* Scale wrapper */}
      <g
        transform={`scale(${scale})`}
        style={{ transition: 'transform 0.5s ease', transformOrigin: '0 0' }}
      >
        {/* Island base — sand shape */}
        <ellipse cx="0" cy="8" rx="40" ry="16" fill="#e8c880" opacity="0.6" />
        <ellipse cx="0" cy="4" rx="35" ry="14" fill="#f3deb0" />
        <ellipse cx="0" cy="0" rx="28" ry="11" fill="#f9edd0" />

        {/* Icon container */}
        <circle cx="0" cy="-8" r="16" fill="rgba(44, 24, 16, 0.85)" stroke="#d4a017" strokeWidth="1.5" />
        <foreignObject x="-10" y="-18" width="20" height="20">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
            <IconComponent size={14} className="text-parchment-100" />
          </div>
        </foreignObject>

        {/* Label */}
        <g opacity={labelOpacity} style={{ transition: 'opacity 0.4s ease' }}>
          <rect
            x="-60"
            y="22"
            width="120"
            height="24"
            rx="4"
            fill="rgba(44, 24, 16, 0.9)"
            stroke="#d4a017"
            strokeWidth="0.5"
          />
          <text
            y="38"
            textAnchor="middle"
            fill="#fdf8e8"
            fontSize="8"
            fontFamily="Georgia, serif"
            fontWeight="bold"
          >
            {project.title.length > 20 ? project.title.slice(0, 18) + '...' : project.title}
          </text>
        </g>

        {/* Hover glow ring */}
        <circle
          cx="0"
          cy="0"
          r="45"
          fill="none"
          stroke="#d4a017"
          strokeWidth="1"
          opacity="0"
        >
          <animate
            attributeName="opacity"
            values="0;0.4;0"
            dur="2s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="r"
            values="45;50;45"
            dur="2s"
            repeatCount="indefinite"
          />
        </circle>
      </g>
    </g>
  );
}
