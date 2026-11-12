'use client'

import { useState } from 'react'
import {
  GraduationCap,
  Plus,
  Calendar,
  Clock,
  Target,
  Award,
  BookOpen,
  CheckCircle2,
  Trash2,
  ChevronRight,
  ChevronDown,
  Layers,
  X,
  AlertCircle,
} from 'lucide-react'

export interface Exam {
  id: string
  name: string
  subject: string
  exam_date: string | null
  color: string
  priority?: string
}

export interface ExamTopic {
  id: string
  exam_id: string
  subject_name: string
  chapter_name: string
  topic_name: string
  status: 'not_started' | 'in_progress' | 'completed' | 'needs_revision'
  notes?: string
}

export interface MockScore {
  id: string
  exam_id: string
  test_name: string
  score: number
  max_score: number
  test_date: string
}

interface ExamsClientViewProps {
  initialExams: Exam[]
  initialTopics: ExamTopic[]
  initialMockScores: MockScore[]
}

const TOPIC_STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  not_started: { label: 'Not Started', color: 'text-slate-400', bg: 'bg-slate-800' },
  in_progress: { label: 'In Progress', color: 'text-cyan-400', bg: 'bg-cyan-500/20' },
  completed: { label: 'Completed', color: 'text-emerald-400', bg: 'bg-emerald-500/20' },
  needs_revision: { label: 'Needs Revision', color: 'text-amber-400', bg: 'bg-amber-500/20' },
}

function getDaysRemaining(dateStr: string | null): number | null {
  if (!dateStr) return null
  const diff = new Date(dateStr).getTime() - Date.now()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export function ExamsClientView({
  initialExams,
  initialTopics,
  initialMockScores,
}: ExamsClientViewProps) {
  const [exams, setExams] = useState<Exam[]>(initialExams)
  const [topics, setTopics] = useState<ExamTopic[]>(initialTopics)
  const [mockScores, setMockScores] = useState<MockScore[]>(initialMockScores)
  const [selectedExamId, setSelectedExamId] = useState<string | null>(exams[0]?.id || null)

  // Exam Modal
  const [isAddExamOpen, setIsAddExamOpen] = useState(false)
  const [examName, setExamName] = useState('')
  const [examSubject, setExamSubject] = useState('')
  const [examDate, setExamDate] = useState('')
  const [examColor, setExamColor] = useState('cyan')

  // Topic Modal
  const [isAddTopicOpen, setIsAddTopicOpen] = useState(false)
  const [topicChapter, setTopicChapter] = useState('')
  const [topicName, setTopicName] = useState('')

  // Mock Score Modal
  const [isAddMockOpen, setIsAddMockOpen] = useState(false)
  const [mockTitle, setMockTitle] = useState('')
  const [mockScoreVal, setMockScoreVal] = useState('')
  const [mockMaxVal, setMockMaxVal] = useState('100')

  const selectedExam = exams.find((e) => e.id === selectedExamId)
  const currentExamTopics = topics.filter((t) => t.exam_id === selectedExamId)
  const currentExamMocks = mockScores.filter((m) => m.exam_id === selectedExamId)

  // Calculate Syllabus Completion %
  const completedTopics = currentExamTopics.filter((t) => t.status === 'completed').length
  const syllabusProgress =
    currentExamTopics.length > 0 ? Math.round((completedTopics / currentExamTopics.length) * 100) : 0

  // Add Exam
  const handleCreateExam = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!examName.trim()) return

    const newExam: Exam = {
      id: 'exam-' + Date.now(),
      name: examName.trim(),
      subject: examSubject.trim() || 'General',
      exam_date: examDate || null,
      color: examColor,
    }

    setExams((prev) => [newExam, ...prev])
    if (!selectedExamId) setSelectedExamId(newExam.id)

    try {
      await fetch('/api/dashboard/exams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newExam),
      })
    } catch (err) {
      console.error('Failed to create exam:', err)
    }

    setExamName('')
    setExamSubject('')
    setExamDate('')
    setIsAddExamOpen(false)
  }

  // Delete Exam
  const handleDeleteExam = async (id: string) => {
    setExams((prev) => prev.filter((e) => e.id !== id))
    setTopics((prev) => prev.filter((t) => t.exam_id !== id))
    if (selectedExamId === id) {
      setSelectedExamId(exams.find((e) => e.id !== id)?.id || null)
    }

    try {
      await fetch(`/api/dashboard/exams?id=${id}`, { method: 'DELETE' })
    } catch (err) {
      console.error('Failed to delete exam:', err)
    }
  }

  // Add Topic
  const handleAddTopic = () => {
    if (!selectedExamId || !topicName.trim()) return

    const newTopic: ExamTopic = {
      id: 'top-' + Date.now(),
      exam_id: selectedExamId,
      subject_name: selectedExam?.subject || 'General',
      chapter_name: topicChapter.trim() || 'Chapter 1',
      topic_name: topicName.trim(),
      status: 'not_started',
    }

    setTopics((prev) => [...prev, newTopic])
    setTopicName('')
    setIsAddTopicOpen(false)
  }

  // Toggle Topic Status
  const cycleTopicStatus = (topicId: string) => {
    const order: Array<ExamTopic['status']> = ['not_started', 'in_progress', 'completed', 'needs_revision']
    setTopics((prev) =>
      prev.map((t) => {
        if (t.id === topicId) {
          const nextIndex = (order.indexOf(t.status) + 1) % order.length
          return { ...t, status: order[nextIndex] }
        }
        return t
      })
    )
  }

  // Delete Topic
  const handleDeleteTopic = (topicId: string) => {
    setTopics((prev) => prev.filter((t) => t.id !== topicId))
  }

  // Add Mock Score
  const handleAddMockScore = () => {
    if (!selectedExamId || !mockTitle.trim() || !mockScoreVal) return

    const newMock: MockScore = {
      id: 'mock-' + Date.now(),
      exam_id: selectedExamId,
      test_name: mockTitle.trim(),
      score: parseFloat(mockScoreVal),
      max_score: parseFloat(mockMaxVal) || 100,
      test_date: new Date().toISOString().split('T')[0],
    }

    setMockScores((prev) => [newMock, ...prev])
    setMockTitle('')
    setMockScoreVal('')
    setIsAddMockOpen(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <GraduationCap className="w-7 h-7 text-cyan-400" /> Exam & Syllabus Preparation
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Track syllabus chapters, topics, countdowns, and manual mock test scores for competitive, college, and school exams.
          </p>
        </div>

        <button
          onClick={() => setIsAddExamOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-600/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add Examination
        </button>
      </div>

      {/* Examinations Cards Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {exams.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-slate-900/40 border border-dashed border-slate-800 rounded-3xl space-y-3">
            <GraduationCap className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-sm font-semibold text-slate-300">No exams registered yet</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Add upcoming college semester exams, competitive exams (UPSC/PCS/SSC), or certifications.
            </p>
            <button
              onClick={() => setIsAddExamOpen(true)}
              className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs"
            >
              <Plus className="w-4 h-4" /> Add Your First Exam
            </button>
          </div>
        ) : (
          exams.map((exam) => {
            const isSelected = exam.id === selectedExamId
            const daysLeft = getDaysRemaining(exam.exam_date)
            const examTopics = topics.filter((t) => t.exam_id === exam.id)
            const doneTopics = examTopics.filter((t) => t.status === 'completed').length
            const prog = examTopics.length > 0 ? Math.round((doneTopics / examTopics.length) * 100) : 0

            return (
              <div
                key={exam.id}
                onClick={() => setSelectedExamId(exam.id)}
                className={`p-5 rounded-3xl border transition-all cursor-pointer relative space-y-3 ${
                  isSelected
                    ? 'bg-slate-900/90 border-cyan-500/60 ring-1 ring-cyan-500/20 shadow-xl'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-white text-base leading-snug">{exam.name}</h3>
                    <span className="text-xs text-cyan-400 font-medium">{exam.subject}</span>
                  </div>

                  {daysLeft !== null && (
                    <div
                      className={`px-2.5 py-1 rounded-xl text-xs font-mono font-bold ${
                        daysLeft <= 7
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {daysLeft > 0 ? `${daysLeft}d left` : daysLeft === 0 ? 'Today!' : 'Passed'}
                    </div>
                  )}
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Syllabus Covered</span>
                    <span className="font-bold text-white">{prog}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all"
                      style={{ width: `${prog}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span>{examTopics.length} Topics total</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteExam(exam.id)
                    }}
                    className="hover:text-rose-400 transition-colors"
                    title="Delete Exam"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Selected Exam Syllabus & Mock Details */}
      {selectedExam && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Syllabus Topics Tracker */}
          <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-cyan-400" /> Syllabus Breakdown: {selectedExam.name}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Click status to cycle: Not Started → In Progress → Completed → Needs Revision
                </p>
              </div>

              <button
                onClick={() => setIsAddTopicOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-all"
              >
                <Plus className="w-3.5 h-3.5" /> Add Topic
              </button>
            </div>

            {currentExamTopics.length === 0 ? (
              <div className="text-center py-10 text-slate-500 text-xs">
                No syllabus topics added yet. Click "+ Add Topic" above to populate chapters.
              </div>
            ) : (
              <div className="space-y-2">
                {currentExamTopics.map((topic) => {
                  const meta = TOPIC_STATUS_MAP[topic.status]
                  return (
                    <div
                      key={topic.id}
                      className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all text-xs"
                    >
                      <div className="space-y-0.5 min-w-0 pr-3">
                        <span className="text-[10px] text-slate-500 font-mono uppercase">
                          {topic.chapter_name}
                        </span>
                        <p className="font-semibold text-white truncate">{topic.topic_name}</p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => cycleTopicStatus(topic.id)}
                          className={`px-3 py-1 rounded-xl font-medium border text-[11px] transition-all ${meta.bg} ${meta.color} border-slate-700/60 hover:brightness-125`}
                        >
                          {meta.label}
                        </button>

                        <button
                          onClick={() => handleDeleteTopic(topic.id)}
                          className="p-1 rounded text-slate-600 hover:text-rose-400"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Right Col: Mock Test Scores Record */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Target className="w-4 h-4 text-cyan-400" /> Mock Test Scores
              </h3>

              <button
                onClick={() => setIsAddMockOpen(true)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                title="Add Score"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {currentExamMocks.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-xs">
                No mock scores logged yet. Enter your practice test results manually!
              </div>
            ) : (
              <div className="space-y-2.5">
                {currentExamMocks.map((mock) => {
                  const pct = Math.round((mock.score / mock.max_score) * 100)
                  return (
                    <div
                      key={mock.id}
                      className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5"
                    >
                      <div className="flex justify-between text-xs">
                        <span className="font-semibold text-white">{mock.test_name}</span>
                        <span className="font-bold text-cyan-400 font-mono">
                          {mock.score}/{mock.max_score} ({pct}%)
                        </span>
                      </div>
                      <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-cyan-400 rounded-full"
                          style={{ width: `${Math.min(100, pct)}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-slate-500 block">{mock.test_date}</span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Examination Modal */}
      {isAddExamOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#111420] border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Add New Examination</h3>
              <button onClick={() => setIsAddExamOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateExam} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Exam Name *</label>
                <input
                  type="text"
                  required
                  value={examName}
                  onChange={(e) => setExamName(e.target.value)}
                  placeholder="e.g. UPSC Prelims, Rajasthan PCS, Semester 5 Finals"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Subject / Area</label>
                <input
                  type="text"
                  value={examSubject}
                  onChange={(e) => setExamSubject(e.target.value)}
                  placeholder="e.g. General Studies, Computer Science"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Exam Date</label>
                <input
                  type="date"
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddExamOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!examName.trim()}
                  className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs"
                >
                  Create Examination
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Topic Modal */}
      {isAddTopicOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#111420] border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Add Syllabus Topic</h3>
              <button onClick={() => setIsAddTopicOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Chapter / Section</label>
                <input
                  type="text"
                  value={topicChapter}
                  onChange={(e) => setTopicChapter(e.target.value)}
                  placeholder="e.g. Ancient Indian History"
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Topic Name *</label>
                <input
                  type="text"
                  value={topicName}
                  onChange={(e) => setTopicName(e.target.value)}
                  placeholder="e.g. Indus Valley Civilization"
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-800">
                <button
                  onClick={() => setIsAddTopicOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddTopic}
                  disabled={!topicName.trim()}
                  className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs"
                >
                  Add Topic
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Mock Score Modal */}
      {isAddMockOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#111420] border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Log Mock Score</h3>
              <button onClick={() => setIsAddMockOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Test Name *</label>
                <input
                  type="text"
                  value={mockTitle}
                  onChange={(e) => setMockTitle(e.target.value)}
                  placeholder="e.g. Mock Test 1 (Full Syllabus)"
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Score Obtained</label>
                  <input
                    type="number"
                    value={mockScoreVal}
                    onChange={(e) => setMockScoreVal(e.target.value)}
                    placeholder="78"
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Max Score</label>
                  <input
                    type="number"
                    value={mockMaxVal}
                    onChange={(e) => setMockMaxVal(e.target.value)}
                    placeholder="100"
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-800">
                <button
                  onClick={() => setIsAddMockOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddMockScore}
                  disabled={!mockTitle.trim() || !mockScoreVal}
                  className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs"
                >
                  Save Score
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
