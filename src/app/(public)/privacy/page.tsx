import Link from 'next/link'
import { Lock, Database, UserCheck, ArrowLeft, Trash2, Download } from 'lucide-react'

export const metadata = {
  title: 'Privacy Policy | StudyHub',
  description: 'How StudyHub safeguards your study telemetry, personal notes, and private files.',
}

export default function PrivacyPage() {
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
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
              <Lock className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white">Privacy Policy</h1>
              <p className="text-sm text-slate-400">Last Revised: November 2, 2026</p>
            </div>
          </div>
          <p className="text-slate-300">
            At StudyHub, your privacy and private study notes are our highest priority. We do not sell your personal information or monitor your private study material.
          </p>
        </div>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-cyan-400" /> 1. Row-Level Security & Strict Data Isolation
          </h2>
          <p className="text-slate-400 leading-relaxed text-sm">
            All user data—including study sessions, bookmarks, private highlights, notes, flashcards, and personal study timers—is strictly partitioned via PostgreSQL Row Level Security (RLS). Every query enforces <code className="bg-slate-900 px-2 py-0.5 rounded text-cyan-400 text-xs">auth.uid() = user_id</code> at the database engine level. No user or third party can query or intercept your private records, even by guessing IDs.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Lock className="w-5 h-5 text-purple-400" /> 2. Secure File Access via Expiring Signed URLs
          </h2>
          <p className="text-slate-400 leading-relaxed text-sm">
            All reading material and personal document uploads are stored in protected storage buckets. No raw public bucket links exist. Every reading or download request dynamically produces an authenticated signed URL with a maximum time-to-live of 60 minutes.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-emerald-400" /> 3. GDPR Rights: Export and Right to be Forgotten
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center gap-2 text-white font-medium text-sm mb-2">
                <Download className="w-4 h-4 text-emerald-400" /> Data Portability (Export)
              </div>
              <p className="text-slate-400 text-xs">
                Under Profile Settings, you can download a complete JSON and Markdown bundle of all your personal notes, flashcards, and study metrics at any time.
              </p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center gap-2 text-white font-medium text-sm mb-2">
                <Trash2 className="w-4 h-4 text-rose-400" /> Account Deletion
              </div>
              <p className="text-slate-400 text-xs">
                You can permanently delete your account and all associated telemetry. Database cascades immediately purge your personal files, notes, and activity logs.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-white">4. Cookies & Authentication Tokens</h2>
          <p className="text-slate-400 leading-relaxed text-sm">
            We use secure, httpOnly, same-site session cookies strictly for authentication and session refresh. We do not use third-party tracking pixels or ad networks.
          </p>
        </section>

        <div className="pt-6 border-t border-slate-800 text-xs text-slate-500 flex justify-between">
          <p>© 2026 StudyHub Platform. All rights reserved.</p>
          <Link href="/terms" className="text-cyan-400 hover:underline">
            View Terms of Service
          </Link>
        </div>
      </div>
    </div>
  )
}
