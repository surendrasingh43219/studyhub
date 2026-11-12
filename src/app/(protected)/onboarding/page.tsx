import { getCurrentUserOrLocal } from '@/lib/auth/session'
import { redirect } from 'next/navigation'
import { OnboardingWizard } from '@/components/onboarding/OnboardingWizard'

export const runtime = 'edge'

export const metadata = {
  title: 'Personalize Your Dashboard | StudyHub',
  description: 'Set up your personal study workspace.',
}

export default async function OnboardingPage() {
  const { user, supabase } = await getCurrentUserOrLocal()

  // Check if already completed
  let onboardingProfile: any = null
  try {
    const { data } = await supabase
      .from('onboarding_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single()
    onboardingProfile = data
  } catch {}

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
