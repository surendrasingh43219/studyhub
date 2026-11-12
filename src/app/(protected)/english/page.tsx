import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { EnglishClientView } from '@/components/english/EnglishClientView'

export const runtime = 'edge'

export const metadata = {
  title: 'English Practice & Communication | StudyHub',
  description: 'Practice spoken English, track active vocabulary, and prepare for IELTS/TOEFL.',
  robots: {
    index: false,
    follow: false,
  },
}

export default async function EnglishPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/signin')

  let logs: any[] = []
  let vocab: any[] = []
  let mocks: any[] = []

  try {
    const { data: logsData } = await supabase.from('english_logs').select('*').eq('user_id', user.id).order('practice_date', { ascending: false })
    if (logsData) logs = logsData
  } catch {}

  try {
    const { data: vocabData } = await supabase.from('vocabulary_words').select('*').eq('user_id', user.id)
    if (vocabData) vocab = vocabData
  } catch {}

  try {
    const { data: mocksData } = await supabase.from('english_mock_scores').select('*').eq('user_id', user.id)
    if (mocksData) mocks = mocksData
  } catch {}

  return (
    <EnglishClientView
      initialLogs={logs}
      initialVocab={vocab}
      initialMocks={mocks}
      targetIeltsScore={7.5}
    />
  )
}
