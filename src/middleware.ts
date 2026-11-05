import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - uploads (uploaded book documents)
     * - favicon.ico (favicon file)
     * - manifest.json / service worker files
     * - images, pdf, epub assets
     */
    '/((?!_next/static|_next/image|uploads|favicon.ico|manifest.json|sw.js|.*\\.(?:svg|png|jpg|jpeg|gif|webp|pdf|epub)$).*)',
  ],
}
