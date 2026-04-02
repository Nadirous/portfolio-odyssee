import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../store/useStore';

export default function SpyglassOverlay() {
  const isActive = useStore((s) => s.isSpyglassActive);

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          className="fixed inset-0 z-20 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Vignette — dark edges, clear center */}
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(circle at 50% 50%, transparent 30%, rgba(0,0,0,0.3) 60%, rgba(0,0,0,0.7) 100%)`,
            }}
          />

          {/* Brass lens ring */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
            <defs>
              <radialGradient id="lens-ring-grad">
                <stop offset="85%" stopColor="transparent" />
                <stop offset="88%" stopColor="#8B6914" stopOpacity="0.6" />
                <stop offset="92%" stopColor="#d4a017" stopOpacity="0.8" />
                <stop offset="96%" stopColor="#8B6914" stopOpacity="0.6" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>
            </defs>
            <circle cx="50" cy="50" r="38" fill="url(#lens-ring-grad)" />
            {/* Lens glare */}
            <ellipse cx="42" cy="38" rx="8" ry="3" fill="rgba(255,255,255,0.08)" transform="rotate(-30 42 38)" />
          </svg>

          {/* Crosshair marks */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-1 h-6 bg-gold/20 absolute" style={{ top: 'calc(50% - 45vh)' }} />
            <div className="w-1 h-6 bg-gold/20 absolute" style={{ bottom: 'calc(50% - 45vh)' }} />
            <div className="h-1 w-6 bg-gold/20 absolute" style={{ left: 'calc(50% - 45vh)' }} />
            <div className="h-1 w-6 bg-gold/20 absolute" style={{ right: 'calc(50% - 45vh)' }} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
