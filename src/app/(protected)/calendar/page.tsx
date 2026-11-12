import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { CalendarClientView } from '@/components/calendar/CalendarClientView'

export const runtime = 'edge'

export const metadata = {
  title: 'Calendar & Schedule | StudyHub',
  description: 'Manage study events, examinations, deadlines, and reminders.',
  robots: {
    index: false,
    follow: false,
  },
}

export default async function CalendarPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/signin')

  let events: any[] = []
  try {
    const { data } = await supabase
      .from('calendar_events')
      .select('*')
      .eq('user_id', user.id)
      .order('start_time', { ascending: true })
    if (data) events = data
  } catch {}

  return <CalendarClientView initialEvents={events} />
}
