import { getCurrentUserOrLocal } from '@/lib/auth/session'
import { AdminClientView } from '@/components/admin/AdminClientView'

export const runtime = 'edge'

export const metadata = {
  title: 'Admin Console | StudyHub',
  description: 'Moderation, user accounts, and library approvals.',
}

export default async function AdminPage() {
  const { user, supabase } = await getCurrentUserOrLocal()

  // Fetch role
  let role = 'admin'
  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    role = profile?.role || user.user_metadata?.role || 'admin'
  } catch {}

  return <AdminClientView />
}
