'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { forgotPasswordSchema } from '@/lib/validations/auth'
import { BookOpen, ArrowLeft, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const validation = forgotPasswordSchema.safeParse({ email })
    if (!validation.success) {
      setError(validation.error.errors[0]?.message || 'Please enter a valid email address')
      return
    }

    setLoading(true)
    const supabase = createClient()

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      if (resetError) throw resetError
      setSuccess(true)
    } catch (err: any) {
      setError(err.message || 'Failed to send password reset email. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0c0d14] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2.5 text-cyan-500 font-bold text-2xl tracking-tight">
          <div className="w-10 h-10 rounded-xl bg-cyan-600/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <BookOpen className="w-6 h-6" />
          </div>
          <span className="text-white">Study<span className="text-cyan-400">Hub</span></span>
        </Link>
        <h2 className="mt-6 text-2xl font-bold tracking-tight text-slate-100">
          Reset your password
        </h2>
        <p className="mt-2 text-xs text-slate-400">
          Enter your registered email address and we&apos;ll send you a secure link to reset your password.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#141724] py-8 px-6 sm:px-8 shadow-xl border border-slate-800 rounded-2xl">
          {success ? (
            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-semibold text-slate-100">Check Your Inbox</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                We sent a password reset link to <strong className="text-slate-200">{email}</strong>. Follow the instructions in the email to set a new password.
              </p>
              <Link
                href="/signin"
                className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl transition-all"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Sign In</span>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-950/40 border border-red-800/60 rounded-xl flex items-start gap-3 text-red-200 text-xs">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Registered Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  disabled={loading}
                  autoComplete="email"
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-cyan-600 hover:bg-cyan-500 active:bg-cyan-700 text-white font-medium rounded-xl text-sm shadow-md shadow-cyan-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending reset link...</span>
                  </>
                ) : (
                  <span>Send Password Reset Email</span>
                )}
              </button>

              <div className="text-center pt-2">
                <Link
                  href="/signin"
                  className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Sign In</span>
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
