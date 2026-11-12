import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { GoalsClientView } from '@/components/goals/GoalsClientView'

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
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/signin')

  const { data: goals } = await supabase
    .from('user_goals')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return <GoalsClientView initialGoals={goals || []} />
}
