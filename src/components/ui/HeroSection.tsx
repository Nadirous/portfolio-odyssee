import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useStore } from '../../store/useStore';

export default function HeroSection() {
  const meta = useStore((s) => s.meta);

  return (
    <div className="relative h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">
      {/* Background ocean effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-ocean-900 via-ocean-800 to-ocean-700" />

      {/* Animated wave lines */}
      <svg className="absolute bottom-0 left-0 right-0 h-32 opacity-20" preserveAspectRatio="none" viewBox="0 0 1200 120">
        <path d="M 0 60 Q 150 20, 300 60 Q 450 100, 600 60 Q 750 20, 900 60 Q 1050 100, 1200 60 L 1200 120 L 0 120 Z" fill="rgba(212,160,23,0.3)">
          <animate attributeName="d" values="M 0 60 Q 150 20, 300 60 Q 450 100, 600 60 Q 750 20, 900 60 Q 1050 100, 1200 60 L 1200 120 L 0 120 Z;M 0 60 Q 150 100, 300 60 Q 450 20, 600 60 Q 750 100, 900 60 Q 1050 20, 1200 60 L 1200 120 L 0 120 Z;M 0 60 Q 150 20, 300 60 Q 450 100, 600 60 Q 750 20, 900 60 Q 1050 100, 1200 60 L 1200 120 L 0 120 Z" dur="6s" repeatCount="indefinite" />
        </path>
      </svg>

      {/* Content */}
      <motion.div
        className="relative z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
      >
        {/* Compass rose decoration */}
        <motion.svg
          width="80"
          height="80"
          viewBox="0 0 80 80"
          className="mx-auto mb-6 text-gold"
          initial={{ rotate: -90, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.5 }}
        >
          <circle cx="40" cy="40" r="35" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.4" />
          <circle cx="40" cy="40" r="25" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
          <polygon points="40,8 37,40 43,40" fill="currentColor" opacity="0.8" />
          <polygon points="40,72 37,40 43,40" fill="currentColor" opacity="0.3" />
          <polygon points="8,40 40,37 40,43" fill="currentColor" opacity="0.5" />
          <polygon points="72,40 40,37 40,43" fill="currentColor" opacity="0.5" />
          <circle cx="40" cy="40" r="4" fill="currentColor" />
        </motion.svg>

        <motion.h1
          className="font-serif text-5xl md:text-7xl text-parchment-100 mb-4 drop-shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          {meta.title}
        </motion.h1>

        <motion.p
          className="font-serif text-xl text-parchment-400 mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          {meta.subtitle}
        </motion.p>

        <motion.p
          className="text-parchment-500 text-sm max-w-md mx-auto mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          {meta.description}
        </motion.p>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 z-10 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <span className="text-parchment-500 text-xs font-serif uppercase tracking-widest">
          Scroll pour naviguer
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <ChevronDown size={24} className="text-gold" />
        </motion.div>
      </motion.div>
    </div>
  );
}
