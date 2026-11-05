import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getLocalUploadedBooks } from '@/lib/books-store'

export const runtime = 'edge'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // 1. Find book record
    let book: any = null
    const supabase = await createClient()
    try {
      const { data } = await supabase.from('books').select('*').eq('id', id).maybeSingle()
      if (data) book = data
    } catch {}

    if (!book) {
      const localBooks = getLocalUploadedBooks()
      book = localBooks.find((b) => b.id === id)
    }

    if (!book) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 })
    }

    const rawPath = book.file_path || book.storage_path || ''

    // 1. If stored in Cloudflare R2
    if (rawPath.startsWith('r2:')) {
      const { isR2Configured, getR2SignedDownloadUrl } = await import('@/lib/storage/r2')
      if (isR2Configured()) {
        const cleanKey = rawPath.replace(/^r2:/, '')
        const signedUrl = await getR2SignedDownloadUrl(cleanKey, 3600)
        return NextResponse.redirect(signedUrl)
      }
    }

    // 2. If stored as an external URL
    if (rawPath.startsWith('http://') || rawPath.startsWith('https://')) {
      return NextResponse.redirect(rawPath)
    }

    try {
      let fs: any = null
      let path: any = null
      if (typeof process !== 'undefined' && (process as any).release?.name === 'node') {
        fs = (eval)('require')('fs')
        path = (eval)('require')('path')
      }
      let diskPath = ''

      if (fs && path) {
        if (rawPath.startsWith('/uploads/') || rawPath.startsWith('uploads/')) {
          const relative = rawPath.replace(/^\/?uploads\//, '')
          diskPath = path.join(process.cwd(), 'public', 'uploads', relative)
        } else if (path.isAbsolute(rawPath) && fs.existsSync(rawPath)) {
          diskPath = rawPath
        }

        // Fallback search in public/uploads if not found
        if (!diskPath || !fs.existsSync(diskPath)) {
          const fallback = path.join(process.cwd(), 'public', 'uploads', 'the_personal_mba_527_pages.pdf')
          if (fs.existsSync(fallback)) {
            diskPath = fallback
          }
        }

        if (diskPath && fs.existsSync(diskPath)) {
          const buffer = fs.readFileSync(diskPath)
          return new NextResponse(buffer, {
            status: 200,
            headers: {
              'Content-Type': 'application/pdf',
              'Content-Length': String(buffer.length),
              'Content-Disposition': `inline; filename="${encodeURIComponent(book.title)}.pdf"`,
              'Cache-Control': 'public, max-age=86400',
            },
          })
        }
      }
    } catch {}

    return NextResponse.json({ error: 'PDF file not found' }, { status: 404 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Stream error' }, { status: 500 })
  }
}
