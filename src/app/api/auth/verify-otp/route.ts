import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'edge'

export async function POST(request: NextRequest) {
  try {
    const { email, token, type } = await request.json()

    if (!email || !token) {
      return NextResponse.json(
        { error: 'Email and 6-digit verification code are required.' },
        { status: 400 }
      )
    }

    const cleanToken = token.toString().trim()
    if (!/^\d{6}$/.test(cleanToken)) {
      return NextResponse.json(
        { error: 'Please enter a valid 6-digit numeric verification code.' },
        { status: 400 }
      )
    }

    const cleanEmail = email.trim().toLowerCase()
    const supabase = await createClient()

    // 1. Verify OTP with Supabase Auth
    // Try 'signup' first; if that fails with unexpected type, try 'email'
    const otpType = (type || 'signup') as 'signup' | 'email'
    let { data, error } = await supabase.auth.verifyOtp({
      email: cleanEmail,
      token: cleanToken,
      type: otpType,
    })

    if (error && otpType === 'signup') {
      const fallbackResult = await supabase.auth.verifyOtp({
        email: cleanEmail,
        token: cleanToken,
        type: 'email',
      })
      if (!fallbackResult.error) {
        data = fallbackResult.data
        error = null
      }
    }

    if (error) {
      return NextResponse.json(
        { error: error.message || 'Invalid or expired verification code.' },
        { status: 400 }
      )
    }

    if (!data.user) {
      return NextResponse.json(
        { error: 'Verification failed. Could not verify user session.' },
        { status: 400 }
      )
    }

    // 2. Ensure initial profile exists in profiles table
    try {
      const rawUsername =
        data.user.user_metadata?.username || cleanEmail.split('@')[0]
      const cleanUsername = `${rawUsername.replace(/[^a-zA-Z0-9_]/g, '_').slice(0, 16)}_${data.user.id.slice(0, 4)}`

      await supabase
        .from('profiles')
        .upsert(
          {
            id: data.user.id,
            email: cleanEmail,
            display_name: data.user.user_metadata?.full_name || 'Student',
            username: cleanUsername,
            role: 'user',
            is_public: false,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'id' }
        )
    } catch (profileErr) {
      console.warn('Profile initialization note:', profileErr)
    }

    return NextResponse.json({
      success: true,
      message: 'Account verified successfully!',
      user: {
        id: data.user.id,
        email: data.user.email,
        user_metadata: data.user.user_metadata,
      },
    })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Verification failed. Please try again.' },
      { status: 500 }
    )
  }
}
