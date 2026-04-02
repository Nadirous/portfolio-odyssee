import { useState, useRef, useCallback } from 'react';
import { RotateCcw, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { useStore, DEFAULT_SEA_PATH } from '../../store/useStore';
import { MAP_WIDTH, MAP_HEIGHT } from '../map/SeaPath';

interface Point {
  x: number;
  y: number;
}

/** Extract endpoint waypoints from an SVG path string */
function parseWaypoints(pathD: string): Point[] {
  const points: Point[] = [];
  const re = /([MCSQLTHVAZ])\s*((?:[-+]?\d*\.?\d+[\s,]*)*)/gi;
  let match;

  while ((match = re.exec(pathD)) !== null) {
    const cmd = match[1].toUpperCase();
    const nums = match[2].trim().split(/[\s,]+/).filter(Boolean).map(Number);

    if (cmd === 'M' && nums.length >= 2) {
      points.push({ x: nums[0], y: nums[1] });
    } else if (cmd === 'C' && nums.length >= 6) {
      points.push({ x: nums[4], y: nums[5] });
    } else if (cmd === 'S' && nums.length >= 4) {
      points.push({ x: nums[2], y: nums[3] });
    } else if (cmd === 'L' && nums.length >= 2) {
      points.push({ x: nums[0], y: nums[1] });
    } else if (cmd === 'Q' && nums.length >= 4) {
      points.push({ x: nums[2], y: nums[3] });
    }
  }

  return points;
}

/** Build a smooth SVG path through waypoints using cubic beziers */
function waypointsToPath(pts: Point[]): string {
  if (pts.length === 0) return '';
  if (pts.length === 1) return `M ${pts[0].x} ${pts[0].y}`;

  let d = `M ${pts[0].x} ${pts[0].y}`;

  for (let i = 1; i < pts.length; i++) {
    const p0 = pts[i - 1];
    const p1 = pts[i];
    // Control points at vertical midpoint create natural S-curves
    const midY = Math.round((p0.y + p1.y) / 2);

    if (i === 1) {
      d += ` C ${p0.x} ${midY}, ${p1.x} ${midY}, ${p1.x} ${p1.y}`;
    } else {
      d += ` S ${p1.x} ${midY}, ${p1.x} ${p1.y}`;
    }
  }

  return d;
}

/** Get a point on an SVG path at given progress (0–1) */
function getPointOnPath(pathD: string, progress: number): Point {
  try {
    const el = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    el.setAttribute('d', pathD);
    const len = el.getTotalLength();
    const pt = el.getPointAtLength(len * progress);
    return { x: pt.x, y: pt.y };
  } catch {
    return { x: 0, y: 0 };
  }
}

export default function PathEditor() {
  const seaPath = useStore((s) => s.seaPath);
  const updateSeaPath = useStore((s) => s.updateSeaPath);
  const projects = useStore((s) => s.projects);

  const [waypoints, setWaypoints] = useState<Point[]>(() => parseWaypoints(seaPath));
  const [dragging, setDragging] = useState<number | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const waypointsRef = useRef(waypoints);
  waypointsRef.current = waypoints;

  const applyWaypoints = useCallback(
    (pts: Point[]) => updateSeaPath(waypointsToPath(pts)),
    [updateSeaPath],
  );

  // Convert screen coords to SVG viewBox coords
  const screenToSvg = useCallback((clientX: number, clientY: number): Point => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const ctm = svg.getScreenCTM();
    if (!ctm) return { x: 0, y: 0 };
    const svgPt = pt.matrixTransform(ctm.inverse());
    return {
      x: Math.round(Math.max(50, Math.min(MAP_WIDTH - 50, svgPt.x))),
      y: Math.round(Math.max(20, Math.min(MAP_HEIGHT - 20, svgPt.y))),
    };
  }, []);

  const handlePointerDown = (index: number) => (e: React.PointerEvent) => {
    e.preventDefault();
    (e.target as Element).setPointerCapture(e.pointerId);
    setDragging(index);
  };

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (dragging === null) return;
      const pt = screenToSvg(e.clientX, e.clientY);
      setWaypoints((prev) => {
        const next = [...prev];
        next[dragging] = pt;
        return next;
      });
    },
    [dragging, screenToSvg],
  );

  const handlePointerUp = useCallback(() => {
    if (dragging !== null) {
      applyWaypoints(waypointsRef.current);
    }
    setDragging(null);
  }, [dragging, applyWaypoints]);

  const addWaypoint = (afterIndex: number) => {
    const p0 = waypoints[afterIndex];
    const p1 = waypoints[afterIndex + 1];
    const newPt: Point = {
      x: Math.round((p0.x + p1.x) / 2),
      y: Math.round((p0.y + p1.y) / 2),
    };
    const next = [...waypoints];
    next.splice(afterIndex + 1, 0, newPt);
    setWaypoints(next);
    applyWaypoints(next);
  };

  const removeWaypoint = (index: number) => {
    if (waypoints.length <= 2) return;
    const next = waypoints.filter((_, i) => i !== index);
    setWaypoints(next);
    applyWaypoints(next);
  };

  const updateWaypointField = (index: number, field: 'x' | 'y', value: number) => {
    const next = [...waypoints];
    next[index] = { ...next[index], [field]: value };
    setWaypoints(next);
    applyWaypoints(next);
  };

  const resetPath = () => {
    const pts = parseWaypoints(DEFAULT_SEA_PATH);
    setWaypoints(pts);
    updateSeaPath(DEFAULT_SEA_PATH);
  };

  const previewPath = waypointsToPath(waypoints);
  const scale = 0.45;

  return (
    <div>
      <h3 className="font-serif text-ink font-semibold mb-1">Éditeur de Chemin</h3>
      <p className="text-xs text-parchment-600 font-serif mb-3">
        Glissez les points pour modifier le trajet du navire. Cliquez sur <strong>+</strong> pour ajouter un point.
      </p>

      {/* Visual drag editor */}
      <div
        className="mb-4 rounded border border-parchment-400 overflow-hidden"
        style={{ background: '#04334a' }}
      >
        <svg
          ref={svgRef}
          viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
          width={MAP_WIDTH * scale}
          height={MAP_HEIGHT * scale}
          className="block mx-auto select-none"
          style={{ touchAction: 'none' }}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          {/* Path preview */}
          <path
            d={previewPath}
            fill="none"
            stroke="rgba(212,160,23,0.5)"
            strokeWidth="4"
            strokeDasharray="12 8"
          />

          {/* Islands */}
          {projects.map((p, i) => {
            const pt = getPointOnPath(previewPath, p.position / 100);
            const ox = i % 2 === 0 ? 80 : -80;
            return (
              <g key={p.id}>
                <line
                  x1={pt.x} y1={pt.y} x2={pt.x + ox} y2={pt.y}
                  stroke="rgba(212,160,23,0.3)" strokeWidth="1" strokeDasharray="4 3"
                />
                <circle cx={pt.x + ox} cy={pt.y} r="10" fill="#e8c880" stroke="#d4a017" strokeWidth="1.5" />
                <text
                  x={pt.x + ox} y={pt.y + 22}
                  textAnchor="middle" fill="#d4a017" fontSize="9" fontFamily="serif"
                >
                  {p.title.length > 12 ? p.title.slice(0, 10) + '…' : p.title}
                </text>
              </g>
            );
          })}

          {/* "+" add-waypoint buttons between consecutive points */}
          {waypoints.map((pt, i) =>
            i < waypoints.length - 1 ? (
              <g
                key={`add-${i}`}
                onClick={() => addWaypoint(i)}
                style={{ cursor: 'pointer' }}
                opacity="0.6"
              >
                <circle
                  cx={(pt.x + waypoints[i + 1].x) / 2}
                  cy={(pt.y + waypoints[i + 1].y) / 2}
                  r="12"
                  fill="rgba(255,255,255,0.12)"
                  stroke="rgba(255,255,255,0.35)"
                  strokeWidth="1"
                />
                <text
                  x={(pt.x + waypoints[i + 1].x) / 2}
                  y={(pt.y + waypoints[i + 1].y) / 2 + 5}
                  textAnchor="middle"
                  fill="white"
                  fontSize="14"
                  fontWeight="bold"
                  pointerEvents="none"
                >
                  +
                </text>
              </g>
            ) : null,
          )}

          {/* Draggable waypoint handles */}
          {waypoints.map((pt, i) => (
            <g key={`wp-${i}`}>
              {/* Larger invisible hit area */}
              <circle
                cx={pt.x}
                cy={pt.y}
                r="20"
                fill="transparent"
                style={{ cursor: 'grab' }}
                onPointerDown={handlePointerDown(i)}
              />
              {/* Visible handle */}
              <circle
                cx={pt.x}
                cy={pt.y}
                r={dragging === i ? 14 : 10}
                fill={
                  i === 0
                    ? '#d4a017'
                    : i === waypoints.length - 1
                    ? '#c0392b'
                    : 'white'
                }
                stroke={dragging === i ? 'white' : '#d4a017'}
                strokeWidth="2"
                opacity={dragging === i ? 1 : 0.9}
                pointerEvents="none"
              />
              <text
                x={pt.x}
                y={pt.y + 4}
                textAnchor="middle"
                fill={i === 0 || i === waypoints.length - 1 ? 'white' : '#333'}
                fontSize="8"
                fontWeight="bold"
                pointerEvents="none"
              >
                {i + 1}
              </text>
            </g>
          ))}
        </svg>
      </div>

      {/* Waypoint coordinate table */}
      <div className="mb-3 space-y-1 max-h-48 overflow-y-auto">
        {waypoints.map((pt, i) => (
          <div key={i} className="flex items-center gap-2 text-xs font-serif bg-parchment-100 px-2 py-1 rounded">
            <span
              className="w-5 h-5 rounded-full text-center leading-5 text-white text-[10px] font-bold"
              style={{
                background:
                  i === 0 ? '#d4a017' : i === waypoints.length - 1 ? '#c0392b' : '#666',
              }}
            >
              {i + 1}
            </span>
            <label className="text-parchment-600">x</label>
            <input
              type="number"
              value={pt.x}
              onChange={(e) => updateWaypointField(i, 'x', parseInt(e.target.value) || 0)}
              className="w-16 px-1 py-0.5 bg-white border border-parchment-300 rounded text-ink text-xs"
            />
            <label className="text-parchment-600">y</label>
            <input
              type="number"
              value={pt.y}
              onChange={(e) => updateWaypointField(i, 'y', parseInt(e.target.value) || 0)}
              className="w-16 px-1 py-0.5 bg-white border border-parchment-300 rounded text-ink text-xs"
            />
            {waypoints.length > 2 && (
              <button
                onClick={() => removeWaypoint(i)}
                className="ml-auto p-0.5 text-accent-400 hover:text-accent-600"
                title="Supprimer ce point"
              >
                <Trash2 size={12} />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Advanced: raw SVG path */}
      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="flex items-center gap-1 text-xs text-parchment-600 font-serif mb-2 hover:text-ink transition-colors"
      >
        {showAdvanced ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        Avancé : chemin SVG brut
      </button>
      {showAdvanced && (
        <textarea
          value={seaPath}
          onChange={(e) => {
            updateSeaPath(e.target.value);
            setWaypoints(parseWaypoints(e.target.value));
          }}
          rows={3}
          className="w-full px-3 py-2 text-xs font-mono bg-parchment-100 border border-parchment-300 rounded text-ink resize-none mb-3"
          spellCheck={false}
        />
      )}

      {/* Reset */}
      <button
        onClick={resetPath}
        className="flex items-center gap-1 px-4 py-2 border border-parchment-400 rounded text-parchment-700 font-serif text-sm hover:bg-parchment-200 transition-colors"
      >
        <RotateCcw size={14} />
        Réinitialiser
      </button>
    </div>
  );
}
