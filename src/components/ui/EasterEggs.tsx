import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, X } from 'lucide-react';
import { useStore } from '../../store/useStore';

// Bottle in the sea — contains the CV
function Bottle() {
  const [isOpen, setIsOpen] = useState(false);
  const meta = useStore((s) => s.meta);
  const scrollProgress = useStore((s) => s.scrollProgress);

  // Only show at ~60% of the journey
  const visible = scrollProgress > 0.55 && scrollProgress < 0.65;

  if (!visible) return null;

  return (
    <>
      <motion.button
        className="fixed z-30"
        style={{ left: '15%', top: '60%' }}
        onClick={() => setIsOpen(true)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, -15, 0], rotate: [-5, 5, -5] }}
        transition={{ y: { repeat: Infinity, duration: 3 }, rotate: { repeat: Infinity, duration: 4 } }}
        title="Une bouteille à la mer..."
      >
        <svg width="40" height="60" viewBox="0 0 40 60">
          {/* Bottle */}
          <path d="M 16 10 L 16 5 L 24 5 L 24 10" fill="#4a7c59" stroke="#2d5a3c" strokeWidth="1" />
          <ellipse cx="20" cy="10" rx="5" ry="2" fill="#8B4513" />
          <path d="M 12 10 Q 10 30 12 50 L 28 50 Q 30 30 28 10 Z" fill="#8fbc8f" opacity="0.7" stroke="#4a7c59" strokeWidth="1" />
          {/* Paper inside */}
          <rect x="16" y="20" width="8" height="12" rx="1" fill="#fdf8e8" opacity="0.6" transform="rotate(5, 20, 26)" />
        </svg>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          >
            <div className="absolute inset-0 bg-black/60" />
            <motion.div
              className="parchment-bg burned-border relative z-10 p-8 max-w-md text-center"
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={() => setIsOpen(false)} className="absolute top-3 right-3 text-parchment-700">
                <X size={18} />
              </button>
              <h3 className="font-serif text-2xl text-ink mb-3">Message dans la bouteille</h3>
              <p className="font-serif text-parchment-700 text-sm mb-6 italic">
                "Vous avez trouvé mon message ! Voici mon curriculum vitae, envoyé à travers les mers numériques..."
              </p>
              {meta.cvUrl ? (
                <a
                  href={meta.cvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-ink text-parchment-100 rounded font-serif hover:bg-parchment-900 transition-colors"
                >
                  <FileText size={18} />
                  Télécharger le CV
                </a>
              ) : (
                <p className="text-parchment-500 text-sm font-serif">
                  (Aucun CV configuré — ajoutez l'URL dans le Bureau du Cartographe)
                </p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Sea monster — appears when idle too long
function SeaMonster() {
  const [visible, setVisible] = useState(false);
  const idleTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const resetTimer = () => {
      setVisible(false);
      clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(() => setVisible(true), 15000); // 15s idle
    };

    resetTimer();
    window.addEventListener('scroll', resetTimer);
    window.addEventListener('mousemove', resetTimer);

    return () => {
      clearTimeout(idleTimer.current);
      window.removeEventListener('scroll', resetTimer);
      window.removeEventListener('mousemove', resetTimer);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed z-20 pointer-events-none"
          style={{ right: '10%', bottom: '20%' }}
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 2, ease: 'easeOut' }}
        >
          <svg width="120" height="100" viewBox="0 0 120 100">
            {/* Tentacle 1 */}
            <path
              d="M 30 90 Q 25 60 35 40 Q 40 30 30 20"
              fill="none"
              stroke="#2d5a3c"
              strokeWidth="6"
              strokeLinecap="round"
              opacity="0.7"
            >
              <animate
                attributeName="d"
                values="M 30 90 Q 25 60 35 40 Q 40 30 30 20;M 30 90 Q 35 55 25 40 Q 20 30 35 15;M 30 90 Q 25 60 35 40 Q 40 30 30 20"
                dur="3s"
                repeatCount="indefinite"
              />
            </path>
            {/* Tentacle 2 */}
            <path
              d="M 60 95 Q 55 65 65 45 Q 70 35 60 25"
              fill="none"
              stroke="#1a4a2c"
              strokeWidth="7"
              strokeLinecap="round"
              opacity="0.6"
            >
              <animate
                attributeName="d"
                values="M 60 95 Q 55 65 65 45 Q 70 35 60 25;M 60 95 Q 65 60 55 45 Q 50 30 65 20;M 60 95 Q 55 65 65 45 Q 70 35 60 25"
                dur="3.5s"
                repeatCount="indefinite"
              />
            </path>
            {/* Tentacle 3 */}
            <path
              d="M 90 90 Q 85 55 95 35 Q 100 25 90 15"
              fill="none"
              stroke="#2d5a3c"
              strokeWidth="5"
              strokeLinecap="round"
              opacity="0.5"
            >
              <animate
                attributeName="d"
                values="M 90 90 Q 85 55 95 35 Q 100 25 90 15;M 90 90 Q 95 50 85 35 Q 80 25 95 10;M 90 90 Q 85 55 95 35 Q 100 25 90 15"
                dur="4s"
                repeatCount="indefinite"
              />
            </path>
            {/* Eye */}
            <circle cx="60" cy="50" r="8" fill="#0a3a1c" opacity="0.4" />
            <circle cx="60" cy="50" r="4" fill="#d4a017" opacity="0.6" />
            <circle cx="61" cy="49" r="2" fill="#000" />
          </svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function EasterEggs() {
  return (
    <>
      <Bottle />
      <SeaMonster />
    </>
  );
}
