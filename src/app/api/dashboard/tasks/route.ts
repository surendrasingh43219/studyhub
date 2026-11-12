import { NextResponse, type NextRequest } from 'next/server'
import { getCurrentUserOrLocal } from '@/lib/auth/session'
import { DEFAULT_TASKS } from '@/lib/data/defaultStudentData'

export const runtime = 'edge'

// GET /api/dashboard/tasks
export async function GET() {
  try {
    const { user, supabase } = await getCurrentUserOrLocal()

    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error || !data || data.length === 0) {
      return NextResponse.json({ tasks: DEFAULT_TASKS })
    }
    return NextResponse.json({ tasks: data })
  } catch (err: any) {
    return NextResponse.json({ tasks: DEFAULT_TASKS })
  }
}

// POST /api/dashboard/tasks — create task
export async function POST(request: NextRequest) {
  try {
    const { user, supabase } = await getCurrentUserOrLocal()

    const { title, category, priority, due_date, description, subject_id } = await request.json()

    if (!title?.trim()) return NextResponse.json({ error: 'Title required' }, { status: 400 })

    const { data, error } = await supabase
      .from('tasks')
      .insert({
        user_id: user.id,
        title: title.trim(),
        category: category || 'General',
        priority: priority || 'medium',
        due_date: due_date || null,
        description: description || null,
        subject_id: subject_id || null,
      })
      .select()
      .single()

    if (error) {
      // Return a simulated task if database RLS blocks unauthenticated local inserts
      return NextResponse.json({
        task: {
          id: `local-task-${Date.now()}`,
          user_id: user.id,
          title: title.trim(),
          category: category || 'General',
          priority: priority || 'medium',
          status: 'not_started',
          is_completed: false,
          due_date: due_date || null,
          description: description || null,
          created_at: new Date().toISOString(),
        },
      })
    }

    return NextResponse.json({ task: data })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// PATCH /api/dashboard/tasks — toggle or edit
export async function PATCH(request: NextRequest) {
  try {
    const { user, supabase } = await getCurrentUserOrLocal()

    const { id, is_completed, status, title, priority, due_date } = await request.json()
    if (!id) return NextResponse.json({ error: 'Task ID required' }, { status: 400 })

    const updates: Record<string, any> = {}
    if (typeof is_completed === 'boolean') {
      updates.is_completed = is_completed
      updates.status = is_completed ? 'completed' : 'in_progress'
      if (is_completed) updates.completed_at = new Date().toISOString()
    }
    if (status) updates.status = status
    if (title) updates.title = title.trim()
    if (priority) updates.priority = priority
    if (due_date !== undefined) updates.due_date = due_date

    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ success: true, updated: updates })
    }

    return NextResponse.json({ task: data })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// DELETE /api/dashboard/tasks
export async function DELETE(request: NextRequest) {
  try {
    const { user, supabase } = await getCurrentUserOrLocal()

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'Task ID required' }, { status: 400 })

    await supabase.from('tasks').delete().eq('id', id).eq('user_id', user.id)

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
