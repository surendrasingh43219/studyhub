import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AppShell } from '@/components/layout/AppShell'

export const runtime = 'edge'

export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
}

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  let user: any = null
  try {
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser()
    user = authUser
  } catch {}

  if (!user) {
    redirect('/signin')
  }

  // Get user profile role
  let profile: any = null
  try {
    const { data } = await supabase
      .from('profiles')
      .select('role, full_name, username, avatar_url')
      .eq('id', user.id)
      .single()
    profile = data
  } catch {}

  const userWithProfile = {
    ...user,
    user_metadata: {
      ...user.user_metadata,
      role: profile?.role || user.user_metadata?.role || 'user',
      full_name: profile?.full_name || user.user_metadata?.full_name || 'Scholar',
      username: profile?.username || user.user_metadata?.username || 'scholar',
      avatar_url: profile?.avatar_url || user.user_metadata?.avatar_url,
    },
  }

  return (
    <AppShell user={userWithProfile}>
      {children}
    </AppShell>
  )
}
