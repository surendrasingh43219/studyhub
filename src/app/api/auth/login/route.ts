import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { email, password, isDemo } = await request.json()

    // 1. If it's explicit demo login or credentials contain placeholder
    const isPlaceholderConfig =
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')

    if (isDemo || isPlaceholderConfig) {
      // Create local authenticated session cookie
      const demoUser = {
        id: '00000000-0000-0000-0000-000000000001',
        email: email || 'surendra@studyhub.local',
        user_metadata: {
          full_name: 'Surendra Scholar',
          username: 'surendra',
          role: 'admin',
        },
      }

      const response = NextResponse.json({
        success: true,
        user: demoUser,
        message: 'Logged in successfully (Local Demo Mode)',
      })

      // Set session cookie (httpOnly, secure in prod)
      response.cookies.set('studyhub_demo_session', JSON.stringify(demoUser), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })

      return response
    }

    // 2. Real Supabase Auth
    const supabase = await createClient()
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, user: data.user })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'An unexpected authentication error occurred.' },
      { status: 500 }
    )
  }
}
