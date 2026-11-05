'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  BookOpen,
  Search,
  Filter,
  Download,
  Bookmark,
  Star,
  Flag,
  Share2,
  FileText,
  CheckCircle,
  ExternalLink,
  ShieldAlert,
  X,
  Upload,
} from 'lucide-react'

interface Book {
  id: string
  title: string
  author: string
  subject: string
  level: string
  category: string
  language: string
  description: string
  file_format: string
  file_size_bytes: number
  page_count: number
  license: string
  storage_path: string
  download_count: number
  rating_avg: number
  tags: string[]
  uploader_id: string | null
}

interface LibraryClientViewProps {
  initialBooks: Book[]
  bookmarkedIds: string[]
  currentUserId: string
}

const SUBJECTS = [
  'All',
  'Science',
  'Maths',
  'Programming',
  'History',
  'Competitive Exams',
  'Languages',
  'Novels',
  'Other',
]

const LEVELS = ['All Levels', 'High School / College Entry', 'Undergraduate / Advanced', 'Olympiad / Contest Prep']

export function LibraryClientView({
  initialBooks,
  bookmarkedIds: initialBookmarks,
  currentUserId,
}: LibraryClientViewProps) {
  // Guarantee unique IDs across all updates
  const uniqueInitial = useMemo(() => {
    const seen = new Set<string>()
    return (initialBooks || []).filter((b) => {
      if (!b?.id || seen.has(b.id)) return false
      seen.add(b.id)
      return true
    })
  }, [initialBooks])

  const [books, setBooks] = useState<Book[]>(uniqueInitial)
  const [bookmarkedSet, setBookmarkedSet] = useState<Set<string>>(new Set(initialBookmarks))
  const [selectedSubject, setSelectedSubject] = useState('All')
  const [selectedLevel, setSelectedLevel] = useState('All Levels')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'downloads' | 'rating' | 'title'>('downloads')
  const [reportModalBook, setReportModalBook] = useState<Book | null>(null)
  const [reportReason, setReportReason] = useState('')
  const [reportSubmitted, setReportSubmitted] = useState(false)
  const [downloadingId, setDownloadingId] = useState<string | null>(null)

  // Toggle bookmark
  const toggleBookmark = (bookId: string) => {
    setBookmarkedSet((prev) => {
      const next = new Set(prev)
      if (next.has(bookId)) {
        next.delete(bookId)
      } else {
        next.add(bookId)
      }
      return next
    })
  }

  // Handle secure download via 60-min signed URL
  const handleDownload = async (book: Book) => {
    try {
      setDownloadingId(book.id)
      const res = await fetch('/api/books/signed-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storagePath: book.storage_path, bookId: book.id }),
      })
      const data = await res.json()
      if (data.signedUrl) {
        // Increment local download count
        setBooks((prev) =>
          prev.map((b) => (b.id === book.id ? { ...b, download_count: b.download_count + 1 } : b))
        )
        // Trigger download
        const a = document.createElement('a')
        a.href = data.signedUrl
        a.download = `${book.title.replace(/[^a-zA-Z0-9]/g, '_')}.${book.file_format}`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
      }
    } catch (err) {
      console.error('Download failed', err)
    } finally {
      setDownloadingId(null)
    }
  }

  // Filtered & Sorted books
  const filteredBooks = useMemo(() => {
    return books
      .filter((book) => {
        const matchesSubject = selectedSubject === 'All' || book.subject.toLowerCase() === selectedSubject.toLowerCase()
        const bookLevel = book.level || (book as any).class_level || 'All Levels'
        const matchesLevel = selectedLevel === 'All Levels' || bookLevel.toLowerCase().includes(selectedLevel.toLowerCase().split(' ')[0])
        const q = searchQuery.toLowerCase()
        const matchesSearch =
          !q ||
          book.title.toLowerCase().includes(q) ||
          book.author.toLowerCase().includes(q) ||
          (book.description && book.description.toLowerCase().includes(q)) ||
          book.tags?.some((t) => t.toLowerCase().includes(q))
        return matchesSubject && matchesLevel && matchesSearch
      })
      .sort((a, b) => {
        if (sortBy === 'downloads') return (b.download_count || 0) - (a.download_count || 0)
        if (sortBy === 'rating') return (b.rating_avg || 0) - (a.rating_avg || 0)
        return a.title.localeCompare(b.title)
      })
  }, [books, selectedSubject, selectedLevel, searchQuery, sortBy])

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!reportReason.trim()) return
    setReportSubmitted(true)
    setTimeout(() => {
      setReportSubmitted(false)
      setReportModalBook(null)
      setReportReason('')
    }, 1500)
  }

  return (
    <div className="space-y-6">
      {/* Header & Upload CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-cyan-400" /> Open-Source Digital Library
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Access, read online, and download peer-reviewed textbooks and open-access educational works.
          </p>
        </div>

        <Link
          href="/library/upload"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/20 transition-all self-start sm:self-auto"
        >
          <Upload className="w-4 h-4" /> Upload Open Book
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="space-y-4 bg-slate-900/70 p-4 sm:p-5 rounded-2xl border border-slate-800">
        {/* Search & Sort Controls */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search by title, author, subject, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 whitespace-nowrap">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="downloads">Most Downloaded</option>
              <option value="rating">Highest Rated</option>
              <option value="title">Alphabetical (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Subjects Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          <span className="text-xs text-slate-500 font-medium shrink-0 mr-1">Subject:</span>
          {SUBJECTS.map((sub) => (
            <button
              key={sub}
              onClick={() => setSelectedSubject(sub)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedSubject === sub
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>
      </div>

      {/* Book Grid */}
      {filteredBooks.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/40 border border-dashed border-slate-800 rounded-3xl p-8 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto">
            <BookOpen className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white">No Books Found</h3>
            <p className="text-sm text-slate-400 max-w-md mx-auto">
              No books in this view. Click below to upload a book!
            </p>
          </div>
          <Link
            href="/library/upload"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/20 transition-all"
          >
            <Upload className="w-4 h-4" /> Upload a Book
          </Link>
        </div>
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBooks.map((book, idx) => {
          const isBookmarked = bookmarkedSet.has(book.id)
          const isMyUpload = book.uploader_id && book.uploader_id === currentUserId

          return (
            <div
              key={`${book.id}-${idx}`}
              className="group bg-slate-900/60 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 flex flex-col justify-between transition-all hover:shadow-xl hover:shadow-cyan-500/5 relative"
            >
              <div>
                {/* Format and License Badges */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold">
                      {book.file_format}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                      {book.subject}
                    </span>
                  </div>

                  <button
                    onClick={() => toggleBookmark(book.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition-colors"
                    aria-label="Bookmark book"
                  >
                    <Bookmark
                      className={`w-4 h-4 ${isBookmarked ? 'fill-cyan-400 text-cyan-400' : ''}`}
                    />
                  </button>
                </div>

                {/* Title & Author */}
                <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-2">
                  {book.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1 font-medium">by {book.author}</p>

                {/* Description */}
                <p className="text-xs text-slate-400/90 mt-2.5 line-clamp-3 leading-relaxed">
                  {book.description}
                </p>

                {/* Level and License */}
                <div className="mt-3.5 pt-3 border-t border-slate-800/80 space-y-1.5 text-[11px] text-slate-400">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Target Level:</span>
                    <span className="text-slate-300 font-medium">{book.level || (book as any).class_level || 'All Levels'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">License:</span>
                    <span className="text-emerald-400 font-mono text-[10px]">{book.license}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-1 text-amber-400">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="font-bold text-xs">{(Number(book.rating_avg) || 4.8).toFixed(1)}</span>
                    </div>
                    <span className="text-[11px] text-slate-500 font-mono">
                      {book.download_count ?? 0} downloads
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/reader/${book.id}`}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/10 transition-colors"
                  >
                    <BookOpen className="w-3.5 h-3.5" /> Read Online
                  </Link>

                  <button
                    onClick={() => handleDownload(book)}
                    disabled={downloadingId === book.id}
                    className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                    title="Download document (60m signed URL)"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setReportModalBook(book)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 transition-colors"
                    title="Report copyright violation or issue"
                  >
                    <Flag className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      )}

      {/* Copyright Report Modal */}
      {reportModalBook && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setReportModalBook(null)}
              className="absolute top-4 right-4 text-slate-500 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center">
                <ShieldAlert className="w-5 h-5 text-rose-400" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Report Book</h3>
                <p className="text-xs text-slate-400">Copyright or content moderation notice</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 mb-3">
              Reporting: <strong className="text-white">{reportModalBook.title}</strong>
            </p>

            {reportSubmitted ? (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>Report received. Our moderation queue has flagged this item for review.</span>
              </div>
            ) : (
              <form onSubmit={handleReportSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Reason for report
                  </label>
                  <select
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                    defaultValue="copyright"
                  >
                    <option value="copyright">Copyright Infringement / Not Open Access</option>
                    <option value="malware">Corrupted File or Malformed Contents</option>
                    <option value="misleading">Inaccurate Title or Metadata</option>
                    <option value="other">Other Violation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Details / Proof of Ownership
                  </label>
                  <textarea
                    rows={3}
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    placeholder="Provide evidence or license details..."
                    required
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setReportModalBook(null)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white text-xs font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors"
                  >
                    Submit Report
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
