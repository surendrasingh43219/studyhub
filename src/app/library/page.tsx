import { createClient } from '@/lib/supabase/server'
import { LibraryClientView } from '@/components/library/LibraryClientView'
import { getLocalUploadedBooks } from '@/lib/books-store'
import { Sidebar } from '@/components/layout/Sidebar'
import { Navbar } from '@/components/layout/Navbar'
import Link from 'next/link'
import { BookOpen, ArrowRight, Sparkles, Compass } from 'lucide-react'

export const runtime = 'edge'

export const metadata = {
  title: 'Open-Source Public Library | StudyHub Pro',
  description: 'Explore, search, read online, and download free educational textbooks, curriculum materials, and reference books.',
}

export default async function LibraryPage() {
  const supabase = await createClient()

  // 1. Fetch approved public books from Supabase database
  let dbBooks: any[] = []
  try {
    const { data: books, error } = await supabase
      .from('books')
      .select('*')
      .eq('is_approved', true)
      .eq('is_public', true)
      .order('download_count', { ascending: false })

    if (!error && books) {
      dbBooks = books
    }
  } catch {}

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 2. Fetch user bookmarks if authenticated
  let bookmarkedIds = new Set<string>()
  if (user?.id) {
    try {
      const { data: userBookmarks } = await supabase
        .from('bookmarks')
        .select('book_id')
        .eq('user_id', user.id)

      bookmarkedIds = new Set(userBookmarks?.map((b) => b.book_id) || [])
    } catch {}
  }

  // 3. Merge Supabase books with local verified uploads
  const localBooks = getLocalUploadedBooks()
  const seenIds = new Set<string>()
  const seenTitles = new Set<string>()

  const displayBooks: any[] = []

  // Add database books first
  for (const b of dbBooks) {
    if (b.id && !seenIds.has(b.id)) {
      seenIds.add(b.id)
      const cleanTitle = (b.title || '').toLowerCase().trim().replace(/[:\-_]/g, ' ')
      seenTitles.add(cleanTitle)
      displayBooks.push({
        id: b.id,
        title: b.title,
        author: b.author,
        subject: b.subject || 'Other',
        level: b.class_level || b.level || 'All Levels',
        category: b.category || 'General',
        language: b.language || 'English',
        description: b.description || '',
        file_format: b.file_format || 'pdf',
        file_size_bytes: b.file_size_bytes || 0,
        page_count: b.page_count || 527,
        license: b.license || 'Creative Commons (CC-BY)',
        storage_path: b.file_path || b.storage_path || '',
        download_count: b.download_count ?? 0,
        rating_avg: typeof b.rating_avg === 'number' ? b.rating_avg : 4.9,
        tags: b.tags || [],
        uploader_id: b.uploader_id || null,
      })
    }
  }

  // Add local books only if unique ID and title
  for (const lb of localBooks) {
    const cleanTitle = (lb.title || '').toLowerCase().trim().replace(/[:\-_]/g, ' ')
    const hasSameTitle = Array.from(seenTitles).some(
      (t) => t.includes(cleanTitle) || cleanTitle.includes(t)
    )
    if (lb.id && !seenIds.has(lb.id) && !hasSameTitle) {
      seenIds.add(lb.id)
      seenTitles.add(cleanTitle)
      displayBooks.push(lb)
    }
  }

  // If user is authenticated, render inside the platform shell
  if (user) {
    let profile: any = null
    try {
      const { data } = await supabase
        .from('profiles')
        .select('role, full_name, username, avatar_url')
        .eq('id', user.id)
        .single()
      profile = data
    } catch {}

    const userWithProfile = {
      ...user,
      user_metadata: {
        ...user.user_metadata,
        role: profile?.role || user.user_metadata?.role || 'user',
        full_name: profile?.full_name || user.user_metadata?.full_name || 'Scholar',
        username: profile?.username || user.user_metadata?.username || 'scholar',
        avatar_url: profile?.avatar_url || user.user_metadata?.avatar_url,
      },
    }

    return (
      <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden">
        <Sidebar userRole={userWithProfile.user_metadata.role} username={userWithProfile.user_metadata.username} />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Navbar user={userWithProfile} />
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-950/60">
            <div className="max-w-7xl mx-auto space-y-8">
              <LibraryClientView
                initialBooks={displayBooks}
                bookmarkedIds={Array.from(bookmarkedIds)}
                currentUserId={user.id}
              />
            </div>
          </main>
        </div>
      </div>
    )
  }

  // If user is an unauthenticated public visitor, render with the public SEO header
  return (
    <div className="min-h-screen bg-[#0c0d14] text-slate-100 flex flex-col">
      {/* Public Header */}
      <header className="border-b border-slate-800/80 bg-[#0c0d14]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 font-bold text-xl tracking-tight">
            <div className="w-9 h-9 rounded-xl bg-cyan-600/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <span>Study<span className="text-cyan-400">Hub</span></span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-300">
            <Link href="/library" className="text-cyan-400 font-semibold">Public Library</Link>
            <Link href="/guides" className="hover:text-white transition-colors">Study Guides</Link>
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/signin?returnTo=/library"
              className="py-2 px-3.5 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
            >
              Sign In
            </Link>
            <Link
              href="/signup?returnTo=/library"
              className="py-2 px-4 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded-xl shadow-md shadow-cyan-600/20 transition-all flex items-center gap-1.5"
            >
              <span>Create Account</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Public Library View */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-slate-900 to-slate-900 border border-cyan-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <span>Free Open Educational Resources</span>
                <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full font-mono">PUBLIC</span>
              </div>
              <p className="text-xs text-slate-400">
                All books in this catalog are licensed under Creative Commons or Public Domain.
              </p>
            </div>
          </div>
          <Link
            href="/signup?returnTo=/library"
            className="text-xs py-2 px-3.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold transition-all whitespace-nowrap shadow-sm"
          >
            Sign up to bookmark & track progress
          </Link>
        </div>

        <LibraryClientView
          initialBooks={displayBooks}
          bookmarkedIds={[]}
          currentUserId=""
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 bg-[#090a0f] text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-400">
            <BookOpen className="w-4 h-4 text-cyan-500" />
            <span className="font-semibold text-slate-200">StudyHub Pro</span>
            <span>&copy; {new Date().getFullYear()} Open Educational Library.</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/guides" className="hover:text-slate-300 transition-colors">Study Guides</Link>
            <Link href="/about" className="hover:text-slate-300 transition-colors">About</Link>
            <Link href="/terms" className="hover:text-slate-300 transition-colors">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-slate-300 transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
