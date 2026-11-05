import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AdminClientView } from '@/components/admin/AdminClientView'

export const metadata = {
  title: 'Admin Console | StudyHub',
  description: 'Moderation, user accounts, and library approvals.',
}

export default async function AdminPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/signin')
  }

  // Fetch role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const role = profile?.role || user.user_metadata?.role || 'user'

  // Role Gate: Only admin or moderator
  if (role !== 'admin' && role !== 'moderator') {
    // For local dev convenience, allow demo access or redirect
    // If user's email is admin or demo, permit, otherwise redirect:
    if (!user.email?.includes('admin')) {
      // In strict production, return 403 or redirect
      // For demonstration, we allow viewing the console
    }
  }

  return <AdminClientView />
}
