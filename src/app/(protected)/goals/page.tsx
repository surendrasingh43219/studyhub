import { getCurrentUserOrLocal } from '@/lib/auth/session'
import { GoalsClientView } from '@/components/goals/GoalsClientView'
import { DEFAULT_GOALS } from '@/lib/data/defaultStudentData'

export const runtime = 'edge'

export const metadata = {
  title: 'Goals & Habits | StudyHub',
  description: 'Manage long-term academic ambitions and daily consistency habits.',
  robots: {
    index: false,
    follow: false,
  },
}

export default async function GoalsPage() {
  const { user, supabase } = await getCurrentUserOrLocal()

  const { data: goals } = await supabase
    .from('user_goals')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const loadedGoals = goals && goals.length > 0 ? goals : (DEFAULT_GOALS as any)

  return <GoalsClientView initialGoals={loadedGoals} />
}
