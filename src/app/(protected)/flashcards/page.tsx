'use client'

import { useState } from 'react'
import { BookMarked, Plus, Layers, RotateCcw, CheckCircle, Sparkles, Brain } from 'lucide-react'

interface Flashcard {
  id: string
  deck: string
  front: string
  back: string
  easeFactor: number
  intervalDays: number
  repetitions: number
}

export default function FlashcardsPage() {
  const [cards, setCards] = useState<Flashcard[]>([
    {
      id: '1',
      deck: 'Computer Architecture',
      front: 'What is Amdahl\'s Law?',
      back: 'A formula which gives the theoretical speedup in latency of the execution of a task at fixed workload that can be expected of a system whose resources are improved: S_latency(s) = 1 / ((1 - p) + p/s).',
      easeFactor: 2.5,
      intervalDays: 3,
      repetitions: 2,
    },
    {
      id: '2',
      deck: 'Data Structures',
      front: 'What is the time complexity of building a Binary Heap from an arbitrary array of N elements?',
      back: 'O(N) time complexity using bottom-up sift-down (heapify), not O(N log N).',
      easeFactor: 2.6,
      intervalDays: 6,
      repetitions: 3,
    },
    {
      id: '3',
      deck: 'Calculus',
      front: 'State L\'Hopital\'s Rule conditions.',
      back: 'Applies when lim f(x)/g(x) produces an indeterminate form 0/0 or ±inf/±inf, and both f and g are differentiable near c.',
      easeFactor: 2.4,
      intervalDays: 1,
      repetitions: 1,
    },
  ])

  const [currentIndex, setCurrentIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [newFront, setNewFront] = useState('')
  const [newBack, setNewBack] = useState('')
  const [newDeck, setNewDeck] = useState('General')

  const currentCard = cards[currentIndex]

  // SM-2 Spaced Repetition calculation
  const handleRateCard = (quality: number) => {
    // quality: 0 (blackout), 3 (hard), 4 (good), 5 (easy)
    if (!currentCard) return
    let { easeFactor, intervalDays, repetitions } = currentCard

    if (quality >= 3) {
      if (repetitions === 0) {
        intervalDays = 1
      } else if (repetitions === 1) {
        intervalDays = 6
      } else {
        intervalDays = Math.round(intervalDays * easeFactor)
      }
      repetitions += 1
    } else {
      repetitions = 0
      intervalDays = 1
    }

    easeFactor = Math.max(1.3, easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)))

    setCards((prev) =>
      prev.map((c, i) =>
        i === currentIndex
          ? { ...c, easeFactor, intervalDays, repetitions }
          : c
      )
    )

    setFlipped(false)
    setCurrentIndex((prev) => (prev + 1) % cards.length)
  }

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newFront.trim() || !newBack.trim()) return
    const card: Flashcard = {
      id: Date.now().toString(),
      deck: newDeck || 'General',
      front: newFront.trim(),
      back: newBack.trim(),
      easeFactor: 2.5,
      intervalDays: 1,
      repetitions: 0,
    }
    setCards([...cards, card])
    setNewFront('')
    setNewBack('')
    setShowAddModal(false)
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <BookMarked className="w-7 h-7 text-cyan-400" /> Spaced Repetition Decks
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            SuperMemo SM-2 interval scheduler for active recall mastery.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Create Card
        </button>
      </div>

      {currentCard ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-mono bg-slate-900 px-3 py-1 rounded-xl border border-slate-800 text-cyan-400">
              Deck: {currentCard.deck}
            </span>
            <span className="font-mono">
              Card {currentIndex + 1} of {cards.length} • Interval: {currentCard.intervalDays}d
            </span>
          </div>

          {/* Flashcard Component */}
          <div
            onClick={() => setFlipped(!flipped)}
            className="min-h-72 p-8 sm:p-12 rounded-3xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 flex flex-col items-center justify-center text-center cursor-pointer transition-all shadow-xl relative select-none"
          >
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 absolute top-5 left-5">
              {flipped ? 'Answer' : 'Question'} (Click anywhere to flip)
            </span>

            <div className="text-lg sm:text-xl font-bold text-white max-w-xl leading-relaxed">
              {flipped ? currentCard.back : currentCard.front}
            </div>

            <span className="text-xs text-cyan-400 opacity-60 mt-6 block">
              {flipped ? 'Rate your recall below &darr;' : 'Tap to reveal answer &rarr;'}
            </span>
          </div>

          {/* Rating controls */}
          {flipped ? (
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => handleRateCard(1)}
                className="py-3 px-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 hover:bg-rose-500/25 text-xs font-bold transition-all text-center"
              >
                Again (1 day)
              </button>
              <button
                onClick={() => handleRateCard(3)}
                className="py-3 px-4 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-300 hover:bg-amber-500/25 text-xs font-bold transition-all text-center"
              >
                Hard (3 days)
              </button>
              <button
                onClick={() => handleRateCard(5)}
                className="py-3 px-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/25 text-xs font-bold transition-all text-center"
              >
                Easy (6+ days)
              </button>
            </div>
          ) : (
            <div className="text-center">
              <button
                onClick={() => setFlipped(true)}
                className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
              >
                Show Answer
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12 bg-slate-900/40 border border-slate-800 rounded-2xl">
          <Layers className="w-10 h-10 text-slate-600 mx-auto mb-2" />
          <p className="text-sm text-slate-400">No cards in this deck.</p>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="font-bold text-white text-base">New Spaced Flashcard</h3>

            <form onSubmit={handleAddCard} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Deck / Subject</label>
                <input
                  type="text"
                  value={newDeck}
                  onChange={(e) => setNewDeck(e.target.value)}
                  placeholder="e.g. Algorithms, Calculus"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Question (Front)</label>
                <textarea
                  rows={2}
                  required
                  value={newFront}
                  onChange={(e) => setNewFront(e.target.value)}
                  placeholder="What is the concept or question?"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Answer (Back)</label>
                <textarea
                  rows={3}
                  required
                  value={newBack}
                  onChange={(e) => setNewBack(e.target.value)}
                  placeholder="The concise answer or formula..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold"
                >
                  Save Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
