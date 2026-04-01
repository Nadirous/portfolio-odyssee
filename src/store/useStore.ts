import { create } from 'zustand';
import configData from '../data/config.json';

export interface Project {
  id: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  position: number;
  images: string[];
  technologies: string[];
  githubUrl: string;
  liveUrl: string;
  icon: string;
}

export interface Biome {
  oceanColor: string;
  oceanLightColor: string;
  parchmentColor: string;
  accentColor: string;
  goldColor: string;
  musicUrl: string;
  ambientSounds: {
    waves: string;
    wood: string;
  };
}

export interface Meta {
  title: string;
  subtitle: string;
  author: string;
  description: string;
  cvUrl: string;
  githubRepo: string;
  githubToken: string;
}

export interface AppState {
  meta: Meta;
  biome: Biome;
  projects: Project[];
  adminPassword: string;

  // UI state
  scrollProgress: number;
  activeProjectId: string | null;
  isLogbookOpen: boolean;
  isAdminOpen: boolean;
  isAdminAuth: boolean;
  isListMode: boolean;
  isMusicPlaying: boolean;
  shipPosition: { x: number; y: number };

  // Actions
  setScrollProgress: (p: number) => void;
  openLogbook: (id: string) => void;
  closeLogbook: () => void;
  toggleAdmin: () => void;
  setAdminAuth: (v: boolean) => void;
  toggleListMode: () => void;
  toggleMusic: () => void;
  setShipPosition: (pos: { x: number; y: number }) => void;

  // CMS actions
  updateMeta: (meta: Partial<Meta>) => void;
  updateBiome: (biome: Partial<Biome>) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, data: Partial<Project>) => void;
  removeProject: (id: string) => void;
  getConfig: () => { meta: Meta; biome: Biome; projects: Project[]; adminPassword: string };
}

export const useStore = create<AppState>((set, get) => ({
  meta: configData.meta,
  biome: configData.biome,
  projects: configData.projects,
  adminPassword: configData.adminPassword,

  scrollProgress: 0,
  activeProjectId: null,
  isLogbookOpen: false,
  isAdminOpen: false,
  isAdminAuth: false,
  isListMode: false,
  isMusicPlaying: false,
  shipPosition: { x: 0, y: 0 },

  setScrollProgress: (p) => set({ scrollProgress: p }),
  openLogbook: (id) => set({ activeProjectId: id, isLogbookOpen: true }),
  closeLogbook: () => set({ activeProjectId: null, isLogbookOpen: false }),
  toggleAdmin: () => set((s) => ({ isAdminOpen: !s.isAdminOpen })),
  setAdminAuth: (v) => set({ isAdminAuth: v }),
  toggleListMode: () => set((s) => ({ isListMode: !s.isListMode })),
  toggleMusic: () => set((s) => ({ isMusicPlaying: !s.isMusicPlaying })),
  setShipPosition: (pos) => set({ shipPosition: pos }),

  updateMeta: (meta) => set((s) => ({ meta: { ...s.meta, ...meta } })),
  updateBiome: (biome) => set((s) => ({ biome: { ...s.biome, ...biome } })),
  addProject: (project) => set((s) => ({ projects: [...s.projects, project] })),
  updateProject: (id, data) =>
    set((s) => ({
      projects: s.projects.map((p) => (p.id === id ? { ...p, ...data } : p)),
    })),
  removeProject: (id) =>
    set((s) => ({ projects: s.projects.filter((p) => p.id !== id) })),
  getConfig: () => {
    const { meta, biome, projects, adminPassword } = get();
    return { meta, biome, projects, adminPassword };
  },
}));
