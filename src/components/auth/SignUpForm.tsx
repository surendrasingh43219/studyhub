'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signUpSchema, type SignUpInput } from '@/lib/validations/auth'
import { PasswordStrengthMeter } from '@/components/auth/PasswordStrengthMeter'
import { OtpVerificationForm } from '@/components/auth/OtpVerificationForm'
import { Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react'

export function SignUpForm() {
  const router = useRouter()

  const [formData, setFormData] = useState<SignUpInput>({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  })

  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [serverError, setServerError] = useState<string | null>(null)
  const [pendingVerificationEmail, setPendingVerificationEmail] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    setServerError(null)

    const validation = signUpSchema.safeParse(formData)
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {}
      validation.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0].toString()] = err.message
      })
      setErrors(fieldErrors)
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          username: formData.username.toLowerCase(),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Could not complete registration.')
      }

      // If user requires 6-digit OTP verification (standard Supabase email verification flow)
      if (data.requiresVerification || !data.user) {
        setPendingVerificationEmail(formData.email.trim().toLowerCase())
      } else {
        // Direct session established
        router.push('/onboarding')
        router.refresh()
      }
    } catch (err: any) {
      setServerError(err.message || 'Could not complete registration. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // If waiting for OTP code verification, render the 6-digit verification screen
  if (pendingVerificationEmail) {
    return <OtpVerificationForm initialEmail={pendingVerificationEmail} />
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {serverError && (
        <div className="p-3 bg-red-950/40 border border-red-800/60 rounded-xl flex items-start gap-3 text-red-200 text-xs">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <span>{serverError}</span>
        </div>
      )}

      {/* Full Name */}
      <div>
        <label className="block text-xs font-medium text-slate-300 mb-1.5">Full Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g. Alex Sharma"
          disabled={loading}
          autoComplete="name"
          className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all disabled:opacity-50"
        />
        {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
      </div>

      {/* Unique Username */}
      <div>
        <label className="block text-xs font-medium text-slate-300 mb-1.5">
          Unique Username
        </label>
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm">@</span>
          <input
            type="text"
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value.toLowerCase().trim() })
            }
            placeholder="username"
            disabled={loading}
            autoComplete="username"
            className="w-full pl-8 pr-3.5 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all disabled:opacity-50"
          />
        </div>
        {errors.username && <p className="text-xs text-red-400 mt-1">{errors.username}</p>}
      </div>

      {/* Email Address */}
      <div>
        <label className="block text-xs font-medium text-slate-300 mb-1.5">Email Address</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="you@example.com"
          disabled={loading}
          autoComplete="email"
          className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all disabled:opacity-50"
        />
        {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
      </div>

      {/* Password with Strength Meter */}
      <div>
        <label className="block text-xs font-medium text-slate-300 mb-1.5">Password</label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            placeholder="Min. 8 characters"
            disabled={loading}
            autoComplete="new-password"
            className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all pr-10 disabled:opacity-50"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        <PasswordStrengthMeter password={formData.password} />
        {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password}</p>}
      </div>

      {/* Confirm Password */}
      <div>
        <label className="block text-xs font-medium text-slate-300 mb-1.5">Confirm Password</label>
        <input
          type={showPassword ? 'text' : 'password'}
          value={formData.confirmPassword}
          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          placeholder="Re-type password"
          disabled={loading}
          autoComplete="new-password"
          className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all disabled:opacity-50"
        />
        {errors.confirmPassword && (
          <p className="text-xs text-red-400 mt-1">{errors.confirmPassword}</p>
        )}
      </div>

      {/* Agree to Terms */}
      <div className="flex items-start gap-2.5 pt-1">
        <input
          type="checkbox"
          id="agreeToTerms"
          checked={formData.agreeToTerms}
          onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
          className="w-4 h-4 mt-0.5 rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-cyan-400 focus:ring-offset-slate-900"
        />
        <label htmlFor="agreeToTerms" className="text-xs text-slate-400 leading-normal cursor-pointer">
          I agree to the{' '}
          <Link href="/terms" target="_blank" className="text-cyan-400 hover:underline">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy" target="_blank" className="text-cyan-400 hover:underline">
            Privacy Policy
          </Link>
          .
        </label>
      </div>
      {errors.agreeToTerms && (
        <p className="text-xs text-red-400">{errors.agreeToTerms}</p>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 px-4 bg-cyan-600 hover:bg-cyan-500 active:bg-cyan-700 text-white font-medium rounded-xl text-sm shadow-md shadow-cyan-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Sending verification code...</span>
          </>
        ) : (
          <span>Create Free Account</span>
        )}
      </button>
    </form>
  )
}
