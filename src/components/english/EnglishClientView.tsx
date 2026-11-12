'use client'

import { useState } from 'react'
import {
  Languages,
  Plus,
  Mic,
  Headphones,
  BookOpen,
  PenTool,
  Bookmark,
  MessageSquare,
  Award,
  Calendar,
  CheckCircle2,
  Trash2,
  X,
  Volume2,
} from 'lucide-react'

export interface EnglishLog {
  id: string
  module: 'speaking' | 'listening' | 'reading' | 'writing' | 'vocabulary' | 'grammar' | 'interview'
  duration_minutes: number
  title: string
  notes?: string
  practice_date: string
}

export interface VocabularyWord {
  id: string
  word: string
  definition: string
  example_sentence?: string
  mastered: boolean
}

export interface EnglishMock {
  id: string
  exam_type: string
  overall_score: number
  listening_score?: number
  reading_score?: number
  writing_score?: number
  speaking_score?: number
  test_date: string
}

interface EnglishClientViewProps {
  initialLogs: EnglishLog[]
  initialVocab: VocabularyWord[]
  initialMocks: EnglishMock[]
  targetIeltsScore?: number
}

const MODULES: Array<{ key: EnglishLog['module']; label: string; icon: any }> = [
  { key: 'speaking', label: 'Speaking', icon: Mic },
  { key: 'listening', label: 'Listening', icon: Headphones },
  { key: 'reading', label: 'Reading', icon: BookOpen },
  { key: 'writing', label: 'Writing', icon: PenTool },
  { key: 'vocabulary', label: 'Vocabulary', icon: Bookmark },
  { key: 'grammar', label: 'Grammar', icon: Award },
  { key: 'interview', label: 'Interview Communication', icon: MessageSquare },
]

const DEFAULT_VOCAB: VocabularyWord[] = [
  { id: 'v-1', word: 'Meticulous', definition: 'Showing great attention to detail; very careful and precise.', example_sentence: 'She maintained a meticulous record of all experimental data.', mastered: true },
  { id: 'v-2', word: 'Pragmatic', definition: 'Dealing with things sensibly and realistically in a practical way.', example_sentence: 'A pragmatic approach to problem-solving yields faster outcomes.', mastered: false },
  { id: 'v-3', word: 'Articulate', definition: 'Expressing ideas fluently and coherently in speech or writing.', example_sentence: 'He gave an articulate explanation during the technical interview.', mastered: false },
]

export function EnglishClientView({
  initialLogs,
  initialVocab,
  initialMocks,
  targetIeltsScore = 7.5,
}: EnglishClientViewProps) {
  const [logs, setLogs] = useState<EnglishLog[]>(initialLogs)
  const [vocab, setVocab] = useState<VocabularyWord[]>(
    initialVocab.length > 0 ? initialVocab : DEFAULT_VOCAB
  )
  const [mocks, setMocks] = useState<EnglishMock[]>(initialMocks)
  const [activeTab, setActiveTab] = useState<'modules' | 'vocab' | 'ielts'>('modules')

  // Modals
  const [isLogModalOpen, setIsLogModalOpen] = useState(false)
  const [isVocabModalOpen, setIsVocabModalOpen] = useState(false)
  const [isIeltsModalOpen, setIsIeltsModalOpen] = useState(false)

  // Log Form
  const [selectedModule, setSelectedModule] = useState<EnglishLog['module']>('speaking')
  const [logTitle, setLogTitle] = useState('')
  const [logDuration, setLogDuration] = useState(20)
  const [logNotes, setLogNotes] = useState('')

  // Vocab Form
  const [newWord, setNewWord] = useState('')
  const [newDefinition, setNewDefinition] = useState('')
  const [newExample, setNewExample] = useState('')

  // IELTS Form
  const [overallScore, setOverallScore] = useState('7.0')
  const [listeningScore, setListeningScore] = useState('7.5')
  const [readingScore, setReadingScore] = useState('7.0')
  const [writingScore, setWritingScore] = useState('6.5')
  const [speakingScore, setSpeakingScore] = useState('7.0')

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault()
    if (!logTitle.trim()) return

    const newLog: EnglishLog = {
      id: 'log-' + Date.now(),
      module: selectedModule,
      duration_minutes: logDuration,
      title: logTitle.trim(),
      notes: logNotes.trim(),
      practice_date: new Date().toISOString().split('T')[0],
    }

    setLogs((prev) => [newLog, ...prev])
    setLogTitle('')
    setLogNotes('')
    setIsLogModalOpen(false)
  }

  const handleAddVocab = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newWord.trim() || !newDefinition.trim()) return

    const newV: VocabularyWord = {
      id: 'voc-' + Date.now(),
      word: newWord.trim(),
      definition: newDefinition.trim(),
      example_sentence: newExample.trim(),
      mastered: false,
    }

    setVocab((prev) => [newV, ...prev])
    setNewWord('')
    setNewDefinition('')
    setNewExample('')
    setIsVocabModalOpen(false)
  }

  const toggleMastered = (id: string) => {
    setVocab((prev) =>
      prev.map((v) => (v.id === id ? { ...v, mastered: !v.mastered } : v))
    )
  }

  const handleDeleteVocab = (id: string) => {
    setVocab((prev) => prev.filter((v) => v.id !== id))
  }

  const handleAddIelts = (e: React.FormEvent) => {
    e.preventDefault()

    const newMock: EnglishMock = {
      id: 'ielts-' + Date.now(),
      exam_type: 'IELTS Academic',
      overall_score: parseFloat(overallScore),
      listening_score: parseFloat(listeningScore),
      reading_score: parseFloat(readingScore),
      writing_score: parseFloat(writingScore),
      speaking_score: parseFloat(speakingScore),
      test_date: new Date().toISOString().split('T')[0],
    }

    setMocks((prev) => [newMock, ...prev])
    setIsIeltsModalOpen(false)
  }

  const totalPracticeMinutes = logs.reduce((acc, l) => acc + (l.duration_minutes || 0), 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <Languages className="w-7 h-7 text-cyan-400" /> English Improvement Tracker
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Systematic daily practice for spoken English, active listening, vocabulary bank, grammar, and IELTS/TOEFL targets.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setActiveTab('modules')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'modules' ? 'bg-cyan-500/20 text-cyan-400 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Practice Modules
            </button>
            <button
              onClick={() => setActiveTab('vocab')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'vocab' ? 'bg-cyan-500/20 text-cyan-400 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Vocab Bank ({vocab.length})
            </button>
            <button
              onClick={() => setActiveTab('ielts')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'ielts' ? 'bg-cyan-500/20 text-cyan-400 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              IELTS / Exam Prep
            </button>
          </div>

          <button
            onClick={() => {
              if (activeTab === 'modules') setIsLogModalOpen(true)
              else if (activeTab === 'vocab') setIsVocabModalOpen(true)
              else setIsIeltsModalOpen(true)
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-600/20 transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            {activeTab === 'modules' ? 'Log Practice' : activeTab === 'vocab' ? 'Add Word' : 'Log Mock'}
          </button>
        </div>
      </div>

      {activeTab === 'modules' && (
        <div className="space-y-6">
          {/* Modules Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {MODULES.map((mod) => {
              const Icon = mod.icon
              const modMinutes = logs
                .filter((l) => l.module === mod.key)
                .reduce((acc, l) => acc + (l.duration_minutes || 0), 0)

              return (
                <div
                  key={mod.key}
                  className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center space-y-2 hover:border-slate-700 transition-all"
                >
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mx-auto">
                    <Icon className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-bold text-white leading-tight">{mod.label}</p>
                  <p className="text-[11px] text-slate-400 font-mono">{modMinutes} mins</p>
                </div>
              )
            })}
          </div>

          {/* Practice History Table */}
          <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-cyan-400" /> Recent Practice Sessions
            </h3>

            {logs.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-xs">
                No English practice sessions logged yet. Record your daily 15-minute speaking or reading habit!
              </div>
            ) : (
              <div className="space-y-2">
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-mono bg-cyan-500/15 text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-500/30">
                          {log.module}
                        </span>
                        <p className="font-semibold text-white">{log.title}</p>
                      </div>
                      {log.notes && <p className="text-[11px] text-slate-400">{log.notes}</p>}
                    </div>

                    <div className="text-right">
                      <span className="font-mono font-bold text-cyan-400">{log.duration_minutes}m</span>
                      <span className="text-[10px] text-slate-500 block">{log.practice_date}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'vocab' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {vocab.map((v) => (
              <div
                key={v.id}
                className={`p-5 rounded-3xl border transition-all space-y-3 ${
                  v.mastered
                    ? 'bg-slate-950/40 border-slate-800/60 opacity-80'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-white text-base">{v.word}</h3>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">{v.definition}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteVocab(v.id)}
                    className="p-1 rounded text-slate-600 hover:text-rose-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {v.example_sentence && (
                  <p className="text-[11px] text-cyan-400/90 italic bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                    "{v.example_sentence}"
                  </p>
                )}

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Status</span>
                  <button
                    onClick={() => toggleMastered(v.id)}
                    className={`px-3 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      v.mastered
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{v.mastered ? 'Mastered' : 'Learning'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'ielts' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">IELTS Target Band: {targetIeltsScore}</h3>
                <p className="text-xs text-slate-400">Track section-wise band scores across mock tests.</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 font-bold text-xs border border-cyan-500/30">
                Target: {targetIeltsScore} Band
              </span>
            </div>

            {mocks.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-xs">
                No mock test scores logged yet. Enter your practice score results above!
              </div>
            ) : (
              <div className="space-y-3">
                {mocks.map((m) => (
                  <div
                    key={m.id}
                    className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-white">{m.exam_type}</span>
                      <span className="font-mono text-cyan-400 font-bold text-sm">
                        Overall Band: {m.overall_score}
                      </span>
                    </div>

                    <div className="grid grid-cols-4 gap-2 text-center pt-2 border-t border-slate-800">
                      <div className="p-1.5 rounded-lg bg-slate-900">
                        <span className="text-[10px] text-slate-500 block">Listening</span>
                        <strong className="text-white">{m.listening_score || '-'}</strong>
                      </div>
                      <div className="p-1.5 rounded-lg bg-slate-900">
                        <span className="text-[10px] text-slate-500 block">Reading</span>
                        <strong className="text-white">{m.reading_score || '-'}</strong>
                      </div>
                      <div className="p-1.5 rounded-lg bg-slate-900">
                        <span className="text-[10px] text-slate-500 block">Writing</span>
                        <strong className="text-white">{m.writing_score || '-'}</strong>
                      </div>
                      <div className="p-1.5 rounded-lg bg-slate-900">
                        <span className="text-[10px] text-slate-500 block">Speaking</span>
                        <strong className="text-white">{m.speaking_score || '-'}</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Log Modal */}
      {isLogModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#111420] border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Log English Practice</h3>
              <button onClick={() => setIsLogModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddLog} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Module</label>
                <select
                  value={selectedModule}
                  onChange={(e) => setSelectedModule(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  {MODULES.map((m) => (
                    <option key={m.key} value={m.key}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Topic / Practice Title *</label>
                <input
                  type="text"
                  required
                  value={logTitle}
                  onChange={(e) => setLogTitle(e.target.value)}
                  placeholder="e.g. 15 Mins Speaking Extempore on Technology"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Duration (Minutes)</label>
                <input
                  type="number"
                  value={logDuration}
                  onChange={(e) => setLogDuration(parseInt(e.target.value) || 15)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Notes</label>
                <textarea
                  rows={2}
                  value={logNotes}
                  onChange={(e) => setLogNotes(e.target.value)}
                  placeholder="Mistakes identified, new idioms, fluency feedback..."
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsLogModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!logTitle.trim()}
                  className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs"
                >
                  Save Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Vocab Modal */}
      {isVocabModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#111420] border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Add Vocabulary Word</h3>
              <button onClick={() => setIsVocabModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddVocab} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Word *</label>
                <input
                  type="text"
                  required
                  value={newWord}
                  onChange={(e) => setNewWord(e.target.value)}
                  placeholder="e.g. Ubiquitous"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Definition *</label>
                <input
                  type="text"
                  required
                  value={newDefinition}
                  onChange={(e) => setNewDefinition(e.target.value)}
                  placeholder="e.g. Present, appearing, or found everywhere"
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Example Sentence</label>
                <input
                  type="text"
                  value={newExample}
                  onChange={(e) => setNewExample(e.target.value)}
                  placeholder="e.g. Smartphones have become ubiquitous in modern society."
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsVocabModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newWord.trim() || !newDefinition.trim()}
                  className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs"
                >
                  Save Word
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* IELTS Mock Modal */}
      {isIeltsModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#111420] border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Log IELTS Mock Score</h3>
              <button onClick={() => setIsIeltsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddIelts} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Overall Band</label>
                  <input
                    type="number"
                    step="0.5"
                    value={overallScore}
                    onChange={(e) => setOverallScore(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Listening Band</label>
                  <input
                    type="number"
                    step="0.5"
                    value={listeningScore}
                    onChange={(e) => setListeningScore(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Reading</label>
                  <input
                    type="number"
                    step="0.5"
                    value={readingScore}
                    onChange={(e) => setReadingScore(e.target.value)}
                    className="w-full px-2 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Writing</label>
                  <input
                    type="number"
                    step="0.5"
                    value={writingScore}
                    onChange={(e) => setWritingScore(e.target.value)}
                    className="w-full px-2 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Speaking</label>
                  <input
                    type="number"
                    step="0.5"
                    value={speakingScore}
                    onChange={(e) => setSpeakingScore(e.target.value)}
                    className="w-full px-2 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsIeltsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs"
                >
                  Save Score
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
