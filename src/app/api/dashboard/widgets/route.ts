import { NextResponse, type NextRequest } from 'next/server'
import { getCurrentUserOrLocal } from '@/lib/auth/session'

export const runtime = 'edge'

// GET /api/dashboard/widgets — load user widget config
export async function GET() {
  try {
    const { user, supabase } = await getCurrentUserOrLocal()

    const { data, error } = await supabase
      .from('dashboard_widgets')
      .select('widgets_config')
      .eq('user_id', user.id)
      .single()

    if (error && error.code !== 'PGRST116') {
      return NextResponse.json({ widgets_config: null })
    }

    return NextResponse.json({ widgets_config: data?.widgets_config || null })
  } catch (err: any) {
    return NextResponse.json({ widgets_config: null })
  }
}

// POST /api/dashboard/widgets — save user widget config
export async function POST(request: NextRequest) {
  try {
    const { user, supabase } = await getCurrentUserOrLocal()
    const { widgets_config } = await request.json()

    await supabase
      .from('dashboard_widgets')
      .upsert(
        {
          user_id: user.id,
          widgets_config,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      )

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ success: true })
  }
}
