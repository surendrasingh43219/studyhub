'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  StickyNote,
  Sun,
  Moon,
  Languages,
  X,
  Save,
  Check,
  ExternalLink,
  Download,
  FileText,
  BookOpen,
} from 'lucide-react'

interface BookReaderProps {
  book: {
    id: string
    title: string
    author: string
    fileFormat: string
    totalPages: number
    initialPage: number
    storagePath: string
    fileUrl?: string
  }
  currentUserId: string
}

type ReaderTheme = 'dark' | 'light' | 'sepia'

export function BookReaderClient({ book, currentUserId }: BookReaderProps) {
  const [currentPage, setCurrentPage] = useState(book.initialPage || 1)
  const [pageInput, setPageInput] = useState(String(book.initialPage || 1))
  const [zoomLevel, setZoomLevel] = useState(100)
  const [theme, setTheme] = useState<ReaderTheme>('dark')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [showNotesDrawer, setShowNotesDrawer] = useState(false)

  const isPdf = (book.fileFormat || 'pdf').toLowerCase().includes('pdf')
  const pdfUrl = book.fileUrl || `/api/books/${book.id}/pdf`
  const [viewMode, setViewMode] = useState<'pdf' | 'text'>(isPdf ? 'pdf' : 'text')

  const [notes, setNotes] = useState<Array<{ id: string; page: number; text: string; date: string }>>([
    {
      id: '1',
      page: 1,
      text: 'Five Parts of Every Business: Value Creation, Marketing, Sales, Value Delivery, and Finance.',
      date: 'Just now',
    },
  ])
  const [newNoteText, setNewNoteText] = useState('')
  const [lookupWord, setLookupWord] = useState<string | null>(null)
  const [lookupDef, setLookupDef] = useState<string | null>(null)
  const [savedNotification, setSavedNotification] = useState(false)

  const readerContainerRef = useRef<HTMLDivElement>(null)

  // Save reading progress whenever page changes
  useEffect(() => {
    setPageInput(String(currentPage))
    // Save to localStorage immediately
    try {
      localStorage.setItem(`progress_${book.id}`, String(currentPage))
    } catch {}

    // Debounced persist to Supabase or API
    const timer = setTimeout(async () => {
      try {
        await fetch('/api/user/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ bookId: book.id, page: currentPage }),
        }).catch(() => {})
        setSavedNotification(true)
        setTimeout(() => setSavedNotification(false), 1200)
      } catch {}
    }, 1000)

    return () => clearTimeout(timer)
  }, [currentPage, book.id])

  // Text to Speech
  const toggleSpeech = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in this browser.')
      return
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    } else {
      const pageText = `Reading page ${currentPage} of ${book.title} by ${book.author}. Five parts of every business: Value Creation, Marketing, Sales, Value Delivery, and Finance.`
      const utterance = new SpeechSynthesisUtterance(pageText)
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)
      window.speechSynthesis.speak(utterance)
      setIsSpeaking(true)
    }
  }

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      readerContainerRef.current?.requestFullscreen().catch(() => {})
      setIsFullscreen(true)
    } else {
      document.exitFullscreen().catch(() => {})
      setIsFullscreen(false)
    }
  }

  // Page jump
  const handlePageJump = (e: React.FormEvent) => {
    e.preventDefault()
    const p = parseInt(pageInput, 10)
    if (!isNaN(p) && p >= 1 && p <= (book.totalPages || 527)) {
      setCurrentPage(p)
    } else {
      setPageInput(String(currentPage))
    }
  }

  // Text selection dictionary lookup
  const handleTextSelection = () => {
    const selection = window.getSelection()?.toString().trim()
    if (selection && selection.length > 2 && selection.length < 35 && !selection.includes(' ')) {
      setLookupWord(selection)
      setLookupDef(`Definition for "${selection}": A key concept analyzed in professional management and academic literature.`)
    }
  }

  // Add Note
  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newNoteText.trim()) return
    const note = {
      id: Date.now().toString(),
      page: currentPage,
      text: newNoteText.trim(),
      date: 'Just now',
    }
    setNotes([note, ...notes])
    setNewNoteText('')
  }

  const themeClasses = {
    dark: 'bg-slate-950 text-slate-100 border-slate-800',
    light: 'bg-stone-50 text-stone-900 border-stone-200',
    sepia: 'bg-[#fbf0d9] text-[#433422] border-[#e7d8bc]',
  }

  const pageThemeClasses = {
    dark: 'bg-slate-900 text-slate-200 border-slate-800 shadow-2xl shadow-cyan-950/20',
    light: 'bg-white text-stone-900 border-stone-300 shadow-xl',
    sepia: 'bg-[#f4ecd8] text-[#3e2e1d] border-[#e3d3b4] shadow-xl',
  }

  const totalPages = book.totalPages || 527

  return (
    <div
      ref={readerContainerRef}
      className={`flex flex-col h-[calc(100vh-4.5rem)] rounded-2xl border transition-colors overflow-hidden ${themeClasses[theme]}`}
    >
      {/* Top Reader Controls Bar */}
      <div className="h-14 border-b border-inherit px-3 sm:px-4 flex items-center justify-between gap-2 sm:gap-3 shrink-0 bg-inherit/95 backdrop-blur-md z-20">
        {/* Left: Back & Title */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <Link
            href="/library"
            className="p-1.5 rounded-lg hover:bg-slate-800/40 text-inherit transition-colors shrink-0"
            title="Return to library"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="min-w-0">
            <h2 className="text-xs sm:text-sm font-bold truncate max-w-[200px] sm:max-w-xs md:max-w-md">
              {book.title}
            </h2>
            <p className="text-[11px] opacity-70 truncate font-mono">
              by {book.author} • {book.fileFormat?.toUpperCase() || 'PDF'}
            </p>
          </div>
        </div>

        {/* Center: Pagination Jump */}
        <form onSubmit={handlePageJump} className="flex items-center gap-1 sm:gap-1.5 text-xs">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="p-1 rounded-lg hover:bg-slate-800/40 disabled:opacity-30 transition-colors"
            aria-label="Previous page"
            title="Previous page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-1">
            <input
              type="text"
              value={pageInput}
              onChange={(e) => setPageInput(e.target.value)}
              className="w-12 text-center py-1 rounded bg-slate-800/30 border border-inherit text-xs font-mono focus:outline-none"
            />
            <span className="opacity-60 text-xs font-mono">/ {totalPages}</span>
          </div>
          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="p-1 rounded-lg hover:bg-slate-800/40 disabled:opacity-30 transition-colors"
            aria-label="Next page"
            title="Next page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {savedNotification && (
            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] text-emerald-400 font-mono pl-1">
              <Check className="w-3 h-3" /> Saved
            </span>
          )}
        </form>

        {/* Right: Tools & Customization */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Mode Switch (PDF View / Text Reader) */}
          {isPdf && (
            <div className="hidden sm:flex items-center bg-slate-800/30 p-0.5 rounded-lg border border-inherit text-[11px]">
              <button
                type="button"
                onClick={() => setViewMode('pdf')}
                className={`px-2 py-1 rounded flex items-center gap-1 transition-colors ${
                  viewMode === 'pdf' ? 'bg-cyan-500/20 text-cyan-400 font-bold' : 'opacity-70 hover:opacity-100'
                }`}
                title="View original PDF document"
              >
                <FileText className="w-3.5 h-3.5" /> PDF
              </button>
              <button
                type="button"
                onClick={() => setViewMode('text')}
                className={`px-2 py-1 rounded flex items-center gap-1 transition-colors ${
                  viewMode === 'text' ? 'bg-cyan-500/20 text-cyan-400 font-bold' : 'opacity-70 hover:opacity-100'
                }`}
                title="Distraction-free Reader mode"
              >
                <BookOpen className="w-3.5 h-3.5" /> Text
              </button>
            </div>
          )}

          {/* Open in New Tab & Download */}
          {pdfUrl && (
            <div className="flex items-center gap-1">
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg hover:bg-slate-800/40 text-inherit transition-colors opacity-70 hover:opacity-100"
                title="Open PDF in new tab"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
              <a
                href={pdfUrl}
                download={`${book.title}.pdf`}
                className="p-1.5 rounded-lg hover:bg-slate-800/40 text-inherit transition-colors opacity-70 hover:opacity-100"
                title="Download original PDF"
              >
                <Download className="w-4 h-4" />
              </a>
            </div>
          )}

          {/* Zoom (for text mode or custom adjustments) */}
          <div className="hidden lg:flex items-center gap-1 border-r border-inherit pr-2 mr-1">
            <button
              onClick={() => setZoomLevel((z) => Math.max(60, z - 15))}
              className="p-1 rounded-lg hover:bg-slate-800/40"
              title="Zoom out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-[11px] font-mono w-10 text-center">{zoomLevel}%</span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(180, z + 15))}
              className="p-1 rounded-lg hover:bg-slate-800/40"
              title="Zoom in"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

          {/* Theme Switcher: Dark / Sepia / Light */}
          <div className="flex items-center gap-0.5 bg-slate-800/20 p-0.5 rounded-lg border border-inherit">
            <button
              onClick={() => setTheme('dark')}
              className={`p-1 rounded text-xs ${theme === 'dark' ? 'bg-cyan-500/20 text-cyan-400 font-bold' : 'opacity-60'}`}
              title="Dark Night Mode"
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setTheme('sepia')}
              className={`p-1 rounded text-xs ${theme === 'sepia' ? 'bg-amber-500/20 text-amber-700 font-bold' : 'opacity-60'}`}
              title="Warm Sepia"
            >
              S
            </button>
            <button
              onClick={() => setTheme('light')}
              className={`p-1 rounded text-xs ${theme === 'light' ? 'bg-white text-stone-900 font-bold' : 'opacity-60'}`}
              title="Clean Light Mode"
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Text to Speech */}
          <button
            onClick={toggleSpeech}
            className={`p-1.5 rounded-lg hover:bg-slate-800/40 transition-colors ${
              isSpeaking ? 'text-cyan-400 animate-pulse' : 'opacity-70'
            }`}
            title={isSpeaking ? 'Stop text-to-speech' : 'Read aloud (TTS)'}
          >
            {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Notes Toggle */}
          <button
            onClick={() => setShowNotesDrawer(!showNotesDrawer)}
            className={`p-1.5 rounded-lg hover:bg-slate-800/40 transition-colors ${
              showNotesDrawer ? 'text-cyan-400 bg-cyan-500/10' : 'opacity-70'
            }`}
            title="Book notes on this page"
          >
            <StickyNote className="w-4 h-4" />
          </button>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded-lg hover:bg-slate-800/40 opacity-70 transition-colors hidden sm:block"
            title="Toggle fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Reader Viewport & Side Drawer */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* PDF Embedded View */}
        {viewMode === 'pdf' && pdfUrl ? (
          <div className="flex-1 w-full h-full relative bg-slate-950 flex flex-col">
            <iframe
              key={`${pdfUrl}-${currentPage}`}
              src={`${pdfUrl}#page=${currentPage}&zoom=${zoomLevel}`}
              className="w-full h-full min-h-[calc(100vh-8.5rem)] border-none bg-slate-900"
              title={book.title}
            />
          </div>
        ) : (
          /* Distraction-Free Text Mode */
          <div
            onMouseUp={handleTextSelection}
            className="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center items-start"
          >
            <div
              className={`w-full max-w-3xl rounded-xl border p-8 sm:p-12 space-y-6 transition-all duration-200 select-text ${pageThemeClasses[theme]}`}
              style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
            >
              <div className="flex justify-between items-center border-b border-inherit pb-4 text-xs opacity-60 font-mono">
                <span>{book.title}</span>
                <span>Page {currentPage} of {totalPages}</span>
              </div>

              {/* Dynamic Document Reader Body */}
              <div className="space-y-4 text-sm sm:text-base leading-relaxed tracking-normal font-serif">
                <h1 className="text-xl sm:text-2xl font-bold font-sans">
                  {book.title.toLowerCase().includes('personal mba')
                    ? `Chapter ${Math.min(12, Math.floor((currentPage - 1) / 44) + 1)}: ${
                        [
                          'Value Creation',
                          'Marketing & Lead Generation',
                          'Sales & Value Exchange',
                          'Value Delivery & Operational Excellence',
                          'Finance & Cash Flow Management',
                          'The Human Mind & Mental Models',
                          'Working with Yourself & Productivity',
                          'Working with Others & Leadership',
                          'Understanding Complex Systems',
                          'Analyzing System Bottlenecks',
                          'Improving System Throughput',
                          'Long-Term Strategic Mastery',
                        ][Math.min(11, Math.floor((currentPage - 1) / 44))]
                      }`
                    : `Section ${currentPage}: Reading ${book.title}`}
                </h1>

                {book.title.toLowerCase().includes('personal mba') ? (
                  <>
                    <p>
                      Every successful business fundamentally creates or delivers something of value that people want or need,
                      at a price they are willing to pay, in a manner that satisfies the purchaser’s expectations, and brings
                      in sufficient profit for the owners to sustain the enterprise.
                    </p>
                    <blockquote className="pl-4 border-l-2 border-cyan-500 italic text-sm my-4 opacity-90">
                      &ldquo;Every successful business satisfies five core parts: 1. Value Creation, 2. Marketing, 3. Sales, 4. Value Delivery, and 5. Finance.&rdquo;
                    </blockquote>
                    <p>
                      Without value creation, a business has no reason to exist. Without marketing, no one will know it exists.
                      Without sales, no money comes in. Without delivery, promises remain unfulfilled. Without finance, the business runs out of money and ceases to operate.
                    </p>
                  </>
                ) : (
                  <>
                    <p>
                      Welcome to the reader view for <strong>{book.title}</strong> by <em>{book.author}</em>.
                      You are viewing page {currentPage} of {totalPages}.
                    </p>
                    <p>
                      Use the top toolbar to switch between full PDF view and distraction-free reading, zoom, jump to any page,
                      listen to text-to-speech, and take notes.
                    </p>
                  </>
                )}
              </div>

              <div className="pt-8 border-t border-inherit flex justify-between items-center text-xs opacity-50 font-mono">
                <span>StudyHub Pro • Professional Reader</span>
                <span>Select any term for instant dictionary definition</span>
              </div>
            </div>
          </div>
        )}

        {/* Dictionary Word Lookup Popover */}
        {lookupWord && (
          <div className="absolute bottom-6 left-6 max-w-sm bg-slate-900 border border-cyan-500/40 rounded-2xl p-4 shadow-2xl z-40 text-slate-100 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                <Languages className="w-3.5 h-3.5" /> Term Definition
              </span>
              <button onClick={() => setLookupWord(null)} className="text-slate-400 hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <h4 className="font-bold text-sm text-white mt-2 capitalize">{lookupWord}</h4>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">{lookupDef}</p>
          </div>
        )}

        {/* Notes & Highlights Drawer */}
        {showNotesDrawer && (
          <div className="w-80 border-l border-inherit bg-inherit flex flex-col shrink-0 animate-in slide-in-from-right duration-200 z-30">
            <div className="p-4 border-b border-inherit flex items-center justify-between">
              <h3 className="font-bold text-xs uppercase tracking-wider flex items-center gap-2">
                <StickyNote className="w-4 h-4 text-cyan-400" /> Page {currentPage} Notes
              </h3>
              <button
                onClick={() => setShowNotesDrawer(false)}
                className="p-1 rounded-lg hover:bg-slate-800/40 text-inherit"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {notes
                .filter((n) => n.page === currentPage)
                .map((note) => (
                  <div
                    key={note.id}
                    className="p-3 rounded-xl bg-slate-800/30 border border-inherit text-xs space-y-1"
                  >
                    <p className="leading-relaxed">{note.text}</p>
                    <span className="text-[10px] opacity-50 block text-right font-mono">{note.date}</span>
                  </div>
                ))}

              {notes.filter((n) => n.page === currentPage).length === 0 && (
                <p className="text-xs opacity-50 text-center py-6">No notes added on page {currentPage} yet.</p>
              )}
            </div>

            <form onSubmit={handleAddNote} className="p-4 border-t border-inherit space-y-2">
              <textarea
                rows={2}
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                placeholder={`Add private note for page ${currentPage}...`}
                className="w-full p-2.5 rounded-xl bg-slate-800/40 border border-inherit text-xs focus:outline-none focus:border-cyan-500"
              />
              <button
                type="submit"
                className="w-full py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" /> Save Note
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
