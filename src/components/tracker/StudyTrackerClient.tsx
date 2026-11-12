'use client'

import { useState, useEffect, useRef } from 'react'
import {
  Timer,
  Play,
  Pause,
  RotateCcw,
  Square,
  CheckCircle2,
  Clock,
  Flame,
  BarChart2,
  BookOpen,
  Calendar,
  Layers,
  Sparkles,
  Award,
  Volume2,
  VolumeX,
} from 'lucide-react'

interface Subject {
  id: string
  name: string
  color: string
}

interface Session {
  id: string
  duration_minutes: number
  notes?: string
  created_at: string
  subject_name?: string
}

interface StudyTrackerClientProps {
  initialSubjects: Subject[]
  initialSessions: Session[]
  dailyGoalHours: number
}

export function StudyTrackerClient({
  initialSubjects,
  initialSessions,
  dailyGoalHours = 4,
}: StudyTrackerClientProps) {
  const [subjects] = useState<Subject[]>(
    initialSubjects.length > 0
      ? initialSubjects
      : [
          { id: '1', name: 'Mathematics', color: 'blue' },
          { id: '2', name: 'Computer Science', color: 'cyan' },
          { id: '3', name: 'General Studies', color: 'emerald' },
        ]
  )

  const [selectedSubject, setSelectedSubject] = useState(subjects[0]?.name || 'General Study')
  const [sessionNotes, setSessionNotes] = useState('')
  const [sessions, setSessions] = useState<Session[]>(initialSessions)

  // Timer states
  const [timerMode, setTimerMode] = useState<'stopwatch' | 'pomodoro'>('stopwatch')
  const [pomodoroTarget, setPomodoroTarget] = useState(25 * 60)
  const [seconds, setSeconds] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const [savingSession, setSavingSession] = useState(false)

  // Sound generator
  const [ambientSound, setAmbientSound] = useState<'none' | 'rain' | 'whitenoise'>('none')
  const audioContextRef = useRef<AudioContext | null>(null)
  const noiseNodeRef = useRef<AudioNode | null>(null)

  // LocalStorage Crash/Refresh Recovery
  const STORAGE_KEY = 'studyhub_active_session'

  useEffect(() => {
    // Restore session on mount
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.isActive && parsed.startTimestamp) {
          const elapsed = Math.floor((Date.now() - parsed.startTimestamp) / 1000)
          setSeconds(elapsed)
          setIsActive(true)
          if (parsed.subject) setSelectedSubject(parsed.subject)
          if (parsed.notes) setSessionNotes(parsed.notes)
          if (parsed.mode) setTimerMode(parsed.mode)
        }
      }
    } catch (e) {
      console.error('Failed to restore session:', e)
    }
  }, [])

  // Timer Tick
  useEffect(() => {
    let interval: any = null
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isActive])

  // Save to localStorage when state changes
  useEffect(() => {
    if (isActive) {
      const startTimestamp = Date.now() - seconds * 1000
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          isActive: true,
          startTimestamp,
          subject: selectedSubject,
          notes: sessionNotes,
          mode: timerMode,
        })
      )
    }
  }, [isActive, seconds, selectedSubject, sessionNotes, timerMode])

  const handleStart = () => {
    setIsActive(true)
  }

  const handlePause = () => {
    setIsActive(false)
    localStorage.removeItem(STORAGE_KEY)
  }

  const handleReset = () => {
    setIsActive(false)
    setSeconds(0)
    localStorage.removeItem(STORAGE_KEY)
  }

  const handleStopAndSave = async () => {
    setIsActive(false)
    localStorage.removeItem(STORAGE_KEY)

    const durationMinutes = Math.max(1, Math.round(seconds / 60))
    setSavingSession(true)

    try {
      // Post study session to server
      const res = await fetch('/api/user/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          duration_minutes: durationMinutes,
          notes: sessionNotes.trim() || `${selectedSubject} study block`,
          subject_name: selectedSubject,
        }),
      })

      const newSession: Session = {
        id: 's-' + Date.now(),
        duration_minutes: durationMinutes,
        notes: sessionNotes.trim() || `${selectedSubject} study block`,
        created_at: new Date().toISOString(),
        subject_name: selectedSubject,
      }

      setSessions((prev) => [newSession, ...prev])
      setSeconds(0)
      setSessionNotes('')
    } catch (err) {
      console.error('Error saving session:', err)
    } finally {
      setSavingSession(false)
    }
  }

  // Ambient sound synthesizer
  const toggleAmbientSound = (sound: 'rain' | 'whitenoise') => {
    if (ambientSound === sound) {
      stopAmbientSound()
      return
    }

    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      }
      const ctx = audioContextRef.current
      if (ctx.state === 'suspended') ctx.resume()

      if (noiseNodeRef.current) noiseNodeRef.current.disconnect()

      const bufferSize = ctx.sampleRate * 2
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
      const output = noiseBuffer.getChannelData(0)
      let lastOut = 0.0

      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1
        output[i] = (lastOut + 0.02 * white) / 1.02
        lastOut = output[i]
        output[i] *= 2.5
      }

      const whiteNoise = ctx.createBufferSource()
      whiteNoise.buffer = noiseBuffer
      whiteNoise.loop = true

      const gain = ctx.createGain()
      gain.gain.value = 0.25

      whiteNoise.connect(gain)
      gain.connect(ctx.destination)
      whiteNoise.start()

      noiseNodeRef.current = whiteNoise
      setAmbientSound(sound)
    } catch (err) {
      console.error('Web Audio error:', err)
    }
  }

  const stopAmbientSound = () => {
    if (noiseNodeRef.current) {
      try {
        noiseNodeRef.current.disconnect()
      } catch {}
      noiseNodeRef.current = null
    }
    setAmbientSound('none')
  }

  // Format Time
  const formatTime = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600)
    const mins = Math.floor((totalSecs % 3600) / 60)
    const secs = totalSecs % 60
    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Metrics
  const todayStr = new Date().toISOString().split('T')[0]
  const todayMinutes = sessions
    .filter((s) => s.created_at && s.created_at.startsWith(todayStr))
    .reduce((acc, s) => acc + (s.duration_minutes || 0), 0)

  const totalMinutes = sessions.reduce((acc, s) => acc + (s.duration_minutes || 0), 0)
  const targetMinutes = dailyGoalHours * 60
  const todayProgressPercent = Math.min(100, Math.round((todayMinutes / targetMinutes) * 100))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <Timer className="w-7 h-7 text-cyan-400" /> Study Tracker
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Focus stopwatch and Pomodoro timer with auto-save, crash recovery, and study distribution metrics.
          </p>
        </div>

        {/* Ambient sound toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleAmbientSound('rain')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              ambientSound === 'rain'
                ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400 shadow-sm'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {ambientSound === 'rain' ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span>Rain Noise</span>
          </button>
        </div>
      </div>

      {/* Main Focus Room Card */}
      <div className="bg-gradient-to-b from-slate-900/90 to-[#101422] border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl text-center space-y-6">
        {/* Subject Selector */}
        <div className="inline-flex items-center gap-2 p-1.5 bg-slate-950 border border-slate-800 rounded-2xl">
          <span className="text-xs text-slate-500 pl-2">Subject:</span>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            disabled={isActive}
            className="bg-transparent text-xs font-bold text-cyan-400 pr-2 py-1 focus:outline-none cursor-pointer"
          >
            {subjects.map((sub) => (
              <option key={sub.id} value={sub.name} className="bg-slate-900 text-white">
                {sub.name}
              </option>
            ))}
          </select>
        </div>

        {/* Giant Timer Display */}
        <div className="py-4">
          <div className="text-6xl sm:text-8xl font-mono font-extrabold text-white tracking-wider drop-shadow-lg">
            {formatTime(seconds)}
          </div>
          <div className="flex items-center justify-center gap-2 text-xs text-slate-400 mt-2 font-mono">
            {isActive ? (
              <span className="inline-flex items-center gap-1.5 text-cyan-400 font-semibold animate-pulse">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                Session Active • Auto-saving locally
              </span>
            ) : (
              <span>Timer paused</span>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {!isActive ? (
            <button
              onClick={handleStart}
              className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-sm shadow-xl shadow-cyan-600/30 transition-all active:scale-95"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{seconds > 0 ? 'Resume Session' : 'Start Focus Session'}</span>
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-xl shadow-amber-500/20 transition-all active:scale-95"
            >
              <Pause className="w-4 h-4 fill-current" />
              <span>Pause</span>
            </button>
          )}

          {seconds > 0 && (
            <button
              onClick={handleStopAndSave}
              disabled={savingSession}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-xl shadow-emerald-600/20 transition-all active:scale-95 disabled:opacity-50"
            >
              <Square className="w-4 h-4 fill-current" />
              <span>{savingSession ? 'Saving...' : 'Save & Log Session'}</span>
            </button>
          )}

          {seconds > 0 && !isActive && (
            <button
              onClick={handleReset}
              className="p-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
              title="Reset Timer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Notes Input during session */}
        <div className="max-w-md mx-auto pt-2">
          <input
            type="text"
            value={sessionNotes}
            onChange={(e) => setSessionNotes(e.target.value)}
            placeholder="Add notes for this session (e.g. Completed Chapter 3 theorems)..."
            className="w-full px-4 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-center"
          />
        </div>
      </div>

      {/* Target & Statistics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Today's Target */}
        <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
            <span className="flex items-center gap-1.5 text-cyan-400">
              <Clock className="w-4 h-4" /> Daily Target
            </span>
            <span>
              {Math.floor(todayMinutes / 60)}h {todayMinutes % 60}m / {dailyGoalHours}h
            </span>
          </div>

          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all"
              style={{ width: `${todayProgressPercent}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400">
            {todayProgressPercent}% of today's study target completed.
          </p>
        </div>

        {/* Total Lifetime Learning */}
        <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="flex items-center gap-1.5 text-xs font-semibold text-amber-400">
            <Flame className="w-4 h-4" /> Lifetime Study Hours
          </span>
          <p className="text-2xl font-bold text-white mt-1">
            {(totalMinutes / 60).toFixed(1)} <span className="text-sm font-normal text-slate-400">Hours</span>
          </p>
          <p className="text-[11px] text-slate-400">Recorded across {sessions.length} study sessions</p>
        </div>

        {/* Resilience Info */}
        <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
            <CheckCircle2 className="w-4 h-4" /> Crash Resilient
          </span>
          <p className="text-xs text-slate-300 leading-relaxed mt-1">
            Active timers safely resume if you accidentally refresh the page or lose connection.
          </p>
        </div>
      </div>

      {/* Recent Study Sessions Table */}
      <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400" /> Recent Study History
        </h3>

        {sessions.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-xs">
            No study sessions recorded yet. Start your first focus block above!
          </div>
        ) : (
          <div className="space-y-2">
            {sessions.slice(0, 10).map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold font-mono">
                    {s.duration_minutes}m
                  </div>
                  <div>
                    <p className="font-semibold text-white">{s.notes || 'Study session'}</p>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {s.created_at ? s.created_at.split('T')[0] : 'Today'}
                    </span>
                  </div>
                </div>

                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-cyan-300 font-medium">
                  {s.subject_name || 'General'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
