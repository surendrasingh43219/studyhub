'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Sparkles,
  User,
  GraduationCap,
  Target,
  BookOpen,
  Clock,
  LayoutDashboard,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Plus,
  X,
  Loader2,
  Shield,
  Layers,
  Calendar,
  CheckSquare,
  Briefcase,
  Languages,
} from 'lucide-react'

// ─── Types ───────────────────────────────────────────────────────────────────
interface OnboardingData {
  display_name: string
  avatar_emoji: string
  bio: string
  education_type: string
  current_institution: string
  course_degree: string
  branch_stream: string
  semester_class: string
  preferred_language: string
  career_interests: string[]
  goals: string[]
  subjects: Array<{ name: string; category: string; icon_emoji: string; color: string }>
  daily_study_goal_hours: number
  wake_up_time: string
  preferred_study_time: string
  break_time: string
  working_hours: string
  weekly_target_hours: number
  selected_widgets: string[]
  theme: string
  accent_color: string
}

interface Props {
  userId: string
  userEmail: string
  initialName: string
  existingProfile: any
}

// ─── Constants ────────────────────────────────────────────────────────────────
const STEPS = [
  { id: 1, title: 'Welcome',          icon: Sparkles,        desc: 'Build your system' },
  { id: 2, title: 'Basic Profile',    icon: User,            desc: 'Academic details' },
  { id: 3, title: 'Personal Goals',   icon: Target,          desc: 'What you want to achieve' },
  { id: 4, title: 'Subjects & Areas', icon: BookOpen,        desc: 'What you are studying' },
  { id: 5, title: 'Daily Routine',    icon: Clock,           desc: 'Targets & schedule' },
  { id: 6, title: 'Dashboard Setup',  icon: LayoutDashboard, desc: 'Choose your widgets' },
  { id: 7, title: 'Finish',           icon: CheckCircle2,    desc: 'Ready to launch' },
]

const EDUCATION_LEVELS = [
  { value: 'school',           label: 'School Student (Grades 9-12)', emoji: '🏫' },
  { value: 'college',          label: 'College / University',         emoji: '🎓' },
  { value: 'competitive_exam', label: 'Competitive Exams (UPSC/PCS/SSC)', emoji: '📋' },
  { value: 'professional',     label: 'Working Professional',         emoji: '💼' },
  { value: 'self_learner',     label: 'Adult Learner / Self-Study',   emoji: '🧠' },
]

const PRESET_GOALS = [
  'Complete graduation with top grade',
  'Prepare for competitive exams (UPSC/PCS/SSC)',
  'Become a Data Analyst',
  'Improve spoken English & communication',
  'Learn Python & SQL programming',
  'Get an internship or job offer',
  'Prepare for IELTS / TOEFL score',
  'Build professional portfolio projects',
  'Maintain daily study consistency',
]

const ALL_WIDGETS = [
  { key: 'stats',    label: 'Study Stats',       icon: '📊', desc: 'Focus hours, streak, tasks completed' },
  { key: 'tasks',    label: 'Daily Tasks',        icon: '✅', desc: 'Interactive tick/untick to-do list' },
  { key: 'exams',    label: 'Exam Countdown',     icon: '📅', desc: 'Days remaining & syllabus progress' },
  { key: 'subjects', label: 'My Subjects',        icon: '📚', desc: 'Subject-wise learning targets' },
  { key: 'reading',  label: 'Book Library',       icon: '📖', desc: 'Digital textbook bookmarks & reader' },
  { key: 'goals',    label: 'Personal Goals',     icon: '🎯', desc: 'Long-term goals & daily habits' },
  { key: 'skills',   label: 'Skills Progress',    icon: '⚡', desc: 'Technical & professional skill levels' },
  { key: 'projects', label: 'Projects',           icon: '🗂️', desc: 'Milestones & GitHub progress' },
  { key: 'calendar', label: 'Calendar',           icon: '🗓️', desc: 'Exams, deadlines & study blocks' },
]

const AVATAR_EMOJIS = ['🎓', '🧑‍💻', '👩‍🔬', '👨‍💼', '🧑‍🎨', '👩‍⚕️', '🧑‍🏫', '👨‍🚀', '⚡', '🎯', '🌟', '🚀']

const SUBJECT_ICONS = ['📚', '💻', '🧮', '🌍', '⚡', '🔬', '📐', '🎵', '🏛️', '💰', '📊', '🔧']
const SUBJECT_COLORS = ['cyan', 'blue', 'violet', 'emerald', 'rose', 'amber']

// ─── Component ────────────────────────────────────────────────────────────────
export function OnboardingWizard({ userId, userEmail, initialName, existingProfile }: Props) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [data, setData] = useState<OnboardingData>({
    display_name: existingProfile?.display_name || initialName,
    avatar_emoji: existingProfile?.avatar_emoji || '🎓',
    bio: existingProfile?.bio || '',
    education_type: existingProfile?.education_type || 'college',
    current_institution: existingProfile?.current_institution || '',
    course_degree: existingProfile?.course_degree || '',
    branch_stream: existingProfile?.branch_stream || '',
    semester_class: existingProfile?.semester_class || '',
    preferred_language: existingProfile?.preferred_language || 'English',
    career_interests: existingProfile?.career_interests || [],
    goals: [
      'Complete graduation with top grade',
      'Become a Data Analyst',
      'Improve spoken English & communication',
    ],
    subjects: [
      { name: 'Mathematics', category: 'Subject', icon_emoji: '🧮', color: 'blue' },
      { name: 'Computer Science', category: 'Subject', icon_emoji: '💻', color: 'cyan' },
      { name: 'English Communication', category: 'Language', icon_emoji: '🌍', color: 'emerald' },
    ],
    daily_study_goal_hours: existingProfile?.daily_study_goal_hours || 4,
    wake_up_time: existingProfile?.wake_up_time || '06:30 AM',
    preferred_study_time: existingProfile?.preferred_study_time || 'evening',
    break_time: existingProfile?.break_time || '10 mins every hour',
    working_hours: existingProfile?.working_hours || '4 - 6 hours',
    weekly_target_hours: existingProfile?.weekly_target_hours || 24,
    selected_widgets: existingProfile?.selected_widgets || ['stats', 'tasks', 'exams', 'subjects', 'reading', 'goals'],
    theme: existingProfile?.theme || 'dark',
    accent_color: existingProfile?.accent_color || 'cyan',
  })

  // Quick inputs
  const [customGoal, setCustomGoal] = useState('')
  const [newSubName, setNewSubName] = useState('')
  const [newSubCategory, setNewSubCategory] = useState('Subject')
  const [newSubEmoji, setNewSubEmoji] = useState('📚')
  const [newSubColor, setNewSubColor] = useState('cyan')

  const toggleGoal = (goal: string) => {
    setData((p) => ({
      ...p,
      goals: p.goals.includes(goal)
        ? p.goals.filter((g) => g !== goal)
        : [...p.goals, goal],
    }))
  }

  const addCustomGoal = () => {
    if (!customGoal.trim()) return
    if (!data.goals.includes(customGoal.trim())) {
      setData((p) => ({ ...p, goals: [...p.goals, customGoal.trim()] }))
    }
    setCustomGoal('')
  }

  const addSubject = () => {
    if (!newSubName.trim()) return
    setData((p) => ({
      ...p,
      subjects: [
        ...p.subjects,
        {
          name: newSubName.trim(),
          category: newSubCategory,
          icon_emoji: newSubEmoji,
          color: newSubColor,
        },
      ],
    }))
    setNewSubName('')
  }

  const removeSubject = (idx: number) => {
    setData((p) => ({ ...p, subjects: p.subjects.filter((_, i) => i !== idx) }))
  }

  const toggleWidget = (key: string) => {
    setData((p) => ({
      ...p,
      selected_widgets: p.selected_widgets.includes(key)
        ? p.selected_widgets.filter((w) => w !== key)
        : [...p.selected_widgets, key],
    }))
  }

  const saveOnboarding = async (isComplete = false) => {
    setSaving(true)
    setError(null)
    try {
      const res = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          onboarding_step: currentStep,
          onboarding_complete: isComplete,
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Failed to save setup')
      }

      if (isComplete) {
        router.push('/dashboard')
        router.refresh()
      }
    } catch (err: any) {
      setError(err.message || 'Error saving setup')
    } finally {
      setSaving(false)
    }
  }

  const handleNext = () => {
    if (currentStep < 7) {
      setCurrentStep((p) => p + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      saveOnboarding(true)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((p) => p - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleSkip = () => {
    saveOnboarding(true)
  }

  // ─── Step Renderers ────────────────────────────────────────────────────────
  const renderStep = () => {
    switch (currentStep) {
      // ── STEP 1: Welcome ──
      case 1:
        return (
          <div className="space-y-6 text-center py-4">
            <div className="w-16 h-16 rounded-3xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto text-cyan-400 shadow-xl shadow-cyan-500/10">
              <Sparkles className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                Welcome to <span className="text-cyan-400">StudyHub</span>!
              </h1>
              <p className="text-base sm:text-lg text-slate-300 font-medium">
                Let's build your personal success system.
              </p>
              <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto leading-relaxed">
                StudyHub is your private student command center. We help you organize daily study routines, track exams, master skills, and achieve ambitious goals—with 100% privacy and zero paywalls.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left pt-2">
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                <div className="text-cyan-400 font-semibold text-xs flex items-center gap-1.5">
                  <Shield className="w-4 h-4" /> 100% Private
                </div>
                <p className="text-[11px] text-slate-400">
                  Every note, task, and syllabus record belongs exclusively to you.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                <div className="text-emerald-400 font-semibold text-xs flex items-center gap-1.5">
                  <CheckSquare className="w-4 h-4" /> Free Forever
                </div>
                <p className="text-[11px] text-slate-400">
                  Unlimited tasks, calendar views, and habit tracking without subscriptions.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                <div className="text-purple-400 font-semibold text-xs flex items-center gap-1.5">
                  <Layers className="w-4 h-4" /> Multi-Device
                </div>
                <p className="text-[11px] text-slate-400">
                  Access seamlessly from mobile, tablet, or desktop with real-time sync.
                </p>
              </div>
            </div>
          </div>
        )

      // ── STEP 2: Basic Profile ──
      case 2:
        return (
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-bold text-white">Academic & Student Profile</h2>
              <p className="text-xs text-slate-400">Customize how your dashboard addresses and organizes your learning.</p>
            </div>

            {/* Avatar & Display Name */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <label className="block text-xs font-semibold text-slate-300">Choose Profile Icon</label>
              <div className="flex flex-wrap gap-2">
                {AVATAR_EMOJIS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setData((p) => ({ ...p, avatar_emoji: emoji }))}
                    className={`text-2xl w-10 h-10 rounded-xl transition-all flex items-center justify-center ${
                      data.avatar_emoji === emoji
                        ? 'bg-cyan-500/20 border-2 border-cyan-400 scale-110 shadow-md shadow-cyan-500/20'
                        : 'bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={data.display_name}
                    onChange={(e) => setData((p) => ({ ...p, display_name: e.target.value }))}
                    placeholder="Enter your name"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Preferred Language</label>
                  <select
                    value={data.preferred_language}
                    onChange={(e) => setData((p) => ({ ...p, preferred_language: e.target.value }))}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="English">English</option>
                    <option value="Hindi">Hindi / Hinglish</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Education Level */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300">Current Educational Level</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {EDUCATION_LEVELS.map((level) => (
                  <button
                    key={level.value}
                    type="button"
                    onClick={() => setData((p) => ({ ...p, education_type: level.value }))}
                    className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                      data.education_type === level.value
                        ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-300 shadow-sm'
                        : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-xl">{level.emoji}</span>
                    <span className="text-xs font-semibold">{level.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Institution & Course Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">College or School Name</label>
                <input
                  type="text"
                  value={data.current_institution}
                  onChange={(e) => setData((p) => ({ ...p, current_institution: e.target.value }))}
                  placeholder="e.g. Delhi University, IIT, Kendriya Vidyalaya"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Course or Degree</label>
                <input
                  type="text"
                  value={data.course_degree}
                  onChange={(e) => setData((p) => ({ ...p, course_degree: e.target.value }))}
                  placeholder="e.g. B.Tech, BCA, B.Sc, B.Com, Class 12"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Branch or Stream</label>
                <input
                  type="text"
                  value={data.branch_stream}
                  onChange={(e) => setData((p) => ({ ...p, branch_stream: e.target.value }))}
                  placeholder="e.g. Computer Science, Science, Commerce"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Current Semester or Class</label>
                <input
                  type="text"
                  value={data.semester_class}
                  onChange={(e) => setData((p) => ({ ...p, semester_class: e.target.value }))}
                  placeholder="e.g. 5th Semester, 3rd Year, 12th Grade"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          </div>
        )

      // ── STEP 3: Personal Goals ──
      case 3:
        return (
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-bold text-white">Your Personal Ambitions & Goals</h2>
              <p className="text-xs text-slate-400">Select what you want to achieve or add your custom milestones.</p>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300">Choose Goals (Select all that apply)</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {PRESET_GOALS.map((goal) => {
                  const isSelected = data.goals.includes(goal)
                  return (
                    <button
                      key={goal}
                      type="button"
                      onClick={() => toggleGoal(goal)}
                      className={`flex items-start gap-2.5 p-3 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-300'
                          : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${isSelected ? 'text-cyan-400' : 'text-slate-600'}`} />
                      <span className="text-xs font-medium leading-snug">{goal}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Custom Goal Input */}
            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <label className="block text-xs font-semibold text-slate-300">Add a Custom Goal</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customGoal}
                  onChange={(e) => setCustomGoal(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomGoal())}
                  placeholder="e.g. Master Power BI and build 3 dashboards..."
                  className="flex-1 px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                />
                <button
                  type="button"
                  onClick={addCustomGoal}
                  disabled={!customGoal.trim()}
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-40"
                >
                  Add Goal
                </button>
              </div>
            </div>

            {data.goals.length > 0 && (
              <p className="text-xs text-cyan-400/80 text-center">
                🎯 {data.goals.length} goals selected for your personal tracking.
              </p>
            )}
          </div>
        )

      // ── STEP 4: Subjects & Areas ──
      case 4:
        return (
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-bold text-white">Subjects & Learning Areas</h2>
              <p className="text-xs text-slate-400">Add the subjects, courses, or skills you are actively studying.</p>
            </div>

            {/* Active Subjects List */}
            <div className="space-y-2">
              {data.subjects.map((sub, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{sub.icon_emoji}</span>
                    <div>
                      <p className="text-xs sm:text-sm font-semibold text-white">{sub.name}</p>
                      <span className="text-[10px] text-cyan-400 font-mono uppercase">{sub.category}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeSubject(idx)}
                    className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Subject Box */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-dashed border-slate-700 space-y-3">
              <p className="text-xs font-bold text-slate-300">Add New Subject / Topic</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={newSubName}
                  onChange={(e) => setNewSubName(e.target.value)}
                  placeholder="Subject Name (e.g. Data Structures, SQL, Economics)"
                  className="px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                />

                <select
                  value={newSubCategory}
                  onChange={(e) => setNewSubCategory(e.target.value)}
                  className="px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="Subject">Academic Subject</option>
                  <option value="Skill">Professional Skill</option>
                  <option value="Language">Language</option>
                  <option value="Competitive Exam">Exam Topic</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Icon:</span>
                <div className="flex gap-1 overflow-x-auto py-1">
                  {SUBJECT_ICONS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setNewSubEmoji(emoji)}
                      className={`text-lg p-1 rounded-lg ${newSubEmoji === emoji ? 'bg-cyan-500/20 border border-cyan-400' : 'hover:bg-slate-800'}`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={addSubject}
                disabled={!newSubName.trim()}
                className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-40"
              >
                Add Subject
              </button>
            </div>
          </div>
        )

      // ── STEP 5: Daily Routine ──
      case 5:
        return (
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-bold text-white">Daily Routine & Focus Target</h2>
              <p className="text-xs text-slate-400">Configure your daily study targets, working hours, and study rhythm.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                <label className="block text-xs font-semibold text-slate-300">Daily Study Target</label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="1"
                    max="12"
                    step="0.5"
                    value={data.daily_study_goal_hours}
                    onChange={(e) => setData((p) => ({ ...p, daily_study_goal_hours: parseFloat(e.target.value) }))}
                    className="flex-1 accent-cyan-400"
                  />
                  <span className="text-sm font-bold text-cyan-400 w-16 text-right">
                    {data.daily_study_goal_hours} hrs/day
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">Realistic targets build long-term consistency.</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                <label className="block text-xs font-semibold text-slate-300">Preferred Study Schedule</label>
                <select
                  value={data.preferred_study_time}
                  onChange={(e) => setData((p) => ({ ...p, preferred_study_time: e.target.value }))}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="morning">Early Morning (5 AM - 9 AM)</option>
                  <option value="afternoon">Afternoon (12 PM - 4 PM)</option>
                  <option value="evening">Evening (5 PM - 9 PM)</option>
                  <option value="night">Night Owl (10 PM - 2 AM)</option>
                </select>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                <label className="block text-xs font-semibold text-slate-300">Target Wake-Up Time</label>
                <input
                  type="text"
                  value={data.wake_up_time}
                  onChange={(e) => setData((p) => ({ ...p, wake_up_time: e.target.value }))}
                  placeholder="e.g. 06:00 AM"
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                <label className="block text-xs font-semibold text-slate-300">Break Schedule</label>
                <input
                  type="text"
                  value={data.break_time}
                  onChange={(e) => setData((p) => ({ ...p, break_time: e.target.value }))}
                  placeholder="e.g. 10 mins after 50 mins session"
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          </div>
        )

      // ── STEP 6: Dashboard Setup ──
      case 6:
        return (
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-bold text-white">Customize Your Dashboard Widgets</h2>
              <p className="text-xs text-slate-400">Select which widgets appear on your command center. You can reorder or toggle them anytime.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ALL_WIDGETS.map((w) => {
                const isSelected = data.selected_widgets.includes(w.key)
                return (
                  <button
                    key={w.key}
                    type="button"
                    onClick={() => toggleWidget(w.key)}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-300 shadow-sm'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xl">{w.icon}</span>
                      <CheckCircle2 className={`w-4 h-4 ${isSelected ? 'text-cyan-400' : 'text-slate-700'}`} />
                    </div>
                    <p className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-slate-300'}`}>{w.label}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{w.desc}</p>
                  </button>
                )
              })}
            </div>
          </div>
        )

      // ── STEP 7: Finish ──
      case 7:
        return (
          <div className="space-y-6 text-center py-4">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400 shadow-xl shadow-emerald-500/10">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Your personal StudyHub is ready!
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
                We've configured your workspace based on your academic path, goals, and daily focus targets.
              </p>
            </div>

            {/* Setup Summary Card */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-left max-w-md mx-auto space-y-2.5 text-xs text-slate-300">
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Student Name:</span>
                <span className="font-semibold text-white">{data.display_name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Education Track:</span>
                <span className="font-semibold text-cyan-400 capitalize">{data.education_type}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Active Goals:</span>
                <span className="font-semibold text-white">{data.goals.length} Goals</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Subjects Added:</span>
                <span className="font-semibold text-white">{data.subjects.length} Subjects</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Daily Study Target:</span>
                <span className="font-semibold text-emerald-400">{data.daily_study_goal_hours} Hours / Day</span>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-[#090b10] text-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-2xl bg-[#111420] border border-slate-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Step Progress Bar */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold text-cyan-400">
              Step {currentStep} of 7 — {STEPS[currentStep - 1].title}
            </span>
            <button
              type="button"
              onClick={handleSkip}
              className="text-slate-500 hover:text-slate-300 text-xs transition-colors"
            >
              Skip setup
            </button>
          </div>

          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300 rounded-full"
              style={{ width: `${(currentStep / 7) * 100}%` }}
            />
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
            {error}
          </div>
        )}

        {/* Step Content */}
        <div className="min-h-[340px]">{renderStep()}</div>

        {/* Action Controls */}
        <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              disabled={saving}
              className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-all flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          ) : (
            <div />
          )}

          <button
            type="button"
            onClick={handleNext}
            disabled={saving}
            className="py-2.5 px-6 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-600/25 transition-all flex items-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Launching...</span>
              </>
            ) : currentStep === 7 ? (
              <>
                <span>Launch My Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <>
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
