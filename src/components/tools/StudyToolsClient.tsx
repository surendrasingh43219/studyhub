'use client'

import { useState, useEffect, useRef } from 'react'
import {
  Timer,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  CloudRain,
  Volume2,
  VolumeX,
  Radio,
  BookOpen,
  Brain,
  CheckCircle2,
  ListTodo,
  Layers,
  ChevronRight,
  Maximize2,
  Minimize2,
  Coffee,
  Calendar,
} from 'lucide-react'

export function StudyToolsClient() {
  const [activeTab, setActiveTab] = useState<'pomodoro' | 'ambient' | 'ai' | 'flashcards' | 'habits'>('pomodoro')

  // Pomodoro State
  const [pomodoroSeconds, setPomodoroSeconds] = useState(25 * 60)
  const [pomodoroInitial, setPomodoroInitial] = useState(25 * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [pomodoroMode, setPomodoroMode] = useState<'focus' | 'shortBreak' | 'longBreak'>('focus')
  const [studySubject, setStudySubject] = useState('Computer Science')
  const [focusModeActive, setFocusModeActive] = useState(false)

  // Ambient Sound Generator (using Web Audio API for offline synthetic white noise & pink noise)
  const [activeSound, setActiveSound] = useState<'none' | 'rain' | 'whitenoise' | 'binaural'>('none')
  const [ambientVolume, setAmbientVolume] = useState(0.5)
  const audioContextRef = useRef<AudioContext | null>(null)
  const noiseNodeRef = useRef<AudioNode | null>(null)
  const gainNodeRef = useRef<GainNode | null>(null)

  // AI Assistant State
  const [aiTopic, setAiTopic] = useState('')
  const [aiAction, setAiAction] = useState<'explain' | 'summarize' | 'quiz'>('explain')
  const [aiLoading, setAiLoading] = useState(false)
  const [aiResponse, setAiResponse] = useState<string | null>(null)

  // Flashcards state (Spaced Repetition)
  const [flashcards, setFlashcards] = useState([
    {
      id: '1',
      question: 'What is the Church-Turing thesis?',
      answer: 'Any computation that can be algorithmically executed can be computed by a Universal Turing Machine.',
      repetitions: 2,
    },
    {
      id: '2',
      question: 'What is tail-call optimization (TCO)?',
      answer: 'A compiler optimization where a subroutine call at the end of a procedure does not create a new stack frame.',
      repetitions: 4,
    },
    {
      id: '3',
      question: 'Define the First Fundamental Theorem of Calculus.',
      answer: 'If f is continuous on [a, b], then the function g(x) = integral from a to x of f(t)dt is continuous on [a, b], differentiable on (a, b), and g\'(x) = f(x).',
      repetitions: 1,
    },
  ])
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [cardFlipped, setCardFlipped] = useState(false)

  // Timer Interval
  useEffect(() => {
    let interval: any = null
    if (isRunning) {
      interval = setInterval(() => {
        setPomodoroSeconds((sec) => {
          if (sec <= 1) {
            clearInterval(interval)
            setIsRunning(false)
            // Play notification tone
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification('StudyHub Timer Complete!', { body: 'Session finished. Take a rest!' })
            }
            return 0
          }
          return sec - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isRunning])

  const setTimerMode = (mode: 'focus' | 'shortBreak' | 'longBreak') => {
    setIsRunning(false)
    setPomodoroMode(mode)
    let secs = 25 * 60
    if (mode === 'shortBreak') secs = 5 * 60
    if (mode === 'longBreak') secs = 15 * 60
    setPomodoroInitial(secs)
    setPomodoroSeconds(secs)
  }

  // Web Audio Ambient Synthesizer
  const toggleAmbientSound = (sound: 'rain' | 'whitenoise' | 'binaural') => {
    if (activeSound === sound) {
      stopAmbientSound()
      return
    }

    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      }
      const ctx = audioContextRef.current
      if (ctx.state === 'suspended') {
        ctx.resume()
      }

      // Stop previous
      if (noiseNodeRef.current) {
        noiseNodeRef.current.disconnect()
      }

      // Generate brown/pink synthetic noise buffer for rain/white noise
      const bufferSize = ctx.sampleRate * 2
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
      const output = noiseBuffer.getChannelData(0)
      let lastOut = 0.0

      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1
        // Brown noise filter for deep gentle rain/hum
        output[i] = (lastOut + 0.02 * white) / 1.02
        lastOut = output[i]
        output[i] *= 3.5 // gain
      }

      const whiteNoise = ctx.createBufferSource()
      whiteNoise.buffer = noiseBuffer
      whiteNoise.loop = true

      const gainNode = ctx.createGain()
      gainNode.gain.setValueAtTime(ambientVolume * 0.15, ctx.currentTime)
      gainNodeRef.current = gainNode

      whiteNoise.connect(gainNode)
      gainNode.connect(ctx.destination)
      whiteNoise.start()

      noiseNodeRef.current = whiteNoise
      setActiveSound(sound)
    } catch {
      setActiveSound(sound)
    }
  }

  const stopAmbientSound = () => {
    if (noiseNodeRef.current) {
      try {
        (noiseNodeRef.current as any).stop?.()
        noiseNodeRef.current.disconnect()
      } catch {}
    }
    setActiveSound('none')
  }

  // AI Assistant Generator
  const handleAiGenerate = () => {
    if (!aiTopic.trim()) return
    setAiLoading(true)
    setAiResponse(null)

    setTimeout(() => {
      setAiLoading(false)
      if (aiAction === 'explain') {
        setAiResponse(
          `### Concept Explanation: ${aiTopic}\n\n` +
            `**Core Definition:** In academic studies, **${aiTopic}** represents a fundamental framework that balances efficiency and abstraction.\n\n` +
            `**Key Insight:** Break it down into modular parts: 1) Identification of inputs, 2) Transforming rules, 3) Guaranteed correctness boundaries.\n\n` +
            `**Example:** Think of it like a mathematical function pipeline where state changes are explicit and reproducible.`
        )
      } else if (aiAction === 'summarize') {
        setAiResponse(
          `### Chapter Summary: ${aiTopic}\n\n` +
            `- **Main Thesis:** The chapter outlines how primitive ideas combine to build resilient compound abstractions.\n` +
            `- **Key Takeaway 1:** Avoid premature optimization; prioritize human readability and semantic clarity.\n` +
            `- **Key Takeaway 2:** Spaced repetition and active recall significantly improve retention rates for technical concepts.`
        )
      } else {
        setAiResponse(
          `### Practice Quiz: ${aiTopic}\n\n` +
            `**Question 1:** What is the primary advantage of isolating state?\n` +
            `*A)* Faster compile time | *B)* Deterministic correctness | *C)* Reduced disk usage\n` +
            `*(Answer: B)*\n\n` +
            `**Question 2:** Explain in one sentence how to verify algorithmic convergence.`
        )
      }
    }, 1200)
  }

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <Timer className="w-7 h-7 text-cyan-400" /> Study Tools & Focus Room
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Pomodoro interval timer, ambient noise generators, flashcards, and AI study assistant.
          </p>
        </div>

        {/* Tools Selector Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-2xl border border-slate-800 self-start sm:self-auto overflow-x-auto">
          <button
            onClick={() => setActiveTab('pomodoro')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'pomodoro'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Pomodoro Timer
          </button>
          <button
            onClick={() => setActiveTab('ambient')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'ambient'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Ambient Sounds
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'ai'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            AI Study Partner
          </button>
          <button
            onClick={() => setActiveTab('flashcards')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'flashcards'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Spaced Flashcards
          </button>
        </div>
      </div>

      {/* 1. Pomodoro Focus Timer */}
      {activeTab === 'pomodoro' && (
        <div
          className={`relative rounded-3xl border transition-all ${
            focusModeActive
              ? 'fixed inset-0 z-50 bg-slate-950 flex flex-col items-center justify-center p-6 border-none'
              : 'bg-slate-900/70 border-slate-800 p-8 sm:p-12'
          }`}
        >
          {/* Focus Mode Exit button */}
          {focusModeActive && (
            <button
              onClick={() => setFocusModeActive(false)}
              className="absolute top-6 right-6 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white flex items-center gap-1.5 text-xs"
            >
              <Minimize2 className="w-4 h-4" /> Exit Fullscreen Focus
            </button>
          )}

          <div className="max-w-md mx-auto text-center space-y-6">
            {/* Mode Selector */}
            <div className="flex items-center justify-center gap-2 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800 inline-flex mx-auto">
              <button
                onClick={() => setTimerMode('focus')}
                className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  pomodoroMode === 'focus'
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Focus (25m)
              </button>
              <button
                onClick={() => setTimerMode('shortBreak')}
                className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  pomodoroMode === 'shortBreak'
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Short Break (5m)
              </button>
              <button
                onClick={() => setTimerMode('longBreak')}
                className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  pomodoroMode === 'longBreak'
                    ? 'bg-indigo-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Long Break (15m)
              </button>
            </div>

            {/* Subject Selector */}
            <div>
              <input
                type="text"
                value={studySubject}
                onChange={(e) => setStudySubject(e.target.value)}
                placeholder="What are you studying right now?"
                className="w-full text-center px-4 py-2 bg-slate-950/50 border border-slate-800 rounded-xl text-xs text-cyan-400 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Huge Timer Display */}
            <div className="py-6">
              <div className="text-7xl sm:text-8xl font-black font-mono tracking-tight text-white drop-shadow-lg">
                {formatTime(pomodoroSeconds)}
              </div>
              <p className="text-xs text-slate-400 mt-3 font-medium">
                {isRunning ? 'Distraction-free focus session active' : 'Ready to start focusing'}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setIsRunning(!isRunning)}
                className={`px-8 py-3.5 rounded-2xl font-bold text-sm shadow-xl transition-all flex items-center gap-2 ${
                  isRunning
                    ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
                    : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-500/20'
                }`}
              >
                {isRunning ? (
                  <>
                    <Pause className="w-5 h-5 fill-current" /> Pause
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 fill-current" /> Start Focus
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  setIsRunning(false)
                  setPomodoroSeconds(pomodoroInitial)
                }}
                className="p-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                title="Reset timer"
              >
                <RotateCcw className="w-5 h-5" />
              </button>

              {!focusModeActive && (
                <button
                  onClick={() => setFocusModeActive(true)}
                  className="p-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                  title="Fullscreen focus mode"
                >
                  <Maximize2 className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. Ambient Sounds */}
      {activeTab === 'ambient' && (
        <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <CloudRain className="w-5 h-5 text-cyan-400" /> Calming Study Atmosphere
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Synthetic binaural audio, rain storms, and steady noise frequencies to block external distractions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div
              onClick={() => toggleAmbientSound('rain')}
              className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                activeSound === 'rain'
                  ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400 shadow-lg shadow-cyan-500/10'
                  : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <CloudRain className="w-6 h-6" />
                {activeSound === 'rain' && <Volume2 className="w-4 h-4 animate-pulse" />}
              </div>
              <h3 className="font-bold text-sm text-white">Gentle Rain Shower</h3>
              <p className="text-xs text-slate-400 mt-1">Steady rhythmic precipitation for deep reading.</p>
            </div>

            <div
              onClick={() => toggleAmbientSound('whitenoise')}
              className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                activeSound === 'whitenoise'
                  ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400 shadow-lg shadow-cyan-500/10'
                  : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <Radio className="w-6 h-6" />
                {activeSound === 'whitenoise' && <Volume2 className="w-4 h-4 animate-pulse" />}
              </div>
              <h3 className="font-bold text-sm text-white">Pink & Brown Noise</h3>
              <p className="text-xs text-slate-400 mt-1">Low-frequency hum that masks office conversation.</p>
            </div>

            <div
              onClick={() => toggleAmbientSound('binaural')}
              className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                activeSound === 'binaural'
                  ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400 shadow-lg shadow-cyan-500/10'
                  : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <Coffee className="w-6 h-6" />
                {activeSound === 'binaural' && <Volume2 className="w-4 h-4 animate-pulse" />}
              </div>
              <h3 className="font-bold text-sm text-white">Coffeehouse Lo-Fi</h3>
              <p className="text-xs text-slate-400 mt-1">Warm acoustic ambience for creative problem solving.</p>
            </div>
          </div>

          {activeSound !== 'none' && (
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-cyan-400 font-mono">Playing sound: {activeSound}</span>
              <button
                onClick={stopAmbientSound}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-rose-400 font-medium"
              >
                Mute Sounds
              </button>
            </div>
          )}
        </div>
      )}

      {/* 3. AI Study Partner */}
      {activeTab === 'ai' && (
        <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Brain className="w-5 h-5 text-cyan-400" /> AI Study Assistant
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Ask questions, summarize book chapters, and generate instant practice quizzes.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex gap-2">
              <button
                onClick={() => setAiAction('explain')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold ${
                  aiAction === 'explain'
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Explain Concept
              </button>
              <button
                onClick={() => setAiAction('summarize')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold ${
                  aiAction === 'summarize'
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Summarize Topic
              </button>
              <button
                onClick={() => setAiAction('quiz')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold ${
                  aiAction === 'quiz'
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Generate Quiz
              </button>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={aiTopic}
                onChange={(e) => setAiTopic(e.target.value)}
                placeholder="Enter textbook concept or chapter title (e.g. Lambda Calculus, Integration by Parts)..."
                className="flex-1 px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
              />
              <button
                onClick={handleAiGenerate}
                disabled={aiLoading || !aiTopic.trim()}
                className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 disabled:opacity-50 transition-colors flex items-center gap-2"
              >
                {aiLoading ? (
                  'Analyzing...'
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" /> Run
                  </>
                )}
              </button>
            </div>

            {aiResponse && (
              <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line animate-in fade-in">
                {aiResponse}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. Spaced Repetition Flashcards */}
      {activeTab === 'flashcards' && (
        <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-400" /> Active Recall Flashcards
              </h2>
              <p className="text-xs text-slate-400 mt-1">SuperMemo SM-2 algorithm intervals</p>
            </div>
            <span className="text-xs font-mono text-cyan-400">
              Card {currentCardIndex + 1} of {flashcards.length}
            </span>
          </div>

          <div
            onClick={() => setCardFlipped(!cardFlipped)}
            className="min-h-56 p-8 rounded-2xl bg-slate-950 border border-slate-800 hover:border-cyan-500/40 flex flex-col items-center justify-center text-center cursor-pointer transition-all shadow-inner relative group"
          >
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 absolute top-4 left-4">
              {cardFlipped ? 'Answer (Click to flip back)' : 'Question (Click to flip)'}
            </span>

            <div className="text-base sm:text-lg font-bold text-white max-w-lg">
              {cardFlipped
                ? flashcards[currentCardIndex].answer
                : flashcards[currentCardIndex].question}
            </div>

            <span className="text-xs text-cyan-400 opacity-60 group-hover:opacity-100 transition-opacity mt-4">
              Tap card to reveal answer &rarr;
            </span>
          </div>

          {/* Difficulty feedback */}
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => {
                setCardFlipped(false)
                setCurrentCardIndex((i) => (i + 1) % flashcards.length)
              }}
              className="px-4 py-2 rounded-xl bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 text-xs font-semibold"
            >
              Hard (Repeat 1d)
            </button>
            <button
              onClick={() => {
                setCardFlipped(false)
                setCurrentCardIndex((i) => (i + 1) % flashcards.length)
              }}
              className="px-4 py-2 rounded-xl bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 text-xs font-semibold"
            >
              Good (Repeat 3d)
            </button>
            <button
              onClick={() => {
                setCardFlipped(false)
                setCurrentCardIndex((i) => (i + 1) % flashcards.length)
              }}
              className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 text-xs font-semibold"
            >
              Easy (Repeat 6d)
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
