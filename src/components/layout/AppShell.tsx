'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Sidebar } from './Sidebar'
import { Navbar } from './Navbar'
import { BottomNav } from './BottomNav'
import {
  User,
  Settings,
  Shield,
  LogOut,
  X,
  BookOpen,
  GraduationCap,
  ExternalLink,
  ChevronRight,
} from 'lucide-react'

interface AppShellProps {
  user: {
    id: string
    email?: string
    user_metadata: {
      full_name?: string
      username?: string
      avatar_url?: string
      role?: string
    }
  }
  children: React.ReactNode
}

export function AppShell({ user, children }: AppShellProps) {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const role = user.user_metadata.role || 'user'
  const username = user.user_metadata.username || 'student'
  const fullName = user.user_metadata.full_name || username

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
    <div className="flex h-screen bg-[#0c0d14] text-slate-100 overflow-hidden font-sans">
      {/* Desktop Sidebar (hidden on mobile, visible on md+) */}
      <div className="hidden md:flex shrink-0">
        <Sidebar userRole={role} username={username} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar user={user} />

        <main className="flex-1 overflow-y-auto p-3.5 sm:p-6 lg:p-8 bg-[#0a0c12]/80 pb-24 md:pb-8">
          <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">{children}</div>
        </main>
      </div>

      {/* Mobile Bottom Navigation (fixed on mobile, hidden on md+) */}
      <BottomNav
        onOpenMenu={() => setMobileDrawerOpen(true)}
        userRole={role}
      />

      {/* Mobile "More" Drawer Overlay */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-black/80 backdrop-blur-sm flex justify-end animate-in fade-in">
          <div
            className="fixed inset-0"
            onClick={() => setMobileDrawerOpen(false)}
            aria-label="Close menu"
          />

          <div className="relative w-4/5 max-w-xs h-full bg-[#121624] border-l border-slate-800 p-6 flex flex-col justify-between shadow-2xl z-10">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-base text-white">StudyHub</span>
                    <span className="text-[10px] text-cyan-400 block -mt-1 font-mono">PRO</span>
                  </div>
                </div>
                <button
                  onClick={() => setMobileDrawerOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* User summary card */}
              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-1">
                <div className="font-semibold text-xs text-white truncate">{fullName}</div>
                <div className="text-[11px] text-slate-400 font-mono truncate">@{username}</div>
                {role === 'admin' && (
                  <span className="inline-block mt-1 text-[10px] font-mono uppercase bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30">
                    Administrator
                  </span>
                )}
              </div>

              {/* Navigation Links */}
              <nav className="space-y-1.5 text-sm">
                <Link
                  href="/profile"
                  onClick={() => setMobileDrawerOpen(false)}
                  className={`flex items-center justify-between p-3 rounded-xl transition-all ${
                    pathname === '/profile'
                      ? 'bg-cyan-500/15 text-cyan-400 font-semibold'
                      : 'text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-cyan-400" />
                    <span>My Profile</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </Link>

                <Link
                  href="/settings"
                  onClick={() => setMobileDrawerOpen(false)}
                  className={`flex items-center justify-between p-3 rounded-xl transition-all ${
                    pathname === '/settings'
                      ? 'bg-cyan-500/15 text-cyan-400 font-semibold'
                      : 'text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Settings className="w-4 h-4 text-slate-400" />
                    <span>Settings & GDPR</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </Link>

                <Link
                  href="/library/upload"
                  onClick={() => setMobileDrawerOpen(false)}
                  className={`flex items-center justify-between p-3 rounded-xl transition-all ${
                    pathname === '/library/upload'
                      ? 'bg-cyan-500/15 text-cyan-400 font-semibold'
                      : 'text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-4 h-4 text-emerald-400" />
                    <span>Upload Book</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </Link>

                {role === 'admin' && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileDrawerOpen(false)}
                    className={`flex items-center justify-between p-3 rounded-xl transition-all ${
                      pathname === '/admin'
                        ? 'bg-cyan-500/15 text-cyan-400 font-semibold'
                        : 'text-slate-300 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Shield className="w-4 h-4 text-amber-400" />
                      <span>Admin Moderation</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  </Link>
                )}

                <div className="pt-2 border-t border-slate-800/60 my-2" />

                <Link
                  href="/guides"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="flex items-center justify-between p-3 rounded-xl text-slate-300 hover:bg-slate-800/60 transition-all text-xs"
                >
                  <span>Study Planning Guides</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                </Link>
              </nav>
            </div>

            {/* Logout button */}
            <div className="pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={handleSignOut}
                className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl bg-red-950/40 border border-red-800/50 text-red-300 text-xs font-semibold hover:bg-red-900/50 transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
