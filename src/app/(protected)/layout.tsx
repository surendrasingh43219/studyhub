import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { Sidebar } from '@/components/layout/Sidebar'
import { Navbar } from '@/components/layout/Navbar'

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
    const cookieStore = await cookies()
    const demoCookie = cookieStore.get('studyhub_demo_session')
    if (demoCookie?.value) {
      try {
        user = JSON.parse(demoCookie.value)
      } catch {}
    }
  }

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
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden">
      {/* Sidebar navigation */}
      <Sidebar userRole={userWithProfile.user_metadata.role} username={userWithProfile.user_metadata.username} />

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar user={userWithProfile} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-950/60">
          <div className="max-w-7xl mx-auto space-y-8">{children}</div>
        </main>
      </div>
    </div>
  )
}
