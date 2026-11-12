import { NextResponse, type NextRequest } from 'next/server'
import { getCurrentUserOrLocal } from '@/lib/auth/session'
import { DEFAULT_GOALS } from '@/lib/data/defaultStudentData'

export const runtime = 'edge'

// GET /api/dashboard/goals
export async function GET() {
  try {
    const { user, supabase } = await getCurrentUserOrLocal()

    const { data, error } = await supabase
      .from('user_goals')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error || !data || data.length === 0) {
      return NextResponse.json({ goals: DEFAULT_GOALS })
    }
    return NextResponse.json({ goals: data })
  } catch (err: any) {
    return NextResponse.json({ goals: DEFAULT_GOALS })
  }
}

// POST /api/dashboard/goals
export async function POST(request: NextRequest) {
  try {
    const { user, supabase } = await getCurrentUserOrLocal()

    const { title, category, target_date, progress, notes } = await request.json()
    if (!title?.trim()) return NextResponse.json({ error: 'Title required' }, { status: 400 })

    const { data, error } = await supabase
      .from('user_goals')
      .insert({
        user_id: user.id,
        title: title.trim(),
        category: category || 'general',
        target_date: target_date || null,
        progress: progress || 0,
        notes: notes || null,
        status: 'in_progress',
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({
        goal: {
          id: `local-goal-${Date.now()}`,
          user_id: user.id,
          title: title.trim(),
          category: category || 'general',
          target_date: target_date || null,
          progress: progress || 0,
          status: 'in_progress',
          created_at: new Date().toISOString(),
        },
      })
    }

    return NextResponse.json({ goal: data })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// DELETE /api/dashboard/goals
export async function DELETE(request: NextRequest) {
  try {
    const { user, supabase } = await getCurrentUserOrLocal()

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })

    await supabase.from('user_goals').delete().eq('id', id).eq('user_id', user.id)

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
