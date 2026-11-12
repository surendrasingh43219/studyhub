import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'edge'

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, username } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required.' },
        { status: 400 }
      )
    }

    const cleanEmail = email.trim().toLowerCase()
    const cleanUsername = (username || cleanEmail.split('@')[0])
      .toLowerCase()
      .replace(/[^a-zA-Z0-9_]/g, '_')
      .slice(0, 20)

    // Real Supabase Auth SignUp
    const supabase = await createClient()
    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: {
        data: {
          full_name: name?.trim() || 'Student',
          username: cleanUsername,
        },
      },
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Supabase returns a user object. If email confirmation is enabled, session is null
    // and user.identities may be populated.
    const isAlreadyVerified = !!data.session

    return NextResponse.json({
      success: true,
      requiresVerification: !isAlreadyVerified,
      email: cleanEmail,
      user: data.user ? {
        id: data.user.id,
        email: data.user.email,
        user_metadata: data.user.user_metadata,
      } : null,
      message: isAlreadyVerified
        ? 'Account created and verified successfully.'
        : 'Verification code sent to your email. Please enter the 6-digit code.',
    })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'An unexpected registration error occurred.' },
      { status: 500 }
    )
  }
}
