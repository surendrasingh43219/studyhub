-- ==============================================================================
-- STUDYHUB PRO: PERSONAL STUDENT COMMAND CENTER - SAFE EXTENSION MIGRATION
-- Non-destructive extension: Adds syllabus tracking, mock scores, skills,
-- job/internship applications, project milestones, English practice logs,
-- and daily habits with strict Row Level Security (auth.uid() = user_id).
-- ==============================================================================

-- 1. Exam Syllabus Topics Breakdown
CREATE TABLE IF NOT EXISTS public.exam_topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  exam_id UUID REFERENCES public.user_exams(id) ON DELETE CASCADE,
  subject_name TEXT NOT NULL,
  chapter_name TEXT NOT NULL,
  topic_name TEXT NOT NULL,
  status TEXT DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed', 'needs_revision')),
  notes TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.exam_topics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "exam_topics_select_owner" ON public.exam_topics
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "exam_topics_insert_owner" ON public.exam_topics
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "exam_topics_update_owner" ON public.exam_topics
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "exam_topics_delete_owner" ON public.exam_topics
  FOR DELETE TO authenticated USING (auth.uid() = user_id);


-- 2. Exam Mock Score Records
CREATE TABLE IF NOT EXISTS public.exam_mock_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  exam_id UUID REFERENCES public.user_exams(id) ON DELETE CASCADE,
  test_name TEXT NOT NULL,
  score NUMERIC NOT NULL,
  max_score NUMERIC NOT NULL,
  test_date DATE DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.exam_mock_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "exam_mock_scores_select_owner" ON public.exam_mock_scores
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "exam_mock_scores_insert_owner" ON public.exam_mock_scores
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "exam_mock_scores_update_owner" ON public.exam_mock_scores
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "exam_mock_scores_delete_owner" ON public.exam_mock_scores
  FOR DELETE TO authenticated USING (auth.uid() = user_id);


-- 3. Career & Skills Tracker
CREATE TABLE IF NOT EXISTS public.user_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  category TEXT DEFAULT 'Technical' CHECK (category IN ('Technical', 'Professional', 'Other')),
  current_level TEXT DEFAULT 'Beginner' CHECK (current_level IN ('Beginner', 'Intermediate', 'Advanced', 'Expert')),
  target_level TEXT DEFAULT 'Advanced' CHECK (target_level IN ('Beginner', 'Intermediate', 'Advanced', 'Expert')),
  completion_percentage INTEGER DEFAULT 0 CHECK (completion_percentage BETWEEN 0 AND 100),
  resources JSONB DEFAULT '[]'::jsonb,
  notes TEXT,
  last_practiced_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.user_skills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_skills_select_owner" ON public.user_skills
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "user_skills_insert_owner" ON public.user_skills
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_skills_update_owner" ON public.user_skills
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_skills_delete_owner" ON public.user_skills
  FOR DELETE TO authenticated USING (auth.uid() = user_id);


-- 4. Job & Internship Application Tracker
CREATE TABLE IF NOT EXISTS public.job_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  company TEXT NOT NULL,
  role TEXT NOT NULL,
  status TEXT DEFAULT 'applied' CHECK (status IN ('wishlist', 'applied', 'interviewing', 'offered', 'rejected')),
  applied_date DATE DEFAULT CURRENT_DATE,
  interview_date TIMESTAMPTZ,
  notes TEXT,
  salary_range TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "job_applications_select_owner" ON public.job_applications
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "job_applications_insert_owner" ON public.job_applications
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "job_applications_update_owner" ON public.job_applications
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "job_applications_delete_owner" ON public.job_applications
  FOR DELETE TO authenticated USING (auth.uid() = user_id);


-- 5. Project Milestones
CREATE TABLE IF NOT EXISTS public.project_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  project_id UUID REFERENCES public.user_projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  due_date DATE,
  is_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.project_milestones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "project_milestones_select_owner" ON public.project_milestones
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "project_milestones_insert_owner" ON public.project_milestones
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "project_milestones_update_owner" ON public.project_milestones
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "project_milestones_delete_owner" ON public.project_milestones
  FOR DELETE TO authenticated USING (auth.uid() = user_id);


-- 6. English Practice Logs & Vocabulary Bank
CREATE TABLE IF NOT EXISTS public.english_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  module TEXT NOT NULL CHECK (module IN ('speaking', 'listening', 'reading', 'writing', 'vocabulary', 'grammar', 'interview')),
  duration_minutes INTEGER DEFAULT 0,
  title TEXT NOT NULL,
  notes TEXT,
  practice_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.english_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "english_logs_select_owner" ON public.english_logs
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "english_logs_insert_owner" ON public.english_logs
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "english_logs_update_owner" ON public.english_logs
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "english_logs_delete_owner" ON public.english_logs
  FOR DELETE TO authenticated USING (auth.uid() = user_id);


CREATE TABLE IF NOT EXISTS public.vocabulary_words (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  word TEXT NOT NULL,
  definition TEXT NOT NULL,
  example_sentence TEXT,
  mastered BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.vocabulary_words ENABLE ROW LEVEL SECURITY;

CREATE POLICY "vocabulary_words_select_owner" ON public.vocabulary_words
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "vocabulary_words_insert_owner" ON public.vocabulary_words
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "vocabulary_words_update_owner" ON public.vocabulary_words
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "vocabulary_words_delete_owner" ON public.vocabulary_words
  FOR DELETE TO authenticated USING (auth.uid() = user_id);


CREATE TABLE IF NOT EXISTS public.english_mock_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  exam_type TEXT DEFAULT 'IELTS' CHECK (exam_type IN ('IELTS', 'TOEFL', 'PTE', 'Other')),
  overall_score NUMERIC NOT NULL,
  listening_score NUMERIC,
  reading_score NUMERIC,
  writing_score NUMERIC,
  speaking_score NUMERIC,
  test_date DATE DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.english_mock_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "english_mock_scores_select_owner" ON public.english_mock_scores
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "english_mock_scores_insert_owner" ON public.english_mock_scores
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "english_mock_scores_update_owner" ON public.english_mock_scores
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "english_mock_scores_delete_owner" ON public.english_mock_scores
  FOR DELETE TO authenticated USING (auth.uid() = user_id);


-- 7. Habits & Habit Logs
CREATE TABLE IF NOT EXISTS public.habits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  icon_emoji TEXT DEFAULT '🎯',
  color TEXT DEFAULT 'cyan',
  target_days_per_week INTEGER DEFAULT 7,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "habits_select_owner" ON public.habits
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "habits_insert_owner" ON public.habits
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "habits_update_owner" ON public.habits
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "habits_delete_owner" ON public.habits
  FOR DELETE TO authenticated USING (auth.uid() = user_id);


CREATE TABLE IF NOT EXISTS public.habit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  habit_id UUID REFERENCES public.habits(id) ON DELETE CASCADE,
  log_date DATE NOT NULL DEFAULT CURRENT_DATE,
  completed BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, habit_id, log_date)
);

ALTER TABLE public.habit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "habit_logs_select_owner" ON public.habit_logs
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "habit_logs_insert_owner" ON public.habit_logs
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "habit_logs_update_owner" ON public.habit_logs
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "habit_logs_delete_owner" ON public.habit_logs
  FOR DELETE TO authenticated USING (auth.uid() = user_id);


-- 8. Enhance Onboarding Profile with Routine & Academic Fields
ALTER TABLE public.onboarding_profiles
  ADD COLUMN IF NOT EXISTS course_degree TEXT,
  ADD COLUMN IF NOT EXISTS branch_stream TEXT,
  ADD COLUMN IF NOT EXISTS semester_class TEXT,
  ADD COLUMN IF NOT EXISTS preferred_language TEXT DEFAULT 'English',
  ADD COLUMN IF NOT EXISTS wake_up_time TEXT,
  ADD COLUMN IF NOT EXISTS study_schedule TEXT,
  ADD COLUMN IF NOT EXISTS break_time TEXT,
  ADD COLUMN IF NOT EXISTS working_hours TEXT,
  ADD COLUMN IF NOT EXISTS weekly_target_hours NUMERIC DEFAULT 14;

