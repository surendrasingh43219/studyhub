'use client'

import { useState } from 'react'
import { StickyNote, Plus, Trash2, Download, BookOpen, Search, Save, Check } from 'lucide-react'

interface Note {
  id: string
  title: string
  content: string
  bookTitle?: string
  pageNumber?: number
  updatedAt: string
}

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: '1',
      title: 'Higher-Order Procedures & Currying',
      content: `# Higher-Order Procedures in Scheme

Procedures that accept other procedures as arguments or return them as values are called higher-order procedures.

\`\`\`scheme
(define (sum term a next b)
  (if (> a b)
      0
      (+ (term a)
         (sum term (next a) next b))))
\`\`\`

### Key Takeaway
Abstraction allows us to express general mathematical methods (e.g. Simpson's Rule numerical integration) without duplicating summation control flow.`,
      bookTitle: 'Structure and Interpretation of Computer Programs',
      pageNumber: 57,
      updatedAt: 'Today, 11:20 AM',
    },
    {
      id: '2',
      title: 'The Fundamental Theorem of Calculus (Part 1)',
      content: `## Theorem Statement
If $f$ is continuous on $[a, b]$, then the function $g$ defined by:
$$g(x) = \\int_a^x f(t)\\,dt$$
is continuous on $[a, b]$, differentiable on $(a, b)$, and $g'(x) = f(x)$.

### Intuition
Integration accumulates area under rate of change; differentiation measures rate of area change. They are inverse processes.`,
      bookTitle: 'Calculus: Volume 1',
      pageNumber: 322,
      updatedAt: 'Yesterday',
    },
  ])

  const [activeNoteId, setActiveNoteId] = useState<string>(notes[0]?.id || '')
  const [searchQuery, setSearchQuery] = useState('')
  const [savedStatus, setSavedStatus] = useState(false)

  const activeNote = notes.find((n) => n.id === activeNoteId) || notes[0]

  const handleUpdateNote = (field: keyof Note, value: any) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === activeNoteId ? { ...n, [field]: value, updatedAt: 'Just now' } : n))
    )
    setSavedStatus(true)
    setTimeout(() => setSavedStatus(false), 1000)
  }

  const handleCreateNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'Untitled Study Note',
      content: '# New Note\n\nStart typing your markdown notes here...',
      updatedAt: 'Just now',
    }
    setNotes([newNote, ...notes])
    setActiveNoteId(newNote.id)
  }

  const handleDeleteNote = (id: string) => {
    const remaining = notes.filter((n) => n.id !== id)
    setNotes(remaining)
    if (activeNoteId === id && remaining.length > 0) {
      setActiveNoteId(remaining[0].id)
    }
  }

  // Export note as Markdown / Text file
  const handleExportNote = () => {
    if (!activeNote) return
    const blob = new Blob([`${activeNote.title}\n\n${activeNote.content}`], {
      type: 'text/markdown;charset=utf-8;',
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${activeNote.title.replace(/[^a-zA-Z0-9]/g, '_')}.md`
    link.click()
    URL.revokeObjectURL(url)
  }

  const filteredNotes = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <StickyNote className="w-7 h-7 text-indigo-400" /> My Study Notes
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Markdown editor linked directly to your textbooks with instant export.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportNote}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-4 h-4" /> Export Note
          </button>
          <button
            onClick={handleCreateNote}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" /> New Note
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-14rem)]">
        {/* Left Column: Note List */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 flex flex-col gap-3 overflow-hidden">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter notes..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {filteredNotes.map((note) => (
              <div
                key={note.id}
                onClick={() => setActiveNoteId(note.id)}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  note.id === activeNoteId
                    ? 'bg-indigo-500/10 border-indigo-500/30 text-white shadow-sm'
                    : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs truncate">{note.title}</h4>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteNote(note.id)
                    }}
                    className="text-slate-600 hover:text-rose-400 p-1"
                    title="Delete note"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-[11px] opacity-70 line-clamp-2 mt-1">{note.content.replace(/[#*`]/g, '')}</p>
                <div className="flex items-center justify-between text-[10px] opacity-50 mt-2 font-mono">
                  {note.bookTitle ? (
                    <span className="truncate max-w-[120px]">{note.bookTitle}</span>
                  ) : (
                    <span>Scratchpad</span>
                  )}
                  <span>{note.updatedAt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Note Editor */}
        <div className="md:col-span-2 bg-slate-900/70 border border-slate-800 rounded-2xl p-6 flex flex-col gap-4 overflow-hidden">
          {activeNote ? (
            <>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <input
                  type="text"
                  value={activeNote.title}
                  onChange={(e) => handleUpdateNote('title', e.target.value)}
                  className="text-lg sm:text-xl font-bold bg-transparent text-white focus:outline-none flex-1"
                  placeholder="Note Title"
                />

                {savedStatus && (
                  <span className="text-xs text-emerald-400 flex items-center gap-1 font-mono">
                    <Check className="w-3.5 h-3.5" /> Saved
                  </span>
                )}
              </div>

              {activeNote.bookTitle && (
                <div className="flex items-center gap-2 text-xs text-indigo-400 bg-indigo-500/10 px-3 py-1.5 rounded-xl border border-indigo-500/20 font-mono">
                  <BookOpen className="w-3.5 h-3.5" /> Linked to: {activeNote.bookTitle} (Page{' '}
                  {activeNote.pageNumber})
                </div>
              )}

              <textarea
                value={activeNote.content}
                onChange={(e) => handleUpdateNote('content', e.target.value)}
                placeholder="Write markdown here..."
                className="flex-1 w-full bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 font-mono text-xs sm:text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 resize-none leading-relaxed"
              />
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
              <StickyNote className="w-10 h-10 mb-2 opacity-50" />
              <p className="text-sm">No note selected.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
