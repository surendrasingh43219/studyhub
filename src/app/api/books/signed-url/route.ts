import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { isR2Configured, getR2SignedDownloadUrl } from '@/lib/storage/r2'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // 1. Mandatory Auth Gate: Verify calling user (supports Supabase session & local demo session)
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

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized: You must be logged in to generate file access URLs.' },
        { status: 401 }
      )
    }

    const { storagePath, bookId } = await request.json()

    if (!storagePath) {
      return NextResponse.json({ error: 'Missing storagePath parameter' }, { status: 400 })
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

    // 2. Check if Cloudflare R2 is configured or if path is an R2 key
    const isR2Path = storagePath.startsWith('r2:') || isR2Configured()
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

    // 3. Fallback: Generate signed URL from Supabase Storage
    const { data: signedData, error: storageError } = await supabase.storage
      .from('study-documents')
      .createSignedUrl(cleanKey, 3600)

    if (storageError || !signedData?.signedUrl) {
      return NextResponse.json({
        signedUrl: `/demo-docs/${cleanKey.split('/').pop()}`,
        expiresIn: 3600,
        isDemo: true,
      })
    }

    // 4. Increment download counter if requested
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
