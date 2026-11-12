'use client'

import { useState } from 'react'
import { AlertCircle, HelpCircle, Loader2 } from 'lucide-react'

export function OAuthButtons() {
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [showConfigGuide, setShowConfigGuide] = useState(false)

  const handleGoogleLogin = async () => {
    try {
      setLoading(true)
      setErrorMsg(null)
      setShowConfigGuide(false)

      const res = await fetch(
        `/api/auth/google-init?origin=${encodeURIComponent(window.location.origin)}`,
        { method: 'GET' }
      )

      const data = await res.json()

      if (!data.success) {
        setErrorMsg(data.error || 'Google Sign-In is temporarily unavailable.')
        if (data.isNotConfigured) {
          setShowConfigGuide(true)
        }
        setLoading(false)
        return
      }

      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error('No authorization URL received.')
      }
    } catch (err: any) {
      console.error('OAuth error:', err)
      setErrorMsg(err.message || 'Unable to connect to Google authentication service.')
      setLoading(false)
    }
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={loading}
        className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-slate-800/90 hover:bg-slate-700 active:bg-slate-900 border border-slate-700 hover:border-slate-600 rounded-xl text-sm font-medium text-slate-200 transition-all shadow-sm disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
            <span className="text-slate-300">Connecting to Google...</span>
          </>
        ) : (
          <>
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </>
        )}
      </button>

      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-xs text-amber-200 space-y-2 animate-in fade-in">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed font-normal">{errorMsg}</p>
          </div>

          {showConfigGuide && (
            <div className="pt-2 border-t border-amber-500/20 text-[11px] space-y-1.5 text-slate-300">
              <div className="font-semibold text-cyan-300 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>How to activate Google Login in Supabase:</span>
              </div>
              <ol className="list-decimal pl-4 space-y-1 text-slate-400">
                <li>
                  Open{' '}
                  <a
                    href="https://console.cloud.google.com/apis/credentials"
                    target="_blank"
                    rel="noreferrer"
                    className="text-cyan-400 hover:underline font-medium"
                  >
                    Google Cloud Console
                  </a>{' '}
                  and create an OAuth 2.0 Client ID (Web Application).
                </li>
                <li>
                  Set Authorized Redirect URI to:{' '}
                  <code className="bg-slate-900 text-cyan-300 px-1 py-0.5 rounded text-[10px]">
                    https://msudsyupqkqfzokrqjep.supabase.co/auth/v1/callback
                  </code>
                </li>
                <li>
                  In your{' '}
                  <a
                    href="https://supabase.com/dashboard/project/msudsyupqkqfzokrqjep/auth/providers"
                    target="_blank"
                    rel="noreferrer"
                    className="text-cyan-400 hover:underline font-medium"
                  >
                    Supabase Auth Providers
                  </a>
                  , turn on <strong>Google</strong> and paste the Client ID and Secret.
                </li>
              </ol>
              <div className="mt-2 p-2 rounded-lg bg-cyan-950/40 border border-cyan-800/30 text-cyan-300 font-medium">
                👉 In the meantime, you and your students can register and sign in instantly using the Email form below!
              </div>
            </div>
          )}
        </div>
      )}

      <div className="relative flex items-center justify-center">
        <div className="border-t border-slate-700 w-full" />
        <span className="bg-[#141724] px-3 text-xs text-slate-400 uppercase tracking-wider">
          or with email
        </span>
      </div>
    </div>
  )
}
