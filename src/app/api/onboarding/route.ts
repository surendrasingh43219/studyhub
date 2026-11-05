import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      display_name,
      avatar_emoji,
      bio,
      education_type,
      career_interests,
      current_institution,
      current_year,
      daily_study_goal_hours,
      preferred_study_time,
      selected_widgets,
      theme,
      accent_color,
      onboarding_step,
      onboarding_complete,
      exams,
      subjects,
    } = body

    // 1. Upsert onboarding profile
    const { error: profileError } = await supabase
      .from('onboarding_profiles')
      .upsert({
        user_id: user.id,
        display_name,
        avatar_emoji,
        bio,
        education_type: education_type || null,
        career_interests: career_interests || [],
        current_institution,
        current_year,
        daily_study_goal_hours,
        preferred_study_time,
        selected_widgets: selected_widgets || [],
        theme,
        accent_color,
        onboarding_step,
        onboarding_complete,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' })

    if (profileError) {
      console.error('Onboarding profile error:', profileError)
      return NextResponse.json({ error: profileError.message }, { status: 500 })
    }

    // 2. Upsert dashboard widget config based on selected_widgets
    if (selected_widgets && selected_widgets.length > 0) {
      const widgetKeys = ['stats','tasks','exams','subjects','reading','goals','skills','projects','calendar','badges']
      const widgetsConfig = widgetKeys.map((key, idx) => ({
        key,
        visible: selected_widgets.includes(key),
        order: idx + 1,
        size: key === 'stats' || key === 'badges' ? 'full' : 'half',
      }))

      await supabase
        .from('dashboard_widgets')
        .upsert({
          user_id: user.id,
          widgets_config: widgetsConfig,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' })
    }

    // 3. Save exams (insert new, skip duplicates)
    if (exams && exams.length > 0) {
      const examsToInsert = exams.map((exam: any) => ({
        user_id: user.id,
        name: exam.name,
        subject: exam.subject || 'General',
        exam_date: exam.exam_date || null,
        color: exam.color || 'rose',
      }))
      await supabase.from('user_exams').insert(examsToInsert)
    }

    // 4. Save subjects (insert new, skip duplicates)
    if (subjects && subjects.length > 0) {
      const subjectsToInsert = subjects.map((sub: any) => ({
        user_id: user.id,
        name: sub.name,
        category: sub.category || 'Subject',
        icon_emoji: sub.icon_emoji || '📚',
        color: sub.color || 'blue',
      }))
      await supabase.from('user_subjects').insert(subjectsToInsert)
    }

    // 5. Update profile display_name + theme in main profiles table
    await supabase
      .from('profiles')
      .update({
        display_name: display_name || user.user_metadata?.full_name,
        theme_color: accent_color || 'blue',
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)

    // 6. Update user_settings daily goal
    if (daily_study_goal_hours) {
      await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          daily_study_goal_minutes: Math.round(daily_study_goal_hours * 60),
          theme: theme || 'system',
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' })
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('Onboarding API error:', err)
    return NextResponse.json({ error: err.message || 'Unexpected error' }, { status: 500 })
  }
}
