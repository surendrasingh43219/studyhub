import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key',
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: Array<{ name: string; value: string; options?: any }>) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: DO NOT remove getUser() - it verifies the JWT with Supabase Auth servers
  let activeUser: any = null
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    activeUser = user
  } catch {}

  // Fallback for local demo mode session
  if (!activeUser) {
    const demoCookie = request.cookies.get('studyhub_demo_session')
    if (demoCookie?.value) {
      try {
        activeUser = JSON.parse(demoCookie.value)
      } catch {}
    }
  }

  const pathname = request.nextUrl.pathname

  // The ONLY public routes allowed without authentication
  const isPublicRoute =
    pathname === '/' ||
    pathname === '/signin' ||
    pathname === '/signup' ||
    pathname === '/forgot-password' ||
    pathname === '/reset-password' ||
    pathname === '/terms' ||
    pathname === '/privacy' ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/uploads/') ||
    pathname.endsWith('.pdf') ||
    pathname.endsWith('.epub')

  // If unauthenticated user tries to access any protected route -> redirect to /signin with returnTo
  if (!activeUser && !isPublicRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/signin'
    url.searchParams.set('returnTo', pathname + request.nextUrl.search)
    return NextResponse.redirect(url)
  }

  // If already authenticated and accessing signin/signup -> redirect to /dashboard
  if (activeUser && (pathname === '/signin' || pathname === '/signup')) {
    const returnTo = request.nextUrl.searchParams.get('returnTo') || '/dashboard'
    const url = request.nextUrl.clone()
    url.pathname = returnTo.startsWith('/') ? returnTo : '/dashboard'
    url.searchParams.delete('returnTo')
    return NextResponse.redirect(url)
  }

  // Allow /api/onboarding and /api/dashboard/* without extra check (they handle auth internally)
  // /onboarding is a protected route — handled by the layout guard above

  return supabaseResponse
}
