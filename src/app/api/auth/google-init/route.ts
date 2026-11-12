import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function GET(request: Request) {
  try {
    const { searchParams, origin } = new URL(request.url)
    const clientOrigin = searchParams.get('origin') || origin
    const supabase = await createClient()

    const callbackUrl = `${clientOrigin}/api/auth/callback`

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: callbackUrl,
        skipBrowserRedirect: true,
      },
    })

    if (error || !data?.url) {
      return NextResponse.json(
        {
          success: false,
          isNotConfigured: true,
          error: error?.message || 'Unable to initialize Google OAuth session.',
        },
        { status: 400 }
      )
    }

    // Probe the URL to verify if Google OAuth provider is actively enabled in Supabase
    try {
      const probe = await fetch(data.url, {
        method: 'GET',
        redirect: 'manual',
      })

      if (probe.status === 400) {
        const bodyText = await probe.text()
        let errJson: any = {}
        try {
          errJson = JSON.parse(bodyText)
        } catch {}

        if (
          errJson?.error_code === 'validation_failed' ||
          errJson?.msg?.includes('not enabled') ||
          bodyText.includes('Unsupported provider')
        ) {
          return NextResponse.json(
            {
              success: false,
              isNotConfigured: true,
              error:
                'Google Sign-In is not enabled yet in your Supabase project. To enable it, add Google Client ID & Secret in Supabase Dashboard (Authentication > Providers > Google). You can sign up/in immediately with Email & Password below!',
            },
            { status: 200 } // Return 200 so frontend can handle gracefully without network error
          )
        }
      }
    } catch {
      // If probe network fails, still give client the URL as fallback
    }

    return NextResponse.json({
      success: true,
      isNotConfigured: false,
      url: data.url,
    })
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: err?.message || 'Failed to initialize Google authentication.',
      },
      { status: 500 }
    )
  }
}
