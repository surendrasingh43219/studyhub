import { getCurrentUserOrLocal } from '@/lib/auth/session'
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
  const { user, supabase } = await getCurrentUserOrLocal()

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
