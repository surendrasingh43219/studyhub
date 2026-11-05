import { createClient } from '@/lib/supabase/server'
import { LibraryClientView } from '@/components/library/LibraryClientView'
import { getLocalUploadedBooks } from '@/lib/books-store'

export const metadata = {
  title: 'Open-Source Library | StudyHub',
  description: 'Explore, read online, and download educational textbooks and reference works.',
}

export default async function LibraryPage() {
  const supabase = await createClient()

  // 1. Fetch approved books from Supabase database
  let dbBooks: any[] = []
  try {
    const { data: books, error } = await supabase
      .from('books')
      .select('*')
      .eq('is_approved', true)
      .order('created_at', { ascending: false })

    if (!error && books) {
      dbBooks = books
    }
  } catch {}

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 2. Fetch user bookmarks
  let bookmarkedIds = new Set<string>()
  if (user?.id) {
    const { data: userBookmarks } = await supabase
      .from('bookmarks')
      .select('book_id')
      .eq('user_id', user.id)

    bookmarkedIds = new Set(userBookmarks?.map((b) => b.book_id) || [])
  }

  // 3. Merge Supabase books with user uploads (e.g., The Personal MBA)
  // Demo fallback books have been completely removed as requested
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
        license: b.license || 'Creative Commons',
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

  return (
    <LibraryClientView
      initialBooks={displayBooks}
      bookmarkedIds={Array.from(bookmarkedIds)}
      currentUserId={user?.id || ''}
    />
  )
}
