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
import ContactSection from './components/ui/ContactSection';
import SpyglassOverlay from './components/ui/SpyglassOverlay';
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
          <ContactSection />
        </>
      )}

      {/* Modals & overlays */}
      <SpyglassOverlay />
      <Logbook />
      <AdminPanel />
      <EasterEggs />
    </div>
  );
}

export default App;
