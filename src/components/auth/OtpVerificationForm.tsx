'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Loader2, AlertCircle, CheckCircle2, ArrowRight, RotateCw, Mail } from 'lucide-react'

interface OtpVerificationFormProps {
  initialEmail?: string
  onSuccess?: () => void
}

const RESEND_COOLDOWN_SECONDS = 60

export function OtpVerificationForm({ initialEmail, onSuccess }: OtpVerificationFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const email = (initialEmail || searchParams.get('email') || '').trim().toLowerCase()
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', ''])
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN_SECONDS)

  // Resend countdown timer
  useEffect(() => {
    if (cooldown <= 0) return
    const timer = setInterval(() => {
      setCooldown((c) => (c <= 1 ? 0 : c - 1))
    }, 1000)
    return () => clearInterval(timer)
  }, [cooldown])

  // Focus the first box on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }
  }, [])

  const handleDigitChange = (index: number, value: string) => {
    // Handle paste of full 6 digits
    if (value.length > 1) {
      const pasted = value.replace(/[^0-9]/g, '').slice(0, 6)
      if (pasted.length > 0) {
        const nextDigits = [...digits]
        for (let i = 0; i < 6; i++) {
          nextDigits[i] = pasted[i] || ''
        }
        setDigits(nextDigits)
        const nextFocus = Math.min(pasted.length, 5)
        inputRefs.current[nextFocus]?.focus()
      }
      return
    }

    const singleVal = value.replace(/[^0-9]/g, '')
    const nextDigits = [...digits]
    nextDigits[index] = singleVal
    setDigits(nextDigits)

    // Auto-advance to next input
    if (singleVal && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setError(null)
    setSuccess(null)

    const token = digits.join('')
    if (token.length !== 6) {
      setError('Please enter all 6 digits of the verification code.')
      return
    }

    if (!email) {
      setError('Missing email address. Please return to the sign-up page.')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          token,
          type: 'signup',
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Verification failed. Please check the code.')
      }

      setSuccess('Email verified successfully! Preparing your personalized workspace...')

      if (onSuccess) {
        onSuccess()
      } else {
        setTimeout(() => {
          router.push('/onboarding')
          router.refresh()
        }, 1200)
      }
    } catch (err: any) {
      setError(err.message || 'Verification failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (cooldown > 0 || resending || !email) return
    setError(null)
    setSuccess(null)
    setResending(true)

    try {
      const res = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, type: 'signup' }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to resend code.')
      }

      setSuccess(`A new 6-digit verification code was sent to ${email}`)
      setCooldown(RESEND_COOLDOWN_SECONDS)
      setDigits(['', '', '', '', '', ''])
      inputRefs.current[0]?.focus()
    } catch (err: any) {
      setError(err.message || 'Failed to resend verification code.')
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto">
          <Mail className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold text-slate-100">Verify Your Email</h3>
        <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
          We sent a 6-digit verification code to{' '}
          <strong className="text-slate-200">{email || 'your email'}</strong>. Enter the code below to activate your account.
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-950/40 border border-red-800/60 rounded-xl flex items-start gap-2.5 text-red-200 text-xs">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-xl flex items-start gap-2.5 text-emerald-200 text-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleVerify} className="space-y-6">
        {/* 6-digit boxes */}
        <div className="flex items-center justify-center gap-2 sm:gap-3">
          {digits.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el
              }}
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={digit}
              onChange={(e) => handleDigitChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              disabled={loading}
              className="w-11 h-13 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-mono font-bold bg-slate-900 border border-slate-700/80 rounded-xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all disabled:opacity-50"
            />
          ))}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || digits.join('').length !== 6}
          className="w-full py-2.5 px-4 bg-cyan-600 hover:bg-cyan-500 active:bg-cyan-700 text-white font-medium rounded-xl text-sm shadow-md shadow-cyan-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Verifying code...</span>
            </>
          ) : (
            <>
              <span>Verify & Activate Account</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        {/* Resend and return links */}
        <div className="pt-2 flex flex-col items-center gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <span>Didn&apos;t receive the code?</span>
            {cooldown > 0 ? (
              <span className="text-slate-500 font-mono">Resend in {cooldown}s</span>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={resending}
                className="text-cyan-400 hover:text-cyan-300 font-semibold underline underline-offset-4 flex items-center gap-1 disabled:opacity-50"
              >
                {resending && <RotateCw className="w-3 h-3 animate-spin" />}
                <span>Resend 6-digit code</span>
              </button>
            )}
          </div>

          <Link
            href="/signin"
            className="text-slate-500 hover:text-slate-300 transition-colors"
          >
            Return to Sign In
          </Link>
        </div>
      </form>
    </div>
  )
}
