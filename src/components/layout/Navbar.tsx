'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, Bell, LogOut, User, Settings, Shield, Flame, BookOpen, Clock } from 'lucide-react'

interface NavbarProps {
  user: {
    id: string
    email?: string
    user_metadata?: {
      full_name?: string
      username?: string
      avatar_url?: string
      role?: string
    }
  }
}

export function Navbar({ user }: NavbarProps) {
  const router = useRouter()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [notificationsOpen, setNotificationsOpen] = useState(false)

  const username = user?.user_metadata?.username || user?.email?.split('@')[0] || 'User'
  const fullName = user?.user_metadata?.full_name || username
  const avatarLetter = (fullName || 'U').charAt(0).toUpperCase()
  const role = user?.user_metadata?.role || 'user'

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
  }

  const handleSignOut = async () => {
    try {
      await fetch('/api/auth/signout', { method: 'POST' })
      router.push('/signin')
      router.refresh()
    } catch {
      router.push('/signin')
    }
  }

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Global Search Bar */}
      <form onSubmit={handleSearchSubmit} className="relative w-full max-w-md hidden sm:block">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search books, authors, subjects, notes..."
          className="w-full pl-10 pr-4 py-2 bg-slate-950/70 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
        />
      </form>

      {/* Right controls */}
      <div className="flex items-center gap-3 ml-auto">
        {/* Streak indicator badge */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-xs font-semibold">
          <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>3-day streak</span>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors relative"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="w-2 h-2 rounded-full bg-cyan-400 absolute top-2 right-2 ring-2 ring-slate-900"></span>
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                <h4 className="font-semibold text-sm text-white">Notifications</h4>
                <span className="text-[10px] text-cyan-400 font-medium">1 unread</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/50 space-y-1">
                  <div className="flex items-center justify-between text-slate-300 font-medium">
                    <span className="flex items-center gap-1.5 text-cyan-400">
                      <Clock className="w-3.5 h-3.5" /> Daily Study Goal
                    </span>
                    <span className="text-[10px] text-slate-500">2h ago</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    You have achieved 45m of your 2-hour daily study target. Keep it up!
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-800/80 transition-colors"
            aria-label="User menu"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-md">
              {avatarLetter}
            </div>
            <div className="hidden md:block text-left">
              <span className="text-xs font-semibold text-slate-200 block leading-tight">{fullName}</span>
              <span className="text-[10px] text-slate-400 block font-mono">@{username}</span>
            </div>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl py-2 z-50">
              <div className="px-4 py-2 border-b border-slate-800">
                <p className="text-xs font-semibold text-white truncate">{fullName}</p>
                <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                <span className="inline-block mt-1 text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  {role}
                </span>
              </div>

              <div className="py-1">
                <Link
                  href="/profile"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <User className="w-4 h-4 text-slate-400" /> My Profile
                </Link>
                <Link
                  href="/settings"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <Settings className="w-4 h-4 text-slate-400" /> Preferences & GDPR
                </Link>
                {(role === 'admin' || role === 'moderator') && (
                  <Link
                    href="/admin"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs text-amber-300 hover:bg-slate-800 transition-colors"
                  >
                    <Shield className="w-4 h-4 text-amber-400" /> Admin Console
                  </Link>
                )}
              </div>

              <div className="pt-1 border-t border-slate-800">
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-rose-400 hover:bg-rose-500/10 transition-colors text-left"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
