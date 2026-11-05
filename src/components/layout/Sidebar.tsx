'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  BookOpen,
  Timer,
  BookMarked,
  StickyNote,
  GraduationCap,
  Shield,
  Settings,
  User,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react'
import { useState } from 'react'

interface SidebarProps {
  userRole?: string
  username?: string
}

export function Sidebar({ userRole = 'user' }: SidebarProps) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Library', href: '/library', icon: BookOpen },
    { name: 'Study Tools', href: '/tools', icon: Timer },
    { name: 'My Notes', href: '/notes', icon: StickyNote },
    { name: 'Flashcards', href: '/flashcards', icon: BookMarked },
    { name: 'Profile', href: '/profile', icon: User },
    { name: 'Settings', href: '/settings', icon: Settings },
  ]

  if (userRole === 'admin' || userRole === 'moderator') {
    navItems.push({ name: 'Admin Panel', href: '/admin', icon: Shield })
  }

  return (
    <aside
      className={`relative border-r border-slate-800 bg-slate-900/90 backdrop-blur-xl transition-all duration-300 flex flex-col ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
        {!collapsed && (
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-lg text-white">StudyHub</span>
              <span className="text-[10px] text-cyan-400 block -mt-1 font-mono tracking-wider">PLATFORM</span>
            </div>
          </Link>
        )}
        {collapsed && (
          <Link href="/dashboard" className="mx-auto">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-auto"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Nav links */}
      <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.name : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${
                isActive
                  ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-sm shadow-cyan-500/10'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              } ${collapsed ? 'justify-center' : ''}`}
            >
              <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
              {!collapsed && <span>{item.name}</span>}
              {!collapsed && item.name === 'Admin Panel' && (
                <span className="ml-auto text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30">
                  STAFF
                </span>
              )}
            </Link>
          )
        })}
      </div>

      {/* Pro/Info Banner (Collapsible) */}
      {!collapsed && (
        <div className="p-3 m-3 rounded-xl bg-gradient-to-b from-cyan-950/40 to-slate-900 border border-cyan-500/20">
          <div className="flex items-center gap-2 text-cyan-300 font-semibold text-xs mb-1">
            <Sparkles className="w-3.5 h-3.5" /> Open-Source Library
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed mb-2">
            Upload public domain & CC-licensed educational books freely.
          </p>
          <Link
            href="/library/upload"
            className="block text-center text-xs py-1.5 px-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-colors"
          >
            Upload Book
          </Link>
        </div>
      )}
    </aside>
  )
}
