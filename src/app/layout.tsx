import type { Metadata, Viewport } from 'next'
import './globals.css'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0c0d14',
}

export const metadata: Metadata = {
  title: 'StudyHub | Open-Source Digital Library & Study Platform',
  description: 'Full-stack study platform with an open-source digital library, personal dashboards, and deep-focus study tools.',
  keywords: ['StudyHub', 'Digital Library', 'Study Platform', 'PDF Reader', 'Pomodoro Timer', 'Flashcards'],
  authors: [{ name: 'StudyHub Platform' }],
  verification: {
    google: '4c518c375c3a50f6',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0c0d14] text-slate-100 antialiased selection:bg-blue-600 selection:text-white">
        {children}
      </body>
    </html>
  )
}
