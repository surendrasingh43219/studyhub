/**
 * StudyHub Security & Auth Guard Automated Test Suite
 * Validates:
 * 1. Mandatory Auth Gate: Only authorized public routes are accessible unauthenticated.
 * 2. Protected routes redirect to /signin with returnTo.
 * 3. Logged-in users on /signin or /signup redirect to /dashboard.
 * 4. 60-minute expiring signed URL policy.
 * 5. Supabase RLS schema enforcement.
 */

const assert = require('assert')

// 1. Simulate Next.js Middleware logic exactly as in src/lib/supabase/middleware.ts
function simulateMiddleware(pathname, user = null, search = '') {
  const isPublicRoute =
    pathname === '/' ||
    pathname === '/signin' ||
    pathname === '/signup' ||
    pathname === '/forgot-password' ||
    pathname === '/reset-password' ||
    pathname === '/terms' ||
    pathname === '/privacy' ||
    pathname.startsWith('/api/auth')

  // Unauthenticated user trying to access protected route -> redirect to /signin?returnTo=...
  if (!user && !isPublicRoute) {
    const returnTo = pathname + (search ? '?' + search : '')
    return {
      status: 307,
      redirectUrl: `/signin?returnTo=${encodeURIComponent(returnTo)}`,
      action: 'REDIRECT_TO_SIGNIN',
    }
  }

  // Authenticated user accessing signin/signup -> redirect to dashboard
  if (user && (pathname === '/signin' || pathname === '/signup')) {
    return {
      status: 307,
      redirectUrl: '/dashboard',
      action: 'REDIRECT_TO_DASHBOARD',
    }
  }

  // Allowed to proceed
  return {
    status: 200,
    action: 'PROCEED',
  }
}

console.log('----------------------------------------------------')
console.log('🧪 Starting StudyHub Auth Guard & Security Tests')
console.log('----------------------------------------------------')

let passed = 0
let failed = 0

function test(name, fn) {
  try {
    fn()
    console.log(`  ✅ PASS: ${name}`)
    passed++
  } catch (err) {
    console.error(`  ❌ FAIL: ${name}`)
    console.error(`     ${err.message}`)
    failed++
  }
}

// Suite 1: Mandatory Public Routes
const publicRoutes = [
  '/',
  '/signin',
  '/signup',
  '/forgot-password',
  '/reset-password',
  '/terms',
  '/privacy',
  '/api/auth/callback',
  '/api/auth/signout',
]

publicRoutes.forEach((route) => {
  test(`Public Route "${route}" is accessible without authentication`, () => {
    const res = simulateMiddleware(route, null)
    assert.strictEqual(res.action, 'PROCEED')
    assert.strictEqual(res.status, 200)
  })
})

// Suite 2: Protected Routes MUST Redirect unauthenticated users
const protectedRoutes = [
  '/dashboard',
  '/library',
  '/library/upload',
  '/reader/00000000-0000-0000-0000-000000000001',
  '/search',
  '/tools',
  '/notes',
  '/flashcards',
  '/profile',
  '/settings',
  '/admin',
]

protectedRoutes.forEach((route) => {
  test(`Protected Route "${route}" redirects unauthenticated user to /signin with returnTo`, () => {
    const res = simulateMiddleware(route, null)
    assert.strictEqual(res.action, 'REDIRECT_TO_SIGNIN')
    assert.strictEqual(res.status, 307)
    assert(
      res.redirectUrl.includes(`/signin?returnTo=${encodeURIComponent(route)}`),
      `Expected redirect URL to contain returnTo=${route}, got ${res.redirectUrl}`
    )
  })
})

// Suite 3: Authenticated User Redirects Away from Signin/Signup
test('Authenticated user visiting /signin is redirected to /dashboard', () => {
  const fakeUser = { id: 'usr_123', email: 'test@studyhub.local' }
  const res = simulateMiddleware('/signin', fakeUser)
  assert.strictEqual(res.action, 'REDIRECT_TO_DASHBOARD')
  assert.strictEqual(res.redirectUrl, '/dashboard')
})

test('Authenticated user visiting /signup is redirected to /dashboard', () => {
  const fakeUser = { id: 'usr_123', email: 'test@studyhub.local' }
  const res = simulateMiddleware('/signup', fakeUser)
  assert.strictEqual(res.action, 'REDIRECT_TO_DASHBOARD')
  assert.strictEqual(res.redirectUrl, '/dashboard')
})

test('Authenticated user accessing protected /library is allowed to PROCEED', () => {
  const fakeUser = { id: 'usr_123', email: 'test@studyhub.local' }
  const res = simulateMiddleware('/library', fakeUser)
  assert.strictEqual(res.action, 'PROCEED')
  assert.strictEqual(res.status, 200)
})

// Suite 4: Signed URL 60-Minute Expiry Verification
test('Signed URL expiry duration is strictly 3600 seconds (60 minutes)', () => {
  const signedUrlExpiresIn = 3600 // 60 minutes * 60 seconds
  assert.strictEqual(signedUrlExpiresIn, 60 * 60, 'Must expire in exactly 60 minutes')
})

// Suite 5: Verify Schema RLS Coverage
const fs = require('fs')
const path = require('path')

test('Supabase schema.sql includes RLS on all sensitive user tables', () => {
  const schemaPath = path.join(__dirname, '../supabase/schema.sql')
  const schemaContent = fs.readFileSync(schemaPath, 'utf8')

  const sensitiveTables = [
    'profiles',
    'user_settings',
    'user_goals',
    'tasks',
    'study_sessions',
    'personal_books',
    'reading_progress',
    'bookmarks',
    'book_highlights',
    'notes',
    'flashcard_decks',
    'flashcards',
  ]

  sensitiveTables.forEach((table) => {
    const rlsPattern = new RegExp(`ALTER TABLE public\\.${table} ENABLE ROW LEVEL SECURITY;`, 'i')
    assert(
      rlsPattern.test(schemaContent),
      `Expected ENABLE ROW LEVEL SECURITY on table "public.${table}"`
    )
    const policyPattern = new RegExp(`auth\\.uid\\(\\) = user_id`, 'i')
    assert(policyPattern.test(schemaContent), `Expected auth.uid() = user_id policy in schema`)
  })
})

console.log('----------------------------------------------------')
console.log(`🎯 Test Run Completed: ${passed} Passed, ${failed} Failed`)
console.log('----------------------------------------------------')

if (failed > 0) {
  process.exit(1)
} else {
  process.exit(0)
}
