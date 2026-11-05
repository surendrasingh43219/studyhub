'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  GraduationCap,
  BookOpen,
  Target,
  LayoutDashboard,
  Palette,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Plus,
  X,
  Loader2,
  Sparkles,
  Brain,
  Clock,
  Calendar,
  Star,
} from 'lucide-react'

// ─── Types ───────────────────────────────────────────────────────────────────
interface OnboardingData {
  display_name: string
  avatar_emoji: string
  bio: string
  education_type: string
  career_interests: string[]
  current_institution: string
  current_year: string
  daily_study_goal_hours: number
  preferred_study_time: string
  selected_widgets: string[]
  theme: string
  accent_color: string
  exams: Array<{ name: string; subject: string; exam_date: string; color: string }>
  subjects: Array<{ name: string; category: string; icon_emoji: string; color: string }>
}

interface Props {
  userId: string
  userEmail: string
  initialName: string
  existingProfile: any
}

// ─── Constants ────────────────────────────────────────────────────────────────
const STEPS = [
  { id: 1, title: 'Your Profile',      icon: GraduationCap, desc: 'Tell us about yourself' },
  { id: 2, title: 'Education & Goals', icon: Brain,          desc: 'What are you studying?' },
  { id: 3, title: 'Exams & Targets',   icon: Calendar,       desc: 'Add your upcoming exams' },
  { id: 4, title: 'Subjects & Skills', icon: BookOpen,       desc: 'What topics are you learning?' },
  { id: 5, title: 'Dashboard Layout',  icon: LayoutDashboard,desc: 'Pick your widgets' },
  { id: 6, title: 'Appearance',        icon: Palette,        desc: 'Choose your theme' },
]

const EDUCATION_TYPES = [
  { value: 'school',           label: 'School Student',       emoji: '🏫' },
  { value: 'college',          label: 'College / University', emoji: '🎓' },
  { value: 'competitive_exam', label: 'Competitive Exams',    emoji: '📋' },
  { value: 'professional',     label: 'Working Professional', emoji: '💼' },
  { value: 'self_learner',     label: 'Self Learner',         emoji: '🧠' },
  { value: 'other',            label: 'Other',                emoji: '✨' },
]

const CAREER_INTERESTS_OPTIONS = [
  'Data Science', 'Web Development', 'Civil Services (UPSC)', 'State PCS (Rajasthan / UP / MP)',
  'Defence (Agniveer / NDA)', 'SSC / Banking', 'IELTS / TOEFL', 'JEE / NEET',
  'CA / Finance', 'Law / CLAT', 'Design / UX', 'Machine Learning / AI',
  'Cybersecurity', 'Cloud / DevOps', 'Business / MBA', 'Teaching / BEd',
  'Medical / MBBS', 'Programming', 'Digital Marketing', 'Other',
]

const EXAM_COLORS = ['rose', 'orange', 'amber', 'cyan', 'blue', 'violet', 'emerald', 'pink']

const SUBJECT_CATEGORIES = ['Subject', 'Skill', 'Language', 'Chapter', 'Module', 'Topic']

const SUBJECT_ICONS = ['📚', '💻', '🧮', '🌍', '⚡', '🔬', '📐', '🎵', '🏛️', '💰', '📊', '🔧']

const ALL_WIDGETS = [
  { key: 'stats',    label: 'Study Stats',      icon: '📊', desc: 'Focus time, streak, notes count' },
  { key: 'tasks',    label: 'Daily Tasks',       icon: '✅', desc: 'Your personal to-do list' },
  { key: 'exams',    label: 'Exam Countdown',    icon: '📅', desc: 'Days remaining to your exams' },
  { key: 'subjects', label: 'My Subjects',       icon: '📚', desc: 'Track subject progress' },
  { key: 'reading',  label: 'Continue Reading',  icon: '📖', desc: 'Resume your current book' },
  { key: 'goals',    label: 'Daily Goals',       icon: '🎯', desc: 'Set and track daily targets' },
  { key: 'skills',   label: 'Skills Progress',   icon: '⚡', desc: 'Track skill completion %' },
  { key: 'projects', label: 'Projects',          icon: '🗂️', desc: 'Monitor your study projects' },
  { key: 'calendar', label: 'Study Calendar',    icon: '🗓️', desc: 'Upcoming events & reminders' },
  { key: 'badges',   label: 'Achievements',      icon: '🏆', desc: 'Unlock badges as you study' },
]

const THEMES = [
  { value: 'dark',   label: 'Dark Mode',   preview: 'bg-slate-900 border-slate-700' },
  { value: 'light',  label: 'Light Mode',  preview: 'bg-white border-slate-200' },
  { value: 'system', label: 'System',      preview: 'bg-gradient-to-r from-slate-900 to-white border-slate-500' },
]

const ACCENT_COLORS = [
  { value: 'cyan',   className: 'bg-cyan-500' },
  { value: 'blue',   className: 'bg-blue-500' },
  { value: 'violet', className: 'bg-violet-500' },
  { value: 'emerald',className: 'bg-emerald-500' },
  { value: 'rose',   className: 'bg-rose-500' },
  { value: 'amber',  className: 'bg-amber-500' },
]

const AVATAR_EMOJIS = ['🎓', '🧑‍💻', '👩‍🔬', '👨‍💼', '🧑‍🎨', '👩‍⚕️', '🧑‍🏫', '👨‍🚀', '🦸', '🧙', '🌟', '🚀']

// ─── Component ────────────────────────────────────────────────────────────────
export function OnboardingWizard({ userId, userEmail, initialName, existingProfile }: Props) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(existingProfile?.onboarding_step || 1)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [data, setData] = useState<OnboardingData>({
    display_name: existingProfile?.display_name || initialName,
    avatar_emoji: existingProfile?.avatar_emoji || '🎓',
    bio: existingProfile?.bio || '',
    education_type: existingProfile?.education_type || '',
    career_interests: existingProfile?.career_interests || [],
    current_institution: existingProfile?.current_institution || '',
    current_year: existingProfile?.current_year || '',
    daily_study_goal_hours: existingProfile?.daily_study_goal_hours || 2,
    preferred_study_time: existingProfile?.preferred_study_time || 'evening',
    selected_widgets: existingProfile?.selected_widgets || ['stats','tasks','exams','subjects','reading','goals','badges'],
    theme: existingProfile?.theme || 'dark',
    accent_color: existingProfile?.accent_color || 'cyan',
    exams: [],
    subjects: [],
  })

  // Exam management
  const [newExam, setNewExam] = useState({ name: '', subject: '', exam_date: '', color: 'rose' })
  // Subject management
  const [newSubject, setNewSubject] = useState({ name: '', category: 'Subject', icon_emoji: '📚', color: 'blue' })

  const saveProgress = async (complete = false) => {
    setSaving(true)
    setError(null)
    try {
      const res = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          onboarding_step: complete ? 6 : currentStep,
          onboarding_complete: complete,
        }),
      })
      if (!res.ok) {
        const j = await res.json()
        throw new Error(j.error || 'Failed to save')
      }
    } catch (e: any) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  const handleNext = async () => {
    await saveProgress(false)
    if (currentStep < STEPS.length) setCurrentStep(currentStep + 1)
  }

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const handleComplete = async () => {
    await saveProgress(true)
    router.push('/dashboard')
    router.refresh()
  }

  const handleSkip = async () => {
    setSaving(true)
    try {
      await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          onboarding_step: 6,
          onboarding_complete: true,
        }),
      })
    } finally {
      setSaving(false)
      router.push('/dashboard')
      router.refresh()
    }
  }

  const toggleCareerInterest = (interest: string) => {
    setData(prev => ({
      ...prev,
      career_interests: prev.career_interests.includes(interest)
        ? prev.career_interests.filter(i => i !== interest)
        : [...prev.career_interests, interest],
    }))
  }

  const toggleWidget = (key: string) => {
    setData(prev => ({
      ...prev,
      selected_widgets: prev.selected_widgets.includes(key)
        ? prev.selected_widgets.filter(w => w !== key)
        : [...prev.selected_widgets, key],
    }))
  }

  const addExam = () => {
    if (!newExam.name.trim()) return
    setData(prev => ({ ...prev, exams: [...prev.exams, { ...newExam }] }))
    setNewExam({ name: '', subject: '', exam_date: '', color: 'rose' })
  }

  const removeExam = (idx: number) => {
    setData(prev => ({ ...prev, exams: prev.exams.filter((_, i) => i !== idx) }))
  }

  const addSubject = () => {
    if (!newSubject.name.trim()) return
    setData(prev => ({ ...prev, subjects: [...prev.subjects, { ...newSubject }] }))
    setNewSubject({ name: '', category: 'Subject', icon_emoji: '📚', color: 'blue' })
  }

  const removeSubject = (idx: number) => {
    setData(prev => ({ ...prev, subjects: prev.subjects.filter((_, i) => i !== idx) }))
  }

  // ─── Render step content ────────────────────────────────────────────────────
  const renderStep = () => {
    switch (currentStep) {
      // ── STEP 1: Profile ──────────────────────────────────────────────────────
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-2">Choose Your Avatar</label>
              <div className="flex flex-wrap gap-2">
                {AVATAR_EMOJIS.map(emoji => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setData(p => ({ ...p, avatar_emoji: emoji }))}
                    className={`w-11 h-11 rounded-xl text-2xl flex items-center justify-center transition-all border-2 ${
                      data.avatar_emoji === emoji
                        ? 'border-cyan-500 bg-cyan-500/10 scale-110'
                        : 'border-slate-700 bg-slate-800 hover:border-slate-600'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Display Name *</label>
              <input
                type="text"
                value={data.display_name}
                onChange={e => setData(p => ({ ...p, display_name: e.target.value }))}
                placeholder="How should we call you?"
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Short Bio <span className="text-slate-500">(optional)</span></label>
              <textarea
                value={data.bio}
                onChange={e => setData(p => ({ ...p, bio: e.target.value }))}
                placeholder="e.g. UPSC aspirant from Jaipur. Preparing for CSE 2027."
                rows={3}
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Your Email</label>
              <input
                type="email"
                value={userEmail}
                disabled
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>
        )

      // ── STEP 2: Education & Goals ─────────────────────────────────────────────
      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-2">I am a...</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {EDUCATION_TYPES.map(type => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setData(p => ({ ...p, education_type: type.value }))}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      data.education_type === type.value
                        ? 'border-cyan-500 bg-cyan-500/10 text-cyan-300'
                        : 'border-slate-700 bg-slate-800 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <div className="text-xl mb-1">{type.emoji}</div>
                    <div className="text-xs font-medium">{type.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Institution / School / College <span className="text-slate-500">(optional)</span></label>
              <input
                type="text"
                value={data.current_institution}
                onChange={e => setData(p => ({ ...p, current_institution: e.target.value }))}
                placeholder="e.g. Delhi University, IIT Bombay, Self-study"
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-2">Career & Study Interests <span className="text-slate-500">(pick all that apply)</span></label>
              <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
                {CAREER_INTERESTS_OPTIONS.map(interest => (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleCareerInterest(interest)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                      data.career_interests.includes(interest)
                        ? 'border-cyan-500 bg-cyan-500/15 text-cyan-300'
                        : 'border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Daily Study Goal</label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={0.5}
                    max={12}
                    step={0.5}
                    value={data.daily_study_goal_hours}
                    onChange={e => setData(p => ({ ...p, daily_study_goal_hours: parseFloat(e.target.value) }))}
                    className="flex-1 accent-cyan-500"
                  />
                  <span className="text-cyan-400 font-mono text-sm w-16 text-right">{data.daily_study_goal_hours}h/day</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Best Study Time</label>
                <select
                  value={data.preferred_study_time}
                  onChange={e => setData(p => ({ ...p, preferred_study_time: e.target.value }))}
                  className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="morning">🌅 Morning</option>
                  <option value="afternoon">☀️ Afternoon</option>
                  <option value="evening">🌆 Evening</option>
                  <option value="night">🌙 Night</option>
                </select>
              </div>
            </div>
          </div>
        )

      // ── STEP 3: Exams ─────────────────────────────────────────────────────────
      case 3:
        return (
          <div className="space-y-5">
            <p className="text-sm text-slate-400">
              Add your upcoming exams — competitive exams, semester finals, certifications, anything.
              These will appear as countdown timers on your dashboard.
            </p>

            {/* Existing exams list */}
            {data.exams.length > 0 && (
              <div className="space-y-2">
                {data.exams.map((exam, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-800 border border-slate-700">
                    <div>
                      <p className="text-sm font-medium text-white">{exam.name}</p>
                      <p className="text-xs text-slate-400">{exam.subject} {exam.exam_date && `· ${exam.exam_date}`}</p>
                    </div>
                    <button onClick={() => removeExam(idx)} className="text-slate-500 hover:text-rose-400 transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add exam form */}
            <div className="p-4 rounded-xl border border-dashed border-slate-600 space-y-3">
              <p className="text-xs font-medium text-slate-400">Add Exam</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Exam name (e.g. Rajasthan PCS, IELTS, JEE)"
                  value={newExam.name}
                  onChange={e => setNewExam(p => ({ ...p, name: e.target.value }))}
                  className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <input
                  type="text"
                  placeholder="Subject / Paper (optional)"
                  value={newExam.subject}
                  onChange={e => setNewExam(p => ({ ...p, subject: e.target.value }))}
                  className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <input
                  type="date"
                  value={newExam.exam_date}
                  onChange={e => setNewExam(p => ({ ...p, exam_date: e.target.value }))}
                  className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <div className="flex gap-1.5">
                  {EXAM_COLORS.map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setNewExam(p => ({ ...p, color }))}
                      className={`flex-1 h-8 rounded-lg transition-all border-2 ${
                        newExam.color === color ? 'border-white scale-110' : 'border-transparent'
                      } bg-${color}-500`}
                    />
                  ))}
                </div>
              </div>
              <button
                type="button"
                onClick={addExam}
                disabled={!newExam.name.trim()}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold disabled:opacity-40 transition-all"
              >
                <Plus className="w-4 h-4" /> Add Exam
              </button>
            </div>

            <p className="text-xs text-slate-500 text-center">
              💡 You can add or edit exams anytime from your dashboard
            </p>
          </div>
        )

      // ── STEP 4: Subjects & Skills ─────────────────────────────────────────────
      case 4:
        return (
          <div className="space-y-5">
            <p className="text-sm text-slate-400">
              Add the subjects, skills, or topics you're currently studying. 
              These will show on your dashboard with individual progress tracking.
            </p>

            {/* Example chips by career interest */}
            {data.career_interests.length > 0 && (
              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <p className="text-xs text-slate-400 mb-2">💡 Quick-add based on your interests:</p>
                <div className="flex flex-wrap gap-1.5">
                  {getSuggestedSubjects(data.career_interests).map(s => (
                    <button
                      key={s.name}
                      type="button"
                      onClick={() => {
                        if (!data.subjects.find(x => x.name === s.name)) {
                          setData(p => ({ ...p, subjects: [...p.subjects, s] }))
                        }
                      }}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs border border-slate-600 bg-slate-900 text-slate-300 hover:border-cyan-500 hover:text-cyan-300 transition-all"
                    >
                      {s.icon_emoji} {s.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Existing subjects list */}
            {data.subjects.length > 0 && (
              <div className="grid grid-cols-2 gap-2">
                {data.subjects.map((sub, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-800 border border-slate-700">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{sub.icon_emoji}</span>
                      <div>
                        <p className="text-xs font-medium text-white">{sub.name}</p>
                        <p className="text-[10px] text-slate-500">{sub.category}</p>
                      </div>
                    </div>
                    <button onClick={() => removeSubject(idx)} className="text-slate-600 hover:text-rose-400 transition-colors">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add subject form */}
            <div className="p-4 rounded-xl border border-dashed border-slate-600 space-y-3">
              <p className="text-xs font-medium text-slate-400">Add Subject / Skill / Topic</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="e.g. SQL, Polity, Reading, Python"
                  value={newSubject.name}
                  onChange={e => setNewSubject(p => ({ ...p, name: e.target.value }))}
                  className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <select
                  value={newSubject.category}
                  onChange={e => setNewSubject(p => ({ ...p, category: e.target.value }))}
                  className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  {SUBJECT_CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1.5">Icon</p>
                <div className="flex flex-wrap gap-1.5">
                  {SUBJECT_ICONS.map(icon => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setNewSubject(p => ({ ...p, icon_emoji: icon }))}
                      className={`w-9 h-9 rounded-lg text-xl flex items-center justify-center border transition-all ${
                        newSubject.icon_emoji === icon ? 'border-cyan-500 bg-cyan-500/10' : 'border-slate-700 bg-slate-800'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
              <button
                type="button"
                onClick={addSubject}
                disabled={!newSubject.name.trim()}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold disabled:opacity-40 transition-all"
              >
                <Plus className="w-4 h-4" /> Add Subject
              </button>
            </div>
          </div>
        )

      // ── STEP 5: Dashboard Layout ───────────────────────────────────────────────
      case 5:
        return (
          <div className="space-y-4">
            <p className="text-sm text-slate-400">
              Choose which widgets to show on your dashboard. You can change these anytime.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ALL_WIDGETS.map(widget => {
                const isSelected = data.selected_widgets.includes(widget.key)
                return (
                  <button
                    key={widget.key}
                    type="button"
                    onClick={() => toggleWidget(widget.key)}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-cyan-500 bg-cyan-500/10 ring-1 ring-cyan-500/30'
                        : 'border-slate-700 bg-slate-800 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-2xl">{widget.icon}</span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
                    </div>
                    <p className={`text-sm font-semibold ${isSelected ? 'text-cyan-300' : 'text-white'}`}>{widget.label}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{widget.desc}</p>
                  </button>
                )
              })}
            </div>
            <p className="text-xs text-slate-500 text-center">
              {data.selected_widgets.length} widget{data.selected_widgets.length !== 1 ? 's' : ''} selected
            </p>
          </div>
        )

      // ── STEP 6: Appearance ────────────────────────────────────────────────────
      case 6:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-3">Theme</label>
              <div className="grid grid-cols-3 gap-3">
                {THEMES.map(theme => (
                  <button
                    key={theme.value}
                    type="button"
                    onClick={() => setData(p => ({ ...p, theme: theme.value }))}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      data.theme === theme.value
                        ? 'border-cyan-500 ring-2 ring-cyan-500/30'
                        : 'border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    <div className={`w-full h-10 rounded-lg mb-2 border ${theme.preview}`} />
                    <p className="text-xs text-center text-slate-300 font-medium">{theme.label}</p>
                    {data.theme === theme.value && (
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 mx-auto mt-1" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-3">Accent Color</label>
              <div className="flex gap-3">
                {ACCENT_COLORS.map(color => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => setData(p => ({ ...p, accent_color: color.value }))}
                    className={`w-10 h-10 rounded-xl ${color.className} transition-all border-2 ${
                      data.accent_color === color.value
                        ? 'border-white scale-125 shadow-lg'
                        : 'border-transparent hover:scale-110'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 space-y-3">
              <p className="text-xs font-semibold text-slate-300">📋 Your Setup Summary</p>
              <div className="space-y-1.5 text-xs text-slate-400">
                <p>👤 <span className="text-white">{data.display_name}</span> {data.avatar_emoji}</p>
                <p>🎓 {EDUCATION_TYPES.find(e => e.value === data.education_type)?.label || 'Not set'}</p>
                <p>⏱️ Goal: <span className="text-cyan-400">{data.daily_study_goal_hours}h/day</span></p>
                <p>📅 {data.exams.length} exam{data.exams.length !== 1 ? 's' : ''} added</p>
                <p>📚 {data.subjects.length} subject{data.subjects.length !== 1 ? 's' : ''} added</p>
                <p>🧩 {data.selected_widgets.length} widgets selected</p>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  const stepInfo = STEPS[currentStep - 1]
  const StepIcon = stepInfo.icon

  return (
    <div className="min-h-screen bg-[#0c0d14] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-medium mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Personalized Setup
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
            Welcome to StudyHub{data.display_name ? `, ${data.display_name.split(' ')[0]}` : ''}! 🎉
          </h1>
          <p className="text-slate-400 text-sm">
            Let's set up your personal dashboard in just a few steps.
          </p>
        </div>

        {/* Step Progress */}
        <div className="flex items-center gap-1 mb-8">
          {STEPS.map((step, idx) => {
            const done = idx + 1 < currentStep
            const active = idx + 1 === currentStep
            return (
              <div key={step.id} className="flex items-center flex-1">
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    done ? 'bg-cyan-500 text-slate-950' :
                    active ? 'bg-cyan-500/20 border-2 border-cyan-500 text-cyan-400' :
                    'bg-slate-800 border border-slate-700 text-slate-500'
                  }`}
                >
                  {done ? <CheckCircle2 className="w-4 h-4" /> : step.id}
                </div>
                {idx < STEPS.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-1 ${done ? 'bg-cyan-500' : 'bg-slate-800'}`} />
                )}
              </div>
            )
          })}
        </div>

        {/* Card */}
        <div className="bg-[#141724] border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
          {/* Card Header */}
          <div className="px-6 py-5 border-b border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
              <StepIcon className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">{stepInfo.title}</h2>
              <p className="text-xs text-slate-400">{stepInfo.desc} · Step {currentStep} of {STEPS.length}</p>
            </div>
          </div>

          {/* Card Content */}
          <div className="px-6 py-6">{renderStep()}</div>

          {/* Error */}
          {error && (
            <div className="mx-6 mb-4 px-4 py-2.5 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs">
              ⚠️ {error}
            </div>
          )}

          {/* Card Footer */}
          <div className="px-6 py-4 border-t border-slate-800 flex items-center justify-between">
            <div className="flex gap-2">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={saving}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-all disabled:opacity-50"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>
              )}
              <button
                type="button"
                onClick={handleSkip}
                disabled={saving}
                className="px-4 py-2 rounded-xl text-slate-500 hover:text-slate-300 text-xs transition-colors disabled:opacity-50"
              >
                Skip Setup
              </button>
            </div>

            {currentStep < STEPS.length ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-sm font-bold shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                Next <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleComplete}
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-sm font-bold shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                Complete Setup
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Helper: suggest subjects based on selected career interests ─────────────
function getSuggestedSubjects(interests: string[]) {
  const map: Record<string, Array<{ name: string; category: string; icon_emoji: string; color: string }>> = {
    'Data Science':         [{ name: 'Python', category: 'Skill', icon_emoji: '🐍', color: 'blue' }, { name: 'SQL', category: 'Skill', icon_emoji: '🗄️', color: 'cyan' }, { name: 'Statistics', category: 'Subject', icon_emoji: '📊', color: 'violet' }],
    'Web Development':      [{ name: 'JavaScript', category: 'Skill', icon_emoji: '💛', color: 'amber' }, { name: 'React', category: 'Skill', icon_emoji: '⚛️', color: 'cyan' }, { name: 'CSS', category: 'Skill', icon_emoji: '🎨', color: 'blue' }],
    'Civil Services (UPSC)':[{ name: 'Polity', category: 'Subject', icon_emoji: '🏛️', color: 'amber' }, { name: 'History', category: 'Subject', icon_emoji: '📜', color: 'rose' }, { name: 'Geography', category: 'Subject', icon_emoji: '🌍', color: 'emerald' }, { name: 'Current Affairs', category: 'Topic', icon_emoji: '📰', color: 'blue' }],
    'State PCS (Rajasthan / UP / MP)': [{ name: 'Rajasthan GK', category: 'Subject', icon_emoji: '🏜️', color: 'amber' }, { name: 'Indian Polity', category: 'Subject', icon_emoji: '🏛️', color: 'blue' }, { name: 'Maths', category: 'Subject', icon_emoji: '🔢', color: 'violet' }],
    'Defence (Agniveer / NDA)':[{ name: 'Physics', category: 'Subject', icon_emoji: '⚡', color: 'amber' }, { name: 'Maths', category: 'Subject', icon_emoji: '🔢', color: 'blue' }, { name: 'English', category: 'Subject', icon_emoji: '🔤', color: 'emerald' }],
    'SSC / Banking':        [{ name: 'Quantitative Aptitude', category: 'Subject', icon_emoji: '🔢', color: 'blue' }, { name: 'Reasoning', category: 'Subject', icon_emoji: '🧩', color: 'violet' }, { name: 'English', category: 'Subject', icon_emoji: '🔤', color: 'emerald' }, { name: 'GK', category: 'Subject', icon_emoji: '🌐', color: 'cyan' }],
    'IELTS / TOEFL':        [{ name: 'Speaking', category: 'Skill', icon_emoji: '🗣️', color: 'rose' }, { name: 'Listening', category: 'Skill', icon_emoji: '👂', color: 'blue' }, { name: 'Reading', category: 'Skill', icon_emoji: '📖', color: 'emerald' }, { name: 'Writing', category: 'Skill', icon_emoji: '✍️', color: 'violet' }],
    'JEE / NEET':           [{ name: 'Physics', category: 'Subject', icon_emoji: '⚡', color: 'amber' }, { name: 'Chemistry', category: 'Subject', icon_emoji: '🧪', color: 'emerald' }, { name: 'Maths', category: 'Subject', icon_emoji: '🔢', color: 'blue' }],
    'Machine Learning / AI':[{ name: 'Python', category: 'Skill', icon_emoji: '🐍', color: 'blue' }, { name: 'Linear Algebra', category: 'Subject', icon_emoji: '📐', color: 'violet' }, { name: 'Deep Learning', category: 'Topic', icon_emoji: '🧠', color: 'rose' }],
    'Programming':          [{ name: 'DSA', category: 'Subject', icon_emoji: '🌲', color: 'emerald' }, { name: 'System Design', category: 'Topic', icon_emoji: '🏗️', color: 'cyan' }],
  }
  const results: Array<{ name: string; category: string; icon_emoji: string; color: string }> = []
  const seen = new Set<string>()
  interests.forEach(interest => {
    (map[interest] || []).forEach(s => {
      if (!seen.has(s.name)) {
        seen.add(s.name)
        results.push(s)
      }
    })
  })
  return results.slice(0, 12)
}
