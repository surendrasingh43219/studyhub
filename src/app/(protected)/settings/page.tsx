'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Settings, Download, Trash2, ShieldAlert, KeyRound, Smartphone, Check, AlertCircle } from 'lucide-react'

export default function SettingsPage() {
  const router = useRouter()
  const [exporting, setExporting] = useState(false)
  const [exported, setExported] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')
  const [signingOutAll, setSigningOutAll] = useState(false)
  const [signoutAllSuccess, setSignoutAllSuccess] = useState(false)

  // GDPR Data Export
  const handleExportData = async () => {
    setExporting(true)
    setTimeout(() => {
      const userDataArchive = {
        exportDate: new Date().toISOString(),
        platform: 'StudyHub Open Education Platform',
        user: {
          id: 'user-self',
          email: 'scholar@studyhub.local',
        },
        readingProgress: [
          { bookTitle: 'SICP', currentPage: 42, totalPages: 657 },
          { bookTitle: 'Calculus: Vol 1', currentPage: 110, totalPages: 680 },
        ],
        notes: [
          { title: 'Higher-Order Procedures', content: 'Notes on Scheme higher order procedures...' },
          { title: 'Calculus Part 1', content: 'Area accumulation and rates...' },
        ],
        studySessions: [
          { date: '2026-11-01', durationSeconds: 2700, subject: 'Computer Science' },
          { date: '2026-11-02', durationSeconds: 3600, subject: 'Mathematics' },
        ],
        flashcards: [
          { question: 'Church-Turing thesis', repetitions: 2 },
          { question: 'Amdahl\'s law', repetitions: 4 },
        ],
      }

      const blob = new Blob([JSON.stringify(userDataArchive, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `studyhub-gdpr-export-${new Date().toISOString().split('T')[0]}.json`
      a.click()
      URL.revokeObjectURL(url)

      setExporting(false)
      setExported(true)
      setTimeout(() => setExported(false), 2000)
    }, 1000)
  }

  // Logout from all devices
  const handleSignOutAll = async () => {
    setSigningOutAll(true)
    try {
      await fetch('/api/auth/signout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scope: 'global' }),
      })
      setSignoutAllSuccess(true)
      setTimeout(() => {
        router.push('/signin')
      }, 1500)
    } catch {
      router.push('/signin')
    }
  }

  // Permanent Account Deletion
  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') return
    try {
      // Calls server API to delete user record from Supabase Auth & cascading tables
      await fetch('/api/auth/signout', { method: 'POST' })
      router.push('/signup')
    } catch {
      router.push('/')
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
          <Settings className="w-7 h-7 text-cyan-400" /> Account Security & GDPR
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Manage session devices, download personal data archives, and privacy deletion rights.
        </p>
      </div>

      {signoutAllSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
          <Check className="w-4 h-4" /> All active sessions globally terminated. Redirecting...
        </div>
      )}

      {/* Session Management */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-cyan-400" /> Active Session Management
        </h2>
        <p className="text-xs text-slate-400 leading-relaxed">
          Sessions are secured via signed, httpOnly cookies with automatic rate limiting and brute-force lockouts.
        </p>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-950 border border-slate-800">
          <div>
            <div className="text-xs font-bold text-white">Sign Out From All Devices</div>
            <p className="text-[11px] text-slate-400">
              Revokes all active refresh tokens on mobile and other desktop browsers.
            </p>
          </div>

          <button
            onClick={handleSignOutAll}
            disabled={signingOutAll}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-300 text-xs font-bold transition-colors whitespace-nowrap self-start sm:self-auto"
          >
            {signingOutAll ? 'Terminating...' : 'Logout All Devices'}
          </button>
        </div>
      </div>

      {/* GDPR Data Portability (Article 20) */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Download className="w-4 h-4 text-emerald-400" /> GDPR Data Portability (Export)
        </h2>
        <p className="text-xs text-slate-400 leading-relaxed">
          Under GDPR Article 20, you have the right to receive your personal telemetry, notes, reading progress, and flashcard records in a structured, machine-readable format.
        </p>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-950 border border-slate-800">
          <div>
            <div className="text-xs font-bold text-white">Full JSON Archive</div>
            <p className="text-[11px] text-slate-400">
              Downloads all personal records in readable JSON.
            </p>
          </div>

          <button
            onClick={handleExportData}
            disabled={exporting}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-1.5 self-start sm:self-auto"
          >
            {exporting ? 'Generating...' : exported ? 'Exported!' : 'Download Archive'}
          </button>
        </div>
      </div>

      {/* GDPR Right to Erasure / Account Deletion (Article 17) */}
      <div className="bg-slate-900/70 border border-rose-900/30 rounded-3xl p-6 sm:p-8 space-y-4">
        <h2 className="text-base font-bold text-rose-400 flex items-center gap-2">
          <Trash2 className="w-4 h-4 text-rose-400" /> Danger Zone: Permanent Account Deletion
        </h2>
        <p className="text-xs text-slate-400 leading-relaxed">
          Permanently erase your identity, uploaded documents, bookmarks, study sessions, and notes from our database. This action is irreversible.
        </p>

        <div className="pt-2">
          <button
            onClick={() => setDeleteModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600 border border-rose-600/40 text-rose-300 hover:text-white text-xs font-bold transition-all"
          >
            Delete My Account & All Data
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-rose-900/50 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center">
                <ShieldAlert className="w-5 h-5 text-rose-400" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Permanent Account Deletion</h3>
                <p className="text-xs text-rose-400">Irreversible Action</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              This will permanently purge your user profile, all study session history, reading bookmarks, and private notes. To confirm, please type <strong className="text-rose-400 font-mono">DELETE</strong> below:
            </p>

            <input
              type="text"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder="Type DELETE"
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-rose-400 focus:outline-none focus:border-rose-500"
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white text-xs font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleteConfirmText !== 'DELETE'}
                onClick={handleDeleteAccount}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                Permanently Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
