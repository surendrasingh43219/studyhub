import Link from 'next/link'
import { Suspense } from 'react'
import { SignInForm } from '@/components/auth/SignInForm'
import { OAuthButtons } from '@/components/auth/OAuthButtons'
import { BookOpen, ShieldCheck } from 'lucide-react'

export const metadata = {
  title: 'Sign In | StudyHub',
  description: 'Sign in to your private StudyHub dashboard, library, and focus tools.',
}

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-[#0c0d14] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2.5 text-blue-500 font-bold text-2xl tracking-tight">
          <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-500">
            <BookOpen className="w-6 h-6" />
          </div>
          <span className="text-white">Study<span className="text-blue-500">Hub</span></span>
        </Link>
        <h2 className="mt-6 text-2xl font-bold tracking-tight text-slate-100">
          Welcome back to StudyHub
        </h2>
        <p className="mt-2 text-xs text-slate-400">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-blue-400 hover:text-blue-300 font-semibold underline-offset-4 hover:underline">
            Create an account for free
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#141724] py-8 px-6 sm:px-8 shadow-xl border border-slate-800 rounded-2xl space-y-6">
          <OAuthButtons />
          <Suspense fallback={<div className="text-center py-8 text-xs text-slate-400">Loading sign in...</div>}>
            <SignInForm />
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
