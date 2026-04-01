import { motion } from 'framer-motion';
import { ExternalLink, GitBranch, X } from 'lucide-react';
import { useStore } from '../../store/useStore';

export default function ListMode() {
  const { projects, isListMode, toggleListMode, meta } = useStore();

  if (!isListMode) return null;

  return (
    <motion.div
      className="fixed inset-0 z-30 bg-ocean-900 overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex justify-between items-start mb-12">
          <div>
            <h1 className="font-serif text-4xl text-parchment-100 mb-2">{meta.author}</h1>
            <p className="text-parchment-400 font-serif">{meta.subtitle}</p>
          </div>
          <button
            onClick={toggleListMode}
            className="flex items-center gap-2 px-4 py-2 bg-ocean-700 text-parchment-200 rounded font-serif text-sm hover:bg-ocean-600 transition-colors"
          >
            <X size={16} />
            Retour à la carte
          </button>
        </div>

        {/* Projects grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              className="bg-ocean-800/50 border border-ocean-600/30 rounded-lg p-6 hover:border-gold/40 transition-colors"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <h3 className="font-serif text-xl text-parchment-100 mb-2">{project.title}</h3>
              <p className="text-parchment-400 text-sm mb-4">{project.shortDescription}</p>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {project.technologies.map((tech) => (
                  <span key={tech} className="wax-seal text-[10px]">
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex gap-2">
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-parchment-300 hover:text-gold transition-colors"
                  >
                    <GitBranch size={14} /> Code
                  </a>
                )}
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-parchment-300 hover:text-gold transition-colors"
                  >
                    <ExternalLink size={14} /> Live
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
