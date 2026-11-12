import Link from 'next/link'
import { BookOpen, GraduationCap, Target, CheckCircle2, ArrowLeft, ArrowRight } from 'lucide-react'

export const metadata = {
  title: 'How to Prepare for Competitive Examinations | StudyHub Pro',
  description:
    'A strategic guide for competitive examinations: backward syllabus planning, revision cycles, mock exam diagnostics, and mental stamina.',
  openGraph: {
    title: 'How to Prepare for Competitive Examinations | StudyHub Pro',
    description: 'Learn backward syllabus planning, revision cycles, and mock test diagnostics.',
    type: 'article',
  },
  alternates: {
    canonical: 'https://silent-dream-b9be.surendrasingh43219.workers.dev/guides/competitive-exam-preparation',
  },
}

export default function CompetitiveExamGuidePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'How to Prepare for Competitive Examinations: Strategy, Syllabus & Mindset',
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
            <span className="text-rose-400 font-mono uppercase bg-rose-500/10 px-2.5 py-1 rounded-md border border-rose-500/20">
              Exam Strategy
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">11 min read</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">Published November 2026</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            How to Prepare for Competitive Examinations: Strategy & Mindset
          </h1>

          <p className="text-base text-slate-300 leading-relaxed">
            Competitive examinations test speed, accuracy, and emotional resilience under pressure as much as raw intellect. Here is the blueprint to outpace the competition.
          </p>
        </header>

        <article className="prose prose-invert max-w-none space-y-8 text-sm leading-relaxed text-slate-300">
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white tracking-tight">
              1. Backward Syllabus Mapping
            </h2>
            <p>
              Never start exam preparation on page 1 of an enormous textbook without knowing the finish line. Count the exact number of calendar days between today and exam day. Subtract a mandatory <strong>30-day final revision and mock test window</strong>. Divide the remaining syllabus topics by the available weeks.
            </p>
            <p>
              This gives you your non-negotiable weekly target rate. If you fall behind schedule, you recognize it instantly rather than panicking two weeks before the test.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white tracking-tight">
              2. The 80/20 Analysis of Past Year Papers (PYQs)
            </h2>
            <p>
              In almost every competitive exam (state civil services, engineering, banking, defense, or graduate entrance tests), roughly 20% of the syllabus sub-topics yield 70–80% of the exam questions.
            </p>
            <p>
              Before reading a new textbook chapter from the <Link href="/library" className="text-cyan-400 underline">StudyHub Library</Link>, inspect the past 10 years of exam papers for that specific subject. Notice recurring themes, problem formulations, and traps set by question designers.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white tracking-tight">
              3. Diagnostic Error Logging
            </h2>
            <p>
              Taking mock exams without rigorous post-exam error analysis is a complete waste of time. After every mock test, maintain an error ledger categorizing mistakes into three groups:
            </p>
            <ul className="space-y-2 list-disc pl-5">
              <li><strong className="text-white">Knowledge Gap:</strong> Did not know the concept or formula (requires targeted re-study).</li>
              <li><strong className="text-white">Calculation / Misread Error:</strong> Rushed the question, misread a negative sign or unit (requires pacing drills).</li>
              <li><strong className="text-white">Time Management Trap:</strong> Spent 6 minutes on an unsolvable question (requires discipline to skip).</li>
            </ul>
          </section>
        </article>

        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="font-bold text-white text-base">Plan Your Exams on StudyHub Pro</div>
            <p className="text-xs text-slate-400">Add upcoming exam dates, monitor countdowns, and track tasks.</p>
          </div>
          <Link
            href="/signup"
            className="py-2.5 px-5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl shadow-md transition-all whitespace-nowrap"
          >
            Create Your Plan Free &rarr;
          </Link>
        </div>
      </main>
    </div>
  )
}
