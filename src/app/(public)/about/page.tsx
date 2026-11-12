import Link from 'next/link'
import { BookOpen, ShieldCheck, HeartHandshake, Sparkles, ArrowRight, Library, Users } from 'lucide-react'

export const metadata = {
  title: 'About StudyHub Pro | Open-Access Educational Mission',
  description:
    'StudyHub Pro is an open-access educational platform uniting a public digital library, evidence-based focus tools, and private personal study dashboards.',
  openGraph: {
    title: 'About StudyHub Pro | Open-Access Educational Mission',
    description: 'Learn about StudyHub Pro’s mission to democratize textbook access and provide distraction-free study tools.',
    type: 'website',
  },
  alternates: {
    canonical: 'https://silent-dream-b9be.surendrasingh43219.workers.dev/about',
  },
}

export default function AboutPage() {
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
            <Link href="/guides" className="hover:text-white transition-colors">Study Guides</Link>
            <Link href="/about" className="text-cyan-400 font-semibold">About</Link>
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
              className="py-2 px-4 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded-xl shadow-md shadow-cyan-600/20 transition-all flex items-center gap-1.5"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-12">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-400 font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Open Access Educational Mission</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Democratizing Education Through Open Access & Deep Focus
          </h1>
          <p className="text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            StudyHub Pro was created with a clear belief: every student in the world deserves access to quality educational textbooks and the focus tools needed to achieve mastery.
          </p>
        </div>

        {/* Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          <div className="p-6 rounded-3xl bg-[#121624] border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <Library className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-white">Public Digital Library</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              We catalog openly licensed textbooks, Creative Commons resources, and public-domain academic works so students never encounter financial barriers to knowledge.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#121624] border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-white">Privacy by Architecture</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              We enforce PostgreSQL Row Level Security (RLS) on all user telemetry, notes, goals, and study records. Your academic journey is entirely private.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#121624] border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-white">Learning Science</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Our tools reflect research in cognitive psychology: active recall, time-boxed Pomodoro intervals, habit formation, and synthesized acoustic focus noise.
            </p>
          </div>
        </div>

        {/* Story */}
        <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4 text-sm text-slate-300 leading-relaxed">
          <h2 className="text-xl font-bold text-white tracking-tight">Our Principles</h2>
          <p>
            StudyHub Pro rejects dark design patterns, intrusive advertising trackers, and paywalled essential curricula. The public library catalogue is freely searchable and indexable by search engines, helping students discover books for competitive examinations, university degrees, and self-taught engineering paths.
          </p>
          <p>
            When a student creates a private account, they receive a distraction-free study operating system equipped with customizable widget dashboards, countdown timers, and notes.
          </p>
        </div>

        {/* CTA */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-cyan-950/40 via-slate-900 to-slate-900 border border-cyan-500/20 text-center space-y-4">
          <h2 className="text-2xl font-bold text-white">Join the StudyHub Learning Community</h2>
          <p className="text-xs text-slate-400 max-w-lg mx-auto">
            Create your free account today and discover textbooks, focus tools, and personalized study tracking.
          </p>
          <div className="pt-2">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 py-3 px-6 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl shadow-md shadow-cyan-600/20 transition-all"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 bg-[#090a0f] text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-400">
            <BookOpen className="w-4 h-4 text-cyan-500" />
            <span className="font-semibold text-slate-200">StudyHub Pro</span>
            <span>&copy; {new Date().getFullYear()} All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/library" className="hover:text-slate-300 transition-colors">Library</Link>
            <Link href="/guides" className="hover:text-slate-300 transition-colors">Guides</Link>
            <Link href="/terms" className="hover:text-slate-300 transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-slate-300 transition-colors">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
