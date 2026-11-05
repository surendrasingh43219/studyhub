import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { getLocalUploadedBooks, saveLocalUploadedBook, type StoredBook } from '@/lib/books-store'
import { isR2Configured, uploadBufferToR2 } from '@/lib/storage/r2'
import fs from 'fs'
import path from 'path'

function mapLicenseToEnum(lic: string): string {
  if (!lic) return 'Creative Commons (CC-BY)'
  const clean = lic.toLowerCase()
  if (clean.includes('public-domain') || clean.includes('public domain') || clean.includes('cc0')) {
    return 'Public Domain'
  }
  if (clean.includes('cc-by-sa') || clean.includes('sharealike') || clean.includes('share-alike')) {
    return 'Creative Commons (CC-BY-SA)'
  }
  if (clean.includes('cc-by-nc') || clean.includes('non-commercial')) {
    return 'Creative Commons (CC-BY-NC)'
  }
  if (clean.includes('open-source') || clean.includes('open source') || clean.includes('mit') || clean.includes('gnu')) {
    return 'Open Source / Free Documentation'
  }
  if (clean.includes('author-permission') || clean.includes('author permission') || clean.includes('consent')) {
    return 'Author Permission'
  }
  return 'Creative Commons (CC-BY)'
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const subject = searchParams.get('subject')
    const query = searchParams.get('q')

    let dbBooks: any[] = []
    try {
      let dbQuery = supabase
        .from('books')
        .select('*')
        .eq('is_approved', true)

      if (subject && subject !== 'All') {
        dbQuery = dbQuery.eq('subject', subject)
      }

      if (query) {
        dbQuery = dbQuery.or(`title.ilike.%${query}%,author.ilike.%${query}%,description.ilike.%${query}%`)
      }

      const { data, error } = await dbQuery.order('download_count', { ascending: false })
      if (!error && data) {
        dbBooks = data
      }
    } catch {}

    // Merge with local uploaded books (The Personal MBA, user uploads, etc.)
    const localBooks = getLocalUploadedBooks()
    const seenIds = new Set<string>()
    const seenTitles = new Set<string>()

    const merged: any[] = []

    for (const b of dbBooks) {
      if (b.id && !seenIds.has(b.id)) {
        seenIds.add(b.id)
        const cleanTitle = (b.title || '').toLowerCase().trim().replace(/[:\-_]/g, ' ')
        seenTitles.add(cleanTitle)
        merged.push({
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
          file_path: b.file_path || b.storage_path || '',
          download_count: b.download_count ?? 0,
          rating_avg: typeof b.rating_avg === 'number' ? b.rating_avg : 4.9,
          tags: b.tags || [],
          uploader_id: b.uploader_id || null,
        })
      }
    }

    for (const lb of localBooks) {
      const cleanTitle = (lb.title || '').toLowerCase().trim().replace(/[:\-_]/g, ' ')
      const hasSameTitle = Array.from(seenTitles).some(
        (t) => t.includes(cleanTitle) || cleanTitle.includes(t)
      )
      if (lb.id && !seenIds.has(lb.id) && !hasSameTitle) {
        seenIds.add(lb.id)
        seenTitles.add(cleanTitle)
        merged.push(lb)
      }
    }

    return NextResponse.json({ books: merged })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // 1. Auth Check (supports real Supabase session and local session)
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
      return NextResponse.json({ error: 'Unauthorized: Please sign in to upload.' }, { status: 401 })
    }

    const contentType = request.headers.get('content-type') || ''
    let title = ''
    let author = ''
    let subject = 'Other'
    let level = 'All Levels'
    let language = 'English'
    let description = ''
    let license = 'Creative Commons (CC-BY)'
    let fileFormat = 'pdf'
    let fileSizeBytes = 0
    let fileHash = ''
    let tags: string[] = []
    let pageCount = 100
    let savedFilePath = ''

    // Handle Multipart Form Data (Real File Upload)
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData()
      const uploadedFile = formData.get('file') as File | null

      title = (formData.get('title') as string) || ''
      author = (formData.get('author') as string) || ''
      subject = (formData.get('subject') as string) || 'Other'
      level = (formData.get('level') as string) || 'All Levels'
      language = (formData.get('language') as string) || 'English'
      description = (formData.get('description') as string) || ''
      license = (formData.get('license') as string) || 'Creative Commons (CC-BY)'
      fileFormat = (formData.get('fileFormat') as string) || 'pdf'
      fileHash = (formData.get('fileHash') as string) || ''
      const rawTags = (formData.get('tags') as string) || ''
      tags = rawTags.split(',').map((t) => t.trim()).filter(Boolean)
      const rawPages = formData.get('pageCount') as string
      if (rawPages) pageCount = parseInt(rawPages, 10) || 100

      if (uploadedFile) {
        fileSizeBytes = uploadedFile.size
        const safeName = `${Date.now()}-${uploadedFile.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`
        const buffer = Buffer.from(await uploadedFile.arrayBuffer())

        // 1. If Cloudflare R2 is configured, stream to R2 (Cloudflare Object Storage)
        if (isR2Configured()) {
          try {
            const r2Key = `books/${user.id}/${safeName}`
            await uploadBufferToR2(r2Key, buffer, uploadedFile.type || 'application/pdf')
            savedFilePath = `r2:${r2Key}`
          } catch (r2Err) {
            console.warn('R2 upload failed:', r2Err)
          }
        }

        // 2. Also save to local public/uploads if filesystem is writable
        try {
          const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
          if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true })
          }
          const fullDiskPath = path.join(uploadsDir, safeName)
          fs.writeFileSync(fullDiskPath, buffer)
          if (!savedFilePath) {
            savedFilePath = `/uploads/${safeName}`
          }
        } catch (diskErr) {
          console.log('Local disk write skipped (Cloudflare/serverless environment)')
        }
      }
    } else {
      // JSON body fallback
      const body = await request.json()
      title = body.title || ''
      author = body.author || ''
      subject = body.subject || 'Other'
      level = body.level || 'All Levels'
      language = body.language || 'English'
      description = body.description || ''
      license = body.license || 'Creative Commons (CC-BY)'
      fileFormat = body.fileFormat || 'pdf'
      fileSizeBytes = body.fileSizeBytes || 0
      fileHash = body.fileHash || ''
      tags = body.tags || []
      pageCount = body.pageCount || 100
      savedFilePath = body.storagePath || ''
    }

    if (!title || !author) {
      return NextResponse.json({ error: 'Title and author are required' }, { status: 400 })
    }

    // Auto-detect page count from title if not set (e.g. "527 pages")
    if (pageCount === 100) {
      const match = title.match(/(\d{2,4})\s*pages?/i)
      if (match) {
        pageCount = parseInt(match[1], 10)
      }
    }

    const mappedLicense = mapLicenseToEnum(license)
    const filePath = savedFilePath || `/uploads/${Date.now()}-${title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.${fileFormat}`

    // 2. Insert into Supabase table public.books with schema-compatible columns
    let insertedBook: any = null
    try {
      const payload: any = {
        title: title.trim(),
        author: author.trim(),
        subject: subject || 'Other',
        class_level: level || 'All Levels',
        category: subject || 'General',
        language: language || 'English',
        description: description || '',
        license: mappedLicense,
        file_format: (fileFormat || 'pdf').toLowerCase().includes('epub') ? 'epub' : 'pdf',
        file_size_bytes: fileSizeBytes || 0,
        file_path: filePath,
        file_hash: fileHash || null,
        is_approved: true,
        is_public: true,
        rights_confirmed: true,
        download_count: 0,
        view_count: 0,
      }

      if (user.id && !user.id.startsWith('00000000-0000-0000-0000-') && !user.id.startsWith('local-')) {
        payload.uploader_id = user.id
      }

      const { data, error } = await supabase.from('books').insert(payload).select().maybeSingle()
      if (!error && data) {
        insertedBook = data
      }
    } catch (dbErr) {
      console.error('Supabase book insert exception:', dbErr)
    }

    // 3. Save to persistent local store so it is ALWAYS available in the library and reader
    const newStoredBook: StoredBook = {
      id: insertedBook?.id || 'book-' + Date.now(),
      title: title.trim(),
      author: author.trim(),
      subject: subject || 'Other',
      level: level || 'All Levels',
      class_level: level || 'All Levels',
      category: subject || 'General',
      language: language || 'English',
      description: description || '',
      file_format: (fileFormat || 'pdf').toLowerCase().includes('epub') ? 'epub' : 'pdf',
      file_size_bytes: fileSizeBytes || 0,
      page_count: pageCount,
      license: mappedLicense,
      storage_path: filePath,
      file_path: filePath,
      download_count: 0,
      rating_avg: 5.0,
      tags: tags || [],
      uploader_id: user.id,
      created_at: new Date().toISOString(),
    }
    saveLocalUploadedBook(newStoredBook)

    return NextResponse.json({ success: true, book: insertedBook || newStoredBook })
  } catch (err: any) {
    console.error('Upload error:', err)
    return NextResponse.json({ error: err.message || 'Internal error' }, { status: 500 })
  }
}
