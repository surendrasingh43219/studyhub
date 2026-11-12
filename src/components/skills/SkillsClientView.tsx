'use client'

import { useState } from 'react'
import {
  Briefcase,
  Plus,
  Award,
  BookOpen,
  CheckCircle2,
  TrendingUp,
  FileText,
  ExternalLink,
  Trash2,
  X,
  Building,
  Calendar,
  Layers,
  Sparkles,
} from 'lucide-react'

export interface Skill {
  id: string
  name: string
  category: 'Technical' | 'Professional' | 'Other'
  current_level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
  target_level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
  completion_percentage: number
  notes?: string
  last_practiced_at?: string
}

export interface JobApplication {
  id: string
  company: string
  role: string
  status: 'wishlist' | 'applied' | 'interviewing' | 'offered' | 'rejected'
  applied_date?: string
  salary_range?: string
  notes?: string
}

interface SkillsClientViewProps {
  initialSkills: Skill[]
  initialApplications: JobApplication[]
}

const DEFAULT_STARTER_SKILLS: Skill[] = [
  { id: 'sk-1', name: 'SQL & Database Queries', category: 'Technical', current_level: 'Intermediate', target_level: 'Advanced', completion_percentage: 65, notes: 'Practicing joins, subqueries, and window functions' },
  { id: 'sk-2', name: 'Python Programming', category: 'Technical', current_level: 'Intermediate', target_level: 'Advanced', completion_percentage: 50, notes: 'Pandas, NumPy, and script automation' },
  { id: 'sk-3', name: 'Power BI & Dashboards', category: 'Technical', current_level: 'Beginner', target_level: 'Intermediate', completion_percentage: 30, notes: 'DAX measures and interactive visualizations' },
  { id: 'sk-4', name: 'Interview Communication', category: 'Professional', current_level: 'Intermediate', target_level: 'Advanced', completion_percentage: 60, notes: 'STAR technique for behavioral questions' },
  { id: 'sk-5', name: 'Resume & Portfolio', category: 'Professional', current_level: 'Advanced', target_level: 'Expert', completion_percentage: 85, notes: 'Updated GitHub projects and LinkedIn presence' },
]

const APP_STATUS_BADGES: Record<string, { label: string; badge: string }> = {
  wishlist: { label: 'Wishlist', badge: 'bg-slate-800 text-slate-300 border-slate-700' },
  applied: { label: 'Applied', badge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' },
  interviewing: { label: 'Interviewing', badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
  offered: { label: 'Offer Received', badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
  rejected: { label: 'Archived', badge: 'bg-rose-500/10 text-rose-400 border-rose-500/30' },
}

export function SkillsClientView({
  initialSkills,
  initialApplications,
}: SkillsClientViewProps) {
  const [skills, setSkills] = useState<Skill[]>(
    initialSkills.length > 0 ? initialSkills : DEFAULT_STARTER_SKILLS
  )
  const [applications, setApplications] = useState<JobApplication[]>(initialApplications)
  const [activeTab, setActiveTab] = useState<'skills' | 'jobs'>('skills')

  // Modals
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false)
  const [isJobModalOpen, setIsJobModalOpen] = useState(false)

  // Skill Form
  const [skillName, setSkillName] = useState('')
  const [skillCategory, setSkillCategory] = useState<Skill['category']>('Technical')
  const [currentLevel, setCurrentLevel] = useState<Skill['current_level']>('Beginner')
  const [targetLevel, setTargetLevel] = useState<Skill['target_level']>('Advanced')
  const [completionPct, setCompletionPct] = useState(25)
  const [skillNotes, setSkillNotes] = useState('')

  // Job Form
  const [company, setCompany] = useState('')
  const [role, setRole] = useState('')
  const [appStatus, setAppStatus] = useState<JobApplication['status']>('applied')
  const [salary, setSalary] = useState('')
  const [appNotes, setAppNotes] = useState('')

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault()
    if (!skillName.trim()) return

    const newSkill: Skill = {
      id: 'skill-' + Date.now(),
      name: skillName.trim(),
      category: skillCategory,
      current_level: currentLevel,
      target_level: targetLevel,
      completion_percentage: completionPct,
      notes: skillNotes.trim(),
      last_practiced_at: new Date().toISOString().split('T')[0],
    }

    setSkills((prev) => [newSkill, ...prev])
    setSkillName('')
    setSkillNotes('')
    setIsSkillModalOpen(false)
  }

  const handleDeleteSkill = (id: string) => {
    setSkills((prev) => prev.filter((s) => s.id !== id))
  }

  const handleUpdateSkillProgress = (id: string, delta: number) => {
    setSkills((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const next = Math.max(0, Math.min(100, s.completion_percentage + delta))
          return { ...s, completion_percentage: next }
        }
        return s
      })
    )
  }

  const handleAddJob = (e: React.FormEvent) => {
    e.preventDefault()
    if (!company.trim() || !role.trim()) return

    const newJob: JobApplication = {
      id: 'job-' + Date.now(),
      company: company.trim(),
      role: role.trim(),
      status: appStatus,
      applied_date: new Date().toISOString().split('T')[0],
      salary_range: salary.trim(),
      notes: appNotes.trim(),
    }

    setApplications((prev) => [newJob, ...prev])
    setCompany('')
    setRole('')
    setSalary('')
    setAppNotes('')
    setIsJobModalOpen(false)
  }

  const handleDeleteJob = (id: string) => {
    setApplications((prev) => prev.filter((j) => j.id !== id))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <Briefcase className="w-7 h-7 text-cyan-400" /> Career & Skills Development
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Build technical and professional capabilities, track portfolio readiness, and manage internship/job applications.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setActiveTab('skills')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'skills' ? 'bg-cyan-500/20 text-cyan-400 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Skills Tracker
            </button>
            <button
              onClick={() => setActiveTab('jobs')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'jobs' ? 'bg-cyan-500/20 text-cyan-400 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Job & Internships ({applications.length})
            </button>
          </div>

          {activeTab === 'skills' ? (
            <button
              onClick={() => setIsSkillModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-600/20 transition-all"
            >
              <Plus className="w-4 h-4" /> Add Skill
            </button>
          ) : (
            <button
              onClick={() => setIsJobModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-600/20 transition-all"
            >
              <Plus className="w-4 h-4" /> Add Application
            </button>
          )}
        </div>
      </div>

      {activeTab === 'skills' ? (
        /* Skills Grid */
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {skills.map((skill) => (
              <div
                key={skill.id}
                className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
                      {skill.category}
                    </span>
                    <h3 className="font-bold text-white text-base mt-1.5">{skill.name}</h3>
                  </div>

                  <button
                    onClick={() => handleDeleteSkill(skill.id)}
                    className="p-1 rounded text-slate-600 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>
                    Level: <strong className="text-white">{skill.current_level}</strong>
                  </span>
                  <span>
                    Target: <strong className="text-cyan-400">{skill.target_level}</strong>
                  </span>
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Mastery</span>
                    <span className="font-bold text-white font-mono">{skill.completion_percentage}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all"
                      style={{ width: `${skill.completion_percentage}%` }}
                    />
                  </div>
                </div>

                {skill.notes && (
                  <p className="text-xs text-slate-400 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80 leading-relaxed">
                    {skill.notes}
                  </p>
                )}

                {/* Quick adjustments */}
                <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-[11px]">
                  <span className="text-slate-500">Update progress</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleUpdateSkillProgress(skill.id, -10)}
                      className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
                    >
                      -10%
                    </button>
                    <button
                      onClick={() => handleUpdateSkillProgress(skill.id, 10)}
                      className="px-2 py-0.5 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 font-bold"
                    >
                      +10%
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Job & Internship Tracker */
        <div className="space-y-4">
          <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Building className="w-4 h-4 text-cyan-400" /> Internship & Job Pipeline
            </h3>

            {applications.length === 0 ? (
              <div className="text-center py-10 text-slate-500 text-xs">
                No internship or job applications logged yet. Click "+ Add Application" above to begin tracking.
              </div>
            ) : (
              <div className="space-y-2.5">
                {applications.map((app) => {
                  const meta = APP_STATUS_BADGES[app.status] || APP_STATUS_BADGES.applied
                  return (
                    <div
                      key={app.id}
                      className="flex items-center justify-between p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all text-xs"
                    >
                      <div className="space-y-0.5 min-w-0 pr-3">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-white text-sm">{app.role}</p>
                          <span className="text-slate-400 font-medium">at {app.company}</span>
                        </div>
                        {app.notes && <p className="text-[11px] text-slate-500">{app.notes}</p>}
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        {app.salary_range && (
                          <span className="text-[10px] text-slate-400 font-mono hidden sm:inline-block">
                            {app.salary_range}
                          </span>
                        )}

                        <span className={`px-2.5 py-1 rounded-full border text-[10px] font-semibold ${meta.badge}`}>
                          {meta.label}
                        </span>

                        <button
                          onClick={() => handleDeleteJob(app.id)}
                          className="p-1 rounded text-slate-600 hover:text-rose-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Skill Modal */}
      {isSkillModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#111420] border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Add New Skill</h3>
              <button onClick={() => setIsSkillModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSkill} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Skill Name *</label>
                <input
                  type="text"
                  required
                  value={skillName}
                  onChange={(e) => setSkillName(e.target.value)}
                  placeholder="e.g. PostgreSQL, Excel Modeling, Public Speaking"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                  <select
                    value={skillCategory}
                    onChange={(e) => setSkillCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Technical">Technical</option>
                    <option value="Professional">Professional</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Target Level</label>
                  <select
                    value={targetLevel}
                    onChange={(e) => setTargetLevel(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Expert">Expert</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Notes / Practice Focus</label>
                <textarea
                  rows={2}
                  value={skillNotes}
                  onChange={(e) => setSkillNotes(e.target.value)}
                  placeholder="Key concepts to practice, tutorial links, certifications..."
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsSkillModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!skillName.trim()}
                  className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs"
                >
                  Save Skill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Job Application Modal */}
      {isJobModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#111420] border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Log Job/Internship Application</h3>
              <button onClick={() => setIsJobModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddJob} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Company Name *</label>
                <input
                  type="text"
                  required
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Google, TCS, Flipkart, Startup Inc."
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Role / Position *</label>
                <input
                  type="text"
                  required
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Junior Data Analyst Intern"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Status</label>
                  <select
                    value={appStatus}
                    onChange={(e) => setAppStatus(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="applied">Applied</option>
                    <option value="interviewing">Interviewing</option>
                    <option value="offered">Offered</option>
                    <option value="wishlist">Wishlist</option>
                    <option value="rejected">Archived</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Salary / Stipend</label>
                  <input
                    type="text"
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                    placeholder="e.g. 25k/mo or 6 LPA"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsJobModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!company.trim() || !role.trim()}
                  className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs"
                >
                  Save Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
