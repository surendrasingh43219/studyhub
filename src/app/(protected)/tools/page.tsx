import { StudyToolsClient } from '@/components/tools/StudyToolsClient'

export const runtime = 'edge'

export const metadata = {
  title: 'Study Tools & Pomodoro | StudyHub Pro',
  description: 'Focus timer, ambient audio synthesis, and AI study assistant.',
}

export default function StudyToolsPage() {
  return <StudyToolsClient />
}
