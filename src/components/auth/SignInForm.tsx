'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { signInSchema, type SignInInput } from '@/lib/validations/auth'
import { Eye, EyeOff, Loader2, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react'

const MAX_FAILED_ATTEMPTS = 5
const LOCKOUT_DURATION_SECONDS = 60

export function SignInForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const returnTo = searchParams.get('returnTo') || '/dashboard'

  const [formData, setFormData] = useState<SignInInput>({
    email: searchParams.get('email') || '',
    password: '',
    rememberMe: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [serverError, setServerError] = useState<string | null>(null)
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Rate Limiting & Lockout State
  const [failedAttempts, setFailedAttempts] = useState(0)
  const [lockoutTimer, setLockoutTimer] = useState(0)

  useEffect(() => {
    const savedAttempts = parseInt(localStorage.getItem('studyhub_failed_attempts') || '0', 10)
    const lockoutUntil = parseInt(localStorage.getItem('studyhub_lockout_until') || '0', 10)
    const now = Date.now()

    if (lockoutUntil > now) {
      setLockoutTimer(Math.ceil((lockoutUntil - now) / 1000))
    } else {
      setFailedAttempts(savedAttempts)
    }
  }, [])

  useEffect(() => {
    if (lockoutTimer <= 0) return
    const interval = setInterval(() => {
      setLockoutTimer((prev) => {
        if (prev <= 1) {
          localStorage.removeItem('studyhub_lockout_until')
          localStorage.removeItem('studyhub_failed_attempts')
          setFailedAttempts(0)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [lockoutTimer])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    setServerError(null)
    setUnverifiedEmail(null)

    if (lockoutTimer > 0) {
      setServerError(`Account temporarily locked due to multiple failed attempts. Try again in ${lockoutTimer}s.`)
      return
    }

    const validation = signInSchema.safeParse(formData)
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
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          rememberMe: formData.rememberMe,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        if (data.isUnverified) {
          setUnverifiedEmail(formData.email.trim().toLowerCase())
          throw new Error(data.error || 'Your account is not verified yet.')
        }

        const nextAttempts = failedAttempts + 1
        setFailedAttempts(nextAttempts)
        localStorage.setItem('studyhub_failed_attempts', nextAttempts.toString())

        if (nextAttempts >= MAX_FAILED_ATTEMPTS) {
          const lockTime = Date.now() + LOCKOUT_DURATION_SECONDS * 1000
          localStorage.setItem('studyhub_lockout_until', lockTime.toString())
          setLockoutTimer(LOCKOUT_DURATION_SECONDS)
          throw new Error(`Too many failed attempts. Login locked for ${LOCKOUT_DURATION_SECONDS} seconds.`)
        } else {
          throw new Error(data.error || `Invalid credentials. (${MAX_FAILED_ATTEMPTS - nextAttempts} attempts remaining)`)
        }
      }

      // Successful login -> clear lockouts
      localStorage.removeItem('studyhub_failed_attempts')
      localStorage.removeItem('studyhub_lockout_until')

      router.push(returnTo)
      router.refresh()
    } catch (err: any) {
      setServerError(err.message || 'Authentication failed. Please check your credentials.')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {serverError && (
        <div className="p-3.5 bg-red-950/40 border border-red-800/60 rounded-xl space-y-2 text-red-200 text-xs">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{serverError}</span>
          </div>

          {unverifiedEmail && (
            <div className="pt-1 border-t border-red-800/40">
              <Link
                href={`/verify-otp?email=${encodeURIComponent(unverifiedEmail)}`}
                className="inline-flex items-center gap-1.5 text-xs text-cyan-300 hover:text-cyan-200 font-semibold underline underline-offset-4"
              >
                <span>Enter your 6-digit verification code now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Email Input */}
      <div>
        <label className="block text-xs font-medium text-slate-300 mb-1.5">
          Email Address
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="you@example.com"
          disabled={loading || lockoutTimer > 0}
          autoComplete="email"
          className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all disabled:opacity-50"
        />
        {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
      </div>

      {/* Password Input */}
      <div>
        <div className="flex justify-between items-center mb-1.5">
          <label className="text-xs font-medium text-slate-300">Password</label>
          <Link
            href="/forgot-password"
            className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            Forgot password?
          </Link>
        </div>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            placeholder="••••••••"
            disabled={loading || lockoutTimer > 0}
            autoComplete="current-password"
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
        {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password}</p>}
      </div>

      {/* Remember Me */}
      <div className="flex items-center">
        <input
          type="checkbox"
          id="rememberMe"
          checked={formData.rememberMe}
          onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
          className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-cyan-400 focus:ring-offset-slate-900"
        />
        <label htmlFor="rememberMe" className="ml-2 text-xs text-slate-300 cursor-pointer">
          Keep me signed in on this device
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading || lockoutTimer > 0}
        className="w-full py-2.5 px-4 bg-cyan-600 hover:bg-cyan-500 active:bg-cyan-700 text-white font-medium rounded-xl text-sm shadow-md shadow-cyan-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Signing in...</span>
          </>
        ) : lockoutTimer > 0 ? (
          <span>Locked ({lockoutTimer}s)</span>
        ) : (
          <span>Sign In to StudyHub</span>
        )}
      </button>
    </form>
  )
}
