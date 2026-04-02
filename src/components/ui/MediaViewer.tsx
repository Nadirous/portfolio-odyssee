import { useState } from 'react';
import { X, Download, FileText, Film, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ProjectMedia } from '../../store/useStore';

function isYouTube(url: string) {
  return /youtube\.com|youtu\.be/.test(url);
}

function isVimeo(url: string) {
  return /vimeo\.com/.test(url);
}

function getYouTubeId(url: string) {
  const match = url.match(/(?:youtu\.be\/|v=)([^&?/]+)/);
  return match?.[1] || '';
}

function getVimeoId(url: string) {
  const match = url.match(/vimeo\.com\/(\d+)/);
  return match?.[1] || '';
}

function MediaIcon({ type }: { type: ProjectMedia['type'] }) {
  switch (type) {
    case 'video': return <Film size={14} />;
    case 'pdf': return <FileText size={14} />;
    case 'file': return <Download size={14} />;
    default: return <ImageIcon size={14} />;
  }
}

function MediaCard({ media, onClick }: { media: ProjectMedia; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="burned-border overflow-hidden group relative bg-parchment-200 flex items-center justify-center h-28 hover:ring-2 ring-gold transition-all"
    >
      {media.type === 'image' ? (
        <img src={media.url} alt={media.title || ''} className="w-full h-full object-cover" loading="lazy" />
      ) : (
        <div className="flex flex-col items-center gap-1 text-parchment-600">
          <MediaIcon type={media.type} />
          <span className="text-xs font-serif truncate max-w-[90%]">{media.title || media.type}</span>
        </div>
      )}
    </button>
  );
}

function ImageLightbox({ url, title, onClose }: { url: string; title?: string; onClose: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 z-10">
        <X size={20} />
      </button>
      <motion.img
        src={url}
        alt={title || ''}
        className="max-w-[90vw] max-h-[85vh] object-contain rounded shadow-2xl"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
        onClick={(e) => e.stopPropagation()}
      />
    </motion.div>
  );
}

function VideoViewer({ url, onClose }: { url: string; onClose: () => void }) {
  let embedUrl = url;
  if (isYouTube(url)) {
    embedUrl = `https://www.youtube.com/embed/${getYouTubeId(url)}?autoplay=1`;
  } else if (isVimeo(url)) {
    embedUrl = `https://player.vimeo.com/video/${getVimeoId(url)}?autoplay=1`;
  }

  const isEmbed = isYouTube(url) || isVimeo(url);

  return (
    <motion.div
      className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 z-10">
        <X size={20} />
      </button>
      <div className="w-full max-w-4xl aspect-video" onClick={(e) => e.stopPropagation()}>
        {isEmbed ? (
          <iframe
            src={embedUrl}
            className="w-full h-full rounded shadow-2xl"
            allow="autoplay; fullscreen"
            allowFullScreen
          />
        ) : (
          <video src={url} controls autoPlay className="w-full h-full rounded shadow-2xl">
            Votre navigateur ne supporte pas la lecture vidéo.
          </video>
        )}
      </div>
    </motion.div>
  );
}

function PdfViewer({ url, onClose }: { url: string; onClose: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 z-10">
        <X size={20} />
      </button>
      <div className="w-full max-w-4xl h-[85vh]" onClick={(e) => e.stopPropagation()}>
        <iframe src={url} className="w-full h-full rounded shadow-2xl bg-white" />
      </div>
    </motion.div>
  );
}

export default function MediaGallery({ media }: { media: ProjectMedia[] }) {
  const [activeMedia, setActiveMedia] = useState<ProjectMedia | null>(null);

  if (media.length === 0) return null;

  const handleClick = (m: ProjectMedia) => {
    if (m.type === 'file') {
      // Direct download for files
      window.open(m.url, '_blank');
      return;
    }
    setActiveMedia(m);
  };

  return (
    <div className="mb-6">
      <h3 className="text-ink font-serif font-semibold text-sm mb-3 uppercase tracking-wider">
        Médias
      </h3>
      <div className="grid grid-cols-3 gap-2">
        {media.map((m) => (
          <MediaCard key={m.id} media={m} onClick={() => handleClick(m)} />
        ))}
      </div>

      <AnimatePresence>
        {activeMedia?.type === 'image' && (
          <ImageLightbox url={activeMedia.url} title={activeMedia.title} onClose={() => setActiveMedia(null)} />
        )}
        {activeMedia?.type === 'video' && (
          <VideoViewer url={activeMedia.url} onClose={() => setActiveMedia(null)} />
        )}
        {activeMedia?.type === 'pdf' && (
          <PdfViewer url={activeMedia.url} onClose={() => setActiveMedia(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
