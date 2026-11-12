'use client'

import { useState } from 'react'
import {
  Target,
  Plus,
  Flame,
  CheckCircle2,
  Calendar,
  Layers,
  Award,
  Trash2,
  X,
  Sparkles,
  TrendingUp,
} from 'lucide-react'

export interface Goal {
  id: string
  title: string
  description?: string
  category?: string
  priority?: string
  target_date?: string
  target_value: number
  current_value: number
  unit: string
  is_completed: boolean
}

export interface Habit {
  id: string
  name: string
  icon_emoji: string
  target_days_per_week: number
  streak: number
  completed_today: boolean
}

interface GoalsClientViewProps {
  initialGoals: Goal[]
  initialHabits?: Habit[]
}

const DEFAULT_HABITS: Habit[] = [
  { id: 'h-1', name: 'Focus Study 4+ Hours', icon_emoji: '📖', target_days_per_week: 7, streak: 5, completed_today: true },
  { id: 'h-2', name: 'English Speaking / Listening', icon_emoji: '🗣️', target_days_per_week: 6, streak: 3, completed_today: false },
  { id: 'h-3', name: 'Solve 5 Coding / Math Problems', icon_emoji: '💻', target_days_per_week: 5, streak: 8, completed_today: true },
  { id: 'h-4', name: 'Physical Exercise / Walk', icon_emoji: '🏃', target_days_per_week: 6, streak: 4, completed_today: false },
]

export function GoalsClientView({ initialGoals, initialHabits }: GoalsClientViewProps) {
  const [goals, setGoals] = useState<Goal[]>(initialGoals)
  const [habits, setHabits] = useState<Habit[]>(
    initialHabits && initialHabits.length > 0 ? initialHabits : DEFAULT_HABITS
  )

  // Modals
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false)
  const [isHabitModalOpen, setIsHabitModalOpen] = useState(false)

  // Goal Form
  const [goalTitle, setGoalTitle] = useState('')
  const [goalDesc, setGoalDesc] = useState('')
  const [goalCategory, setGoalCategory] = useState('Academic')
  const [targetDate, setTargetDate] = useState('')

  // Habit Form
  const [habitName, setHabitName] = useState('')
  const [habitEmoji, setHabitEmoji] = useState('🎯')

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault()
    if (!goalTitle.trim()) return

    const newGoal: Goal = {
      id: 'g-' + Date.now(),
      title: goalTitle.trim(),
      description: goalDesc.trim(),
      category: goalCategory,
      target_date: targetDate || undefined,
      target_value: 100,
      current_value: 0,
      unit: '%',
      is_completed: false,
    }

    setGoals((prev) => [newGoal, ...prev])
    setIsGoalModalOpen(false)
    setGoalTitle('')
    setGoalDesc('')
  }

  const handleDeleteGoal = async (id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id))
    try {
      await fetch(`/api/dashboard/goals?id=${id}`, { method: 'DELETE' })
    } catch {}
  }

  const handleToggleGoal = async (id: string, currentState: boolean) => {
    setGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, is_completed: !currentState } : g))
    )
    try {
      await fetch('/api/dashboard/goals', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, is_completed: !currentState }),
      })
    } catch {}
  }

  const handleToggleHabit = (id: string) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id === id) {
          const nextState = !h.completed_today
          return {
            ...h,
            completed_today: nextState,
            streak: nextState ? h.streak + 1 : Math.max(0, h.streak - 1),
          }
        }
        return h
      })
    )
  }

  const handleCreateHabit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!habitName.trim()) return

    const newH: Habit = {
      id: 'h-' + Date.now(),
      name: habitName.trim(),
      icon_emoji: habitEmoji,
      target_days_per_week: 7,
      streak: 1,
      completed_today: true,
    }

    setHabits((prev) => [...prev, newH])
    setIsHabitModalOpen(false)
    setHabitName('')
  }

  const handleDeleteHabit = (id: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== id))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <Target className="w-7 h-7 text-cyan-400" /> Personal Goals & Daily Habits
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Track long-term academic targets and maintain unbreakable daily consistency streaks.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsHabitModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-all"
          >
            <Plus className="w-4 h-4" /> Add Habit
          </button>
          <button
            onClick={() => setIsGoalModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-600/20 transition-all"
          >
            <Plus className="w-4 h-4" /> Add Goal
          </button>
        </div>
      </div>

      {/* Daily Habits Section */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-400" /> Daily Habits & Streaks
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Click to check in for today and keep your streak alive!
            </p>
          </div>
          <span className="text-xs font-mono text-cyan-400">
            {habits.filter((h) => h.completed_today).length}/{habits.length} Done Today
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {habits.map((habit) => (
            <div
              key={habit.id}
              onClick={() => handleToggleHabit(habit.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                habit.completed_today
                  ? 'bg-emerald-500/10 border-emerald-500/40 ring-1 ring-emerald-500/20'
                  : 'bg-slate-950 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl">{habit.icon_emoji}</span>
                <div
                  className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all ${
                    habit.completed_today
                      ? 'bg-emerald-500 border-emerald-500'
                      : 'border-slate-600'
                  }`}
                >
                  {habit.completed_today && <CheckCircle2 className="w-3.5 h-3.5 text-slate-950 stroke-[3]" />}
                </div>
              </div>

              <div>
                <p className={`text-xs font-bold leading-snug ${habit.completed_today ? 'text-white' : 'text-slate-300'}`}>
                  {habit.name}
                </p>
                <div className="flex items-center gap-1.5 text-[11px] text-amber-400 font-mono mt-1 font-semibold">
                  <Flame className="w-3.5 h-3.5 fill-current" />
                  <span>{habit.streak} Days Streak</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Long-Term Goals Section */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Target className="w-4 h-4 text-cyan-400" /> Long-Term Academic & Career Goals
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Major milestones you are actively pursuing.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {goals.filter((g) => g.is_completed).length}/{goals.length} Achieved
          </span>
        </div>

        {goals.length === 0 ? (
          <div className="text-center py-10 text-slate-500 text-xs">
            No long-term goals created yet. Click "+ Add Goal" above to define your ambitions!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {goals.map((goal) => (
              <div
                key={goal.id}
                className={`p-5 rounded-2xl border transition-all space-y-3 ${
                  goal.is_completed
                    ? 'bg-slate-950/40 border-slate-800/60 opacity-70'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded-full border border-cyan-500/20">
                      {goal.category || 'Target'}
                    </span>
                    <h3
                      className={`font-bold text-sm text-white ${
                        goal.is_completed ? 'line-through text-slate-500' : ''
                      }`}
                    >
                      {goal.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleToggleGoal(goal.id, goal.is_completed)}
                      className={`p-1.5 rounded-lg border text-xs font-semibold ${
                        goal.is_completed
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          : 'bg-slate-800 text-slate-400 hover:text-white border-slate-700'
                      }`}
                    >
                      {goal.is_completed ? 'Completed' : 'Mark Achieved'}
                    </button>
                    <button
                      onClick={() => handleDeleteGoal(goal.id)}
                      className="p-1 rounded text-slate-600 hover:text-rose-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {goal.description && (
                  <p className="text-xs text-slate-400 leading-relaxed">{goal.description}</p>
                )}

                {goal.target_date && (
                  <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1.5 pt-1">
                    <Calendar className="w-3 h-3 text-cyan-400" />
                    <span>Target Date: {goal.target_date}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Goal Modal */}
      {isGoalModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#111420] border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Create Long-Term Goal</h3>
              <button onClick={() => setIsGoalModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateGoal} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Goal Title *</label>
                <input
                  type="text"
                  required
                  value={goalTitle}
                  onChange={(e) => setGoalTitle(e.target.value)}
                  placeholder="e.g. Clear State PCS Examination in First Attempt"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description / Strategy</label>
                <textarea
                  rows={2}
                  value={goalDesc}
                  onChange={(e) => setGoalDesc(e.target.value)}
                  placeholder="Daily routine plan, resources, mentorship..."
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                  <input
                    type="text"
                    value={goalCategory}
                    onChange={(e) => setGoalCategory(e.target.value)}
                    placeholder="Academic, Career, Health..."
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Target Date</label>
                  <input
                    type="date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsGoalModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!goalTitle.trim()}
                  className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs"
                >
                  Save Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Habit Modal */}
      {isHabitModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#111420] border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Create Daily Habit</h3>
              <button onClick={() => setIsHabitModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateHabit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Habit Name *</label>
                <input
                  type="text"
                  required
                  value={habitName}
                  onChange={(e) => setHabitName(e.target.value)}
                  placeholder="e.g. Read 10 Pages of History"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Icon Emoji</label>
                <input
                  type="text"
                  value={habitEmoji}
                  onChange={(e) => setHabitEmoji(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsHabitModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!habitName.trim()}
                  className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs"
                >
                  Create Habit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
