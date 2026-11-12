import { getCurrentUserOrLocal } from '@/lib/auth/session'
import { TasksClientView } from '@/components/tasks/TasksClientView'
import { DEFAULT_TASKS } from '@/lib/data/defaultStudentData'

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
  const { user, supabase } = await getCurrentUserOrLocal()

  const { data: tasks } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const loadedTasks = tasks && tasks.length > 0 ? tasks : (DEFAULT_TASKS as any)

  return <TasksClientView initialTasks={loadedTasks} />
}
