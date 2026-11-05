import { cookies } from 'next/headers'
import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { BookReaderClient } from '@/components/reader/BookReaderClient'
import { getLocalUploadedBooks } from '@/lib/books-store'

export const runtime = 'edge'

interface ReaderPageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ page?: string }>
}

export async function generateMetadata({ params }: ReaderPageProps) {
  const { id } = await params
  return {
    title: `Reading Book | StudyHub`,
  }
}

export default async function ReaderPage({ params, searchParams }: ReaderPageProps) {
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

  if (!user) {
    const cookieStore = await cookies()
    const demoCookie = cookieStore.get('studyhub_demo_session')
    if (demoCookie?.value) {
      try {
        user = JSON.parse(demoCookie.value)
      } catch {}
    }
  }

  if (!user) redirect('/signin')

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
    } else {
      bookData = {
        id,
        title: 'Document Reader',
        author: 'StudyHub',
        file_format: 'pdf',
        page_count: 527,
        storage_path: '',
      }
    }
  }

  // 2. Fetch last read page from reading_progress (isolated by user_id = auth.uid())
  const { data: progress } = await supabase
    .from('reading_progress')
    .select('current_page')
    .eq('book_id', id)
    .eq('user_id', user.id)
    .maybeSingle()

  const initialPage = page ? parseInt(page, 10) : progress?.current_page || 1

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
      currentUserId={user.id}
    />
  )
}
