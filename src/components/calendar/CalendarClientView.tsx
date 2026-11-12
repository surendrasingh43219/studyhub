'use client'

import { useState } from 'react'
import {
  Calendar as CalendarIcon,
  Plus,
  ChevronLeft,
  ChevronRight,
  Clock,
  Tag,
  Trash2,
  X,
  Layers,
  GraduationCap,
  CheckCircle2,
  Bell,
} from 'lucide-react'

export interface CalendarEvent {
  id: string
  title: string
  description?: string
  event_type: 'exam' | 'assignment' | 'study_session' | 'deadline' | 'personal' | 'revision'
  start_time: string
  end_time?: string
  color?: string
}

interface CalendarClientViewProps {
  initialEvents: CalendarEvent[]
}

const EVENT_TYPE_COLORS: Record<string, { label: string; badge: string; dot: string }> = {
  exam: { label: 'Examination', badge: 'bg-rose-500/10 text-rose-400 border-rose-500/30', dot: 'bg-rose-500' },
  assignment: { label: 'Assignment', badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30', dot: 'bg-amber-500' },
  study_session: { label: 'Study Block', badge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30', dot: 'bg-cyan-500' },
  deadline: { label: 'Project Deadline', badge: 'bg-purple-500/10 text-purple-400 border-purple-500/30', dot: 'bg-purple-500' },
  personal: { label: 'Personal', badge: 'bg-slate-800 text-slate-300 border-slate-700', dot: 'bg-slate-400' },
  revision: { label: 'Revision', badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30', dot: 'bg-emerald-500' },
}

export function CalendarClientView({ initialEvents }: CalendarClientViewProps) {
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month')
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Form State
  const [title, setTitle] = useState('')
  const [eventType, setEventType] = useState<CalendarEvent['event_type']>('study_session')
  const [eventDate, setEventDate] = useState(new Date().toISOString().split('T')[0])
  const [eventTime, setEventTime] = useState('10:00')
  const [description, setDescription] = useState('')
  const [saving, setSaving] = useState(false)

  // Calendar calculations
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const firstDayOfMonth = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    setSaving(true)

    const startDateTime = `${eventDate}T${eventTime}:00`

    const newEvent: CalendarEvent = {
      id: 'cal-' + Date.now(),
      title: title.trim(),
      description: description.trim(),
      event_type: eventType,
      start_time: startDateTime,
      color: 'cyan',
    }

    setEvents((prev) => [newEvent, ...prev])
    setIsModalOpen(false)
    setTitle('')
    setDescription('')
    setSaving(false)
  }

  const handleDeleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((ev) => ev.id !== id))
  }

  // Days array for month grid
  const days = []
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null)
  }
  for (let d = 1; d <= daysInMonth; d++) {
    days.push(d)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <CalendarIcon className="w-7 h-7 text-cyan-400" /> Academic Calendar
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Schedule examinations, assignment deadlines, revision reminders, and focus blocks.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs font-semibold">
            {(['month', 'week', 'day'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1.5 rounded-lg capitalize transition-all ${
                  viewMode === mode ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-400 hover:text-white'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-600/20 transition-all"
          >
            <Plus className="w-4 h-4" /> Add Event
          </button>
        </div>
      </div>

      {/* Month Navigator */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
        <h2 className="text-lg font-bold text-white">{monthName}</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevMonth}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
          >
            Today
          </button>
          <button
            onClick={handleNextMonth}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Calendar Grid View */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-xl space-y-2">
        {/* Day of Week Headers */}
        <div className="grid grid-cols-7 text-center pb-2 text-xs font-bold text-slate-400 border-b border-slate-800">
          <span>Sun</span>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 pt-2">
          {days.map((day, idx) => {
            if (day === null) {
              return <div key={'empty-' + idx} className="min-h-[80px] sm:min-h-[100px] p-2 bg-slate-950/20 rounded-2xl opacity-30" />
            }

            const dayString = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
            const dayEvents = events.filter((ev) => ev.start_time && ev.start_time.startsWith(dayString))
            const isToday =
              new Date().toISOString().split('T')[0] === dayString

            return (
              <div
                key={day}
                className={`min-h-[80px] sm:min-h-[100px] p-2 rounded-2xl border transition-all flex flex-col justify-between ${
                  isToday
                    ? 'bg-cyan-500/10 border-cyan-500/50 ring-1 ring-cyan-500/30'
                    : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-bold font-mono ${
                      isToday ? 'text-cyan-400' : 'text-slate-400'
                    }`}
                  >
                    {day}
                  </span>
                  {dayEvents.length > 0 && (
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  )}
                </div>

                <div className="space-y-1 mt-1 overflow-y-auto max-h-16">
                  {dayEvents.slice(0, 2).map((ev) => {
                    const meta = EVENT_TYPE_COLORS[ev.event_type] || EVENT_TYPE_COLORS.personal
                    return (
                      <div
                        key={ev.id}
                        className={`text-[9px] px-1.5 py-0.5 rounded truncate font-medium ${meta.badge}`}
                        title={ev.title}
                      >
                        {ev.title}
                      </div>
                    )
                  })}
                  {dayEvents.length > 2 && (
                    <span className="text-[9px] text-slate-500 block">
                      +{dayEvents.length - 2} more
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Upcoming Events List */}
      <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Bell className="w-4 h-4 text-cyan-400" /> Scheduled Events & Reminders
        </h3>

        {events.length === 0 ? (
          <p className="text-xs text-slate-500 py-4 text-center">No upcoming events scheduled yet.</p>
        ) : (
          <div className="space-y-2">
            {events.slice(0, 8).map((ev) => {
              const meta = EVENT_TYPE_COLORS[ev.event_type] || EVENT_TYPE_COLORS.personal
              return (
                <div
                  key={ev.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs"
                >
                  <div className="flex items-center gap-3 min-w-0 pr-3">
                    <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${meta.dot}`} />
                    <div className="min-w-0">
                      <p className="font-semibold text-white truncate">{ev.title}</p>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {ev.start_time.replace('T', ' ')}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${meta.badge}`}>
                      {meta.label}
                    </span>
                    <button
                      onClick={() => handleDeleteEvent(ev.id)}
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

      {/* Add Event Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#111420] border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Add Calendar Event</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Mathematics Mid-Term Exam"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Event Type</label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="study_session">Study Block</option>
                    <option value="exam">Examination</option>
                    <option value="assignment">Assignment</option>
                    <option value="deadline">Project Deadline</option>
                    <option value="revision">Revision</option>
                    <option value="personal">Personal Event</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Time</label>
                  <input
                    type="time"
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Date</label>
                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
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
                  Save Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
