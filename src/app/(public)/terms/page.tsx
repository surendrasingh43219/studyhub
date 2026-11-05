import Link from 'next/link'
import { ShieldCheck, BookOpen, ArrowLeft } from 'lucide-react'

export const metadata = {
  title: 'Terms of Service | StudyHub',
  description: 'Terms and conditions for using StudyHub and its open-source digital library.',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <div className="border-b border-slate-800 pb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white">Terms of Service</h1>
              <p className="text-sm text-slate-400">Effective Date: November 2, 2026</p>
            </div>
          </div>
          <p className="text-slate-300">
            Welcome to StudyHub. By creating an account or accessing our platform, you agree to comply with and be bound by the following terms.
          </p>
        </div>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-white">1. Platform Purpose & Open-Source Library</h2>
          <p className="text-slate-400 leading-relaxed text-sm">
            StudyHub provides personalized study workflows, productivity utilities, and a community-driven digital repository. All educational material shared in our library must strictly adhere to legitimate open licensing (Public Domain, Creative Commons, MIT, Apache, or verified explicit permission from the original copyright holder).
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-white">2. User Accounts & Security</h2>
          <p className="text-slate-400 leading-relaxed text-sm">
            You must provide accurate and verifiable registration details. You are solely responsible for maintaining the confidentiality of your credentials. Access attempts exceeding 5 failed attempts are locked automatically to safeguard against brute-force attacks.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-white">3. Upload Policy & Copyright Guarantee</h2>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
            <h3 className="text-white font-medium text-sm flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-cyan-400" /> Mandatory Uploader Certification
            </h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Whenever you upload a PDF or EPUB document, you explicitly warrant that you possess the full copyright or hold an active license permitting public redistribution. Uploading pirated, proprietary textbooks or copyrighted commercial publications without authorization is strictly prohibited and results in immediate account suspension.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-white">4. DMCA Notice and Takedown Procedure</h2>
          <p className="text-slate-400 leading-relaxed text-sm">
            StudyHub complies with the Digital Millennium Copyright Act. If you believe your copyrighted work has been improperly uploaded to our library, submit an immediate report using the in-app &apos;Report Document&apos; button or contact our designated copyright agent at <span className="text-cyan-400">dmca@studyhub.local</span>. We promptly investigate and remove infringing materials within 24 hours.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-white">5. Account Termination</h2>
          <p className="text-slate-400 leading-relaxed text-sm">
            We reserve the right to suspend or terminate accounts that breach copyright agreements, execute malicious automated requests, or abuse system resources.
          </p>
        </section>

        <div className="pt-6 border-t border-slate-800 text-xs text-slate-500 flex justify-between">
          <p>© 2026 StudyHub Platform. All rights reserved.</p>
          <Link href="/privacy" className="text-cyan-400 hover:underline">
            View Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  )
}
