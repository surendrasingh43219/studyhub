import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ExamsClientView } from '@/components/exams/ExamsClientView'

export const runtime = 'edge'

export const metadata = {
  title: 'Exam Preparation | StudyHub',
  description: 'Track examination syllabi, countdowns, and mock test scores.',
  robots: {
    index: false,
    follow: false,
  },
}

export default async function ExamsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/signin')

  const [{ data: exams }] = await Promise.all([
    supabase
      .from('user_exams')
      .select('*')
      .eq('user_id', user.id)
      .order('exam_date', { ascending: true }),
  ])

  // Fetch topics and mock scores if table exists, else empty array
  let topics: any[] = []
  let mockScores: any[] = []

  try {
    const { data: topicsData } = await supabase.from('exam_topics').select('*').eq('user_id', user.id)
    if (topicsData) topics = topicsData
  } catch {}

  try {
    const { data: mocksData } = await supabase.from('exam_mock_scores').select('*').eq('user_id', user.id)
    if (mocksData) mockScores = mocksData
  } catch {}

  return (
    <ExamsClientView
      initialExams={exams || []}
      initialTopics={topics}
      initialMockScores={mockScores}
    />
  )
}
