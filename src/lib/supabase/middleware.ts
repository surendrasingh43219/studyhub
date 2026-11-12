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
  // No mock or demo session fallback is permitted.
  let activeUser: any = null
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    activeUser = user
  } catch {
    activeUser = null
  }

  const pathname = request.nextUrl.pathname

  // Gated private routes that STRICTLY require authentication
  const isExplicitlyProtected =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/tasks') ||
    pathname.startsWith('/tracker') ||
    pathname.startsWith('/exams') ||
    pathname.startsWith('/calendar') ||
    pathname.startsWith('/skills') ||
    pathname.startsWith('/projects') ||
    pathname.startsWith('/english') ||
    pathname.startsWith('/goals') ||
    pathname.startsWith('/analytics') ||
    pathname.startsWith('/profile') ||
    pathname.startsWith('/settings') ||
    pathname.startsWith('/notes') ||
    pathname.startsWith('/tools') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/onboarding') ||
    pathname === '/library/upload' ||
    pathname.startsWith('/library/upload/')

  // The public routes allowed without authentication:
  // Public book catalog, public reader, learning guides, legal & auth pages
  const isPublicRoute =
    pathname === '/' ||
    pathname === '/about' ||
    pathname === '/contact' ||
    pathname === '/library' ||
    (pathname.startsWith('/library/') && !pathname.startsWith('/library/upload')) ||
    pathname.startsWith('/reader/') ||
    pathname === '/guides' ||
    pathname.startsWith('/guides/') ||
    pathname === '/signin' ||
    pathname === '/signup' ||
    pathname === '/verify-otp' ||
    pathname === '/forgot-password' ||
    pathname === '/reset-password' ||
    pathname === '/terms' ||
    pathname === '/privacy' ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml' ||
    pathname.startsWith('/google') ||
    pathname.endsWith('.html') ||
    pathname.endsWith('.txt') ||
    pathname.endsWith('.xml') ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/uploads/') ||
    pathname.endsWith('.pdf') ||
    pathname.endsWith('.epub')

  // If unauthenticated user tries to access any protected route -> redirect to /signin with returnTo
  if (!activeUser && (isExplicitlyProtected || !isPublicRoute)) {
    const url = request.nextUrl.clone()
    url.pathname = '/signin'
    url.searchParams.set('returnTo', pathname + request.nextUrl.search)
    return NextResponse.redirect(url)
  }

  // If already authenticated and accessing signin/signup/verify-otp -> redirect to /dashboard
  if (activeUser && (pathname === '/signin' || pathname === '/signup' || pathname === '/verify-otp')) {
    const returnTo = request.nextUrl.searchParams.get('returnTo') || '/dashboard'
    const url = request.nextUrl.clone()
    url.pathname = returnTo.startsWith('/') && !returnTo.startsWith('/signin') && !returnTo.startsWith('/signup') ? returnTo : '/dashboard'
    url.searchParams.delete('returnTo')
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
