import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'edge'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { bookId, page } = await request.json()

    if (!bookId || !page) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
    }

    // Upsert reading progress for this user
    await supabase.from('reading_progress').upsert(
      {
        user_id: user.id,
        book_id: bookId,
        current_page: page,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,book_id' }
    )

    return NextResponse.json({ success: true, page })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error updating progress' }, { status: 500 })
  }
}
