import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ProjectsClientView } from '@/components/projects/ProjectsClientView'

export const runtime = 'edge'

export const metadata = {
  title: 'My Projects | StudyHub',
  description: 'Manage personal software, analytics, and research projects.',
  robots: {
    index: false,
    follow: false,
  },
}

export default async function ProjectsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/signin')

  let projects: any[] = []
  try {
    const { data } = await supabase
      .from('user_projects')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    if (data) projects = data
  } catch {}

  return <ProjectsClientView initialProjects={projects} />
}
