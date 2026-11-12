import { getCurrentUserOrLocal } from '@/lib/auth/session'
import { ExamsClientView } from '@/components/exams/ExamsClientView'
import { DEFAULT_EXAMS } from '@/lib/data/defaultStudentData'

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
  const { user, supabase } = await getCurrentUserOrLocal()

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

  const loadedExams = exams && exams.length > 0 ? exams : (DEFAULT_EXAMS as any)

  return (
    <ExamsClientView
      initialExams={loadedExams}
      initialTopics={topics}
      initialMockScores={mockScores}
    />
  )
}
