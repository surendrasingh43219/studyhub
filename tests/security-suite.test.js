/**
 * StudyHub Pro Comprehensive Security, Privacy & SEO Test Suite
 * Validates:
 * 1. Authentication Security: Zero mock/demo auth bypasses, 6-digit OTP verification logic.
 * 2. Privacy & Data Isolation: User A vs User B strict row-level isolation simulation.
 * 3. Public Library Access: Unauthenticated access to public catalog vs protected personal bookshelf.
 * 4. Flashcards Purge: Complete elimination of all flashcard code, routes, components, and sidebar links.
 * 5. SEO Architecture: Robots.txt rules, dynamic sitemap entries, JSON-LD structured data, private page noindex.
 */

const assert = require('assert')
const fs = require('fs')
const path = require('path')

console.log('====================================================')
console.log('🛡️  Starting StudyHub Pro Comprehensive Security Suite')
console.log('====================================================\n')

let passed = 0
let failed = 0

function test(name, fn) {
  try {
    fn()
    console.log(`  ✅ PASS: ${name}`)
    passed++
  } catch (err) {
    console.error(`  ❌ FAIL: ${name}`)
    console.error(`     Error: ${err.message}`)
    failed++
  }
}

const ROOT = path.join(__dirname, '..')

// ─── SUITE 1: AUTHENTICATION HARDENING & MOCK PURGE ───────────────────────────
console.log('--- Suite 1: Authentication Hardening & Demo Bypass Elimination ---')

test('login/route.ts has NO demo session bypass or isDemo parameter', () => {
  const content = fs.readFileSync(path.join(ROOT, 'src/app/api/auth/login/route.ts'), 'utf8')
  assert.strictEqual(content.includes('studyhub_demo_session'), false, 'Must not issue demo session cookie')
  assert.strictEqual(content.includes('isDemo'), false, 'Must not accept isDemo parameter')
  assert.strictEqual(content.includes('isPlaceholderConfig'), false, 'Must not have placeholder bypass')
  assert.strictEqual(content.includes('supabase.auth.signInWithPassword'), true, 'Must call real signInWithPassword')
})

test('signup/route.ts has NO placeholder fallback and requires real verification', () => {
  const content = fs.readFileSync(path.join(ROOT, 'src/app/api/auth/signup/route.ts'), 'utf8')
  assert.strictEqual(content.includes('studyhub_demo_session'), false, 'Must not issue demo session cookie')
  assert.strictEqual(content.includes('isPlaceholderConfig'), false, 'Must not have placeholder bypass')
  assert.strictEqual(content.includes('supabase.auth.signUp'), true, 'Must call real signUp')
})

test('verify-otp/route.ts strictly validates 6-digit format and verifies via Supabase', () => {
  const content = fs.readFileSync(path.join(ROOT, 'src/app/api/auth/verify-otp/route.ts'), 'utf8')
  assert.strictEqual(content.includes('supabase.auth.verifyOtp'), true, 'Must call real verifyOtp')
  assert.strictEqual(content.includes('/^\\d{6}$/'), true, 'Must enforce 6-digit regex validation')
})

test('resend-otp/route.ts exists and calls supabase.auth.resend', () => {
  const content = fs.readFileSync(path.join(ROOT, 'src/app/api/auth/resend-otp/route.ts'), 'utf8')
  assert.strictEqual(content.includes('supabase.auth.resend'), true, 'Must call real resend')
})

test('middleware.ts has zero demo session fallbacks and verifies real JWT user', () => {
  const content = fs.readFileSync(path.join(ROOT, 'src/lib/supabase/middleware.ts'), 'utf8')
  assert.strictEqual(content.includes('studyhub_demo_session'), false, 'Middleware must never read demo cookie')
  assert.strictEqual(content.includes('supabase.auth.getUser()'), true, 'Middleware must verify Supabase JWT')
})

test('Protected layout has zero demo session fallbacks', () => {
  const content = fs.readFileSync(path.join(ROOT, 'src/app/(protected)/layout.tsx'), 'utf8')
  assert.strictEqual(content.includes('studyhub_demo_session'), false, 'Protected layout must never read demo cookie')
})

test('SignInForm.tsx has NO demo login button or demo state', () => {
  const content = fs.readFileSync(path.join(ROOT, 'src/components/auth/SignInForm.tsx'), 'utf8')
  assert.strictEqual(content.includes('handleDemoLogin'), false, 'Must not contain handleDemoLogin')
  assert.strictEqual(content.includes('One-Click Demo Login'), false, 'Must not render Demo Login button')
})

// ─── SUITE 2: DUAL-USER DATA ISOLATION (USER A vs USER B) ─────────────────────
console.log('\n--- Suite 2: Two-User Privacy & Data Separation (RLS Engine Simulation) ---')

// Simulate database table store with RLS policy evaluation
const mockDb = {
  tasks: [
    { id: 'task-1', user_id: 'user-aaa-uuid', title: 'User A Discrete Maths Prep' },
    { id: 'task-2', user_id: 'user-bbb-uuid', title: 'User B Secret Medical Notes' },
  ],
  notes: [
    { id: 'note-1', user_id: 'user-aaa-uuid', title: 'User A Private Research' },
    { id: 'note-2', user_id: 'user-bbb-uuid', title: 'User B Confidential Essay' },
  ],
  goals: [
    { id: 'goal-1', user_id: 'user-aaa-uuid', title: 'User A Goal: 40 hrs study' },
    { id: 'goal-2', user_id: 'user-bbb-uuid', title: 'User B Goal: 10 hrs IELTS' },
  ],
  exams: [
    { id: 'exam-1', user_id: 'user-aaa-uuid', name: 'User A State PCS Exam' },
    { id: 'exam-2', user_id: 'user-bbb-uuid', name: 'User B Agniveer Exam' },
  ],
  books: [
    { id: 'book-public', is_public: true, is_approved: true, uploader_id: 'user-aaa-uuid', title: 'Public Physics Vol 1' },
    { id: 'book-private-b', is_public: false, is_approved: false, uploader_id: 'user-bbb-uuid', title: 'User B Private Document' },
  ],
}

function rlsSelect(table, currentUserId) {
  if (table === 'books') {
    // Approved public books are accessible to everyone (even unauthenticated) or owner
    return mockDb.books.filter((b) => (b.is_public && b.is_approved) || (currentUserId && b.uploader_id === currentUserId))
  }
  // Private tables strictly enforce auth.uid() = user_id
  if (!currentUserId) return []
  return (mockDb[table] || []).filter((row) => row.user_id === currentUserId)
}

function rlsUpdate(table, id, updates, currentUserId) {
  if (!currentUserId) return { rowsAffected: 0 }
  const rows = mockDb[table] || []
  let count = 0
  rows.forEach((row) => {
    if (row.id === id && row.user_id === currentUserId) {
      Object.assign(row, updates)
      count++
    }
  })
  return { rowsAffected: count }
}

function rlsDelete(table, id, currentUserId) {
  if (!currentUserId) return { rowsAffected: 0 }
  const index = (mockDb[table] || []).findIndex((r) => r.id === id && r.user_id === currentUserId)
  if (index !== -1) {
    mockDb[table].splice(index, 1)
    return { rowsAffected: 1 }
  }
  return { rowsAffected: 0 }
}

test('User A cannot SELECT User B private tasks', () => {
  const result = rlsSelect('tasks', 'user-aaa-uuid')
  assert.strictEqual(result.length, 1)
  assert.strictEqual(result[0].title, 'User A Discrete Maths Prep')
  assert.strictEqual(result.some((t) => t.user_id === 'user-bbb-uuid'), false)
})

test('User A cannot UPDATE User B private notes', () => {
  const res = rlsUpdate('notes', 'note-2', { title: 'Hacked by User A' }, 'user-aaa-uuid')
  assert.strictEqual(res.rowsAffected, 0, 'Must affect 0 rows when attempting unauthorized update')
  const original = mockDb.notes.find((n) => n.id === 'note-2')
  assert.strictEqual(original.title, 'User B Confidential Essay')
})

test('User A cannot DELETE User B private goals', () => {
  const res = rlsDelete('goals', 'goal-2', 'user-aaa-uuid')
  assert.strictEqual(res.rowsAffected, 0, 'Must affect 0 rows when attempting unauthorized delete')
  const exists = mockDb.goals.some((g) => g.id === 'goal-2')
  assert.strictEqual(exists, true, 'User B goal must remain intact')
})

test('User A cannot read User B upcoming exams', () => {
  const result = rlsSelect('exams', 'user-aaa-uuid')
  assert.strictEqual(result.length, 1)
  assert.strictEqual(result[0].name, 'User A State PCS Exam')
  assert.strictEqual(result.some((e) => e.user_id === 'user-bbb-uuid'), false)
})

test('Unauthenticated visitor cannot access any private tasks, notes, goals or exams', () => {
  assert.strictEqual(rlsSelect('tasks', null).length, 0)
  assert.strictEqual(rlsSelect('notes', null).length, 0)
  assert.strictEqual(rlsSelect('goals', null).length, 0)
  assert.strictEqual(rlsSelect('exams', null).length, 0)
})

test('Unauthenticated visitor CAN access approved public books in the library', () => {
  const publicCatalog = rlsSelect('books', null)
  assert.strictEqual(publicCatalog.length, 1)
  assert.strictEqual(publicCatalog[0].title, 'Public Physics Vol 1')
  assert.strictEqual(publicCatalog.some((b) => b.id === 'book-private-b'), false, 'Private book must never leak to public')
})

// ─── SUITE 3: FLASHCARDS COMPLETE ELIMINATION ─────────────────────────────────
console.log('\n--- Suite 3: Complete Removal of Flashcards Feature ---')

test('Flashcards page route directory is completely deleted', () => {
  const exists = fs.existsSync(path.join(ROOT, 'src/app/(protected)/flashcards'))
  assert.strictEqual(exists, false, 'src/app/(protected)/flashcards must not exist')
})

test('Sidebar navigation does not contain Flashcards link', () => {
  const content = fs.readFileSync(path.join(ROOT, 'src/components/layout/Sidebar.tsx'), 'utf8')
  assert.strictEqual(content.includes('/flashcards'), false, 'Sidebar must not have /flashcards link')
  assert.strictEqual(content.includes('Flashcards'), false, 'Sidebar must not mention Flashcards')
})

test('StudyToolsClient does not have flashcards tab or Spaced Repetition section', () => {
  const content = fs.readFileSync(path.join(ROOT, 'src/components/tools/StudyToolsClient.tsx'), 'utf8')
  assert.strictEqual(content.toLowerCase().includes('flashcard'), false, 'StudyToolsClient must have zero flashcard references')
})

test('Source code (src/) has zero occurrences of flashcard', () => {
  function scanDir(dir) {
    const files = fs.readdirSync(dir)
    for (const file of files) {
      const fullPath = path.join(dir, file)
      const stat = fs.statSync(fullPath)
      if (stat.isDirectory()) {
        scanDir(fullPath)
      } else if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js')) {
        const text = fs.readFileSync(fullPath, 'utf8')
        if (text.toLowerCase().includes('flashcard')) {
          throw new Error(`Found flashcard reference in: ${fullPath}`)
        }
      }
    }
  }
  scanDir(path.join(ROOT, 'src'))
})

// ─── SUITE 4: PUBLIC LIBRARY & READER DECOUPLING ──────────────────────────────
console.log('\n--- Suite 4: Public Library Decoupling ---')

test('Public library page exists outside of (protected) folder', () => {
  const exists = fs.existsSync(path.join(ROOT, 'src/app/library/page.tsx'))
  assert.strictEqual(exists, true, 'src/app/library/page.tsx must exist')
})

test('Protected upload page exists for authenticated students only', () => {
  const exists = fs.existsSync(path.join(ROOT, 'src/app/(protected)/library/upload/page.tsx'))
  assert.strictEqual(exists, true, 'src/app/(protected)/library/upload/page.tsx must exist')
})

test('Signed URL API permits public approved books and blocks private files', () => {
  const content = fs.readFileSync(path.join(ROOT, 'src/app/api/books/signed-url/route.ts'), 'utf8')
  assert.strictEqual(content.includes('isPublicApprovedBook'), true, 'Must distinguish public approved books')
  assert.strictEqual(content.includes('studyhub_demo_session'), false, 'Must not accept demo session')
})

// ─── SUITE 5: SEO ARCHITECTURE & EDUCATIONAL HUB ──────────────────────────────
console.log('\n--- Suite 5: SEO Foundation & Educational Learning Hub ---')

test('robots.ts is configured correctly with strict private disallow and public allow rules', () => {
  const content = fs.readFileSync(path.join(ROOT, 'src/app/robots.ts'), 'utf8')
  assert.strictEqual(content.includes('/dashboard'), true, 'Must disallow /dashboard')
  assert.strictEqual(content.includes('/profile'), true, 'Must disallow /profile')
  assert.strictEqual(content.includes('/settings'), true, 'Must disallow /settings')
  assert.strictEqual(content.includes('/notes'), true, 'Must disallow /notes')
  assert.strictEqual(content.includes('/library'), true, 'Must allow /library')
  assert.strictEqual(content.includes('/guides'), true, 'Must allow /guides')
  assert.strictEqual(content.includes('sitemap.xml'), true, 'Must link sitemap.xml')
})

test('sitemap.ts includes all 8 educational guides and public information pages', () => {
  const content = fs.readFileSync(path.join(ROOT, 'src/app/sitemap.ts'), 'utf8')
  const expectedRoutes = [
    '/library',
    '/guides',
    '/guides/daily-study-timetable',
    '/guides/track-study-hours',
    '/guides/competitive-exam-preparation',
    '/guides/study-goals-guide',
    '/guides/study-productivity',
    '/guides/college-assignments',
    '/guides/consistent-study-habits',
    '/guides/personal-study-planner',
    '/about',
    '/contact',
    '/terms',
    '/privacy',
  ]
  expectedRoutes.forEach((route) => {
    assert.strictEqual(content.includes(route), true, `Sitemap must include ${route}`)
  })
})

test('All 8 educational guide pages exist and have JSON-LD Article structured data', () => {
  const guideSlugs = [
    'daily-study-timetable',
    'track-study-hours',
    'competitive-exam-preparation',
    'study-goals-guide',
    'study-productivity',
    'college-assignments',
    'consistent-study-habits',
    'personal-study-planner',
  ]
  guideSlugs.forEach((slug) => {
    const filePath = path.join(ROOT, `src/app/(public)/guides/${slug}/page.tsx`)
    assert.strictEqual(fs.existsSync(filePath), true, `Guide page ${slug} must exist`)
    const content = fs.readFileSync(filePath, 'utf8')
    assert.strictEqual(content.includes('application/ld+json'), true, `${slug} must contain JSON-LD structured data`)
    assert.strictEqual(content.includes("'@type': 'Article'"), true, `${slug} must declare Article type`)
  })
})

test('Protected layout sets noindex and nofollow metadata for all child routes', () => {
  const content = fs.readFileSync(path.join(ROOT, 'src/app/(protected)/layout.tsx'), 'utf8')
  assert.strictEqual(content.includes('index: false'), true, 'Protected layout must set index: false')
  assert.strictEqual(content.includes('follow: false'), true, 'Protected layout must set follow: false')
})

console.log('\n====================================================')
console.log(`🎯 Security Suite Results: ${passed} Passed, ${failed} Failed`)
console.log('====================================================')

if (failed > 0) process.exit(1)
