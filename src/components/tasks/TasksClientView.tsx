'use client'

import { useState, useMemo } from 'react'
import {
  CheckSquare,
  Plus,
  Search,
  Filter,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle2,
  Trash2,
  Edit2,
  Tag,
  ChevronDown,
  LayoutList,
  Kanban,
  X,
  Layers,
} from 'lucide-react'

export interface Task {
  id: string
  title: string
  description?: string
  category: string
  priority: 'high' | 'medium' | 'low'
  status: 'not_started' | 'in_progress' | 'completed' | 'on_hold'
  is_completed: boolean
  start_date?: string | null
  due_date?: string | null
  estimated_minutes?: number
  actual_minutes?: number
  created_at?: string
}

interface TasksClientViewProps {
  initialTasks: Task[]
}

const CATEGORIES = [
  'All',
  'Study',
  'College',
  'Career',
  'Projects',
  'English Practice',
  'Personal',
  'Important Work',
]

const PRIORITY_STYLES: Record<string, string> = {
  high: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
  medium: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  low: 'bg-slate-800 text-slate-400 border-slate-700',
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  not_started: { label: 'Not Started', color: 'text-slate-400' },
  in_progress: { label: 'In Progress', color: 'text-cyan-400' },
  completed: { label: 'Completed', color: 'text-emerald-400' },
  on_hold: { label: 'On Hold', color: 'text-amber-400' },
}

export function TasksClientView({ initialTasks }: TasksClientViewProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedPriority, setSelectedPriority] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list')
  const [filterTab, setFilterTab] = useState<'all' | 'today' | 'upcoming' | 'overdue' | 'completed'>('all')

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('Study')
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium')
  const [status, setStatus] = useState<'not_started' | 'in_progress' | 'completed' | 'on_hold'>('not_started')
  const [dueDate, setDueDate] = useState('')
  const [estimatedMinutes, setEstimatedMinutes] = useState(30)
  const [saving, setSaving] = useState(false)

  // Toggle tick / untick
  const handleToggleTask = async (id: string, currentState: boolean) => {
    const nextCompleted = !currentState
    const nextStatus = nextCompleted ? 'completed' : 'in_progress'

    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, is_completed: nextCompleted, status: nextStatus } : t))
    )

    try {
      await fetch('/api/dashboard/tasks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, is_completed: nextCompleted }),
      })
    } catch (err) {
      console.error('Error toggling task:', err)
    }
  }

  // Delete task
  const handleDeleteTask = async (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id))
    try {
      await fetch(`/api/dashboard/tasks?id=${id}`, { method: 'DELETE' })
    } catch (err) {
      console.error('Error deleting task:', err)
    }
  }

  // Open modal
  const openCreateModal = () => {
    setEditingTask(null)
    setTitle('')
    setDescription('')
    setCategory('Study')
    setPriority('medium')
    setStatus('not_started')
    setDueDate('')
    setEstimatedMinutes(30)
    setIsModalOpen(true)
  }

  const openEditModal = (task: Task) => {
    setEditingTask(task)
    setTitle(task.title)
    setDescription(task.description || '')
    setCategory(task.category || 'Study')
    setPriority(task.priority || 'medium')
    setStatus(task.status || (task.is_completed ? 'completed' : 'in_progress'))
    setDueDate(task.due_date ? task.due_date.split('T')[0] : '')
    setEstimatedMinutes(task.estimated_minutes || 30)
    setIsModalOpen(true)
  }

  const handleSaveTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    setSaving(true)

    const payload = {
      id: editingTask?.id,
      title: title.trim(),
      description: description.trim(),
      category,
      priority,
      status,
      is_completed: status === 'completed',
      due_date: dueDate ? dueDate : null,
      estimated_minutes: estimatedMinutes,
    }

    try {
      if (editingTask) {
        // Update
        const updatedTask: Task = {
          ...editingTask,
          ...payload,
          id: editingTask.id,
        }
        setTasks((prev) => prev.map((t) => (t.id === editingTask.id ? updatedTask : t)))
        await fetch('/api/dashboard/tasks', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...payload, id: editingTask.id }),
        })
      } else {
        // Create
        const res = await fetch('/api/dashboard/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        const created = await res.json()
        const newTask: Task = created?.task || {
          ...payload,
          id: 'temp-' + Date.now(),
        }
        setTasks((prev) => [newTask, ...prev])
      }
      setIsModalOpen(false)
    } catch (err) {
      console.error('Failed to save task:', err)
    } finally {
      setSaving(false)
    }
  }

  // Filter tasks
  const todayStr = new Date().toISOString().split('T')[0]

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      // Search
      if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false

      // Category
      if (selectedCategory !== 'All' && t.category !== selectedCategory) return false

      // Priority
      if (selectedPriority !== 'all' && t.priority !== selectedPriority) return false

      // Filter Tab
      if (filterTab === 'today') {
        return t.due_date && t.due_date.startsWith(todayStr)
      }
      if (filterTab === 'upcoming') {
        return t.due_date && t.due_date > todayStr && !t.is_completed
      }
      if (filterTab === 'overdue') {
        return t.due_date && t.due_date < todayStr && !t.is_completed
      }
      if (filterTab === 'completed') {
        return t.is_completed
      }

      return true
    })
  }, [tasks, search, selectedCategory, selectedPriority, filterTab, todayStr])

  const completedCount = tasks.filter((t) => t.is_completed).length
  const pendingCount = tasks.filter((t) => !t.is_completed).length

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="border-b border-slate-800 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <CheckSquare className="w-7 h-7 text-cyan-400" /> My Tasks
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Organize daily study activities, college assignments, and professional milestones with live tick/untick sync.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center bg-slate-900 border border-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'list' ? 'bg-cyan-500/20 text-cyan-400 font-bold' : 'text-slate-400 hover:text-white'
              }`}
              title="List View"
            >
              <LayoutList className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'kanban' ? 'bg-cyan-500/20 text-cyan-400 font-bold' : 'text-slate-400 hover:text-white'
              }`}
              title="Board View"
            >
              <Kanban className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-600/20 transition-all"
          >
            <Plus className="w-4 h-4" /> Add Task
          </button>
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <span className="text-xs text-slate-400 font-medium">Total Tasks</span>
          <p className="text-2xl font-bold text-white mt-1">{tasks.length}</p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <span className="text-xs text-emerald-400 font-medium">Completed</span>
          <p className="text-2xl font-bold text-emerald-300 mt-1">{completedCount}</p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <span className="text-xs text-cyan-400 font-medium">Pending Tasks</span>
          <p className="text-2xl font-bold text-cyan-300 mt-1">{pendingCount}</p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <span className="text-xs text-amber-400 font-medium">Completion Rate</span>
          <p className="text-2xl font-bold text-amber-300 mt-1">
            {tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0}%
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
        <div className="flex flex-wrap items-center gap-1.5">
          {(['all', 'today', 'upcoming', 'overdue', 'completed'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterTab(tab)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                filterTab === tab
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative flex-1 sm:w-48">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tasks..."
              className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main View: List or Kanban */}
      {viewMode === 'list' ? (
        <div className="space-y-2">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-16 bg-slate-900/40 border border-dashed border-slate-800 rounded-3xl space-y-3">
              <CheckSquare className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-sm font-semibold text-slate-300">No tasks found</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No tasks match your current filter. Create a new task to organize your day.
              </p>
              <button
                onClick={openCreateModal}
                className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs"
              >
                <Plus className="w-4 h-4" /> Create First Task
              </button>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <div
                key={task.id}
                className={`group flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border transition-all ${
                  task.is_completed
                    ? 'bg-slate-950/40 border-slate-800/60 opacity-60'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Left: Checkbox & Title */}
                <div className="flex items-center gap-3.5 flex-1 min-w-0 pr-3">
                  <button
                    type="button"
                    onClick={() => handleToggleTask(task.id, task.is_completed)}
                    className="shrink-0 p-0.5"
                    aria-label={task.is_completed ? 'Mark incomplete' : 'Mark complete'}
                  >
                    <div
                      className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all ${
                        task.is_completed
                          ? 'bg-emerald-500 border-emerald-500 shadow-sm shadow-emerald-500/20'
                          : 'border-slate-600 hover:border-emerald-500'
                      }`}
                    >
                      {task.is_completed && <CheckCircle2 className="w-3.5 h-3.5 text-slate-950 stroke-[3]" />}
                    </div>
                  </button>

                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-xs sm:text-sm font-semibold truncate ${
                        task.is_completed ? 'line-through text-slate-500' : 'text-white'
                      }`}
                    >
                      {task.title}
                    </p>
                    {task.description && (
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">{task.description}</p>
                    )}
                  </div>
                </div>

                {/* Right: Badges & Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-medium hidden sm:inline-block">
                    {task.category}
                  </span>

                  <span
                    className={`text-[9px] px-2 py-0.5 rounded-full border font-semibold uppercase ${
                      PRIORITY_STYLES[task.priority] || PRIORITY_STYLES.medium
                    }`}
                  >
                    {task.priority}
                  </span>

                  {task.due_date && (
                    <span className="text-[10px] text-slate-400 font-mono hidden md:inline-flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-cyan-400" />
                      {task.due_date.split('T')[0]}
                    </span>
                  )}

                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openEditModal(task)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 transition-colors"
                      title="Edit task"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                      title="Delete task"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        /* Kanban View */
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {(['not_started', 'in_progress', 'completed', 'on_hold'] as const).map((colStatus) => {
            const colTasks = filteredTasks.filter(
              (t) => (t.status || (t.is_completed ? 'completed' : 'not_started')) === colStatus
            )
            const meta = STATUS_LABELS[colStatus]

            return (
              <div key={colStatus} className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className={`text-xs font-bold ${meta.color}`}>{meta.label}</span>
                  <span className="text-xs text-slate-500 font-mono">{colTasks.length}</span>
                </div>

                <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
                  {colTasks.map((task) => (
                    <div
                      key={task.id}
                      className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2 hover:border-slate-700 transition-all"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-semibold text-white leading-snug">{task.title}</p>
                        <button
                          onClick={() => handleToggleTask(task.id, task.is_completed)}
                          className="shrink-0 p-0.5"
                        >
                          <div
                            className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                              task.is_completed
                                ? 'bg-emerald-500 border-emerald-500'
                                : 'border-slate-600 hover:border-emerald-500'
                            }`}
                          >
                            {task.is_completed && <CheckCircle2 className="w-3 h-3 text-slate-950" />}
                          </div>
                        </button>
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                        <span className="bg-slate-900 px-1.5 py-0.5 rounded text-slate-400">{task.category}</span>
                        <span
                          className={`px-1.5 py-0.5 rounded font-mono uppercase ${
                            PRIORITY_STYLES[task.priority] || PRIORITY_STYLES.medium
                          }`}
                        >
                          {task.priority}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Task Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-[#111420] border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">
                {editingTask ? 'Edit Task' : 'Create New Task'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveTask} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Task Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Finish Chapter 4 Mathematics Exercises"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description (Optional)</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Additional notes or instructions..."
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    {CATEGORIES.filter((c) => c !== 'All').map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                  </input>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="not_started">Not Started</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="on_hold">On Hold</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || !title.trim()}
                  className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs shadow-md shadow-cyan-600/20 disabled:opacity-40"
                >
                  {saving ? 'Saving...' : editingTask ? 'Update Task' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
