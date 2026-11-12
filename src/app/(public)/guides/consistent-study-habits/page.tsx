import Link from 'next/link'
import { BookOpen, Brain, CheckCircle2, ArrowLeft, ArrowRight } from 'lucide-react'

export const metadata = {
  title: 'How to Build Consistent Daily Study Habits | StudyHub Pro',
  description:
    'Harness behavioral psychology, habit stacking, micro-commitments, and implementation intentions to study every day without relying on willpower.',
  openGraph: {
    title: 'How to Build Consistent Daily Study Habits',
    description: 'Learn how to form automatic study habits that survive low-motivation days.',
    type: 'article',
  },
  alternates: {
    canonical: 'https://silent-dream-b9be.surendrasingh43219.workers.dev/guides/consistent-study-habits',
  },
}

export default function ConsistentStudyHabitsPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'How to Build Consistent Daily Study Habits Using Habit Stacking',
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
            <span className="text-indigo-400 font-mono uppercase bg-indigo-500/10 px-2.5 py-1 rounded-md border border-indigo-500/20">
              Habits & Discipline
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">7 min read</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">Published November 2026</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            How to Build Consistent Daily Study Habits That Stick
          </h1>

          <p className="text-base text-slate-300 leading-relaxed">
            Willpower is a depletable biological resource. Elite students build automatic environmental habits so that sitting down to study requires zero debate.
          </p>
        </header>

        <article className="prose prose-invert max-w-none space-y-6 text-sm leading-relaxed text-slate-300">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white tracking-tight">1. Habit Stacking Formulas</h2>
            <p>Attach your study routine to an established biological anchor: &ldquo;Immediately after I finish my morning coffee, I will open StudyHub and complete 1 Pomodoro session of Calculus.&rdquo; This replaces vague motivation with an automated cognitive cue.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white tracking-tight">2. The 5-Minute Micro-Commitment</h2>
            <p>On days when motivation is near zero, promise yourself just 5 minutes of study. The psychological barrier to starting is 10 times higher than the barrier to continuing once in motion. 80% of the time, you will keep going past the 5-minute mark.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white tracking-tight">3. Never Miss Twice</h2>
            <p>Missing a day is an accident; missing two days in a row is the start of a new, negative habit. If an emergency prevents you from studying for 4 hours, do 15 minutes of review so you preserve your behavioral identity as a disciplined scholar.</p>
          </section>
        </article>

        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="font-bold text-white text-base">Build Your Study Streak on StudyHub</div>
            <p className="text-xs text-slate-400">Track daily consistency and earn study achievement badges.</p>
          </div>
          <Link
            href="/signup"
            className="py-2.5 px-5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl shadow-md transition-all whitespace-nowrap"
          >
            Start Your Streak &rarr;
          </Link>
        </div>
      </main>
    </div>
  )
}
