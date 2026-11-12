import { NextResponse, type NextRequest } from 'next/server'
import { getCurrentUserOrLocal } from '@/lib/auth/session'
import { DEFAULT_EXAMS } from '@/lib/data/defaultStudentData'

export const runtime = 'edge'

// GET /api/dashboard/exams
export async function GET() {
  try {
    const { user, supabase } = await getCurrentUserOrLocal()

    const { data, error } = await supabase
      .from('user_exams')
      .select('*')
      .eq('user_id', user.id)
      .order('exam_date', { ascending: true })

    if (error || !data || data.length === 0) {
      return NextResponse.json({ exams: DEFAULT_EXAMS })
    }
    return NextResponse.json({ exams: data })
  } catch (err: any) {
    return NextResponse.json({ exams: DEFAULT_EXAMS })
  }
}

// POST /api/dashboard/exams
export async function POST(request: NextRequest) {
  try {
    const { user, supabase } = await getCurrentUserOrLocal()

    const { title, exam_date, syllabus_progress, target_score, notes } = await request.json()
    if (!title?.trim()) return NextResponse.json({ error: 'Title required' }, { status: 400 })

    const { data, error } = await supabase
      .from('user_exams')
      .insert({
        user_id: user.id,
        title: title.trim(),
        exam_date: exam_date || null,
        syllabus_progress: syllabus_progress || 0,
        target_score: target_score || null,
        notes: notes || null,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({
        exam: {
          id: `local-exam-${Date.now()}`,
          user_id: user.id,
          title: title.trim(),
          exam_date: exam_date || null,
          syllabus_progress: syllabus_progress || 0,
          target_score: target_score || null,
          created_at: new Date().toISOString(),
        },
      })
    }

    return NextResponse.json({ exam: data })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// DELETE /api/dashboard/exams
export async function DELETE(request: NextRequest) {
  try {
    const { user, supabase } = await getCurrentUserOrLocal()

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })

    await supabase.from('user_exams').delete().eq('id', id).eq('user_id', user.id)

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
