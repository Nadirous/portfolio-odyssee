import { create } from 'zustand';
import configData from '../data/config.json';

export interface ProjectMedia {
  id: string;
  type: 'image' | 'video' | 'pdf' | 'file';
  url: string;
  title?: string;
}

export interface Project {
  id: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  position: number;
  images: string[];
  media: ProjectMedia[];
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
  contactEmail: string;
  githubRepo: string;
  githubToken: string;
}

export const DEFAULT_SEA_PATH =
  'M 400 50 C 250 200, 550 350, 350 500 S 150 700, 400 850 S 650 1000, 350 1150 S 100 1350, 400 1500 S 700 1650, 350 1800 S 50 2000, 400 2150 S 750 2300, 400 2450 S 100 2600, 400 2750 S 650 2900, 400 3050';

export interface AppState {
  meta: Meta;
  biome: Biome;
  projects: Project[];
  seaPath: string;
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
  isSpyglassActive: boolean;
  spyglassProgress: number;

  // Actions
  setScrollProgress: (p: number) => void;
  openLogbook: (id: string) => void;
  closeLogbook: () => void;
  toggleAdmin: () => void;
  setAdminAuth: (v: boolean) => void;
  toggleListMode: () => void;
  toggleMusic: () => void;
  setShipPosition: (pos: { x: number; y: number }) => void;
  setSpyglass: (active: boolean, progress?: number) => void;

  // CMS actions
  updateMeta: (meta: Partial<Meta>) => void;
  updateBiome: (biome: Partial<Biome>) => void;
  updateSeaPath: (path: string) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, data: Partial<Project>) => void;
  removeProject: (id: string) => void;
  getConfig: () => object;
}

function migrateProjects(projects: typeof configData.projects): Project[] {
  return projects.map((p) => ({
    ...p,
    media: (p as unknown as Project).media || [],
  }));
}

export const useStore = create<AppState>((set, get) => ({
  meta: {
    ...configData.meta,
    githubToken: localStorage.getItem('portfolio_github_token') || '',
  },
  biome: configData.biome,
  projects: migrateProjects(configData.projects),
  seaPath: (configData as unknown as { seaPath?: string }).seaPath || DEFAULT_SEA_PATH,
  adminPassword: configData.adminPassword,

  scrollProgress: 0,
  activeProjectId: null,
  isLogbookOpen: false,
  isAdminOpen: false,
  isAdminAuth: false,
  isListMode: false,
  isMusicPlaying: false,
  shipPosition: { x: 0, y: 0 },
  isSpyglassActive: false,
  spyglassProgress: 0,

  setScrollProgress: (p) => set({ scrollProgress: p }),
  openLogbook: (id) => set({ activeProjectId: id, isLogbookOpen: true }),
  closeLogbook: () => set({ activeProjectId: null, isLogbookOpen: false }),
  toggleAdmin: () => set((s) => ({ isAdminOpen: !s.isAdminOpen })),
  setAdminAuth: (v) => set({ isAdminAuth: v }),
  toggleListMode: () => set((s) => ({ isListMode: !s.isListMode })),
  toggleMusic: () => set((s) => ({ isMusicPlaying: !s.isMusicPlaying })),
  setShipPosition: (pos) => set({ shipPosition: pos }),
  setSpyglass: (active, progress) =>
    set({ isSpyglassActive: active, spyglassProgress: progress ?? (active ? 1 : 0) }),

  updateMeta: (meta) => {
    if (meta.githubToken !== undefined) {
      localStorage.setItem('portfolio_github_token', meta.githubToken);
    }
    set((s) => ({ meta: { ...s.meta, ...meta } }));
  },
  updateBiome: (biome) => set((s) => ({ biome: { ...s.biome, ...biome } })),
  updateSeaPath: (path) => set({ seaPath: path }),
  addProject: (project) => set((s) => ({ projects: [...s.projects, project] })),
  updateProject: (id, data) =>
    set((s) => ({
      projects: s.projects.map((p) => (p.id === id ? { ...p, ...data } : p)),
    })),
  removeProject: (id) =>
    set((s) => ({ projects: s.projects.filter((p) => p.id !== id) })),
  getConfig: () => {
    const { meta, biome, projects, adminPassword, seaPath } = get();
    const { githubToken: _, ...safeMeta } = meta;
    return { meta: { ...safeMeta, githubToken: '' }, biome, projects, seaPath, adminPassword };
  },
}));
