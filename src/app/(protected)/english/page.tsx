import { getCurrentUserOrLocal } from '@/lib/auth/session'
import { EnglishClientView } from '@/components/english/EnglishClientView'
import { DEFAULT_ENGLISH_LOGS, DEFAULT_VOCABULARY } from '@/lib/data/defaultStudentData'

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
  const { user, supabase } = await getCurrentUserOrLocal()

  let logs: any[] = []
  let vocab: any[] = []
  let mocks: any[] = []

  try {
    const { data: logsData } = await supabase.from('english_logs').select('*').eq('user_id', user.id).order('practice_date', { ascending: false })
    if (logsData && logsData.length > 0) logs = logsData
  } catch {}

  try {
    const { data: vocabData } = await supabase.from('english_vocabulary').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
    if (vocabData && vocabData.length > 0) vocab = vocabData
  } catch {}

  try {
    const { data: mocksData } = await supabase.from('ielts_mock_scores').select('*').eq('user_id', user.id).order('test_date', { ascending: false })
    if (mocksData && mocksData.length > 0) mocks = mocksData
  } catch {}

  return (
    <EnglishClientView
      initialLogs={logs.length > 0 ? logs : (DEFAULT_ENGLISH_LOGS as any)}
      initialVocab={vocab.length > 0 ? vocab : (DEFAULT_VOCABULARY as any)}
      initialMocks={mocks}
    />
  )
}
