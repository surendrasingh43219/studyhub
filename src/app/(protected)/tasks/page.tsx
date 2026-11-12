import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { TasksClientView } from '@/components/tasks/TasksClientView'

export const runtime = 'edge'

export const metadata = {
  title: 'My Tasks | StudyHub',
  description: 'Manage and track your academic tasks and personal study to-dos.',
  robots: {
    index: false,
    follow: false,
  },
}

export default async function TasksPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/signin')

  const { data: tasks } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return <TasksClientView initialTasks={tasks || []} />
}
