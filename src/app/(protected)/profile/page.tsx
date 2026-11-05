'use client'

import { useState } from 'react'
import { User, Lock, Globe, Bell, Palette, Type, Check, Sparkles, Shield } from 'lucide-react'

export default function ProfilePage() {
  const [fullName, setFullName] = useState('Surendra Scholar')
  const [username, setUsername] = useState('surendra')
  const [bio, setBio] = useState('CS & Mathematics student focusing on compilers and distributed systems.')
  const [isPublic, setIsPublic] = useState(false) // Default PRIVATE as mandated
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg'>('md')
  const [themeColor, setThemeColor] = useState<'cyan' | 'indigo' | 'emerald' | 'amber'>('cyan')
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [saved, setSaved] = useState(false)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
          <User className="w-7 h-7 text-cyan-400" /> Scholar Profile & Customization
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Control your public presence, reading interface theme, and privacy boundaries.
        </p>
      </div>

      {saved && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
          <Check className="w-4 h-4" /> Profile and interface settings updated successfully!
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Personal Details */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" /> Basic Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Academic Bio</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Privacy Gate: Public vs Private Toggle */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" /> Privacy & Isolation Settings
          </h2>
          <p className="text-xs text-slate-400">
            By default, all study logs, notes, streaks, and flashcards are completely private and accessible only by you via PostgreSQL Row Level Security.
          </p>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                {isPublic ? (
                  <>
                    <Globe className="w-4 h-4 text-cyan-400" /> Public Profile Visible
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 text-amber-400" /> Private Profile (Default)
                  </>
                )}
              </div>
              <p className="text-xs text-slate-400">
                {isPublic
                  ? 'Other students can view your public study streak on the opt-in leaderboard.'
                  : 'Nobody can see your profile or study metrics. Absolute data isolation.'}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsPublic(!isPublic)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                isPublic ? 'bg-cyan-500' : 'bg-slate-800'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  isPublic ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* UI Themes & Font Size */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Palette className="w-4 h-4 text-purple-400" /> Appearance & Reader Preferences
          </h2>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Theme Accent Color</label>
            <div className="flex items-center gap-3">
              {(['cyan', 'indigo', 'emerald', 'amber'] as const).map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setThemeColor(color)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all border ${
                    themeColor === color
                      ? 'bg-slate-800 border-white text-white shadow-md'
                      : 'border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Default Reader Font Size</label>
            <div className="flex items-center gap-3">
              {(['sm', 'md', 'lg'] as const).map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setFontSize(size)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all border ${
                    fontSize === size
                      ? 'bg-slate-800 border-cyan-400 text-cyan-400 shadow-md'
                      : 'border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {size === 'sm' ? 'Compact' : size === 'md' ? 'Normal' : 'Enlarged'}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all"
          >
            Save Profile Settings
          </button>
        </div>
      </form>
    </div>
  )
}
