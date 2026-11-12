import { Suspense } from 'react'
import Link from 'next/link'
import { OtpVerificationForm } from '@/components/auth/OtpVerificationForm'
import { BookOpen, ShieldCheck } from 'lucide-react'

export const metadata = {
  title: 'Verify Your Email | StudyHub Pro',
  description: 'Enter your 6-digit verification code to activate your private StudyHub account.',
}

export default function VerifyOtpPage() {
  return (
    <div className="min-h-screen bg-[#0c0d14] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2.5 text-cyan-500 font-bold text-2xl tracking-tight">
          <div className="w-10 h-10 rounded-xl bg-cyan-600/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <BookOpen className="w-6 h-6" />
          </div>
          <span className="text-white">Study<span className="text-cyan-400">Hub</span></span>
        </Link>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#141724] py-8 px-6 sm:px-8 shadow-xl border border-slate-800 rounded-2xl">
          <Suspense fallback={<div className="text-center py-8 text-xs text-slate-400">Loading verification...</div>}>
            <OtpVerificationForm />
          </Suspense>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Strict end-to-end data isolation with Supabase RLS</span>
        </div>
      </div>
    </div>
  )
}
