import { AnimatePresence } from 'framer-motion';
import { useStore } from './store/useStore';
import { useDeepLink } from './hooks/useDeepLink';
import { useAudio } from './hooks/useAudio';
import Header from './components/ui/Header';
import HeroSection from './components/ui/HeroSection';
import MapContainer from './components/map/MapContainer';
import Logbook from './components/ui/Logbook';
import Compass from './components/ui/Compass';
import ListMode from './components/ui/ListMode';
import AdminPanel from './components/admin/AdminPanel';
import EasterEggs from './components/ui/EasterEggs';
import './App.css';

function App() {
  const isListMode = useStore((s) => s.isListMode);

  // Hooks
  useDeepLink();
  useAudio();

  return (
    <div className="relative">
      {/* Fixed UI layer */}
      <Header />
      <Compass />

      {/* List mode overlay */}
      <AnimatePresence>
        {isListMode && <ListMode />}
      </AnimatePresence>

      {/* Main map experience */}
      {!isListMode && (
        <>
          <HeroSection />
          <MapContainer />

          {/* Footer */}
          <footer className="relative z-10 py-12 text-center bg-ocean-900">
            <p className="font-serif text-parchment-500 text-sm">
              Fin du voyage — pour l'instant.
            </p>
            <p className="text-parchment-600 text-xs mt-2 font-serif">
              Construit avec React, GSAP, et une pincée de magie maritime.
            </p>
          </footer>
        </>
      )}

      {/* Modals & overlays */}
      <Logbook />
      <AdminPanel />
      <EasterEggs />
    </div>
  );
}

export default App;
