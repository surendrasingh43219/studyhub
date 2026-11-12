import { getCurrentUserOrLocal } from '@/lib/auth/session'
import { redirect } from 'next/navigation'
import { PersonalizedDashboard } from '@/components/dashboard/PersonalizedDashboard'
import { DEFAULT_TASKS, DEFAULT_EXAMS, DEFAULT_GOALS } from '@/lib/data/defaultStudentData'

export const runtime = 'edge'

export const metadata = {
  title: 'Dashboard | StudyHub',
  description: 'Your personal student command center.',
  robots: {
    index: false,
    follow: false,
  },
}

export default async function DashboardPage() {
  const { user, supabase } = await getCurrentUserOrLocal()

  // ── Check if onboarding is complete ──────────────────────────────────────
  const { data: onboardingProfile } = await supabase
    .from('onboarding_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  // If onboarding exists but not complete → redirect to onboarding
  if (onboardingProfile && !onboardingProfile.onboarding_complete) {
    redirect('/onboarding')
  }

  // ── Fetch personalized data in parallel ───────────────────────────────────
  const [
    { data: widgetConfig },
    { data: tasks },
    { data: exams },
    { data: subjects },
    { data: goals },
    { data: readingHistory },
    { count: notesCount },
    { count: bookmarksCount },
    { data: studySessions },
  ] = await Promise.all([
    supabase.from('dashboard_widgets').select('widgets_config').eq('user_id', user.id).single(),
    supabase.from('tasks').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(30),
    supabase.from('user_exams').select('*').eq('user_id', user.id).eq('is_completed', false).order('exam_date', { ascending: true }),
    supabase.from('user_subjects').select('*').eq('user_id', user.id).eq('is_active', true).order('created_at', { ascending: false }),
    supabase.from('user_goals').select('*').eq('user_id', user.id).eq('is_completed', false).order('created_at', { ascending: false }).limit(10),
    supabase.from('reading_progress').select('*, books(*)').eq('user_id', user.id).order('updated_at', { ascending: false }).limit(1),
    supabase.from('notes').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
    supabase.from('bookmarks').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
    supabase.from('study_sessions').select('duration_minutes').eq('user_id', user.id).gte('created_at', `${new Date().toISOString().split('T')[0]}T00:00:00Z`),
  ])

  const todayStudyMinutes = studySessions?.reduce((acc, s) => acc + (s.duration_minutes || 0), 0) || 0

  // ── Build continue reading payload ────────────────────────────────────────
  let continueReading = null
  if (readingHistory && readingHistory.length > 0 && readingHistory[0].books) {
    const book = readingHistory[0].books as any
    continueReading = {
      id: book.id,
      title: book.title,
      author: book.author,
      currentPage: readingHistory[0].current_page || 1,
      totalPages: book.page_count || 100,
      coverUrl: book.cover_url,
      category: book.category || 'General',
    }
  }

  // ── Badges (static for now, will be dynamic in future) ───────────────────
  const badges = [
    { id: 'b1', title: 'First Login', description: 'Logged in for the first time', icon: '🌟', unlocked: true },
    { id: 'b2', title: 'Setup Complete', description: 'Finished personalized onboarding', icon: '🎯', unlocked: !!onboardingProfile?.onboarding_complete },
    { id: 'b3', title: 'Bookworm', description: 'Read your first 3 books', icon: '📚', unlocked: false },
    { id: 'b4', title: 'Night Owl', description: 'Studied past 11 PM', icon: '🦉', unlocked: false },
    { id: 'b5', title: 'Centurion', description: '100 Pomodoro sessions', icon: '⚡', unlocked: false },
    { id: 'b6', title: 'Exam Ready', description: 'Added 3 or more exams', icon: '📋', unlocked: (exams?.length || 0) >= 3 },
  ]

  return (
    <PersonalizedDashboard
      user={{
        id: user.id,
        email: user.email,
        name: onboardingProfile?.display_name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Student',
        avatarEmoji: onboardingProfile?.avatar_emoji || '🎓',
      }}
      stats={{
        todayStudyMinutes,
        currentStreak: 0, // Will be calculated from sessions in a future PR
        totalBooksRead: 0,
        notesCount: notesCount || 0,
        bookmarksCount: bookmarksCount || 0,
      }}
      continueReading={continueReading}
      widgetsConfig={widgetConfig?.widgets_config || []}
      initialTasks={tasks && tasks.length > 0 ? tasks : (DEFAULT_TASKS as any)}
      initialExams={exams && exams.length > 0 ? exams : (DEFAULT_EXAMS as any)}
      initialSubjects={subjects || []}
      initialGoals={goals && goals.length > 0 ? goals : (DEFAULT_GOALS as any)}
      onboardingProfile={onboardingProfile}
      badges={badges}
    />
  )
}
