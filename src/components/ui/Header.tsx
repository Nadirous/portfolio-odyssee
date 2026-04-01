import { List, Map as MapIcon, Settings, Volume2, VolumeX } from 'lucide-react';
import { useStore } from '../../store/useStore';

export default function Header() {
  const {
    meta, isListMode, isMusicPlaying,
    toggleListMode, toggleAdmin, toggleMusic,
  } = useStore();

  return (
    <header className="fixed top-0 left-0 right-0 z-40 pointer-events-none">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Title */}
        <div className="pointer-events-auto">
          <h1 className="font-serif text-xl text-parchment-100 flex items-center gap-2 drop-shadow-lg">
            <MapIcon size={20} className="text-gold" />
            {meta.title}
          </h1>
          <p className="text-parchment-400 text-xs font-serif ml-7">{meta.subtitle}</p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={toggleMusic}
            className="p-2 rounded-full bg-ink/60 text-parchment-300 hover:text-gold hover:bg-ink/80 transition-colors backdrop-blur-sm"
            title={isMusicPlaying ? 'Couper le son' : 'Jouer la musique'}
          >
            {isMusicPlaying ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>

          <button
            onClick={toggleListMode}
            className="p-2 rounded-full bg-ink/60 text-parchment-300 hover:text-gold hover:bg-ink/80 transition-colors backdrop-blur-sm"
            title={isListMode ? 'Mode Carte' : 'Mode Liste'}
          >
            {isListMode ? <MapIcon size={18} /> : <List size={18} />}
          </button>

          <button
            onClick={toggleAdmin}
            className="p-2 rounded-full bg-ink/60 text-parchment-300 hover:text-gold hover:bg-ink/80 transition-colors backdrop-blur-sm"
            title="Bureau du Cartographe"
          >
            <Settings size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
