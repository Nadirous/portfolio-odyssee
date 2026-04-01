import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  X, Plus, Trash2, Save, Upload, Eye, EyeOff,
  Map, Palette, FileText, Settings, Lock
} from 'lucide-react';
import { Octokit } from '@octokit/rest';
import { useStore, type Project } from '../../store/useStore';

function AdminLogin({ onAuth }: { onAuth: () => void }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const adminPassword = useStore((s) => s.adminPassword);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === adminPassword) {
      onAuth();
    } else {
      setError(true);
      setTimeout(() => setError(false), 1500);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4 p-8">
      <Lock size={32} className="text-gold" />
      <h3 className="font-serif text-xl text-ink">Bureau du Cartographe</h3>
      <p className="text-parchment-700 text-sm text-center font-serif">
        Entrez le mot de passe pour accéder aux cartes
      </p>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Mot de passe..."
        className={`w-full px-4 py-2 border rounded font-serif text-ink bg-parchment-100 ${
          error ? 'border-accent-400 animate-pulse' : 'border-parchment-400'
        }`}
      />
      <button
        type="submit"
        className="w-full px-4 py-2 bg-ink text-parchment-100 rounded font-serif hover:bg-parchment-900 transition-colors"
      >
        Entrer
      </button>
    </form>
  );
}

type Tab = 'projects' | 'map' | 'biome' | 'settings';

function ProjectEditor({ project, onChange, onRemove }: {
  project: Project;
  onChange: (data: Partial<Project>) => void;
  onRemove: () => void;
}) {
  return (
    <div className="border border-parchment-400 rounded p-4 mb-4">
      <div className="flex justify-between items-start mb-3">
        <input
          value={project.title}
          onChange={(e) => onChange({ title: e.target.value })}
          className="text-lg font-serif font-bold text-ink bg-transparent border-b border-parchment-400 focus:border-gold outline-none w-full mr-2"
        />
        <button onClick={onRemove} className="p-1 text-accent-400 hover:text-accent-600">
          <Trash2 size={16} />
        </button>
      </div>

      <div className="grid gap-3">
        <div>
          <label className="text-xs text-parchment-700 uppercase tracking-wider font-serif">Description courte</label>
          <input
            value={project.shortDescription}
            onChange={(e) => onChange({ shortDescription: e.target.value })}
            className="w-full px-3 py-1.5 text-sm bg-parchment-100 border border-parchment-300 rounded text-ink"
          />
        </div>
        <div>
          <label className="text-xs text-parchment-700 uppercase tracking-wider font-serif">Description longue</label>
          <textarea
            value={project.longDescription}
            onChange={(e) => onChange({ longDescription: e.target.value })}
            rows={3}
            className="w-full px-3 py-1.5 text-sm bg-parchment-100 border border-parchment-300 rounded text-ink resize-none"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-parchment-700 uppercase tracking-wider font-serif">Position sur le chemin (%)</label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="5"
                max="95"
                value={project.position}
                onChange={(e) => onChange({ position: parseInt(e.target.value) })}
                className="flex-1"
              />
              <span className="text-sm text-ink w-10 text-right">{project.position}%</span>
            </div>
          </div>
          <div>
            <label className="text-xs text-parchment-700 uppercase tracking-wider font-serif">Icône</label>
            <select
              value={project.icon}
              onChange={(e) => onChange({ icon: e.target.value })}
              className="w-full px-3 py-1.5 text-sm bg-parchment-100 border border-parchment-300 rounded text-ink"
            >
              {['palm-tree', 'server', 'lighthouse', 'brain', 'code', 'database', 'globe', 'rocket', 'smartphone', 'shield', 'layout', 'box'].map((icon) => (
                <option key={icon} value={icon}>{icon}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-parchment-700 uppercase tracking-wider font-serif">GitHub URL</label>
            <input
              value={project.githubUrl}
              onChange={(e) => onChange({ githubUrl: e.target.value })}
              className="w-full px-3 py-1.5 text-sm bg-parchment-100 border border-parchment-300 rounded text-ink"
              placeholder="https://github.com/..."
            />
          </div>
          <div>
            <label className="text-xs text-parchment-700 uppercase tracking-wider font-serif">Live URL</label>
            <input
              value={project.liveUrl}
              onChange={(e) => onChange({ liveUrl: e.target.value })}
              className="w-full px-3 py-1.5 text-sm bg-parchment-100 border border-parchment-300 rounded text-ink"
              placeholder="https://..."
            />
          </div>
        </div>
        <div>
          <label className="text-xs text-parchment-700 uppercase tracking-wider font-serif">Technologies (séparées par des virgules)</label>
          <input
            value={project.technologies.join(', ')}
            onChange={(e) => onChange({ technologies: e.target.value.split(',').map((t) => t.trim()).filter(Boolean) })}
            className="w-full px-3 py-1.5 text-sm bg-parchment-100 border border-parchment-300 rounded text-ink"
          />
        </div>
      </div>
    </div>
  );
}

export default function AdminPanel() {
  const {
    isAdminOpen, isAdminAuth, toggleAdmin, setAdminAuth,
    meta, biome, projects,
    updateMeta, updateBiome, updateProject, addProject, removeProject,
    getConfig,
  } = useStore();

  const [tab, setTab] = useState<Tab>('projects');
  const [publishStatus, setPublishStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

  const handleAddProject = () => {
    const newProject: Project = {
      id: `project-${Date.now()}`,
      title: 'Nouvelle Île',
      shortDescription: 'Description courte',
      longDescription: 'Description détaillée du projet...',
      position: 50,
      images: [],
      technologies: ['React'],
      githubUrl: '',
      liveUrl: '',
      icon: 'globe',
    };
    addProject(newProject);
  };

  const handlePublish = async () => {
    if (!meta.githubRepo || !meta.githubToken) {
      alert('Configurez le repo GitHub et le token dans les paramètres.');
      return;
    }

    setPublishStatus('saving');
    try {
      const [owner, repo] = meta.githubRepo.split('/');
      const octokit = new Octokit({ auth: meta.githubToken });

      // Get current file SHA
      let sha: string | undefined;
      try {
        const { data } = await octokit.repos.getContent({
          owner, repo,
          path: 'src/data/config.json',
        });
        if (!Array.isArray(data) && 'sha' in data) {
          sha = data.sha;
        }
      } catch {
        // File doesn't exist yet
      }

      const content = btoa(unescape(encodeURIComponent(JSON.stringify(getConfig(), null, 2))));

      await octokit.repos.createOrUpdateFileContents({
        owner, repo,
        path: 'src/data/config.json',
        message: '🗺️ Update portfolio config via Cartographer',
        content,
        ...(sha ? { sha } : {}),
      });

      setPublishStatus('success');
      setTimeout(() => setPublishStatus('idle'), 3000);
    } catch (err) {
      console.error('Publish failed:', err);
      setPublishStatus('error');
      setTimeout(() => setPublishStatus('idle'), 3000);
    }
  };

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: 'projects', label: 'Projets', icon: <FileText size={16} /> },
    { key: 'map', label: 'Carte', icon: <Map size={16} /> },
    { key: 'biome', label: 'Biome', icon: <Palette size={16} /> },
    { key: 'settings', label: 'Config', icon: <Settings size={16} /> },
  ];

  return (
    <AnimatePresence>
      {isAdminOpen && (
        <motion.div
          className="fixed inset-0 z-[60] flex"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/40" onClick={toggleAdmin} />

          <motion.div
            className="parchment-bg relative z-10 w-full max-w-xl ml-auto h-full overflow-y-auto shadow-2xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            {/* Header */}
            <div className="sticky top-0 z-10 bg-gradient-to-r from-ink to-parchment-900 p-4 flex items-center justify-between">
              <h2 className="font-serif text-lg text-parchment-100 flex items-center gap-2">
                <Map size={20} />
                Bureau du Cartographe
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePublish}
                  disabled={publishStatus === 'saving'}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded text-sm font-serif transition-colors ${
                    publishStatus === 'success'
                      ? 'bg-green-600 text-white'
                      : publishStatus === 'error'
                      ? 'bg-accent-400 text-white'
                      : 'bg-gold text-ink hover:bg-parchment-400'
                  }`}
                >
                  <Upload size={14} />
                  {publishStatus === 'saving' ? 'Publication...' :
                   publishStatus === 'success' ? 'Publié !' :
                   publishStatus === 'error' ? 'Erreur' : 'Publier'}
                </button>
                <button onClick={toggleAdmin} className="p-1 text-parchment-300 hover:text-white">
                  <X size={20} />
                </button>
              </div>
            </div>

            {!isAdminAuth ? (
              <AdminLogin onAuth={() => setAdminAuth(true)} />
            ) : (
              <>
                {/* Tabs */}
                <div className="flex border-b border-parchment-400">
                  {tabs.map((t) => (
                    <button
                      key={t.key}
                      onClick={() => setTab(t.key)}
                      className={`flex-1 flex items-center justify-center gap-1 px-3 py-2.5 text-sm font-serif transition-colors ${
                        tab === t.key
                          ? 'bg-parchment-200 text-ink border-b-2 border-gold'
                          : 'text-parchment-700 hover:text-ink'
                      }`}
                    >
                      {t.icon}
                      {t.label}
                    </button>
                  ))}
                </div>

                <div className="p-4">
                  {/* Projects tab */}
                  {tab === 'projects' && (
                    <div>
                      {projects.map((project) => (
                        <ProjectEditor
                          key={project.id}
                          project={project}
                          onChange={(data) => updateProject(project.id, data)}
                          onRemove={() => removeProject(project.id)}
                        />
                      ))}
                      <button
                        onClick={handleAddProject}
                        className="w-full py-3 border-2 border-dashed border-parchment-400 rounded text-parchment-600 font-serif hover:border-gold hover:text-gold transition-colors flex items-center justify-center gap-2"
                      >
                        <Plus size={18} />
                        Ajouter une île
                      </button>
                    </div>
                  )}

                  {/* Map tab — island positions */}
                  {tab === 'map' && (
                    <div>
                      <h3 className="font-serif text-ink font-semibold mb-4">Positions des Îles</h3>
                      {projects.map((project) => (
                        <div key={project.id} className="mb-4 p-3 bg-parchment-100 rounded border border-parchment-300">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="font-serif text-ink">{project.title}</span>
                            <span className="text-parchment-600">{project.position}%</span>
                          </div>
                          <input
                            type="range"
                            min="5"
                            max="95"
                            value={project.position}
                            onChange={(e) => updateProject(project.id, { position: parseInt(e.target.value) })}
                            className="w-full"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Biome tab */}
                  {tab === 'biome' && (
                    <div className="space-y-4">
                      <h3 className="font-serif text-ink font-semibold">Thème & Couleurs</h3>
                      {[
                        { key: 'oceanColor' as const, label: 'Couleur de l\'Océan' },
                        { key: 'oceanLightColor' as const, label: 'Océan (clair)' },
                        { key: 'parchmentColor' as const, label: 'Parchemin' },
                        { key: 'accentColor' as const, label: 'Accent' },
                        { key: 'goldColor' as const, label: 'Or' },
                      ].map(({ key, label }) => (
                        <div key={key} className="flex items-center gap-3">
                          <input
                            type="color"
                            value={biome[key]}
                            onChange={(e) => updateBiome({ [key]: e.target.value })}
                            className="w-10 h-10 rounded border border-parchment-400 cursor-pointer"
                          />
                          <span className="font-serif text-sm text-ink">{label}</span>
                        </div>
                      ))}
                      <hr className="border-parchment-400" />
                      <h3 className="font-serif text-ink font-semibold">Sons & Musique</h3>
                      <div>
                        <label className="text-xs text-parchment-700 uppercase tracking-wider font-serif">URL Musique de fond</label>
                        <input
                          value={biome.musicUrl}
                          onChange={(e) => updateBiome({ musicUrl: e.target.value })}
                          className="w-full px-3 py-1.5 text-sm bg-parchment-100 border border-parchment-300 rounded text-ink"
                          placeholder="https://..."
                        />
                      </div>
                      <div>
                        <label className="text-xs text-parchment-700 uppercase tracking-wider font-serif">URL Son des vagues</label>
                        <input
                          value={biome.ambientSounds.waves}
                          onChange={(e) => updateBiome({ ambientSounds: { ...biome.ambientSounds, waves: e.target.value } })}
                          className="w-full px-3 py-1.5 text-sm bg-parchment-100 border border-parchment-300 rounded text-ink"
                        />
                      </div>
                    </div>
                  )}

                  {/* Settings tab */}
                  {tab === 'settings' && (
                    <div className="space-y-4">
                      <h3 className="font-serif text-ink font-semibold">Informations</h3>
                      {[
                        { key: 'title' as const, label: 'Titre du Portfolio' },
                        { key: 'subtitle' as const, label: 'Sous-titre' },
                        { key: 'author' as const, label: 'Auteur' },
                        { key: 'description' as const, label: 'Description' },
                        { key: 'cvUrl' as const, label: 'URL du CV (PDF)' },
                      ].map(({ key, label }) => (
                        <div key={key}>
                          <label className="text-xs text-parchment-700 uppercase tracking-wider font-serif">{label}</label>
                          <input
                            value={meta[key]}
                            onChange={(e) => updateMeta({ [key]: e.target.value })}
                            className="w-full px-3 py-1.5 text-sm bg-parchment-100 border border-parchment-300 rounded text-ink"
                          />
                        </div>
                      ))}
                      <hr className="border-parchment-400" />
                      <h3 className="font-serif text-ink font-semibold">Déploiement GitHub</h3>
                      <div>
                        <label className="text-xs text-parchment-700 uppercase tracking-wider font-serif">Repo (owner/repo)</label>
                        <input
                          value={meta.githubRepo}
                          onChange={(e) => updateMeta({ githubRepo: e.target.value })}
                          className="w-full px-3 py-1.5 text-sm bg-parchment-100 border border-parchment-300 rounded text-ink"
                          placeholder="username/portfolio"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-parchment-700 uppercase tracking-wider font-serif">Token d'accès personnel</label>
                        <input
                          type="password"
                          value={meta.githubToken}
                          onChange={(e) => updateMeta({ githubToken: e.target.value })}
                          className="w-full px-3 py-1.5 text-sm bg-parchment-100 border border-parchment-300 rounded text-ink"
                          placeholder="ghp_..."
                        />
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
