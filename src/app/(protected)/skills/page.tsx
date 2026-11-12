import { getCurrentUserOrLocal } from '@/lib/auth/session'
import { SkillsClientView } from '@/components/skills/SkillsClientView'

export const runtime = 'edge'

export const metadata = {
  title: 'Skills & Career | StudyHub',
  description: 'Track technical competencies, professional growth, and job applications.',
  robots: {
    index: false,
    follow: false,
  },
}

export default async function SkillsPage() {
  const { user, supabase } = await getCurrentUserOrLocal()

  let skills: any[] = []
  let applications: any[] = []

  try {
    const { data: skillsData } = await supabase.from('user_skills').select('*').eq('user_id', user.id)
    if (skillsData) skills = skillsData
  } catch {}

  try {
    const { data: appsData } = await supabase.from('job_applications').select('*').eq('user_id', user.id)
    if (appsData) applications = appsData
  } catch {}

  return <SkillsClientView initialSkills={skills} initialApplications={applications} />
}
