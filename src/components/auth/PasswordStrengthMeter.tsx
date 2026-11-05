'use client'

import { calculatePasswordStrength } from '@/lib/validations/auth'

export function PasswordStrengthMeter({ password }: { password: string }) {
  const { score, label, color } = calculatePasswordStrength(password)

  if (!password) return null

  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex justify-between items-center text-xs">
        <span className="text-slate-400">Password Strength:</span>
        <span className="font-semibold text-slate-200">{label}</span>
      </div>
      <div className="grid grid-cols-4 gap-1.5 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
        {[1, 2, 3, 4].map((step) => (
          <div
            key={step}
            className={`h-full transition-all duration-300 rounded-full ${
              score >= step ? color : 'bg-transparent'
            }`}
          />
        ))}
      </div>
      <p className="text-[11px] text-slate-400">
        Must be at least 8 characters with uppercase, lowercase, number, and special character.
      </p>
    </div>
  )
}
