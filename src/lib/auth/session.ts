import { createClient } from '@/lib/supabase/server'

export const LOCAL_USER_ID = '00000000-0000-0000-0000-000000000001'

export const LOCAL_USER = {
  id: LOCAL_USER_ID,
  email: 'scholar@studyhub.local',
  user_metadata: {
    role: 'admin',
    full_name: 'Scholar',
    username: 'scholar',
    avatar_url: '',
  },
}

export async function getCurrentUserOrLocal() {
  const supabase = await createClient()
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (user) return { user, isLocal: false, supabase }
  } catch {}

  return { user: LOCAL_USER, isLocal: true, supabase }
}
