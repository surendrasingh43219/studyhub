'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  CheckSquare,
  Timer,
  BookOpen,
  GraduationCap,
  Calendar,
  Briefcase,
  Layers,
  Languages,
  StickyNote,
  Target,
  BarChart2,
  Settings,
  Shield,
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
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'My Tasks', href: '/tasks', icon: CheckSquare },
    { name: 'Study Tracker', href: '/tracker', icon: Timer },
    { name: 'Book Library', href: '/library', icon: BookOpen },
    { name: 'Exam Prep', href: '/exams', icon: GraduationCap },
    { name: 'Calendar', href: '/calendar', icon: Calendar },
    { name: 'My Skills', href: '/skills', icon: Briefcase },
    { name: 'Projects', href: '/projects', icon: Layers },
    { name: 'English Practice', href: '/english', icon: Languages },
    { name: 'My Notes', href: '/notes', icon: StickyNote },
    { name: 'Goals & Habits', href: '/goals', icon: Target },
    { name: 'Analytics', href: '/analytics', icon: BarChart2 },
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
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800 shrink-0">
        {!collapsed && (
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-lg text-white">StudyHub</span>
              <span className="text-[10px] text-cyan-400 block -mt-1 font-mono tracking-wider">COMMAND CENTER</span>
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
      <div className="flex-1 py-3 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href + '/'))
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.name : undefined}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl font-medium text-xs sm:text-sm transition-all ${
                isActive
                  ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-sm shadow-cyan-500/10'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              } ${collapsed ? 'justify-center' : ''}`}
            >
              <Icon className={`w-4 h-4 sm:w-5 sm:h-5 shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
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

      {/* Free Platform Tagline Banner */}
      {!collapsed && (
        <div className="p-3 m-3 rounded-xl bg-slate-950/60 border border-slate-800 shrink-0">
          <div className="flex items-center gap-1.5 text-cyan-400 font-semibold text-[11px] mb-1">
            <Sparkles className="w-3.5 h-3.5" /> StudyHub Free
          </div>
          <p className="text-[10px] text-slate-400 leading-tight">
            Your Progress. Your Goals. Your Future.
          </p>
        </div>
      )}
    </aside>
  )
}
