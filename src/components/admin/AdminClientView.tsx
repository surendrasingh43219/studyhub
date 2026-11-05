'use client'

import { useState } from 'react'
import {
  Shield,
  Users,
  BookOpen,
  Flag,
  BarChart3,
  CheckCircle,
  XCircle,
  Ban,
  AlertTriangle,
  Megaphone,
  Trash2,
  Eye,
} from 'lucide-react'

export function AdminClientView() {
  const [activeTab, setActiveTab] = useState<'queue' | 'reports' | 'users' | 'analytics' | 'announcements'>('queue')

  // Sample moderation queue
  const [pendingBooks, setPendingBooks] = useState([
    {
      id: 'book-pending-1',
      title: 'Introduction to Statistical Learning',
      author: 'Gareth James, Daniela Witten, Trevor Hastie, Robert Tibshirani',
      uploader: 'data_enthusiast_99',
      license: 'CC BY-NC 4.0',
      subject: 'Maths / Statistics',
      format: 'PDF',
      size: '14.2 MB',
      date: '1 hour ago',
    },
    {
      id: 'book-pending-2',
      title: 'Operating Systems: Three Easy Pieces',
      author: 'Remzi H. Arpaci-Dusseau, Andrea C. Arpaci-Dusseau',
      uploader: 'os_student_dev',
      license: 'Author Permission (Free Online)',
      subject: 'Programming',
      format: 'PDF',
      size: '8.4 MB',
      date: '3 hours ago',
    },
  ])

  // Sample reports queue
  const [reports, setReports] = useState([
    {
      id: 'rep-1',
      bookTitle: 'Calculus Volume 1',
      reportedBy: 'user_412',
      reason: 'Incorrect cover image attached to chapter 4',
      type: 'Metadata Error',
      status: 'pending',
      date: 'Yesterday',
    },
    {
      id: 'rep-2',
      bookTitle: 'Unauthorized Sample Upload',
      reportedBy: 'copyright_holder_rep',
      reason: 'Claimed copyright ownership infringement. Requesting takedown.',
      type: 'DMCA Takedown',
      status: 'pending',
      date: '2 days ago',
    },
  ])

  // Sample users
  const [users, setUsers] = useState([
    { id: 'u1', name: 'Surendra', username: 'surendra', role: 'admin', status: 'active', joined: 'Nov 2026' },
    { id: 'u2', name: 'Alice Walker', username: 'alicew', role: 'user', status: 'active', joined: 'Oct 2026' },
    { id: 'u3', name: 'SpamBot99', username: 'spambot99', role: 'user', status: 'suspended', joined: 'Yesterday' },
  ])

  const [announcementText, setAnnouncementText] = useState('StudyHub 2.0 Open Repository is live! Explore peer-reviewed textbooks.')
  const [announcementSaved, setAnnouncementSaved] = useState(false)

  const handleApproveBook = (id: string) => {
    setPendingBooks(pendingBooks.filter((b) => b.id !== id))
  }

  const handleRejectBook = (id: string) => {
    setPendingBooks(pendingBooks.filter((b) => b.id !== id))
  }

  const handleResolveReport = (id: string) => {
    setReports(reports.filter((r) => r.id !== id))
  }

  const handleToggleUserBan = (id: string) => {
    setUsers(
      users.map((u) =>
        u.id === id ? { ...u, status: u.status === 'active' ? 'suspended' : 'active' } : u
      )
    )
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <Shield className="w-7 h-7 text-amber-400" /> Admin Moderation Console
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Review submitted uploads, manage DMCA copyright reports, monitor users, and inspect analytics.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-2xl border border-slate-800 overflow-x-auto self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('queue')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'queue'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Approvals ({pendingBooks.length})
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'reports'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            DMCA Reports ({reports.length})
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'users'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Users ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'analytics'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Analytics
          </button>
        </div>
      </div>

      {/* 1. Approvals Queue */}
      {activeTab === 'queue' && (
        <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-cyan-400" /> Pending Book Approvals
          </h2>
          <p className="text-xs text-slate-400">
            Verify open-access licenses and MIME authenticity before publishing to the global library.
          </p>

          <div className="space-y-3">
            {pendingBooks.map((book, idx) => (
              <div
                key={`${book.id}-${idx}`}
                className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                      {book.license}
                    </span>
                    <h3 className="text-sm font-bold text-white">{book.title}</h3>
                  </div>
                  <p className="text-xs text-slate-400">
                    by {book.author} • Uploaded by @{book.uploader} ({book.date})
                  </p>
                  <p className="text-[11px] text-slate-500 font-mono">
                    {book.subject} • {book.format} • {book.size}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleApproveBook(book.id)}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <CheckCircle className="w-4 h-4" /> Approve
                  </button>
                  <button
                    onClick={() => handleRejectBook(book.id)}
                    className="px-3.5 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-bold text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <XCircle className="w-4 h-4" /> Reject
                  </button>
                </div>
              </div>
            ))}

            {pendingBooks.length === 0 && (
              <p className="text-xs text-slate-500 text-center py-8">Approval queue is empty.</p>
            )}
          </div>
        </div>
      )}

      {/* 2. Reports Queue */}
      {activeTab === 'reports' && (
        <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Flag className="w-5 h-5 text-rose-400" /> Copyright & Content Reports Queue
          </h2>
          <div className="space-y-3">
            {reports.map((rep) => (
              <div
                key={rep.id}
                className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 font-bold">
                      {rep.type}
                    </span>
                    <h3 className="text-sm font-bold text-white">{rep.bookTitle}</h3>
                  </div>
                  <p className="text-xs text-slate-300">{rep.reason}</p>
                  <p className="text-[11px] text-slate-500 font-mono">
                    Reported by @{rep.reportedBy} • {rep.date}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleResolveReport(rep.id)}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
                  >
                    Dismiss
                  </button>
                  <button
                    onClick={() => handleResolveReport(rep.id)}
                    className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors"
                  >
                    Takedown Document
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Users Management */}
      {activeTab === 'users' && (
        <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-cyan-400" /> User Accounts & Role Permissions
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase font-mono border-b border-slate-800">
                <tr>
                  <th className="p-3">User</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Joined</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {users.map((u) => (
                  <tr key={u.id}>
                    <td className="p-3">
                      <div className="font-bold text-white">{u.name}</div>
                      <div className="text-[11px] text-slate-500 font-mono">@{u.username}</div>
                    </td>
                    <td className="p-3">
                      <span className="uppercase font-mono text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded uppercase font-mono ${
                          u.status === 'active'
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : 'bg-rose-500/10 text-rose-400'
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-slate-400">{u.joined}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleToggleUserBan(u.id)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                          u.status === 'active'
                            ? 'bg-rose-500/20 text-rose-300 hover:bg-rose-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'
                        }`}
                      >
                        {u.status === 'active' ? 'Suspend' : 'Unsuspend'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. Analytics */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900/70 border border-slate-800 p-5 rounded-2xl">
            <div className="text-slate-400 text-xs">Total Active Users</div>
            <div className="text-2xl font-bold text-white mt-1">1,842</div>
            <span className="text-[11px] text-emerald-400">+14% this month</span>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 p-5 rounded-2xl">
            <div className="text-slate-400 text-xs">Published Books</div>
            <div className="text-2xl font-bold text-cyan-400 mt-1">328</div>
            <span className="text-[11px] text-slate-500">100% open-licensed</span>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 p-5 rounded-2xl">
            <div className="text-slate-400 text-xs">Total Downloads</div>
            <div className="text-2xl font-bold text-white mt-1">19,450</div>
            <span className="text-[11px] text-emerald-400">+1,200 this week</span>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 p-5 rounded-2xl">
            <div className="text-slate-400 text-xs">Study Focus Hours</div>
            <div className="text-2xl font-bold text-amber-400 mt-1">8,920 hrs</div>
            <span className="text-[11px] text-slate-500">Tracked via Pomodoro</span>
          </div>
        </div>
      )}
    </div>
  )
}
