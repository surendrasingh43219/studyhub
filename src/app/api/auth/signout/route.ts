import { createClient } from '@/lib/supabase/server'
import { NextResponse, type NextRequest } from 'next/server'

export const runtime = 'edge'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check if "logout from all devices" was requested
    const { searchParams } = new URL(request.url)
    const allDevices = searchParams.get('scope') === 'global'

    try {
      await supabase.auth.signOut({
        scope: allDevices ? 'global' : 'local',
      })
    } catch (e) {
      console.warn('Supabase sign out error:', e)
    }

    const response = NextResponse.json({ success: true, message: 'Signed out successfully' })
    // Ensure legacy demo cookies are always scrubbed
    response.cookies.delete('studyhub_demo_session')

    return response
  } catch (err: any) {
    const response = NextResponse.json({ success: true })
    response.cookies.delete('studyhub_demo_session')
    return response
  }
}
