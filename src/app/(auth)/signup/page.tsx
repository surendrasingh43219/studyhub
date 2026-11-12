import Link from 'next/link'
import { SignUpForm } from '@/components/auth/SignUpForm'
import { OAuthButtons } from '@/components/auth/OAuthButtons'
import { AuthTabs } from '@/components/auth/AuthTabs'
import { BookOpen, ShieldCheck } from 'lucide-react'

export const metadata = {
  title: 'Sign Up | StudyHub',
  description: 'Create your free StudyHub account to access your personal student command center.',
}

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-[#0c0d14] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2.5 text-cyan-500 font-bold text-2xl tracking-tight">
          <div className="w-10 h-10 rounded-xl bg-cyan-600/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <BookOpen className="w-6 h-6" />
          </div>
          <span className="text-white">Study<span className="text-cyan-400">Hub</span> <span className="text-[10px] bg-cyan-500/15 text-cyan-300 px-1.5 py-0.5 rounded font-mono font-normal">FREE</span></span>
        </Link>
        <h2 className="mt-6 text-2xl font-bold tracking-tight text-slate-100">
          Create your Free Account
        </h2>
        <p className="mt-2 text-xs text-slate-400">
          Your personal productivity and progress tracking platform
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#141724] py-8 px-6 sm:px-8 shadow-xl border border-slate-800 rounded-2xl space-y-6">
          {/* Segmented Auth Switcher (Sign In vs Sign Up) */}
          <AuthTabs active="signup" />

          {/* Google OAuth Button */}
          <OAuthButtons />

          {/* Registration Form */}
          <SignUpForm />

          {/* Quick link to Sign In */}
          <div className="pt-2 text-center text-xs text-slate-400 border-t border-slate-800/80">
            Already have an account?{' '}
            <Link href="/signin" className="text-cyan-400 hover:text-cyan-300 font-semibold underline-offset-4 hover:underline">
              Sign In here
            </Link>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Strict end-to-end data isolation with Supabase RLS</span>
        </div>
      </div>
    </div>
  )
}
