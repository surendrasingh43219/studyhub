import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')
  const errorDescription = searchParams.get('error_description')
  const next = searchParams.get('next') ?? '/dashboard'

  // If OAuth provider returned an error back to callback
  if (error) {
    console.error('OAuth Callback Error:', error, errorDescription)
    const errorMsg = errorDescription || error || 'OAuth authentication failed'
    return NextResponse.redirect(`${origin}/signin?error=${encodeURIComponent(errorMsg)}`)
  }

  if (code) {
    const supabase = await createClient()
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

    if (!exchangeError) {
      // Ensure profile row exists in public.profiles table
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (user) {
          const { data: existingProfile } = await supabase
            .from('profiles')
            .select('id, full_name, onboarding_completed')
            .eq('id', user.id)
            .maybeSingle()

          if (!existingProfile) {
            const rawUsername =
              user.user_metadata?.username ||
              user.email?.split('@')[0] ||
              'scholar'
            const cleanUsername = rawUsername
              .toLowerCase()
              .replace(/[^a-zA-Z0-9_]/g, '_')

            await supabase.from('profiles').insert({
              id: user.id,
              username: `${cleanUsername}_${user.id.slice(0, 4)}`,
              display_name:
                user.user_metadata?.full_name ||
                user.user_metadata?.name ||
                cleanUsername,
              full_name:
                user.user_metadata?.full_name ||
                user.user_metadata?.name ||
                cleanUsername,
              email: user.email,
              avatar_url:
                user.user_metadata?.avatar_url ||
                user.user_metadata?.picture ||
                '',
              role: 'user',
              onboarding_completed: false,
            })
          }
        }
      } catch (err) {
        console.error('Profile creation check in callback error:', err)
      }

      const forwardedHost = request.headers.get('x-forwarded-host')
      const isLocalEnv = process.env.NODE_ENV === 'development'
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    } else {
      console.error('Code exchange failed:', exchangeError)
      return NextResponse.redirect(
        `${origin}/signin?error=${encodeURIComponent(exchangeError.message)}`
      )
    }
  }

  // Fallback if no code and no error
  return NextResponse.redirect(`${origin}/signin?error=auth-callback-failed`)
}
