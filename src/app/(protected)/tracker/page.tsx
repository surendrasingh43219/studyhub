import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { StudyTrackerClient } from '@/components/tracker/StudyTrackerClient'

export const runtime = 'edge'

export const metadata = {
  title: 'Study Tracker | StudyHub',
  description: 'Focus timer and stopwatch with subject tracking and crash recovery.',
  robots: {
    index: false,
    follow: false,
  },
}

export default async function TrackerPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/signin')

  const [{ data: subjects }, { data: sessions }, { data: profile }] = await Promise.all([
    supabase.from('user_subjects').select('id, name, color').eq('user_id', user.id),
    supabase
      .from('study_sessions')
      .select('id, duration_minutes, notes, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(30),
    supabase.from('onboarding_profiles').select('daily_study_goal_hours').eq('user_id', user.id).single(),
  ])

  return (
    <StudyTrackerClient
      initialSubjects={subjects || []}
      initialSessions={sessions || []}
      dailyGoalHours={profile?.daily_study_goal_hours || 4}
    />
  )
}
