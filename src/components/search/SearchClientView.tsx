'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import {
  Search,
  BookOpen,
  StickyNote,
  Clock,
  Filter,
  Sparkles,
  ArrowRight,
  Star,
  Download,
  Trash2,
} from 'lucide-react'

interface SearchResultBook {
  id: string
  title: string
  author: string
  subject: string
  category: string
  file_format: string
  rating_avg: number
  download_count: number
  snippet?: string
}

interface SearchResultNote {
  id: string
  title: string
  content: string
  bookTitle?: string
  updatedAt: string
}

export function SearchClientView({ initialQuery = '' }: { initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery)
  const [activeTab, setActiveTab] = useState<'all' | 'books' | 'notes'>('all')
  const [selectedSubject, setSelectedSubject] = useState('All')
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'calculus integration',
    'compiler architecture',
    'biological cell structures',
    'competitive programming',
  ])

  // Sample instant search dataset
  const sampleBooks: SearchResultBook[] = [
    {
      id: '00000000-0000-0000-0000-000000000001',
      title: 'Structure and Interpretation of Computer Programs',
      author: 'Harold Abelson and Gerald Jay Sussman',
      subject: 'Programming',
      category: 'Computer Science',
      file_format: 'pdf',
      rating_avg: 4.9,
      download_count: 1420,
      snippet: 'Core concepts of programming, functional decomposition, data abstraction, and interpreter design.',
    },
    {
      id: '00000000-0000-0000-0000-000000000002',
      title: 'Calculus: Volume 1',
      author: 'Gilbert Strang (OpenStax)',
      subject: 'Maths',
      category: 'Mathematics',
      file_format: 'pdf',
      rating_avg: 4.8,
      download_count: 980,
      snippet: 'Single-variable calculus, derivatives, limits, and integration methods for undergraduate mathematics.',
    },
    {
      id: '00000000-0000-0000-0000-000000000004',
      title: 'Competitive Programmer\'s Handbook',
      author: 'Antti Laaksonen',
      subject: 'Competitive Exams',
      category: 'Computer Science',
      file_format: 'pdf',
      rating_avg: 4.95,
      download_count: 2150,
      snippet: 'Algorithmic problem-solving, graph algorithms, dynamic programming, and data structures for IOI/ICPC.',
    },
  ]

  const sampleNotes: SearchResultNote[] = [
    {
      id: 'note-1',
      title: 'Higher-Order Functions and Currying',
      content: 'Procedures that manipulate procedures. In Scheme and modern languages, functions are first-class citizens.',
      bookTitle: 'SICP',
      updatedAt: '2 days ago',
    },
    {
      id: 'note-2',
      title: 'Fundamental Theorem of Calculus Summary',
      content: 'Connecting differentiation with definite integration. If f is continuous on [a,b] then F(x) = integral from a to x of f(t) dt is differentiable.',
      bookTitle: 'Calculus: Vol 1',
      updatedAt: 'Yesterday',
    },
  ]

  const filteredBooks = sampleBooks.filter((b) => {
    const q = query.toLowerCase()
    const matchesQ =
      !q ||
      b.title.toLowerCase().includes(q) ||
      b.author.toLowerCase().includes(q) ||
      b.snippet?.toLowerCase().includes(q)
    const matchesSubject = selectedSubject === 'All' || b.subject === selectedSubject
    return matchesQ && matchesSubject
  })

  const filteredNotes = sampleNotes.filter((n) => {
    const q = query.toLowerCase()
    return !q || n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q)
  })

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    if (!recentSearches.includes(query.trim())) {
      setRecentSearches([query.trim(), ...recentSearches.slice(0, 5)])
    }
  }

  const clearRecent = () => setRecentSearches([])

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
          <Search className="w-7 h-7 text-cyan-400" /> Global Search
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Search across open-source textbooks, authors, categories, and your personal private markdown notes.
        </p>
      </div>

      {/* Main Search Input */}
      <form onSubmit={handleSearchSubmit} className="relative">
        <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search books, authors, formulas, code, private notes..."
          className="w-full pl-12 pr-4 py-3.5 bg-slate-900 border border-slate-800 rounded-2xl text-base text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 shadow-xl"
        />
      </form>

      {/* Recent Searches */}
      {recentSearches.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap text-xs text-slate-400">
          <span className="flex items-center gap-1 text-slate-500">
            <Clock className="w-3.5 h-3.5" /> Recent:
          </span>
          {recentSearches.map((term) => (
            <button
              key={term}
              onClick={() => setQuery(term)}
              className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 hover:text-white transition-colors"
            >
              {term}
            </button>
          ))}
          <button
            onClick={clearRecent}
            className="text-[11px] text-slate-500 hover:text-rose-400 ml-auto transition-colors"
          >
            Clear history
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'all'
              ? 'bg-cyan-500 text-slate-950 font-bold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          All Results ({filteredBooks.length + filteredNotes.length})
        </button>
        <button
          onClick={() => setActiveTab('books')}
          className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'books'
              ? 'bg-cyan-500 text-slate-950 font-bold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Books & Textbooks ({filteredBooks.length})
        </button>
        <button
          onClick={() => setActiveTab('notes')}
          className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'notes'
              ? 'bg-cyan-500 text-slate-950 font-bold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          My Private Notes ({filteredNotes.length})
        </button>
      </div>

      {/* Results Section */}
      <div className="space-y-6">
        {/* Books Results */}
        {(activeTab === 'all' || activeTab === 'books') && filteredBooks.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-cyan-400" /> Matching Textbooks
            </h3>
            <div className="space-y-3">
              {filteredBooks.map((book) => (
                <div
                  key={book.id}
                  className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                        {book.subject}
                      </span>
                      <h4 className="text-sm font-bold text-white">{book.title}</h4>
                    </div>
                    <p className="text-xs text-slate-400">by {book.author}</p>
                    {book.snippet && (
                      <p className="text-xs text-slate-400/90 pt-1 line-clamp-1">{book.snippet}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      href={`/reader/${book.id}`}
                      className="px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/10 transition-colors flex items-center gap-1.5"
                    >
                      <BookOpen className="w-3.5 h-3.5" /> Read
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Private Notes Results */}
        {(activeTab === 'all' || activeTab === 'notes') && filteredNotes.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <StickyNote className="w-4 h-4 text-indigo-400" /> Private Study Notes (Strictly Isolated by RLS)
            </h3>
            <div className="space-y-3">
              {filteredNotes.map((note) => (
                <div
                  key={note.id}
                  className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 space-y-2 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white">{note.title}</h4>
                    <span className="text-[10px] text-slate-500 font-mono">{note.updatedAt}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{note.content}</p>
                  {note.bookTitle && (
                    <span className="inline-block text-[10px] text-indigo-400 font-mono">
                      Linked to: {note.bookTitle}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {filteredBooks.length === 0 && filteredNotes.length === 0 && (
          <div className="text-center py-12 bg-slate-900/30 border border-dashed border-slate-800 rounded-2xl space-y-2">
            <Search className="w-8 h-8 text-slate-600 mx-auto" />
            <p className="text-sm text-slate-400">No matching books or personal notes found.</p>
            <p className="text-xs text-slate-500">Try searching for broader keywords or author names.</p>
          </div>
        )}
      </div>
    </div>
  )
}
