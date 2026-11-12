import Link from 'next/link'
import { BookOpen, Sparkles, CheckCircle2, ArrowLeft, ArrowRight } from 'lucide-react'

export const metadata = {
  title: 'How to Use a Personal Study Planner | StudyHub Pro',
  description:
    'Integrate digital library textbooks, personal notes, exam countdowns, and daily task lists into a single unified high-leverage study system.',
  openGraph: {
    title: 'How to Use a Personal Study Planner | StudyHub Pro',
    description: 'Learn how to integrate digital library books, notes, and task trackers into one unified workflow.',
    type: 'article',
  },
  alternates: {
    canonical: 'https://silent-dream-b9be.surendrasingh43219.workers.dev/guides/personal-study-planner',
  },
}

export default function PersonalStudyPlannerPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'How to Use a Personal Study Planner to Accelerate Exam Mastery',
    author: { '@type': 'Organization', name: 'StudyHub Pro Academic Research Team' },
    publisher: { '@type': 'Organization', name: 'StudyHub Pro' },
    datePublished: '2026-11-12',
  }

  return (
    <div className="min-h-screen bg-[#0c0d14] text-slate-100 flex flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header className="border-b border-slate-800/80 bg-[#0c0d14]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/guides" className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Guides</span>
          </Link>
          <Link href="/" className="flex items-center gap-2 font-bold text-lg text-white">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            <span>Study<span className="text-cyan-400">Hub</span></span>
          </Link>
          <Link href="/signup" className="text-xs py-1.5 px-3 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold shadow-sm">
            Join Free
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-10">
        <header className="space-y-4 border-b border-slate-800 pb-8">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-teal-400 font-mono uppercase bg-teal-500/10 px-2.5 py-1 rounded-md border border-teal-500/20">
              Planning Systems
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">6 min read</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">Published November 2026</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            How to Use a Personal Study Planner to Accelerate Exam Mastery
          </h1>

          <p className="text-base text-slate-300 leading-relaxed">
            Scattered notes, lost PDF bookmarks, and forgotten deadlines drain your cognitive capacity. Here is how a central mission control elevates your study efficiency.
          </p>
        </header>

        <article className="prose prose-invert max-w-none space-y-6 text-sm leading-relaxed text-slate-300">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white tracking-tight">1. The Single Source of Truth</h2>
            <p>Every minute spent looking for a missing PDF file or trying to remember which textbook chapter you left off on is wasted energy. Centralize your reading bookshelf, bookmarks, and notes in one unified hub like StudyHub Pro.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white tracking-tight">2. Dynamic Widget Customization</h2>
            <p>Different phases of your academic journey demand different metrics. During exam weeks, prioritize countdown timers and priority task checklists. During semester exploration, surface reading progress and notes widgets.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white tracking-tight">3. Strict Data Isolation & Privacy</h2>
            <p>Your academic struggles, weak topics, exam schedules, and personal notes are your private business. With StudyHub&apos;s PostgreSQL Row Level Security, your personal study logs remain strictly confidential and completely isolated.</p>
          </section>
        </article>

        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="font-bold text-white text-base">Experience StudyHub Pro</div>
            <p className="text-xs text-slate-400">Free open-source digital library and customizable student dashboard.</p>
          </div>
          <Link
            href="/signup"
            className="py-2.5 px-5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl shadow-md transition-all whitespace-nowrap"
          >
            Launch Your Planner &rarr;
          </Link>
        </div>
      </main>
    </div>
  )
}
