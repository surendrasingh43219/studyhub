'use client'

import Link from 'next/link'
import { LogIn, UserPlus } from 'lucide-react'

interface AuthTabsProps {
  active: 'signin' | 'signup'
}

export function AuthTabs({ active }: AuthTabsProps) {
  return (
    <div className="grid grid-cols-2 p-1.5 bg-slate-900/90 border border-slate-800 rounded-xl">
      <Link
        href="/signin"
        className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-xs font-semibold transition-all ${
          active === 'signin'
            ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-600/25 ring-1 ring-cyan-400/30'
            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
        }`}
      >
        <LogIn className="w-3.5 h-3.5" />
        <span>Sign In</span>
      </Link>

      <Link
        href="/signup"
        className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-xs font-semibold transition-all ${
          active === 'signup'
            ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-600/25 ring-1 ring-cyan-400/30'
            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
        }`}
      >
        <UserPlus className="w-3.5 h-3.5" />
        <span>Sign Up</span>
      </Link>
    </div>
  )
}
