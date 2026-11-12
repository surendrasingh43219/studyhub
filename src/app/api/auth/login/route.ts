import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'edge'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required.' },
        { status: 400 }
      )
    }

    const cleanEmail = email.trim().toLowerCase()

    // Real Supabase Auth authentication
    const supabase = await createClient()
    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password,
    })

    if (error) {
      // Check for unverified email error
      const isUnverified =
        error.message.toLowerCase().includes('email not confirmed') ||
        error.message.toLowerCase().includes('not confirmed')

      return NextResponse.json(
        {
          error: isUnverified
            ? 'Your email address has not been verified yet. Please enter the 6-digit verification code sent to your inbox.'
            : error.message,
          isUnverified,
          email: isUnverified ? cleanEmail : undefined,
        },
        { status: 400 }
      )
    }

    if (!data.user) {
      return NextResponse.json(
        { error: 'Invalid login credentials.' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email,
        user_metadata: data.user.user_metadata,
      },
    })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'An unexpected authentication error occurred.' },
      { status: 500 }
    )
  }
}
