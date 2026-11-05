'use client'

import { useState, useCallback, useRef } from 'react'
import Link from 'next/link'
import {
  Clock, Flame, BookOpen, CheckCircle2, Calendar, Bookmark, StickyNote, Award,
  ArrowRight, Plus, Play, Sparkles, SlidersHorizontal, Eye, EyeOff, X,
  GripVertical, Loader2, Target, Layers, Zap, Briefcase, CalendarDays,
  ChevronDown, ChevronUp, Pencil, Trash2, AlertCircle,
} from 'lucide-react'

// ─── Types ───────────────────────────────────────────────────────────────────
interface WidgetConfig { key: string; visible: boolean; order: number; size: string }

interface Task { id: string; title: string; category: string; priority: string; due_date: string | null; is_completed: boolean; description?: string }
interface Exam { id: string; name: string; subject: string; exam_date: string | null; color: string; priority: string; daysLeft?: number }
interface Subject { id: string; name: string; category: string; icon_emoji: string; color: string; target_hours: number; completed_hours: number }
interface Goal { id: string; title: string; type: string; target_value: number; current_value: number; unit: string; icon_emoji: string; is_completed: boolean }

interface PersonalizedDashboardProps {
  user: { id: string; email?: string; name: string; avatarEmoji?: string }
  stats: { todayStudyMinutes: number; currentStreak: number; totalBooksRead: number; notesCount: number; bookmarksCount: number }
  continueReading: { id: string; title: string; author: string; currentPage: number; totalPages: number; coverUrl?: string; category: string } | null
  widgetsConfig: WidgetConfig[]
  initialTasks: Task[]
  initialExams: Exam[]
  initialSubjects: Subject[]
  initialGoals: Goal[]
  onboardingProfile: { education_type?: string; career_interests?: string[]; daily_study_goal_hours?: number; accent_color?: string } | null
  badges: Array<{ id: string; title: string; description: string; icon: string; unlocked: boolean }>
}

// ─── Color helpers ─────────────────────────────────────────────────────────
const colorMap: Record<string, string> = {
  rose: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
  orange: 'text-orange-400 bg-orange-500/10 border-orange-500/30',
  amber: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
  cyan: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
  blue: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
  violet: 'text-violet-400 bg-violet-500/10 border-violet-500/30',
  emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
  pink: 'text-pink-400 bg-pink-500/10 border-pink-500/30',
  purple: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
}

const priorityBadge: Record<string, string> = {
  high:   'bg-rose-500/10 text-rose-400 border border-rose-500/30',
  medium: 'bg-amber-500/10 text-amber-400 border border-amber-500/30',
  low:    'bg-slate-700 text-slate-400 border border-slate-700',
}

function daysLeft(dateStr: string | null): number | null {
  if (!dateStr) return null
  const diff = new Date(dateStr).getTime() - Date.now()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

// ─── Component ────────────────────────────────────────────────────────────────
export function PersonalizedDashboard({
  user, stats, continueReading, widgetsConfig: initialWidgetsConfig,
  initialTasks, initialExams, initialSubjects, initialGoals, onboardingProfile, badges,
}: PersonalizedDashboardProps) {

  const [widgetsConfig, setWidgetsConfig] = useState<WidgetConfig[]>(
    initialWidgetsConfig.length > 0 ? initialWidgetsConfig : [
      { key: 'stats', visible: true, order: 1, size: 'full' },
      { key: 'tasks', visible: true, order: 2, size: 'half' },
      { key: 'exams', visible: true, order: 3, size: 'half' },
      { key: 'subjects', visible: true, order: 4, size: 'half' },
      { key: 'reading', visible: true, order: 5, size: 'half' },
      { key: 'goals', visible: true, order: 6, size: 'half' },
      { key: 'badges', visible: true, order: 10, size: 'full' },
    ]
  )
  const [showCustomizer, setShowCustomizer] = useState(false)
  const [savingWidgets, setSavingWidgets] = useState(false)

  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [exams, setExams] = useState<Exam[]>(initialExams)
  const [subjects, setSubjects] = useState<Subject[]>(initialSubjects)
  const [goals, setGoals] = useState<Goal[]>(initialGoals)

  // Quick-add states
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskPriority, setNewTaskPriority] = useState('medium')
  const [addingTask, setAddingTask] = useState(false)

  const [showAddExam, setShowAddExam] = useState(false)
  const [newExam, setNewExam] = useState({ name: '', subject: '', exam_date: '', color: 'rose' })
  const [addingExam, setAddingExam] = useState(false)

  const [showAddSubject, setShowAddSubject] = useState(false)
  const [newSubject, setNewSubject] = useState({ name: '', category: 'Subject', icon_emoji: '📚', color: 'blue' })
  const [addingSubject, setAddingSubject] = useState(false)

  const [newGoalTitle, setNewGoalTitle] = useState('')
  const [addingGoal, setAddingGoal] = useState(false)

  // Drag-and-drop for widget reorder
  const dragItem = useRef<number | null>(null)
  const dragOverItem = useRef<number | null>(null)

  const sortedWidgets = [...widgetsConfig].sort((a, b) => a.order - b.order)
  const visibleWidgets = sortedWidgets.filter(w => w.visible).map(w => w.key)

  // ─── Widget Config Persistence ─────────────────────────────────────────────
  const saveWidgets = useCallback(async (config: WidgetConfig[]) => {
    setSavingWidgets(true)
    try {
      await fetch('/api/dashboard/widgets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ widgets_config: config }),
      })
    } finally {
      setSavingWidgets(false)
    }
  }, [])

  const toggleWidget = async (key: string) => {
    const updated = widgetsConfig.map(w => w.key === key ? { ...w, visible: !w.visible } : w)
    setWidgetsConfig(updated)
    await saveWidgets(updated)
  }

  const handleDragSort = () => {
    if (dragItem.current === null || dragOverItem.current === null) return
    const sorted = [...sortedWidgets]
    const dragged = sorted.splice(dragItem.current, 1)[0]
    sorted.splice(dragOverItem.current, 0, dragged)
    const updated = sorted.map((w, i) => ({ ...w, order: i + 1 }))
    setWidgetsConfig(updated)
    saveWidgets(updated)
    dragItem.current = null
    dragOverItem.current = null
  }

  // ─── Tasks CRUD ────────────────────────────────────────────────────────────
  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTaskTitle.trim()) return
    setAddingTask(true)
    try {
      const res = await fetch('/api/dashboard/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTaskTitle, priority: newTaskPriority }),
      })
      const { task } = await res.json()
      if (task) {
        setTasks(prev => [task, ...prev])
        setNewTaskTitle('')
      }
    } finally {
      setAddingTask(false)
    }
  }

  const handleToggleTask = async (id: string, currentState: boolean) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, is_completed: !currentState } : t))
    await fetch('/api/dashboard/tasks', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, is_completed: !currentState }),
    })
  }

  const handleDeleteTask = async (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id))
    await fetch(`/api/dashboard/tasks?id=${id}`, { method: 'DELETE' })
  }

  // ─── Exams CRUD ────────────────────────────────────────────────────────────
  const handleAddExam = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newExam.name.trim()) return
    setAddingExam(true)
    try {
      const res = await fetch('/api/dashboard/exams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newExam),
      })
      const { exam } = await res.json()
      if (exam) {
        setExams(prev => [...prev, exam])
        setNewExam({ name: '', subject: '', exam_date: '', color: 'rose' })
        setShowAddExam(false)
      }
    } finally {
      setAddingExam(false)
    }
  }

  const handleDeleteExam = async (id: string) => {
    setExams(prev => prev.filter(e => e.id !== id))
    await fetch(`/api/dashboard/exams?id=${id}`, { method: 'DELETE' })
  }

  // ─── Subjects CRUD ─────────────────────────────────────────────────────────
  const handleAddSubject = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newSubject.name.trim()) return
    setAddingSubject(true)
    try {
      const res = await fetch('/api/dashboard/subjects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSubject),
      })
      const { subject } = await res.json()
      if (subject) {
        setSubjects(prev => [subject, ...prev])
        setNewSubject({ name: '', category: 'Subject', icon_emoji: '📚', color: 'blue' })
        setShowAddSubject(false)
      }
    } finally {
      setAddingSubject(false)
    }
  }

  const handleDeleteSubject = async (id: string) => {
    setSubjects(prev => prev.filter(s => s.id !== id))
    await fetch(`/api/dashboard/subjects?id=${id}`, { method: 'DELETE' })
  }

  // ─── Goals CRUD ────────────────────────────────────────────────────────────
  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newGoalTitle.trim()) return
    setAddingGoal(true)
    try {
      const res = await fetch('/api/dashboard/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newGoalTitle, type: 'daily', target_value: 1, unit: 'hours' }),
      })
      const { goal } = await res.json()
      if (goal) {
        setGoals(prev => [goal, ...prev])
        setNewGoalTitle('')
      }
    } finally {
      setAddingGoal(false)
    }
  }

  const handleToggleGoal = async (id: string, current: boolean) => {
    setGoals(prev => prev.map(g => g.id === id ? { ...g, is_completed: !current } : g))
    await fetch('/api/dashboard/goals', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, is_completed: !current }),
    })
  }

  const handleDeleteGoal = async (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id))
    await fetch(`/api/dashboard/goals?id=${id}`, { method: 'DELETE' })
  }

  // ─── Greeting ──────────────────────────────────────────────────────────────
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : hour < 21 ? 'Good Evening' : 'Good Night'
  const goalMinutes = Math.round((onboardingProfile?.daily_study_goal_hours || 2) * 60)
  const goalProgress = Math.min(100, Math.round((stats.todayStudyMinutes / goalMinutes) * 100))

  const WIDGET_LABELS: Record<string, { label: string; icon: string }> = {
    stats:    { label: 'Study Stats',     icon: '📊' },
    tasks:    { label: 'Daily Tasks',     icon: '✅' },
    exams:    { label: 'Exam Countdown',  icon: '📅' },
    subjects: { label: 'My Subjects',     icon: '📚' },
    reading:  { label: 'Continue Reading',icon: '📖' },
    goals:    { label: 'Daily Goals',     icon: '🎯' },
    skills:   { label: 'Skills',          icon: '⚡' },
    projects: { label: 'Projects',        icon: '🗂️' },
    calendar: { label: 'Calendar',        icon: '🗓️' },
    badges:   { label: 'Achievements',    icon: '🏆' },
  }

  // ─── Widget renderers ────────────────────────────────────────────────────────
  const renderWidget = (key: string) => {
    switch (key) {
      // ── STATS ──────────────────────────────────────────────────────────────
      case 'stats':
        return (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Today's Focus", value: `${Math.floor(stats.todayStudyMinutes/60)}h ${stats.todayStudyMinutes%60}m`, sub: `Goal: ${Math.floor(goalMinutes/60)}h ${goalMinutes%60}m (${goalProgress}%)`, icon: <Clock className="w-4 h-4"/>, color: 'text-cyan-400 bg-cyan-500/10' },
              { label: 'Streak',  value: `${stats.currentStreak} Days`, sub: "Don't break the chain!", icon: <Flame className="w-4 h-4 fill-amber-400"/>, color: 'text-amber-400 bg-amber-500/10' },
              { label: 'Notes',   value: `${stats.notesCount}`, sub: <Link href="/notes" className="text-cyan-400 hover:underline">View all →</Link>, icon: <StickyNote className="w-4 h-4"/>, color: 'text-indigo-400 bg-indigo-500/10' },
              { label: 'Bookmarks', value: `${stats.bookmarksCount}`, sub: <Link href="/library" className="text-cyan-400 hover:underline">Library →</Link>, icon: <Bookmark className="w-4 h-4"/>, color: 'text-purple-400 bg-purple-500/10' },
            ].map((s, i) => (
              <div key={i} className="bg-slate-900/70 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-3">
                  <span>{s.label}</span>
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${s.color}`}>{s.icon}</div>
                </div>
                <div className="text-2xl font-bold text-white tracking-tight">{s.value}</div>
                <div className="text-[11px] text-slate-400 mt-1">{s.sub}</div>
              </div>
            ))}
          </div>
        )

      // ── TASKS ──────────────────────────────────────────────────────────────
      case 'tasks':
        return (
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <h3 className="font-semibold text-white text-base">Daily Tasks</h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                {tasks.filter(t => t.is_completed).length}/{tasks.length} done
              </span>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-1 mb-4">
              {tasks.length === 0 && (
                <div className="text-center py-6 text-slate-500 text-xs">No tasks yet. Add your first task below!</div>
              )}
              {tasks.map(task => (
                <div key={task.id} className={`group flex items-center gap-2.5 p-3 rounded-xl border transition-all ${task.is_completed ? 'bg-slate-950/40 border-slate-800/60 opacity-60' : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'}`}>
                  <button onClick={() => handleToggleTask(task.id, task.is_completed)} className="shrink-0">
                    <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${task.is_completed ? 'bg-emerald-500 border-emerald-500' : 'border-slate-600 hover:border-emerald-500'}`}>
                      {task.is_completed && <CheckCircle2 className="w-3 h-3 text-slate-950" />}
                    </div>
                  </button>
                  <span className={`flex-1 text-xs ${task.is_completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>{task.title}</span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${priorityBadge[task.priority] || priorityBadge.medium}`}>{task.priority}</span>
                  <button onClick={() => handleDeleteTask(task.id)} className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-rose-400 transition-all">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddTask} className="flex gap-2">
              <select
                value={newTaskPriority}
                onChange={e => setNewTaskPriority(e.target.value)}
                className="px-2 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
              >
                <option value="high">🔴 High</option>
                <option value="medium">🟡 Med</option>
                <option value="low">🟢 Low</option>
              </select>
              <input
                type="text"
                placeholder="Add task..."
                value={newTaskTitle}
                onChange={e => setNewTaskTitle(e.target.value)}
                className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
              />
              <button type="submit" disabled={addingTask} className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 transition-colors disabled:opacity-50">
                {addingTask ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              </button>
            </form>
          </div>
        )

      // ── EXAMS ──────────────────────────────────────────────────────────────
      case 'exams':
        return (
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-rose-400" />
                <h3 className="font-semibold text-white text-base">Exam Countdown</h3>
              </div>
              <button onClick={() => setShowAddExam(!showAddExam)} className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium">
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>

            {showAddExam && (
              <form onSubmit={handleAddExam} className="mb-4 p-3 rounded-xl bg-slate-950/60 border border-slate-700/60 space-y-2">
                <input type="text" placeholder="Exam name" value={newExam.name} onChange={e => setNewExam(p => ({ ...p, name: e.target.value }))}
                  className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500" />
                <div className="flex gap-2">
                  <input type="text" placeholder="Subject" value={newExam.subject} onChange={e => setNewExam(p => ({ ...p, subject: e.target.value }))}
                    className="flex-1 px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500" />
                  <input type="date" value={newExam.exam_date} onChange={e => setNewExam(p => ({ ...p, exam_date: e.target.value }))}
                    className="flex-1 px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500" />
                </div>
                <div className="flex gap-1">
                  {['rose','amber','cyan','blue','violet','emerald'].map(c => (
                    <button key={c} type="button" onClick={() => setNewExam(p => ({ ...p, color: c }))}
                      className={`flex-1 h-6 rounded bg-${c}-500 border-2 ${newExam.color === c ? 'border-white' : 'border-transparent'}`} />
                  ))}
                </div>
                <button type="submit" disabled={addingExam || !newExam.name.trim()} className="w-full py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold disabled:opacity-50">
                  {addingExam ? 'Adding...' : 'Add Exam'}
                </button>
              </form>
            )}

            <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
              {exams.length === 0 && !showAddExam && (
                <div className="text-center py-6 text-slate-500 text-xs">No exams added. Click + Add to start.</div>
              )}
              {exams.map(exam => {
                const dl = daysLeft(exam.exam_date)
                const colors = colorMap[exam.color] || colorMap.rose
                return (
                  <div key={exam.id} className="group flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                    <div>
                      <h4 className="text-xs font-semibold text-white">{exam.name}</h4>
                      <p className="text-[11px] text-slate-400">{exam.subject}</p>
                      {exam.exam_date && <p className="text-[10px] text-slate-500 font-mono">{new Date(exam.exam_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>}
                    </div>
                    <div className="flex items-center gap-2">
                      {dl !== null && (
                        <div className="text-right">
                          <div className={`text-lg font-extrabold font-mono ${dl <= 7 ? 'text-rose-400' : dl <= 30 ? 'text-amber-400' : 'text-emerald-400'}`}>{dl}d</div>
                          <span className="text-[9px] text-slate-500 uppercase">left</span>
                        </div>
                      )}
                      <button onClick={() => handleDeleteExam(exam.id)} className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-rose-400 transition-all">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )

      // ── SUBJECTS ───────────────────────────────────────────────────────────
      case 'subjects':
        return (
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-400" />
                <h3 className="font-semibold text-white text-base">My Subjects</h3>
              </div>
              <button onClick={() => setShowAddSubject(!showAddSubject)} className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium">
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>

            {showAddSubject && (
              <form onSubmit={handleAddSubject} className="mb-4 p-3 rounded-xl bg-slate-950/60 border border-slate-700/60 space-y-2">
                <div className="flex gap-2">
                  <input type="text" placeholder="Subject / Skill name" value={newSubject.name} onChange={e => setNewSubject(p => ({ ...p, name: e.target.value }))}
                    className="flex-1 px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500" />
                  <select value={newSubject.category} onChange={e => setNewSubject(p => ({ ...p, category: e.target.value }))}
                    className="px-2 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500">
                    {['Subject','Skill','Language','Topic','Module'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="flex gap-1">
                  {['📚','💻','🧮','🌍','⚡','🔬','📐','🎵'].map(icon => (
                    <button key={icon} type="button" onClick={() => setNewSubject(p => ({ ...p, icon_emoji: icon }))}
                      className={`flex-1 h-7 rounded text-sm ${newSubject.icon_emoji === icon ? 'bg-cyan-500/20 ring-1 ring-cyan-500' : 'bg-slate-800'}`}>{icon}</button>
                  ))}
                </div>
                <button type="submit" disabled={addingSubject || !newSubject.name.trim()} className="w-full py-1.5 rounded-lg bg-blue-500 hover:bg-blue-400 text-white text-xs font-bold disabled:opacity-50">
                  {addingSubject ? 'Adding...' : 'Add Subject'}
                </button>
              </form>
            )}

            <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
              {subjects.length === 0 && !showAddSubject && (
                <div className="col-span-2 text-center py-6 text-slate-500 text-xs">No subjects added yet.</div>
              )}
              {subjects.map(sub => {
                const pct = sub.target_hours > 0 ? Math.min(100, Math.round((sub.completed_hours / sub.target_hours) * 100)) : 0
                const colors = colorMap[sub.color] || colorMap.blue
                return (
                  <div key={sub.id} className="group p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xl">{sub.icon_emoji}</span>
                      <div className="flex items-center gap-1">
                        <span className="text-[9px] text-slate-500">{sub.category}</span>
                        <button onClick={() => handleDeleteSubject(sub.id)} className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-rose-400 transition-all">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs font-semibold text-white truncate">{sub.name}</p>
                    <div className="mt-2 w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full bg-${sub.color}-500 transition-all`} style={{ width: `${pct}%` }} />
                    </div>
                    <p className="text-[9px] text-slate-500 mt-1">{sub.completed_hours}h / {sub.target_hours}h</p>
                  </div>
                )
              })}
            </div>
          </div>
        )

      // ── READING ────────────────────────────────────────────────────────────
      case 'reading':
        return (
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-cyan-400" />
                <h3 className="font-semibold text-white text-base">Continue Reading</h3>
              </div>
              <Link href="/library" className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
                Browse all <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            {continueReading ? (
              <div className="flex gap-4 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <div className="w-14 h-20 bg-gradient-to-tr from-cyan-900 to-indigo-900 rounded-lg shrink-0 flex items-center justify-center text-cyan-300 font-bold text-xl shadow-md border border-cyan-500/20">
                  {continueReading.title.charAt(0)}
                </div>
                <div className="flex-1">
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">{continueReading.category}</span>
                  <h4 className="text-xs font-bold text-white mt-1 line-clamp-2">{continueReading.title}</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">by {continueReading.author}</p>
                  <div className="mt-3 space-y-1.5">
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>Page {continueReading.currentPage} of {continueReading.totalPages}</span>
                      <span className="text-cyan-400">{Math.round((continueReading.currentPage/continueReading.totalPages)*100)}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full" style={{ width: `${(continueReading.currentPage/continueReading.totalPages)*100}%` }} />
                    </div>
                  </div>
                  <Link href={`/reader/${continueReading.id}`} className="inline-flex items-center gap-1 mt-3 px-3 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-[10px] font-bold transition-all">
                    <Play className="w-3 h-3 fill-current" /> Resume
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 bg-slate-950/40 border border-dashed border-slate-800 rounded-xl space-y-2">
                <BookOpen className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-xs text-slate-400">No book in progress</p>
                <Link href="/library" className="inline-block px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold">
                  Browse Library
                </Link>
              </div>
            )}
          </div>
        )

      // ── GOALS ──────────────────────────────────────────────────────────────
      case 'goals':
        return (
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-emerald-400" />
                <h3 className="font-semibold text-white text-base">Daily Goals</h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                {goals.filter(g => g.is_completed).length}/{goals.length}
              </span>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1 mb-4">
              {goals.length === 0 && (
                <div className="text-center py-5 text-slate-500 text-xs">Add a goal below!</div>
              )}
              {goals.map(goal => (
                <div key={goal.id} className={`group flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${goal.is_completed ? 'bg-slate-950/40 border-slate-800/60 opacity-60' : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'}`}
                  onClick={() => handleToggleGoal(goal.id, goal.is_completed)}>
                  <div className={`w-4 h-4 rounded-md border flex items-center justify-center ${goal.is_completed ? 'bg-emerald-500 border-emerald-500' : 'border-slate-600'}`}>
                    {goal.is_completed && <CheckCircle2 className="w-3 h-3 text-slate-950" />}
                  </div>
                  <span className="text-lg">{goal.icon_emoji}</span>
                  <span className={`flex-1 text-xs ${goal.is_completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>{goal.title}</span>
                  <button onClick={e => { e.stopPropagation(); handleDeleteGoal(goal.id) }} className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-rose-400 transition-all">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
            <form onSubmit={handleAddGoal} className="flex gap-2">
              <input type="text" placeholder="Add a goal..." value={newGoalTitle} onChange={e => setNewGoalTitle(e.target.value)}
                className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500" />
              <button type="submit" disabled={addingGoal} className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 transition-colors disabled:opacity-50">
                {addingGoal ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              </button>
            </form>
          </div>
        )

      // ── BADGES ─────────────────────────────────────────────────────────────
      case 'badges':
        return (
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                <h3 className="font-semibold text-white text-base">Achievements</h3>
              </div>
              <span className="text-[11px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full border border-slate-700">Private by Default</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {badges.map(badge => (
                <div key={badge.id} className={`p-3.5 rounded-xl border flex items-center gap-3 ${badge.unlocked ? 'bg-amber-500/5 border-amber-500/30' : 'bg-slate-950/40 border-slate-800/80 opacity-40'}`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-xl ${badge.unlocked ? 'bg-amber-500/20 border border-amber-500/30' : 'bg-slate-800'}`}>{badge.icon}</div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{badge.title}</h4>
                    <p className="text-[10px] text-slate-400 line-clamp-1">{badge.description}</p>
                    <span className="text-[9px] font-mono text-cyan-400">{badge.unlocked ? 'Unlocked' : 'Locked'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      // ── SKILLS (placeholder) ───────────────────────────────────────────────
      case 'skills':
        return (
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-amber-400" />
              <h3 className="font-semibold text-white text-base">Skills Progress</h3>
            </div>
            <div className="text-center py-8 text-slate-500 text-xs space-y-2">
              <span className="text-3xl">⚡</span>
              <p>Add skills from the Subjects widget to track progress here.</p>
              <Link href="/tools" className="inline-block px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs hover:bg-amber-500/20 transition-colors">Start Study Timer</Link>
            </div>
          </div>
        )

      // ── PROJECTS (placeholder) ─────────────────────────────────────────────
      case 'projects':
        return (
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Briefcase className="w-5 h-5 text-purple-400" />
              <h3 className="font-semibold text-white text-base">Projects</h3>
            </div>
            <div className="text-center py-8 text-slate-500 text-xs space-y-2">
              <span className="text-3xl">🗂️</span>
              <p>Project tracking coming soon. Use Tasks to track project work for now.</p>
            </div>
          </div>
        )

      // ── CALENDAR (placeholder) ─────────────────────────────────────────────
      case 'calendar':
        return (
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <CalendarDays className="w-5 h-5 text-blue-400" />
              <h3 className="font-semibold text-white text-base">Study Calendar</h3>
            </div>
            <div className="text-center py-8 text-slate-500 text-xs space-y-2">
              <span className="text-3xl">🗓️</span>
              <p>Your exam dates from the Exam Countdown widget appear here.</p>
              {exams.slice(0, 3).map(e => (
                <div key={e.id} className="text-left p-2 rounded-lg bg-slate-800 border border-slate-700">
                  <p className="text-xs text-white font-medium">{e.name}</p>
                  <p className="text-[10px] text-slate-400">{e.exam_date ? new Date(e.exam_date).toLocaleDateString('en-IN') : 'No date set'}</p>
                </div>
              ))}
            </div>
          </div>
        )

      default: return null
    }
  }

  // ─── Full-width widgets ────────────────────────────────────────────────────
  const fullWidgets = ['stats', 'badges']

  return (
    <div className="space-y-6">
      {/* ── Top Banner ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{user.avatarEmoji || '🎓'}</span>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                {greeting}, {user.name.split(' ')[0]}! ✨
              </h1>
              {onboardingProfile?.career_interests && onboardingProfile.career_interests.length > 0 && (
                <p className="text-xs text-slate-400 mt-0.5">
                  Studying: {onboardingProfile.career_interests.slice(0, 3).join(' · ')}
                </p>
              )}
            </div>
          </div>
          {/* Daily goal progress bar */}
          <div className="mt-2 flex items-center gap-3">
            <div className="flex-1 max-w-xs bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full transition-all" style={{ width: `${goalProgress}%` }} />
            </div>
            <span className="text-xs text-slate-400">{stats.todayStudyMinutes}m / {goalMinutes}m daily goal</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={() => setShowCustomizer(!showCustomizer)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-all">
            <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
            {savingWidgets ? 'Saving...' : 'Customize'}
          </button>
          <Link href="/tools" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold shadow-lg shadow-cyan-500/20 transition-all">
            <Play className="w-3.5 h-3.5 fill-current" /> Start Study Timer
          </Link>
        </div>
      </div>

      {/* ── Widget Customizer ──────────────────────────────────────────────── */}
      {showCustomizer && (
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300 pb-2 border-b border-slate-800">
            <span>🧩 Customize Dashboard Widgets</span>
            <span className="text-slate-500">Drag to reorder · Click to toggle visibility</span>
          </div>
          <div className="space-y-1.5">
            {sortedWidgets.map((widget, idx) => {
              const info = WIDGET_LABELS[widget.key]
              if (!info) return null
              return (
                <div
                  key={widget.key}
                  draggable
                  onDragStart={() => { dragItem.current = idx }}
                  onDragEnter={() => { dragOverItem.current = idx }}
                  onDragEnd={handleDragSort}
                  onDragOver={e => e.preventDefault()}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border cursor-grab active:cursor-grabbing transition-all ${
                    widget.visible ? 'bg-cyan-500/5 border-cyan-500/20 text-slate-200' : 'bg-slate-950 border-slate-800 text-slate-500 opacity-70'
                  }`}
                >
                  <GripVertical className="w-4 h-4 text-slate-500 shrink-0" />
                  <span className="text-base">{info.icon}</span>
                  <span className="flex-1 text-xs font-medium">{info.label}</span>
                  <button onClick={() => toggleWidget(widget.key)} className="ml-auto text-slate-400 hover:text-slate-100">
                    {widget.visible ? <Eye className="w-4 h-4 text-cyan-400" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                </div>
              )
            })}
          </div>
          <p className="text-[10px] text-slate-500 text-center">Changes save automatically to your Supabase account</p>
        </div>
      )}

      {/* ── Widget Grid ────────────────────────────────────────────────────── */}
      {/* Full-width first */}
      {visibleWidgets.filter(k => fullWidgets.includes(k) && k !== 'badges').map(key => (
        <div key={key}>{renderWidget(key)}</div>
      ))}

      {/* Half-width grid */}
      {(() => {
        const halfKeys = visibleWidgets.filter(k => !fullWidgets.includes(k))
        if (halfKeys.length === 0) return null
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {halfKeys.map(key => <div key={key}>{renderWidget(key)}</div>)}
          </div>
        )
      })()}

      {/* Badges last */}
      {visibleWidgets.includes('badges') && renderWidget('badges')}
    </div>
  )
}
