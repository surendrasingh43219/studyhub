import Link from 'next/link'
import { BookOpen, CheckCircle2, ArrowLeft, ArrowRight } from 'lucide-react'

export const metadata = {
  title: 'How to Manage College Assignments Without Stress | StudyHub Pro',
  description:
    'A tactical framework to organize coursework, laboratory reports, and research projects across multiple semester classes with zero deadline panic.',
  openGraph: {
    title: 'How to Manage College Assignments Without Stress',
    description: 'Learn how to deconstruct complex coursework and balance multiple semester deadlines.',
    type: 'article',
  },
  alternates: {
    canonical: 'https://silent-dream-b9be.surendrasingh43219.workers.dev/guides/college-assignments',
  },
}

export default function CollegeAssignmentsPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'How to Manage College Assignments & Deadlines Without All-Nighters',
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
            <span className="text-purple-400 font-mono uppercase bg-purple-500/10 px-2.5 py-1 rounded-md border border-purple-500/20">
              College Success
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">8 min read</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">Published November 2026</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            How to Manage College Assignments & Deadlines Without All-Nighters
          </h1>

          <p className="text-base text-slate-300 leading-relaxed">
            All-nighters before project submission deadlines destroy cognitive functioning for days. Here is the engineering approach to academic project delivery.
          </p>
        </header>

        <article className="prose prose-invert max-w-none space-y-6 text-sm leading-relaxed text-slate-300">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white tracking-tight">1. Day 1 Assignment Triage</h2>
            <p>The day a professor announces a major paper or project, spend 15 minutes reviewing the prompt and rubric. Outline the required sections, cite 3 preliminary references, and write a rough opening hypothesis. This eliminates the paralyzing dread of a blank page weeks later.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white tracking-tight">2. The 3-Draft Writing Method</h2>
            <p>Never attempt to write and edit simultaneously. Produce an ugly first draft quickly without editing. In draft two, restructure logical arguments. In draft three, polish grammar, formatting, and bibliographic citations.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white tracking-tight">3. Subject Categorization</h2>
            <p>On StudyHub, you can organize your dashboard by college subjects, setting custom target hours and attaching reading materials directly from the <Link href="/library" className="text-cyan-400 underline">digital library</Link>.</p>
          </section>
        </article>

        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="font-bold text-white text-base">Organize Your Semester on StudyHub</div>
            <p className="text-xs text-slate-400">Track subjects, task deadlines, and project milestones.</p>
          </div>
          <Link
            href="/signup"
            className="py-2.5 px-5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl shadow-md transition-all whitespace-nowrap"
          >
            Get Started Free &rarr;
          </Link>
        </div>
      </main>
    </div>
  )
}
