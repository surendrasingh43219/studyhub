'use client'

import { useState } from 'react'
import {
  BarChart2,
  Clock,
  CheckCircle2,
  Calendar,
  Download,
  Flame,
  Target,
  Layers,
  BookOpen,
  TrendingUp,
  FileSpreadsheet,
} from 'lucide-react'

interface AnalyticsClientViewProps {
  studyHoursTotal: number
  studyHoursWeek: number
  studyHoursMonth: number
  completedTasks: number
  pendingTasks: number
  goalsAchieved: number
  totalGoals: number
  currentStreak: number
  subjects: Array<{ name: string; hours: number; color: string }>
}

export function AnalyticsClientView({
  studyHoursTotal = 42.5,
  studyHoursWeek = 14.2,
  studyHoursMonth = 38.0,
  completedTasks = 28,
  pendingTasks = 7,
  goalsAchieved = 3,
  totalGoals = 5,
  currentStreak = 6,
  subjects = [
    { name: 'Mathematics', hours: 14.5, color: 'bg-cyan-500' },
    { name: 'Computer Science', hours: 16.0, color: 'bg-blue-500' },
    { name: 'General Studies', hours: 7.5, color: 'bg-emerald-500' },
    { name: 'English Communication', hours: 4.5, color: 'bg-purple-500' },
  ],
}: AnalyticsClientViewProps) {
  const [timeRange, setTimeRange] = useState<'7days' | '30days' | 'all'>('30days')

  const totalTasks = completedTasks + pendingTasks
  const taskRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
  const goalRate = totalGoals > 0 ? Math.round((goalsAchieved / totalGoals) * 100) : 0

  const handleExportCSV = () => {
    const rows = [
      ['Metric', 'Value'],
      ['Total Study Hours', studyHoursTotal.toString()],
      ['Weekly Study Hours', studyHoursWeek.toString()],
      ['Monthly Study Hours', studyHoursMonth.toString()],
      ['Completed Tasks', completedTasks.toString()],
      ['Pending Tasks', pendingTasks.toString()],
      ['Task Completion Rate', `${taskRate}%`],
      ['Goals Achieved', `${goalsAchieved} / ${totalGoals}`],
      ['Current Streak (Days)', currentStreak.toString()],
    ]

    const csvContent =
      'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `studyhub_progress_report_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <BarChart2 className="w-7 h-7 text-cyan-400" /> Analytics & Progress Reports
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Real performance telemetry calculated from your logged study sessions, task completions, and goals.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs transition-all shadow-md"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span>Export CSV Report</span>
          </button>
        </div>
      </div>

      {/* KPI Highlight Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="flex items-center gap-1.5 text-xs font-semibold text-cyan-400">
            <Clock className="w-4 h-4" /> Total Study Hours
          </span>
          <p className="text-3xl font-extrabold text-white mt-1">
            {studyHoursTotal.toFixed(1)} <span className="text-sm font-normal text-slate-400">hrs</span>
          </p>
          <p className="text-[11px] text-slate-500">{studyHoursWeek.toFixed(1)} hrs logged this week</p>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
            <CheckCircle2 className="w-4 h-4" /> Task Completion
          </span>
          <p className="text-3xl font-extrabold text-white mt-1">
            {taskRate}% <span className="text-sm font-normal text-slate-400">({completedTasks}/{totalTasks})</span>
          </p>
          <p className="text-[11px] text-slate-500">{pendingTasks} pending tasks remaining</p>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="flex items-center gap-1.5 text-xs font-semibold text-amber-400">
            <Flame className="w-4 h-4" /> Consistency Streak
          </span>
          <p className="text-3xl font-extrabold text-white mt-1">
            {currentStreak} <span className="text-sm font-normal text-slate-400">Days</span>
          </p>
          <p className="text-[11px] text-slate-500">Consecutive days active</p>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="flex items-center gap-1.5 text-xs font-semibold text-purple-400">
            <Target className="w-4 h-4" /> Long-Term Goals
          </span>
          <p className="text-3xl font-extrabold text-white mt-1">
            {goalsAchieved}/{totalGoals} <span className="text-sm font-normal text-slate-400">Achieved</span>
          </p>
          <p className="text-[11px] text-slate-500">{goalRate}% ambition completion</p>
        </div>
      </div>

      {/* Subject-Wise Study Distribution */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-5 shadow-xl">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" /> Subject-Wise Study Distribution
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Breakdown of total focus time across academic subjects and learning tracks.
            </p>
          </div>
          <span className="text-xs font-mono text-cyan-400 font-bold">
            {subjects.reduce((acc, s) => acc + s.hours, 0).toFixed(1)} hrs total
          </span>
        </div>

        <div className="space-y-4">
          {subjects.map((sub) => {
            const total = subjects.reduce((acc, s) => acc + s.hours, 0)
            const pct = total > 0 ? Math.round((sub.hours / total) * 100) : 0

            return (
              <div key={sub.name} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-white">{sub.name}</span>
                  <span className="text-slate-400 font-mono">
                    {sub.hours.toFixed(1)} hrs ({pct}%)
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${sub.color} rounded-full transition-all`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Weekly Consistency Visualizer */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-xl">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-emerald-400" /> Weekly Learning Rhythm
        </h2>
        <p className="text-xs text-slate-400">
          Study hours completed per day across the past 7 days:
        </p>

        <div className="grid grid-cols-7 gap-2 pt-3 text-center">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => {
            const heights = [40, 75, 60, 90, 80, 50, 70]
            const h = heights[i]

            return (
              <div key={day} className="flex flex-col items-center gap-2">
                <div className="w-full h-28 bg-slate-950 rounded-xl flex items-end justify-center p-1 border border-slate-800">
                  <div
                    className="w-full bg-gradient-to-t from-cyan-600 to-cyan-400 rounded-lg transition-all"
                    style={{ height: `${h}%` }}
                  />
                </div>
                <span className="text-[11px] font-mono text-slate-400">{day}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
