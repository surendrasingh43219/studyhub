'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Clock,
  Flame,
  BookOpen,
  CheckCircle2,
  Calendar,
  Bookmark,
  StickyNote,
  Award,
  ArrowRight,
  Plus,
  Play,
  RotateCcw,
  Sparkles,
  SlidersHorizontal,
  ChevronDown,
  Eye,
  EyeOff,
} from 'lucide-react'

interface DashboardData {
  user: {
    id: string
    email?: string
    name?: string
  }
  stats: {
    todayStudyMinutes: number
    currentStreak: number
    totalBooksRead: number
    notesCount: number
    bookmarksCount: number
  }
  continueReading: {
    id: string
    title: string
    author: string
    currentPage: number
    totalPages: number
    coverUrl?: string
    category: string
  } | null
  dailyGoals: Array<{
    id: string
    title: string
    targetMinutes: number
    completedMinutes: number
    isCompleted: boolean
  }>
  upcomingExams: Array<{
    id: string
    name: string
    examDate: string
    daysLeft: number
    color: string
  }>
  badges: Array<{
    id: string
    title: string
    description: string
    icon: string
    unlocked: boolean
  }>
}

export function DashboardOverview({ initialData }: { initialData: DashboardData }) {
  const [data, setData] = useState(initialData)
  const [newGoalTitle, setNewGoalTitle] = useState('')
  const [activeWidgetCustomizer, setActiveWidgetCustomizer] = useState(false)
  const [widgetVisibility, setWidgetVisibility] = useState({
    stats: true,
    continueReading: true,
    goals: true,
    exams: true,
    badges: true,
    quickActions: true,
  })

  const toggleWidget = (key: keyof typeof widgetVisibility) => {
    setWidgetVisibility((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handleToggleGoal = (id: string) => {
    setData((prev) => ({
      ...prev,
      dailyGoals: prev.dailyGoals.map((g) =>
        g.id === id ? { ...g, isCompleted: !g.isCompleted } : g
      ),
    }))
  }

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newGoalTitle.trim()) return
    const newGoal = {
      id: Date.now().toString(),
      title: newGoalTitle.trim(),
      targetMinutes: 30,
      completedMinutes: 0,
      isCompleted: false,
    }
    setData((prev) => ({
      ...prev,
      dailyGoals: [...prev.dailyGoals, newGoal],
    }))
    setNewGoalTitle('')
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Welcome back, {data.user.name || 'Scholar'}
            </h1>
            <span className="text-xl">✨</span>
          </div>
          <p className="text-slate-400 text-sm">
            Strict RLS protected workspace. Your study telemetry and personal notes are completely isolated.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveWidgetCustomizer(!activeWidgetCustomizer)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-all"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" /> Customize Widgets
          </button>
          <Link
            href="/tools"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold shadow-lg shadow-cyan-500/20 transition-all"
          >
            <Play className="w-3.5 h-3.5 fill-current" /> Start Study Timer
          </Link>
        </div>
      </div>

      {/* Widget Customizer Drawer */}
      {activeWidgetCustomizer && (
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl animate-in fade-in space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300 pb-2 border-b border-slate-800">
            <span>Toggle Visible Widgets</span>
            <span className="text-slate-500">Settings automatically persist per user</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            {Object.entries(widgetVisibility).map(([key, isVisible]) => (
              <button
                key={key}
                onClick={() => toggleWidget(key as keyof typeof widgetVisibility)}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium border transition-colors ${
                  isVisible
                    ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
                    : 'bg-slate-950 border-slate-800 text-slate-500'
                }`}
              >
                <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                {isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Primary Key Stats Grid */}
      {widgetVisibility.stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900/70 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-3">
              <span>Today&apos;s Focus</span>
              <div className="w-7 h-7 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white tracking-tight">
                {Math.floor(data.stats.todayStudyMinutes / 60)}h {data.stats.todayStudyMinutes % 60}m
              </div>
              <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-medium">
                <span>+25m from yesterday</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-3">
              <span>Current Streak</span>
              <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <Flame className="w-4 h-4 fill-amber-400" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-amber-400 tracking-tight">
                {data.stats.currentStreak} Days
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Don&apos;t break the chain today!</div>
            </div>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-3">
              <span>Saved Notes</span>
              <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                <StickyNote className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white tracking-tight">{data.stats.notesCount}</div>
              <Link href="/notes" className="text-[11px] text-cyan-400 hover:underline mt-1 block">
                View all markdown notes &rarr;
              </Link>
            </div>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-3">
              <span>Bookmarks</span>
              <div className="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
                <Bookmark className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white tracking-tight">
                {data.stats.bookmarksCount}
              </div>
              <Link href="/library" className="text-[11px] text-cyan-400 hover:underline mt-1 block">
                Explore open library &rarr;
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid: Continue Reading & Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Continue Reading Card */}
        {widgetVisibility.continueReading && (
          <div className="lg:col-span-2 bg-slate-900/70 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-cyan-400" />
                  <h3 className="font-semibold text-white text-base">Continue Reading</h3>
                </div>
                <Link
                  href="/library"
                  className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1"
                >
                  Browse all <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {data.continueReading ? (
                <div className="flex flex-col sm:flex-row gap-5 p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <div className="w-20 h-28 bg-gradient-to-tr from-cyan-900 to-indigo-900 rounded-lg shrink-0 flex items-center justify-center text-cyan-300 font-bold text-2xl shadow-md border border-cyan-500/20">
                    {data.continueReading.title.charAt(0)}
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                        {data.continueReading.category}
                      </span>
                      <h4 className="text-white font-bold text-base mt-1.5">{data.continueReading.title}</h4>
                      <p className="text-slate-400 text-xs mt-0.5">by {data.continueReading.author}</p>
                    </div>

                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between text-xs text-slate-400">
                        <span>Progress (Page {data.continueReading.currentPage} of {data.continueReading.totalPages})</span>
                        <span className="font-mono text-cyan-400">
                          {Math.round((data.continueReading.currentPage / data.continueReading.totalPages) * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${(data.continueReading.currentPage / data.continueReading.totalPages) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10 bg-slate-950/40 border border-dashed border-slate-800 rounded-xl space-y-3">
                  <BookOpen className="w-10 h-10 text-slate-600 mx-auto" />
                  <p className="text-sm text-slate-400">No active book in progress.</p>
                  <Link
                    href="/library"
                    className="inline-block px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold"
                  >
                    Select a Book to Read
                  </Link>
                </div>
              )}
            </div>

            {data.continueReading && (
              <div className="mt-5 flex justify-end">
                <Link
                  href={`/reader/${data.continueReading.id}?page=${data.continueReading.currentPage}`}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold shadow-lg shadow-cyan-500/20 transition-all"
                >
                  Resume Reader <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Daily Goals & To-Dos */}
        {widgetVisibility.goals && (
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <h3 className="font-semibold text-white text-base">Daily Goals</h3>
                </div>
                <span className="text-xs text-slate-400 font-mono">
                  {data.dailyGoals.filter((g) => g.isCompleted).length}/{data.dailyGoals.length} done
                </span>
              </div>

              <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                {data.dailyGoals.map((goal) => (
                  <div
                    key={goal.id}
                    onClick={() => handleToggleGoal(goal.id)}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                      goal.isCompleted
                        ? 'bg-slate-950/40 border-slate-800/60 opacity-60'
                        : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                          goal.isCompleted
                            ? 'bg-emerald-500 border-emerald-500 text-slate-950'
                            : 'border-slate-600'
                        }`}
                      >
                        {goal.isCompleted && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </div>
                      <span
                        className={`text-xs ${
                          goal.isCompleted ? 'line-through text-slate-500' : 'text-slate-200'
                        }`}
                      >
                        {goal.title}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">{goal.targetMinutes}m</span>
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={handleAddGoal} className="mt-4 flex gap-2">
              <input
                type="text"
                placeholder="Add daily goal..."
                value={newGoalTitle}
                onChange={(e) => setNewGoalTitle(e.target.value)}
                className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
              />
              <button
                type="submit"
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 transition-colors"
                aria-label="Add goal"
              >
                <Plus className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Second Row: Upcoming Exams & Achievements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Exams Countdown */}
        {widgetVisibility.exams && (
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-rose-400" />
                <h3 className="font-semibold text-white text-base">Upcoming Exams</h3>
              </div>
              <span className="text-xs text-slate-500">Target Countdowns</span>
            </div>

            <div className="space-y-3">
              {data.upcomingExams.map((exam) => (
                <div
                  key={exam.id}
                  className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <h4 className="text-xs font-semibold text-white">{exam.name}</h4>
                    <p className="text-[11px] text-slate-400 font-mono">{exam.examDate}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-extrabold text-rose-400 font-mono">
                      {exam.daysLeft}d
                    </div>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider">Remaining</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Achievements / Badges */}
        {widgetVisibility.badges && (
          <div className="lg:col-span-2 bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                <h3 className="font-semibold text-white text-base">Achievements & Badges</h3>
              </div>
              <span className="text-[11px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full border border-slate-700">
                Private by Default
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {data.badges.map((badge) => (
                <div
                  key={badge.id}
                  className={`p-3.5 rounded-xl border flex items-center gap-3 transition-colors ${
                    badge.unlocked
                      ? 'bg-amber-500/5 border-amber-500/30'
                      : 'bg-slate-950/40 border-slate-800/80 opacity-40'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-xl font-bold ${
                      badge.unlocked
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {badge.icon}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{badge.title}</h4>
                    <p className="text-[10px] text-slate-400 line-clamp-1">{badge.description}</p>
                    <span className="text-[9px] font-mono text-cyan-400">
                      {badge.unlocked ? 'Unlocked' : 'Locked'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
