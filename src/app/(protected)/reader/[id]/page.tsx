import { createClient } from '@/lib/supabase/server'
import { BookReaderClient } from '@/components/reader/BookReaderClient'
import { getLocalUploadedBooks } from '@/lib/books-store'
import { notFound, redirect } from 'next/navigation'

export const runtime = 'edge'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: book } = await supabase.from('books').select('title, author').eq('id', id).maybeSingle()

  if (book) {
    return {
      title: `${book.title} | StudyHub Reader`,
      description: `Read ${book.title} by ${book.author} on StudyHub.`,
    }
  }

  return {
    title: 'StudyHub Document Reader',
    description: 'Read educational books and reference material.',
  }
}

export default async function ReaderPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ page?: string }>
}) {
  const { id } = await params
  const { page } = await searchParams

  const supabase = await createClient()

  let user: any = null
  try {
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser()
    user = authUser
  } catch {}

  // 1. Fetch book record
  let bookData: any = null
  const { data: book } = await supabase.from('books').select('*').eq('id', id).maybeSingle()

  if (book) {
    bookData = {
      ...book,
      storage_path: book.file_path || book.storage_path,
    }
  } else {
    // Check local books store
    const localBooks = getLocalUploadedBooks()
    const found = localBooks.find((b) => b.id === id)
    if (found) {
      bookData = found
    }
  }

  if (!bookData) {
    notFound()
  }

  // If the book is not public/approved, user must be the authenticated uploader
  if (!bookData.is_public || !bookData.is_approved) {
    if (!user || user.id !== bookData.uploader_id) {
      redirect('/signin')
    }
  }

  // 2. Fetch last read page from reading_progress if authenticated
  let initialPage = 1
  if (user?.id) {
    const { data: progress } = await supabase
      .from('reading_progress')
      .select('current_page')
      .eq('book_id', id)
      .eq('user_id', user.id)
      .maybeSingle()

    initialPage = page ? parseInt(page, 10) : progress?.current_page || 1
  } else if (page) {
    initialPage = parseInt(page, 10) || 1
  }

  const rawPath = bookData.file_path || bookData.storage_path || ''
  let fileUrl = `/api/books/${id}/pdf`
  if (rawPath.startsWith('http://') || rawPath.startsWith('https://')) {
    fileUrl = rawPath
  } else if (rawPath.startsWith('/uploads/')) {
    fileUrl = rawPath
  } else if (rawPath.startsWith('uploads/')) {
    fileUrl = '/' + rawPath
  }

  return (
    <BookReaderClient
      book={{
        id: bookData.id,
        title: bookData.title,
        author: bookData.author,
        fileFormat: bookData.file_format || 'pdf',
        totalPages: bookData.page_count || 527,
        initialPage,
        storagePath: rawPath,
        fileUrl,
      }}
      currentUserId={user?.id || ''}
    />
  )
}
