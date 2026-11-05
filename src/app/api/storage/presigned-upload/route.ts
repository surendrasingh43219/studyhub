import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { isR2Configured, getR2SignedUploadUrl } from '@/lib/storage/r2'

export const runtime = 'edge'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // 1. Auth Check
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
      return NextResponse.json({ error: 'Unauthorized: Please sign in.' }, { status: 401 })
    }

    const { fileName, fileType, fileSizeBytes } = await request.json()

    if (!fileName) {
      return NextResponse.json({ error: 'fileName is required' }, { status: 400 })
    }

    const cleanName = fileName.toLowerCase().replace(/[^a-z0-9._-]/g, '_')
    const key = `books/${user.id}/${Date.now()}-${cleanName}`

    // 2. If Cloudflare R2 is configured, generate direct upload presigned URL
    if (isR2Configured()) {
      const uploadUrl = await getR2SignedUploadUrl(key, fileType || 'application/pdf', 1800)
      return NextResponse.json({
        provider: 'cloudflare-r2',
        uploadUrl,
        key: `r2:${key}`,
        storagePath: key,
        method: 'PUT',
      })
    }

    // 3. If R2 is not yet configured, return local/direct upload instruction
    return NextResponse.json({
      provider: 'local',
      key,
      storagePath: key,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal error' }, { status: 500 })
  }
}
