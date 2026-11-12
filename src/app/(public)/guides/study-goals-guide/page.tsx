import Link from 'next/link'
import { BookOpen, Target, CheckCircle2, ArrowLeft, ArrowRight } from 'lucide-react'

export const metadata = {
  title: 'How to Set and Achieve SMART Study Goals | StudyHub Pro',
  description:
    'A practical guide to setting actionable study goals using the SMART framework, milestone breaking, and daily accountability systems.',
  openGraph: {
    title: 'How to Set and Achieve SMART Study Goals | StudyHub Pro',
    description: 'Transform vague study resolutions into actionable daily milestones that produce measurable results.',
    type: 'article',
  },
  alternates: {
    canonical: 'https://silent-dream-b9be.surendrasingh43219.workers.dev/guides/study-goals-guide',
  },
}

export default function StudyGoalsGuidePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'How to Set and Achieve SMART Study Goals',
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
            <span className="text-emerald-400 font-mono uppercase bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
              Goal Setting
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">7 min read</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">Published November 2026</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            How to Set and Achieve SMART Study Goals
          </h1>

          <p className="text-base text-slate-300 leading-relaxed">
            &ldquo;I want to study more this semester&rdquo; is a wish, not a goal. Here is how to apply the SMART goal methodology to your academic coursework.
          </p>
        </header>

        <article className="prose prose-invert max-w-none space-y-8 text-sm leading-relaxed text-slate-300">
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white tracking-tight">
              1. The Anatomy of a SMART Academic Goal
            </h2>
            <div className="space-y-3">
              <p>
                <strong className="text-cyan-400">Specific:</strong> Target a distinct sub-topic (e.g. &ldquo;Master dynamic programming memoization techniques&rdquo; instead of &ldquo;Study algorithms&rdquo;).
              </p>
              <p>
                <strong className="text-cyan-400">Measurable:</strong> Tie it to numerical metrics (e.g. &ldquo;Solve 15 LeetCode medium DP problems without looking at solutions&rdquo;).
              </p>
              <p>
                <strong className="text-cyan-400">Achievable:</strong> Match the target to your current preparation level rather than setting unreachable daily quotas.
              </p>
              <p>
                <strong className="text-cyan-400">Relevant:</strong> Verify that the topic carries weight on your upcoming examination or syllabus.
              </p>
              <p>
                <strong className="text-cyan-400">Time-Bound:</strong> Give it a strict deadline (e.g. &ldquo;Completed by Friday at 6:00 PM&rdquo;).
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white tracking-tight">
              2. Breaking 90-Day Goals into Daily Micro-Tasks
            </h2>
            <p>
              Big goals overwhelm the brain, leading to procrastination. When faced with an enormous textbook, calculate the chapters and assign 1 single chapter per 3 days. On StudyHub, you can track daily tasks directly on your private dashboard, ensuring you celebrate daily micro-wins that compound into semester-long success.
            </p>
          </section>
        </article>

        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="font-bold text-white text-base">Set and Track Goals with StudyHub Pro</div>
            <p className="text-xs text-slate-400">Personalized dashboard goals with daily progress rings.</p>
          </div>
          <Link
            href="/signup"
            className="py-2.5 px-5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl shadow-md transition-all whitespace-nowrap"
          >
            Start Free &rarr;
          </Link>
        </div>
      </main>
    </div>
  )
}
