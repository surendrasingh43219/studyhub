import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'edge'

export async function POST(request: NextRequest) {
  try {
    const { email, type } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email address is required.' },
        { status: 400 }
      )
    }

    const cleanEmail = email.trim().toLowerCase()
    const supabase = await createClient()

    const resendType = type === 'email_change' ? 'email_change' : 'signup'
    const { error } = await supabase.auth.resend({
      type: resendType,
      email: cleanEmail,
    })

    if (error) {
      return NextResponse.json(
        { error: error.message || 'Failed to resend verification code. Please wait before retrying.' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: `A new 6-digit code has been sent to ${cleanEmail}.`,
    })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'An unexpected error occurred while resending code.' },
      { status: 500 }
    )
  }
}
