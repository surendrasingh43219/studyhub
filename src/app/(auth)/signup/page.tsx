import Link from 'next/link'
import { SignUpForm } from '@/components/auth/SignUpForm'
import { OAuthButtons } from '@/components/auth/OAuthButtons'
import { BookOpen, Lock } from 'lucide-react'

export const metadata = {
  title: 'Sign Up | StudyHub',
  description: 'Create your free StudyHub account to access the digital library and personal study dashboard.',
}

export default function SignUpPage() {
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
          Create your StudyHub Account
        </h2>
        <p className="mt-2 text-xs text-slate-400">
          Already have an account?{' '}
          <Link href="/signin" className="text-blue-400 hover:text-blue-300 font-semibold underline-offset-4 hover:underline">
            Sign in here
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#141724] py-8 px-6 sm:px-8 shadow-xl border border-slate-800 rounded-2xl space-y-6">
          <OAuthButtons />
          <SignUpForm />
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
          <Lock className="w-3.5 h-3.5 text-blue-400" />
          <span>Private dashboard with encrypted individual storage</span>
        </div>
      </div>
    </div>
  )
}
