import { useEffect, useRef } from 'react';
import { useStore } from '../store/useStore';

export function useAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isMusicPlaying = useStore((s) => s.isMusicPlaying);
  const musicUrl = useStore((s) => s.biome.musicUrl);

  useEffect(() => {
    if (!musicUrl) return;

    if (!audioRef.current) {
      audioRef.current = new Audio(musicUrl);
      audioRef.current.loop = true;
      audioRef.current.volume = 0.3;
    }

    if (isMusicPlaying) {
      audioRef.current.play().catch(() => {
        // Autoplay blocked — user needs to interact first
      });
    } else {
      audioRef.current.pause();
    }

    return () => {
      audioRef.current?.pause();
    };
  }, [isMusicPlaying, musicUrl]);
}
