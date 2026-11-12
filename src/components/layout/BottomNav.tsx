'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  CheckSquare,
  Timer,
  BookOpen,
  Menu,
} from 'lucide-react'

interface BottomNavProps {
  onOpenMenu: () => void
  userRole?: string
}

export function BottomNav({ onOpenMenu, userRole }: BottomNavProps) {
  const pathname = usePathname()

  const tabs = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Tasks', href: '/tasks', icon: CheckSquare },
    { name: 'Tracker', href: '/tracker', icon: Timer },
    { name: 'Library', href: '/library', icon: BookOpen },
  ]

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-xl border-t border-slate-800/80 px-2 py-1.5 pb-[calc(0.375rem+env(safe-area-inset-bottom,0px))]"
    >
      <div className="grid grid-cols-5 items-center justify-around max-w-md mx-auto">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href || pathname.startsWith(tab.href + '/')
          const Icon = tab.icon
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all min-h-[48px] ${
                isActive
                  ? 'text-cyan-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 active:scale-95'
              }`}
            >
              <div className={`p-1 rounded-lg transition-colors ${isActive ? 'bg-cyan-500/15' : ''}`}>
                <Icon className={`w-5 h-5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight truncate max-w-[64px]">
                {tab.name}
              </span>
            </Link>
          )
        })}

        {/* Menu button to open mobile drawer */}
        <button
          type="button"
          onClick={onOpenMenu}
          aria-label="Open navigation menu"
          className="flex flex-col items-center justify-center py-1 px-1 rounded-xl text-slate-400 hover:text-slate-200 active:scale-95 transition-all min-h-[48px]"
        >
          <div className="p-1 rounded-lg hover:bg-slate-800">
            <Menu className="w-5 h-5 text-slate-400" />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">More</span>
        </button>
      </div>
    </nav>
  )
}
