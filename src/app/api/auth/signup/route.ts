import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'edge'

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, username } = await request.json()

    const isPlaceholderConfig =
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')

    if (isPlaceholderConfig) {
      // Local development registration fallback
      const demoUser = {
        id: '00000000-0000-0000-0000-' + Date.now().toString().slice(-12).padStart(12, '0'),
        email,
        user_metadata: {
          full_name: name || 'Student',
          username: username || email.split('@')[0],
          role: 'user',
        },
      }

      const response = NextResponse.json({
        success: true,
        user: demoUser,
        message: 'Account created successfully (Local Dev Mode)',
      })

      response.cookies.set('studyhub_demo_session', JSON.stringify(demoUser), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      })

      return response
    }

    // Real Supabase Auth SignUp
    const supabase = await createClient()
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          username,
        },
      },
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, user: data.user })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'An unexpected registration error occurred.' },
      { status: 500 }
    )
  }
}
