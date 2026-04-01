import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, ExternalLink, GitBranch } from 'lucide-react';
import { useStore } from '../../store/useStore';

export default function Logbook() {
  const { isLogbookOpen, activeProjectId, projects, closeLogbook } = useStore();
  const overlayRef = useRef<HTMLDivElement>(null);
  const project = projects.find((p) => p.id === activeProjectId);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLogbook();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [closeLogbook]);

  return (
    <AnimatePresence>
      {isLogbookOpen && project && (
        <motion.div
          ref={overlayRef}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => {
            if (e.target === overlayRef.current) closeLogbook();
          }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Logbook content */}
          <motion.div
            className="parchment-bg burned-border relative z-10 max-w-2xl w-full max-h-[85vh] overflow-y-auto"
            initial={{ scale: 0.8, opacity: 0, rotateX: 15 }}
            animate={{ scale: 1, opacity: 1, rotateX: 0 }}
            exit={{ scale: 0.8, opacity: 0, rotateX: -15 }}
            transition={{ type: 'spring', damping: 20, stiffness: 200 }}
          >
            {/* Header decoration */}
            <div className="bg-gradient-to-r from-parchment-600/20 via-parchment-400/30 to-parchment-600/20 p-6 pb-4">
              <button
                onClick={closeLogbook}
                className="absolute top-4 right-4 p-1 rounded-full bg-parchment-700/20 hover:bg-parchment-700/40 transition-colors"
              >
                <X size={20} className="text-parchment-800" />
              </button>

              {/* Title with decorative lines */}
              <div className="text-center">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <div className="h-px w-12 bg-parchment-600" />
                  <span className="text-parchment-600 text-xs uppercase tracking-widest font-serif">
                    Journal de Bord
                  </span>
                  <div className="h-px w-12 bg-parchment-600" />
                </div>
                <h2 className="font-serif text-2xl md:text-3xl text-ink font-bold">
                  {project.title}
                </h2>
                <p className="text-parchment-700 mt-1 text-sm italic font-serif">
                  {project.shortDescription}
                </p>
              </div>
            </div>

            <div className="p-6 pt-2">
              {/* Description */}
              <div className="mb-6">
                <p className="text-parchment-800 leading-relaxed font-serif text-sm">
                  {project.longDescription}
                </p>
              </div>

              {/* Image gallery */}
              {project.images.length > 0 && (
                <div className="mb-6">
                  <div className="grid grid-cols-2 gap-2">
                    {project.images.map((img, i) => (
                      <div
                        key={i}
                        className="burned-border overflow-hidden"
                      >
                        <img
                          src={img}
                          alt={`${project.title} screenshot ${i + 1}`}
                          className="w-full h-32 object-cover"
                          loading="lazy"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Technologies — wax seal badges */}
              <div className="mb-6">
                <h3 className="text-ink font-serif font-semibold text-sm mb-3 uppercase tracking-wider">
                  Technologies
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span key={tech} className="wax-seal">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Links */}
              <div className="flex gap-3 pt-4 border-t border-parchment-400/50">
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-ink text-parchment-100 rounded font-serif text-sm hover:bg-parchment-900 transition-colors"
                  >
                    <GitBranch size={16} />
                    Code Source
                  </a>
                )}
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-ocean-600 text-parchment-100 rounded font-serif text-sm hover:bg-ocean-700 transition-colors"
                  >
                    <ExternalLink size={16} />
                    Voir en Live
                  </a>
                )}
              </div>
            </div>

            {/* Bottom decorative border */}
            <div className="h-3 bg-gradient-to-r from-parchment-600/10 via-parchment-500/20 to-parchment-600/10" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
