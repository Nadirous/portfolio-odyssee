import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../store/useStore';

export default function Compass() {
  const { scrollProgress, projects, isListMode } = useStore();
  const openLogbook = useStore((s) => s.openLogbook);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (isListMode) return null;

  const rotation = scrollProgress * 360;

  const scrollToProject = (position: number) => {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const targetScroll = (position / 100) * scrollHeight;
    window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Quick navigation menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="absolute bottom-20 right-0 parchment-bg burned-border p-3 min-w-[200px]"
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
          >
            <h4 className="font-serif text-ink text-xs uppercase tracking-wider mb-2 px-1">Navigation Rapide</h4>
            {projects.map((project) => (
              <button
                key={project.id}
                onClick={() => scrollToProject(project.position)}
                className="w-full text-left px-2 py-1.5 text-sm font-serif text-parchment-800 hover:bg-parchment-200 rounded transition-colors flex items-center gap-2"
              >
                <div
                  className="w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: scrollProgress * 100 >= project.position - 5 ? '#d4a017' : '#d4a85466',
                  }}
                />
                {project.title}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Compass button */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="relative w-16 h-16 rounded-full bg-ink/90 border-2 border-gold shadow-lg shadow-black/30 hover:shadow-gold/20 transition-shadow"
      >
        {/* Compass outer ring */}
        <svg viewBox="0 0 64 64" className="absolute inset-0">
          <circle cx="32" cy="32" r="28" fill="none" stroke="#d4a017" strokeWidth="0.5" opacity="0.5" />
          {/* Cardinal marks */}
          {['N', 'E', 'S', 'W'].map((dir, i) => (
            <text
              key={dir}
              x="32"
              y="10"
              textAnchor="middle"
              fill="#d4a017"
              fontSize="6"
              fontFamily="serif"
              transform={`rotate(${i * 90}, 32, 32)`}
              opacity="0.6"
            >
              {dir}
            </text>
          ))}
        </svg>

        {/* Rotating needle */}
        <svg viewBox="0 0 64 64" className="absolute inset-0" style={{ transform: `rotate(${rotation}deg)` }}>
          {/* North needle (red) */}
          <polygon points="32,12 29,32 35,32" fill="#c0392b" />
          {/* South needle (white) */}
          <polygon points="32,52 29,32 35,32" fill="#fdf8e8" opacity="0.7" />
          {/* Center dot */}
          <circle cx="32" cy="32" r="3" fill="#d4a017" />
        </svg>

        {/* Progress ring */}
        <svg viewBox="0 0 64 64" className="absolute inset-0">
          <circle
            cx="32"
            cy="32"
            r="30"
            fill="none"
            stroke="#d4a017"
            strokeWidth="2"
            strokeDasharray={`${scrollProgress * 188.5} 188.5`}
            strokeLinecap="round"
            transform="rotate(-90, 32, 32)"
            opacity="0.6"
          />
        </svg>
      </button>
    </div>
  );
}
