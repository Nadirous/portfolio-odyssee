import { useState } from 'react';
import { Send, MapPin, Anchor } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '../../store/useStore';

export default function ContactSection() {
  const meta = useStore((s) => s.meta);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const to = meta.contactEmail || '';
    const subject = encodeURIComponent(`Message de ${name} — Portfolio Odyssée`);
    const body = encodeURIComponent(
      `Nom : ${name}\nEmail : ${email}\n\n${message}`,
    );
    window.open(`mailto:${to}?subject=${subject}&body=${body}`);
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <section className="relative z-10 overflow-hidden" style={{ background: 'linear-gradient(to bottom, #04334a, #021a28)' }}>
      {/* Decorative waves at top */}
      <svg viewBox="0 0 1200 80" className="w-full block" preserveAspectRatio="none" style={{ marginBottom: -1 }}>
        <path d="M0 40 Q150 0 300 40 T600 40 T900 40 T1200 40 V80 H0Z" fill="#04334a" />
        <path d="M0 50 Q150 20 300 50 T600 50 T900 50 T1200 50 V80 H0Z" fill="#031f30" opacity="0.6" />
      </svg>

      <div className="max-w-3xl mx-auto px-6 py-16 md:py-24">
        {/* Island illustration */}
        <motion.div
          className="flex justify-center mb-8"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="relative">
            {/* Island base */}
            <svg width="200" height="120" viewBox="0 0 200 120">
              {/* Water reflection */}
              <ellipse cx="100" cy="105" rx="90" ry="12" fill="rgba(10,102,144,0.3)" />
              {/* Sand layers */}
              <ellipse cx="100" cy="85" rx="70" ry="25" fill="#d4a017" opacity="0.3" />
              <ellipse cx="100" cy="80" rx="60" ry="20" fill="#e8c880" />
              <ellipse cx="100" cy="75" rx="50" ry="16" fill="#f3deb0" />
              {/* Palm tree */}
              <line x1="100" y1="75" x2="100" y2="25" stroke="#8B6914" strokeWidth="4" strokeLinecap="round" />
              <path d="M100 25 Q120 10 140 20" fill="none" stroke="#2d8f4e" strokeWidth="3" strokeLinecap="round" />
              <path d="M100 25 Q80 5 55 15" fill="none" stroke="#2d8f4e" strokeWidth="3" strokeLinecap="round" />
              <path d="M100 25 Q110 0 130 5" fill="none" stroke="#3aa85e" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M100 25 Q85 15 65 25" fill="none" stroke="#3aa85e" strokeWidth="2.5" strokeLinecap="round" />
              {/* Flag */}
              <line x1="130" y1="65" x2="130" y2="35" stroke="#8B6914" strokeWidth="2" />
              <path d="M130 35 L150 42 L130 50Z" fill="#c0392b" />
              {/* Treasure chest */}
              <rect x="80" y="62" width="22" height="14" rx="2" fill="#8B6914" stroke="#6B4F12" strokeWidth="1" />
              <rect x="80" y="62" width="22" height="6" rx="2" fill="#A07818" />
              <circle cx="91" cy="69" r="2" fill="#d4a017" />
            </svg>
            {/* Animated glow */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 rounded-full bg-gold/10 animate-pulse" />
            </div>
          </div>
        </motion.div>

        {/* Anchor icon */}
        <motion.div
          className="flex justify-center mb-4"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, type: 'spring' }}
        >
          <div className="w-12 h-12 rounded-full bg-gold/20 border border-gold/40 flex items-center justify-center">
            <Anchor size={24} className="text-gold" />
          </div>
        </motion.div>

        {/* Title & invitation */}
        <motion.div
          className="text-center mb-10"
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="h-px w-16 bg-gold/40" />
            <MapPin size={14} className="text-gold/60" />
            <div className="h-px w-16 bg-gold/40" />
          </div>
          <h2 className="font-serif text-2xl md:text-3xl text-parchment-100 mb-4 font-bold">
            L'Île du Contact
          </h2>
          <p className="font-serif text-lg md:text-xl text-gold italic leading-relaxed max-w-xl mx-auto">
            Si vous avez aimé l'aventure, aimeriez-vous la faire fructifier avec moi ?
          </p>
        </motion.div>

        {/* Contact form */}
        <motion.form
          onSubmit={handleSubmit}
          className="parchment-bg burned-border p-6 md:p-8 max-w-lg mx-auto"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <div className="space-y-4">
            <div>
              <label className="text-xs text-parchment-700 uppercase tracking-wider font-serif">
                Votre nom
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Capitaine..."
                className="w-full px-4 py-2.5 mt-1 bg-parchment-100 border border-parchment-400 rounded font-serif text-ink text-sm focus:border-gold focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="text-xs text-parchment-700 uppercase tracking-wider font-serif">
                Votre email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="capitaine@navire.com"
                className="w-full px-4 py-2.5 mt-1 bg-parchment-100 border border-parchment-400 rounded font-serif text-ink text-sm focus:border-gold focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="text-xs text-parchment-700 uppercase tracking-wider font-serif">
                Votre message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={4}
                placeholder="J'ai une mission pour vous..."
                className="w-full px-4 py-2.5 mt-1 bg-parchment-100 border border-parchment-400 rounded font-serif text-ink text-sm resize-none focus:border-gold focus:outline-none transition-colors"
              />
            </div>
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-ink text-parchment-100 rounded font-serif text-sm hover:bg-parchment-900 transition-colors"
            >
              {sent ? (
                'Message envoyé !'
              ) : (
                <>
                  <Send size={16} />
                  Envoyer la bouteille à la mer
                </>
              )}
            </button>
          </div>
        </motion.form>

        {/* Footer credits */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
        >
          <p className="font-serif text-parchment-500 text-sm">
            Fin du voyage — pour l'instant.
          </p>
          <p className="text-parchment-600 text-xs mt-2 font-serif">
            Construit avec React, GSAP, et une pincée de magie maritime.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
