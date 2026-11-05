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
} from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0c0d14] text-slate-100 flex flex-col">
      {/* Navigation Bar */}
      <header className="border-b border-slate-800/80 bg-[#0c0d14]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 font-bold text-xl tracking-tight">
            <div className="w-9 h-9 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-500">
              <BookOpen className="w-5 h-5" />
            </div>
            <span>Study<span className="text-blue-500">Hub</span></span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm text-slate-300">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#library" className="hover:text-white transition-colors">Digital Library</a>
            <a href="#security" className="hover:text-white transition-colors">Security</a>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/signin"
              className="py-2 px-4 text-xs font-semibold text-slate-200 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="py-2 px-4 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 rounded-xl shadow-md shadow-blue-600/20 transition-all flex items-center gap-1.5"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative pt-20 pb-24 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(59,130,246,0.15),rgba(255,255,255,0))]" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center space-y-6">
            <div className="inline-flex items-center gap-2 py-1.5 px-3.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Full-Stack Open Digital Library & Study Platform</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
              Master Your Exams with an <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Open Digital Library</span> & Focus Tools
            </h1>

            <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Access thousands of open-source textbooks and exam notes, track your daily study routines on a private dashboard, and study with advanced Pomodoro timers and flashcards.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
              <Link
                href="/signup"
                className="w-full sm:w-auto py-3.5 px-7 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-sm shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center gap-2"
              >
                <span>Create Your Free Account</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/signin"
                className="w-full sm:w-auto py-3.5 px-7 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold rounded-xl text-sm transition-all"
              >
                Explore Dashboard
              </Link>
            </div>

            <div className="pt-10 flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>100% Free & Open Access</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-400" />
                <span>Strict Supabase RLS Isolation</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-400" />
                <span>PDF & EPUB In-Browser Reader</span>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-20 border-t border-slate-800 bg-[#0f111a]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
              <h2 className="text-3xl font-bold tracking-tight text-white">
                Everything You Need for Peak Study Performance
              </h2>
              <p className="text-sm text-slate-400">
                Designed for students, competitive exam aspirants, and developers who demand distraction-free productivity.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="p-6 bg-[#141724] border border-slate-800 rounded-2xl space-y-4 hover:border-slate-700 transition-all">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                  <Library className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-white">Open Digital Library</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Browse by Subject &gt; Class/Level &gt; Book. Read PDF and EPUB files online with search, annotations, highlights, bookmarks, and text-to-speech.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="p-6 bg-[#141724] border border-slate-800 rounded-2xl space-y-4 hover:border-slate-700 transition-all">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                  <Flame className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-white">Personal Study Dashboard</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Your private mission control with daily study streaks, exam countdowns, goal progress, and drag-and-drop customizable widgets.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="p-6 bg-[#141724] border border-slate-800 rounded-2xl space-y-4 hover:border-slate-700 transition-all">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                  <Clock className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-white">Deep Focus Study Tools</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Customizable Pomodoro timers, spaced repetition flashcards (SM-2), distraction-free focus mode, and ambient study sounds.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Security & RLS Gate */}
        <section id="security" className="py-20 border-t border-slate-800">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <div className="w-14 h-14 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto">
              <Lock className="w-7 h-7" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-white">
              Strict Data Isolation & Mandatory Gate
            </h2>
            <p className="text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Every user table is enforced with PostgreSQL Row-Level Security (<code className="text-blue-400 bg-slate-900 px-2 py-0.5 rounded">auth.uid() = user_id</code>). No user can ever access another user&apos;s private notes, study history, or bookmarks. All book storage files use expiring signed URLs.
            </p>
            <div className="pt-4">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 py-3 px-6 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl shadow-md transition-all"
              >
                <span>Join StudyHub Today</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-10 bg-[#090a0f] text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-300">
            <BookOpen className="w-4 h-4 text-blue-500" />
            <span className="font-semibold">StudyHub</span>
            <span>&copy; {new Date().getFullYear()} All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/terms" className="hover:text-slate-300 transition-colors">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-slate-300 transition-colors">Privacy Policy</Link>
            <Link href="/signin" className="hover:text-slate-300 transition-colors">Sign In</Link>
            <Link href="/signup" className="text-blue-400 hover:text-blue-300 transition-colors">Sign Up</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
