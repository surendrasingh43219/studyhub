'use client'

import { useState } from 'react'
import {
  Layers,
  Plus,
  GitBranch,
  ExternalLink,
  Calendar,
  CheckCircle2,
  Trash2,
  X,
  Code2,
  FolderGit2,
  Sparkles,
} from 'lucide-react'

export interface Project {
  id: string
  title: string
  description?: string
  category?: string
  technologies?: string[]
  github_url?: string
  start_date?: string
  target_date?: string
  status: 'planning' | 'in_progress' | 'completed' | 'on_hold'
  progress_percentage: number
}

interface ProjectsClientViewProps {
  initialProjects: Project[]
}

const DEFAULT_STARTER: Project = {
  id: 'starter-1',
  title: 'SmartCart — Data Analytics & Business Intelligence',
  description: 'Full-stack retail analytics dashboard tracking product inventory, checkout metrics, and customer churn analysis.',
  category: 'Data Analytics',
  technologies: ['Python', 'SQL', 'Power BI', 'PostgreSQL'],
  github_url: 'https://github.com',
  start_date: '2026-11-01',
  target_date: '2026-12-15',
  status: 'in_progress',
  progress_percentage: 45,
}

const STATUS_MAP: Record<string, { label: string; badge: string }> = {
  planning: { label: 'Planning', badge: 'bg-slate-800 text-slate-300 border-slate-700' },
  in_progress: { label: 'In Progress', badge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' },
  completed: { label: 'Completed', badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
  on_hold: { label: 'On Hold', badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
}

export function ProjectsClientView({ initialProjects }: ProjectsClientViewProps) {
  const [projects, setProjects] = useState<Project[]>(
    initialProjects.length > 0 ? initialProjects : [DEFAULT_STARTER]
  )
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Form State
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('Data Analytics')
  const [technologies, setTechnologies] = useState('Python, SQL, PostgreSQL')
  const [githubUrl, setGithubUrl] = useState('')
  const [targetDate, setTargetDate] = useState('')
  const [progressPct, setProgressPct] = useState(20)
  const [status, setStatus] = useState<Project['status']>('in_progress')

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    const newProj: Project = {
      id: 'proj-' + Date.now(),
      title: title.trim(),
      description: description.trim(),
      category: category.trim(),
      technologies: technologies.split(',').map((t) => t.trim()).filter(Boolean),
      github_url: githubUrl.trim() || undefined,
      start_date: new Date().toISOString().split('T')[0],
      target_date: targetDate || undefined,
      status,
      progress_percentage: progressPct,
    }

    setProjects((prev) => [newProj, ...prev])
    setIsModalOpen(false)
    setTitle('')
    setDescription('')
    setGithubUrl('')
  }

  const handleDeleteProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id))
  }

  const handleUpdateProgress = (id: string, delta: number) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const next = Math.max(0, Math.min(100, p.progress_percentage + delta))
          return { ...p, progress_percentage: next, status: next === 100 ? 'completed' : p.status }
        }
        return p
      })
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <FolderGit2 className="w-7 h-7 text-cyan-400" /> Personal Projects
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Build resume-worthy applications, analytics dashboards, and research assignments with milestone tracking.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-600/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add Project
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((project) => {
          const meta = STATUS_MAP[project.status] || STATUS_MAP.in_progress

          return (
            <div
              key={project.id}
              className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
                      {project.category || 'Engineering'}
                    </span>
                    <h3 className="font-bold text-white text-lg mt-1.5 leading-snug">{project.title}</h3>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full border text-[10px] font-semibold shrink-0 ${meta.badge}`}>
                    {meta.label}
                  </span>
                </div>

                {project.description && (
                  <p className="text-xs text-slate-400 leading-relaxed">{project.description}</p>
                )}

                {/* Tech Chips */}
                {project.technologies && project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-slate-300 text-[10px] font-mono"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Progress & Actions */}
              <div className="space-y-3 pt-3 border-t border-slate-800/80">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Milestone Progress</span>
                    <span className="font-bold text-white font-mono">{project.progress_percentage}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all"
                      style={{ width: `${project.progress_percentage}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleUpdateProgress(project.id, -10)}
                      className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
                    >
                      -10%
                    </button>
                    <button
                      onClick={() => handleUpdateProgress(project.id, 10)}
                      className="px-2 py-0.5 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 font-bold"
                    >
                      +10%
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    {project.github_url && (
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors flex items-center gap-1 text-[11px]"
                      >
                        <Code2 className="w-3.5 h-3.5" /> Repo
                      </a>
                    )}
                    <button
                      onClick={() => handleDeleteProject(project.id)}
                      className="p-1.5 rounded-lg text-slate-600 hover:text-rose-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Create Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#111420] border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Create Personal Project</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Project Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. HealthCare Analysis Dashboard"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Goal and impact of this project..."
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Data Analytics, Web App, AI..."
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">GitHub URL</label>
                  <input
                    type="url"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/..."
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Technologies (comma separated)
                </label>
                <input
                  type="text"
                  value={technologies}
                  onChange={(e) => setTechnologies(e.target.value)}
                  placeholder="Python, SQL, Docker, React"
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!title.trim()}
                  className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
