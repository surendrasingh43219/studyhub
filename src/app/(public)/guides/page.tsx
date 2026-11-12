import Link from 'next/link'
import {
  BookOpen,
  Calendar,
  Clock,
  Target,
  GraduationCap,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Brain,
  CheckCircle2,
} from 'lucide-react'

export const metadata = {
  title: 'Study Planning & Academic Success Guides | StudyHub Pro',
  description:
    'Evidence-based study planning guides, timetable templates, exam preparation techniques, and productivity strategies for high-performing students.',
  openGraph: {
    title: 'Study Planning & Academic Success Guides | StudyHub Pro',
    description:
      'Evidence-based study planning guides, timetable templates, and productivity strategies.',
    type: 'website',
  },
}

const GUIDES = [
  {
    slug: 'daily-study-timetable',
    title: 'How to Create an Unbeatable Daily Study Timetable',
    description:
      'Learn the science of circadian rhythms, ultradian focus blocks, and time-boxing to build a realistic daily study timetable that you can actually stick to.',
    category: 'Time Management',
    readTime: '8 min read',
    icon: Calendar,
    color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
  },
  {
    slug: 'track-study-hours',
    title: 'How to Track Study Hours Effectively for Academic Success',
    description:
      'Discover why passive tracking fails, how to measure high-retention deep work vs shallow study, and the exact metrics needed to measure real progress.',
    category: 'Study Analytics',
    readTime: '6 min read',
    icon: Clock,
    color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  },
  {
    slug: 'competitive-exam-preparation',
    title: 'How to Prepare for Competitive Examinations: Strategy & Mindset',
    description:
      'A comprehensive roadmap for government, entrance, and competitive exams. Learn backward syllabus planning, revision cycles, and mock test diagnostic analysis.',
    category: 'Exam Strategy',
    readTime: '11 min read',
    icon: GraduationCap,
    color: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
  },
  {
    slug: 'study-goals-guide',
    title: 'How to Set and Achieve SMART Study Goals That Stick',
    description:
      'Transform vague academic wishes into actionable daily and weekly milestones using the SMART framework tailored specifically for college and school curricula.',
    category: 'Goal Setting',
    readTime: '7 min read',
    icon: Target,
    color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  },
  {
    slug: 'study-productivity',
    title: '10 Proven Methods to Improve Study Productivity and Deep Focus',
    description:
      'Overcome cognitive fatigue, digital distractions, and procrastination with research-backed focus strategies, Pomodoro intervals, and environmental design.',
    category: 'Productivity',
    readTime: '9 min read',
    icon: TrendingUp,
    color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  },
  {
    slug: 'college-assignments',
    title: 'How to Manage College Assignments & Deadlines Without All-Nighters',
    description:
      'A practical framework for breaking complex coursework, research papers, and technical labs into manageable sub-tasks with zero submission panic.',
    category: 'College Success',
    readTime: '8 min read',
    icon: BookOpen,
    color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  },
  {
    slug: 'consistent-study-habits',
    title: 'How to Build Consistent Daily Study Habits Using Habit Stacking',
    description:
      'Harness implementation intentions, habit stacking, and micro-commitments to study every single day without relying on fleeting willpower.',
    category: 'Habits & Discipline',
    readTime: '7 min read',
    icon: Brain,
    color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
  },
  {
    slug: 'personal-study-planner',
    title: 'How to Use a Personal Study Planner to Accelerate Exam Mastery',
    description:
      'Learn how to integrate digital library resources, personal notes, exam countdowns, and daily task trackers into one unified high-leverage workflow.',
    category: 'Planning Systems',
    readTime: '6 min read',
    icon: Sparkles,
    color: 'text-teal-400 bg-teal-500/10 border-teal-500/20',
  },
]

export default function GuidesIndexPage() {
  return (
    <div className="min-h-screen bg-[#0c0d14] text-slate-100 flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-800/80 bg-[#0c0d14]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 font-bold text-xl tracking-tight">
            <div className="w-9 h-9 rounded-xl bg-cyan-600/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <span>Study<span className="text-cyan-400">Hub</span></span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-300">
            <Link href="/library" className="hover:text-white transition-colors">Public Library</Link>
            <Link href="/guides" className="text-cyan-400 font-semibold">Study Guides</Link>
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/signin"
              className="py-2 px-3.5 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="py-2 px-4 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded-xl shadow-md shadow-cyan-600/20 transition-all flex items-center gap-1.5"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-400 font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Open Educational Learning Resources</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Practical Study Guides & Learning Science
          </h1>
          <p className="text-base text-slate-400 leading-relaxed">
            Original, human-reviewed methodologies designed to help students, competitive exam aspirants, and independent learners build disciplined study systems.
          </p>
        </div>

        {/* Guides Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {GUIDES.map((guide) => {
            const Icon = guide.icon
            return (
              <article
                key={guide.slug}
                className="group p-6 rounded-3xl bg-[#121624] border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between space-y-5 shadow-lg shadow-black/20"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/20">
                      {guide.category}
                    </span>
                    <span className="text-xs text-slate-500">{guide.readTime}</span>
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-lg font-bold text-slate-100 group-hover:text-cyan-300 transition-colors leading-snug">
                      <Link href={`/guides/${guide.slug}`}>
                        {guide.title}
                      </Link>
                    </h2>
                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                      {guide.description}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-cyan-400 group-hover:text-cyan-300">
                  <Link href={`/guides/${guide.slug}`} className="inline-flex items-center gap-1.5">
                    <span>Read full guide</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </article>
            )
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-10 bg-[#090a0f] text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-400">
            <BookOpen className="w-4 h-4 text-cyan-500" />
            <span className="font-semibold text-slate-200">StudyHub Pro</span>
            <span>&copy; {new Date().getFullYear()} All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/library" className="hover:text-slate-300 transition-colors">Public Library</Link>
            <Link href="/about" className="hover:text-slate-300 transition-colors">About</Link>
            <Link href="/terms" className="hover:text-slate-300 transition-colors">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-slate-300 transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
