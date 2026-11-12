import Link from 'next/link'
import {
  BookOpen,
  Shield,
  Clock,
  Sparkles,
  ArrowRight,
  Library,
  Flame,
  CheckCircle,
  FileText,
  Lock,
  Compass,
  GraduationCap,
  Calendar,
  Layers,
} from 'lucide-react'

export const metadata = {
  title: 'StudyHub | Personal Student Progress & Productivity Platform',
  description:
    'Your Progress. Your Goals. Your Future. A 100% free personal student command center to organize education, track daily routines, master exams, and develop skills.',
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0d14] text-slate-100 flex flex-col font-sans">
      {/* Navigation Bar */}
      <header className="border-b border-slate-800/80 bg-[#0a0d14]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 font-bold text-xl tracking-tight">
            <div className="w-9 h-9 rounded-xl bg-cyan-600/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shadow-md shadow-cyan-500/10">
              <BookOpen className="w-5 h-5" />
            </div>
            <span>Study<span className="text-cyan-400">Hub</span> <span className="text-[10px] bg-cyan-500/15 text-cyan-300 px-1.5 py-0.5 rounded font-mono font-normal">FREE</span></span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm text-slate-300">
            <Link href="/library" className="hover:text-white transition-colors">Book Library</Link>
            <Link href="/guides" className="hover:text-white transition-colors">Study Guides</Link>
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
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
              className="py-2 px-4 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 active:bg-cyan-700 rounded-xl shadow-md shadow-cyan-600/20 transition-all flex items-center gap-1.5"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative pt-20 pb-24 sm:pb-32 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(6,182,212,0.15),rgba(255,255,255,0))]" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center space-y-6">
            <div className="inline-flex items-center gap-2 py-1.5 px-3.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-semibold text-cyan-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>100% Free Forever • Personal Student Command Center</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
              Your Progress. Your Goals. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Your Future.</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
              The modern, completely free student productivity platform. Organize daily study routines, track tasks with instant tick/untick sync across all your devices, manage examination syllabi, develop career skills, and access our integrated digital book library.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
              <Link
                href="/signup"
                className="w-full sm:w-auto py-3.5 px-7 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-xl text-sm shadow-lg shadow-cyan-600/25 transition-all flex items-center justify-center gap-2"
              >
                <span>Build Your Personal StudyHub</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/library"
                className="w-full sm:w-auto py-3.5 px-7 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-200 font-semibold rounded-xl text-sm transition-all flex items-center justify-center gap-2"
              >
                <Compass className="w-4 h-4 text-cyan-400" />
                <span>Explore Book Library</span>
              </Link>
            </div>

            <div className="pt-10 flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>100% Free & Open Access</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-cyan-400" />
                <span>Strict Supabase RLS Privacy</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-400" />
                <span>PDF & EPUB In-Browser Reader</span>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Grid */}
        <section id="features" className="py-20 border-t border-slate-800/80 bg-[#0d101a]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
              <h2 className="text-3xl font-bold tracking-tight text-white">
                Everything You Need for Academic Excellence
              </h2>
              <p className="text-sm text-slate-400">
                Designed for students, competitive exam aspirants, and independent learners who demand distraction-free productivity.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="p-7 bg-[#121624] border border-slate-800 rounded-3xl space-y-4 hover:border-slate-700 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                  <Library className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Open Digital Library</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Browse by Subject &gt; Class/Level &gt; Book. Read PDF and EPUB files online with search, bookmarks, highlights, and text-to-speech without paywalls.
                </p>
                <Link href="/library" className="inline-flex items-center gap-1.5 text-xs text-cyan-400 font-semibold hover:underline">
                  <span>Browse catalog</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Feature 2 */}
              <div className="p-7 bg-[#121624] border border-slate-800 rounded-3xl space-y-4 hover:border-slate-700 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                  <Flame className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Personal Study Dashboard</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Your private mission control with daily study streaks, exam countdowns, goal progress, and drag-and-drop customizable widgets strictly protected by RLS.
                </p>
                <Link href="/signup" className="inline-flex items-center gap-1.5 text-xs text-purple-400 font-semibold hover:underline">
                  <span>Create dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Feature 3 */}
              <div className="p-7 bg-[#121624] border border-slate-800 rounded-3xl space-y-4 hover:border-slate-700 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                  <Clock className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Deep Focus Study Tools</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Customizable Pomodoro focus timers, distraction-free fullscreen mode, synthesized ambient acoustic noise (brown noise, gentle rain), and AI study assistance.
                </p>
                <Link href="/signup" className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-semibold hover:underline">
                  <span>Explore tools</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Study Guides Teaser Section */}
        <section className="py-20 border-t border-slate-800/80 bg-[#0a0d14]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="space-y-2">
                <div className="text-xs font-mono font-semibold uppercase text-cyan-400 tracking-wider">
                  LEARNING SCIENCE & METHODOLOGY
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white">
                  Practical Academic Success Guides
                </h2>
                <p className="text-xs text-slate-400 max-w-xl">
                  Original, human-reviewed study planning strategies to optimize retention and exam performance.
                </p>
              </div>
              <Link
                href="/guides"
                className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-400 hover:text-cyan-300"
              >
                <span>View all 8 study guides</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-[#121624] border border-slate-800 space-y-3">
                <span className="text-[10px] font-mono uppercase bg-cyan-500/10 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/20">
                  Timetable Design
                </span>
                <h3 className="font-bold text-white text-sm">
                  <Link href="/guides/daily-study-timetable" className="hover:text-cyan-400 transition-colors">
                    How to Create an Unbeatable Daily Study Timetable
                  </Link>
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Circadian rhythm alignment, ultradian focus blocks, and time-boxing methods that prevent burnout.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#121624] border border-slate-800 space-y-3">
                <span className="text-[10px] font-mono uppercase bg-blue-500/10 text-blue-300 px-2 py-0.5 rounded border border-blue-500/20">
                  Analytics
                </span>
                <h3 className="font-bold text-white text-sm">
                  <Link href="/guides/track-study-hours" className="hover:text-cyan-400 transition-colors">
                    How to Track Study Hours Effectively for Academic Success
                  </Link>
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Distinguishing deep work from passive desk time and building high-retention study habits.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#121624] border border-slate-800 space-y-3">
                <span className="text-[10px] font-mono uppercase bg-rose-500/10 text-rose-300 px-2 py-0.5 rounded border border-rose-500/20">
                  Exam Strategy
                </span>
                <h3 className="font-bold text-white text-sm">
                  <Link href="/guides/competitive-exam-preparation" className="hover:text-cyan-400 transition-colors">
                    How to Prepare for Competitive Examinations
                  </Link>
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Backward syllabus planning, previous year question 80/20 analysis, and diagnostic mock test ledgers.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Security & RLS Gate */}
        <section id="security" className="py-20 border-t border-slate-800/80 bg-[#0d101a]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <div className="w-14 h-14 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto">
              <Lock className="w-7 h-7" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-white">
              Strict User Privacy & Supabase Row Level Security
            </h2>
            <p className="text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Every private user table is strictly isolated via PostgreSQL Row-Level Security (<code className="text-cyan-400 bg-slate-900 px-2 py-0.5 rounded">auth.uid() = user_id</code>). No user can query or intercept another scholar&apos;s personal notes, study records, or goals.
            </p>
            <div className="pt-4">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 py-3 px-6 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs rounded-xl shadow-md transition-all"
              >
                <span>Join StudyHub Today</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-10 bg-[#07090e] text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-400">
            <BookOpen className="w-4 h-4 text-cyan-500" />
            <span className="font-semibold text-slate-200">StudyHub Pro</span>
            <span>&copy; {new Date().getFullYear()} All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/library" className="hover:text-slate-300 transition-colors">Public Library</Link>
            <Link href="/guides" className="hover:text-slate-300 transition-colors">Study Guides</Link>
            <Link href="/about" className="hover:text-slate-300 transition-colors">About</Link>
            <Link href="/contact" className="hover:text-slate-300 transition-colors">Contact</Link>
            <Link href="/terms" className="hover:text-slate-300 transition-colors">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-slate-300 transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
