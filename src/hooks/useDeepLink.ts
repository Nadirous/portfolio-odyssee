import { useEffect } from 'react';
import { useStore } from '../store/useStore';

export function useDeepLink() {
  const projects = useStore((s) => s.projects);

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (!hash) return;

      const project = projects.find((p) => p.id === hash);
      if (project) {
        // Wait for the page to be ready, then scroll to the project's position
        setTimeout(() => {
          const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
          const targetScroll = (project.position / 100) * scrollHeight;
          window.scrollTo({ top: targetScroll, behavior: 'smooth' });
        }, 500);
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [projects]);

  // Update hash as ship passes islands
  const scrollProgress = useStore((s) => s.scrollProgress);

  useEffect(() => {
    const currentProject = projects.find((p) => {
      const threshold = 3;
      return Math.abs(scrollProgress * 100 - p.position) < threshold;
    });

    if (currentProject) {
      const newHash = `#${currentProject.id}`;
      if (window.location.hash !== newHash) {
        history.replaceState(null, '', newHash);
      }
    }
  }, [scrollProgress, projects]);
}
