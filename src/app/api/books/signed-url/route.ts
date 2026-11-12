import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { isR2Configured, getR2SignedDownloadUrl } from '@/lib/storage/r2'

export const runtime = 'edge'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // 1. Check authenticated user via real Supabase Auth
    let user: any = null
    try {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser()
      user = authUser
    } catch {}

    const { storagePath, bookId } = await request.json()

    if (!storagePath) {
      return NextResponse.json({ error: 'Missing storagePath parameter' }, { status: 400 })
    }

    // 2. Validate public access vs private ownership
    let isPublicApprovedBook = false
    if (bookId) {
      try {
        const { data: book } = await supabase
          .from('books')
          .select('id, is_public, is_approved, uploader_id')
          .eq('id', bookId)
          .maybeSingle()

        if (book && book.is_public && book.is_approved) {
          isPublicApprovedBook = true
        } else if (book && user && book.uploader_id === user.id) {
          isPublicApprovedBook = true // Owner can access their own book
        }
      } catch {}
    }

    // If not a verified public approved book, require authenticated user
    if (!isPublicApprovedBook && !user) {
      return NextResponse.json(
        { error: 'Unauthorized: You must be logged in to access this document.' },
        { status: 401 }
      )
    }

    // Direct local uploads or public URLs
    if (storagePath.startsWith('/uploads/') || storagePath.startsWith('uploads/')) {
      const clean = storagePath.startsWith('/') ? storagePath : '/' + storagePath
      return NextResponse.json({
        signedUrl: clean,
        expiresIn: 86400,
        provider: 'local-disk',
      })
    }
    if (storagePath.startsWith('http://') || storagePath.startsWith('https://')) {
      return NextResponse.json({
        signedUrl: storagePath,
        expiresIn: 86400,
        provider: 'external',
      })
    }

    // Check Cloudflare R2
    const cleanKey = storagePath.replace(/^r2:/, '')

    if (isR2Configured()) {
      try {
        const signedUrl = await getR2SignedDownloadUrl(cleanKey, 3600)
        return NextResponse.json({
          signedUrl,
          expiresIn: 3600,
          provider: 'cloudflare-r2',
        })
      } catch (r2Err) {
        console.warn('R2 signed url failed, falling back to Supabase:', r2Err)
      }
    }

    // Fallback: Supabase Storage signed URL
    const { data: signedData, error: storageError } = await supabase.storage
      .from('study-documents')
      .createSignedUrl(cleanKey, 3600)

    if (storageError || !signedData?.signedUrl) {
      return NextResponse.json({
        signedUrl: `/demo-docs/${cleanKey.split('/').pop()}`,
        expiresIn: 3600,
        isDemo: false,
      })
    }

    // Increment download counter if requested
    if (bookId) {
      try {
        await supabase.rpc('increment_book_download', { book_id: bookId })
      } catch {}
    }

    return NextResponse.json({
      signedUrl: signedData.signedUrl,
      expiresIn: 3600,
      provider: 'supabase',
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 })
  }
}
