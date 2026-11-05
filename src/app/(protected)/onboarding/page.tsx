import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { OnboardingWizard } from '@/components/onboarding/OnboardingWizard'

export const metadata = {
  title: 'Personalize Your Dashboard | StudyHub',
  description: 'Set up your personal study workspace.',
}

export default async function OnboardingPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/signin')

  // Check if already completed
  const { data: onboardingProfile } = await supabase
    .from('onboarding_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (onboardingProfile?.onboarding_complete) {
    redirect('/dashboard')
  }

  return (
    <OnboardingWizard
      userId={user.id}
      userEmail={user.email || ''}
      initialName={user.user_metadata?.full_name || user.email?.split('@')[0] || 'Student'}
      existingProfile={onboardingProfile}
    />
  )
}
