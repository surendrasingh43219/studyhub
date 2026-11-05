-- ==============================================================================
-- STUDYHUB - PERSONALIZED DASHBOARD MIGRATION
-- Run this in Supabase SQL Editor AFTER the base schema.sql
-- ==============================================================================

-- -----------------------------------------------------------------------
-- TABLE 1: ONBOARDING PROFILES
-- Stores the user's personalization answers from onboarding wizard
-- -----------------------------------------------------------------------
create table if not exists public.onboarding_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null unique,
  -- Step 1: Profile
  display_name text,
  avatar_emoji text default '🎓',
  bio text,
  -- Step 2: Education & Career
  education_type text check (education_type in (
    'school', 'college', 'competitive_exam', 'professional', 'self_learner', 'other'
  )) default 'self_learner',
  career_interests text[] default array[]::text[],
  current_institution text,
  current_year text,
  -- Step 3: Study Preferences
  daily_study_goal_hours numeric default 2,
  preferred_study_time text check (preferred_study_time in ('morning', 'afternoon', 'evening', 'night')) default 'evening',
  -- Step 4: Widget Preferences
  selected_widgets text[] default array['stats', 'tasks', 'exams', 'subjects', 'reading', 'goals']::text[],
  -- Step 5: Theme
  theme text check (theme in ('dark', 'light', 'system')) default 'dark',
  accent_color text default 'cyan',
  -- Meta
  onboarding_complete boolean default false not null,
  onboarding_step integer default 0 not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.onboarding_profiles enable row level security;

drop policy if exists "Users can manage their own onboarding profile" on public.onboarding_profiles;
create policy "Users can manage their own onboarding profile"
  on public.onboarding_profiles for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- -----------------------------------------------------------------------
-- TABLE 2: USER EXAMS
-- User-created exams (Rajasthan GK, Agniveer, Semester Finals, IELTS, etc.)
-- -----------------------------------------------------------------------
create table if not exists public.user_exams (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  name text not null,
  subject text default 'General',
  exam_date date,
  description text,
  color text default 'rose',
  is_completed boolean default false not null,
  priority text check (priority in ('low', 'medium', 'high')) default 'medium',
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.user_exams enable row level security;

drop policy if exists "Strict isolation for user exams" on public.user_exams;
create policy "Strict isolation for user exams"
  on public.user_exams for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index if not exists user_exams_user_idx on public.user_exams(user_id);
create index if not exists user_exams_date_idx on public.user_exams(exam_date);

-- -----------------------------------------------------------------------
-- TABLE 3: USER SUBJECTS
-- User-added subjects, skills, topics (SQL, Python, History, Speaking, etc.)
-- -----------------------------------------------------------------------
create table if not exists public.user_subjects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  name text not null,
  category text default 'Subject',
  description text,
  color text default 'blue',
  icon_emoji text default '📚',
  target_hours numeric default 10,
  completed_hours numeric default 0,
  is_active boolean default true not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.user_subjects enable row level security;

drop policy if exists "Strict isolation for user subjects" on public.user_subjects;
create policy "Strict isolation for user subjects"
  on public.user_subjects for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index if not exists user_subjects_user_idx on public.user_subjects(user_id);

-- -----------------------------------------------------------------------
-- TABLE 4: DASHBOARD WIDGETS CONFIG
-- Per-user widget order, visibility, and size preferences
-- -----------------------------------------------------------------------
create table if not exists public.dashboard_widgets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null unique,
  widgets_config jsonb default '[
    {"key": "stats",    "visible": true,  "order": 1, "size": "full"},
    {"key": "tasks",    "visible": true,  "order": 2, "size": "half"},
    {"key": "exams",    "visible": true,  "order": 3, "size": "half"},
    {"key": "subjects", "visible": true,  "order": 4, "size": "half"},
    {"key": "reading",  "visible": true,  "order": 5, "size": "half"},
    {"key": "goals",    "visible": true,  "order": 6, "size": "half"},
    {"key": "skills",   "visible": false, "order": 7, "size": "half"},
    {"key": "projects", "visible": false, "order": 8, "size": "half"},
    {"key": "calendar", "visible": false, "order": 9, "size": "half"},
    {"key": "badges",   "visible": true,  "order": 10, "size": "full"}
  ]'::jsonb,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.dashboard_widgets enable row level security;

drop policy if exists "Users can manage their own widget config" on public.dashboard_widgets;
create policy "Users can manage their own widget config"
  on public.dashboard_widgets for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- -----------------------------------------------------------------------
-- TABLE 5: USER PROJECTS
-- Project-based tracking (Data Analysis Project, App Build, etc.)
-- -----------------------------------------------------------------------
create table if not exists public.user_projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  name text not null,
  description text,
  status text check (status in ('planning', 'in_progress', 'completed', 'paused')) default 'planning',
  color text default 'purple',
  deadline date,
  progress_percent integer default 0 check (progress_percent between 0 and 100),
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.user_projects enable row level security;

drop policy if exists "Strict isolation for user projects" on public.user_projects;
create policy "Strict isolation for user projects"
  on public.user_projects for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- -----------------------------------------------------------------------
-- TABLE 6: CALENDAR EVENTS & STUDY REMINDERS
-- -----------------------------------------------------------------------
create table if not exists public.calendar_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  description text,
  event_type text check (event_type in ('study', 'exam', 'reminder', 'deadline', 'other')) default 'study',
  event_date date not null,
  event_time time,
  color text default 'blue',
  is_completed boolean default false not null,
  linked_exam_id uuid references public.user_exams on delete set null,
  linked_subject_id uuid references public.user_subjects on delete set null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.calendar_events enable row level security;

drop policy if exists "Strict isolation for calendar events" on public.calendar_events;
create policy "Strict isolation for calendar events"
  on public.calendar_events for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index if not exists calendar_events_user_date_idx on public.calendar_events(user_id, event_date);

-- -----------------------------------------------------------------------
-- EXTEND existing tasks table with foreign links
-- -----------------------------------------------------------------------
alter table public.tasks
  add column if not exists subject_id uuid references public.user_subjects on delete set null,
  add column if not exists project_id uuid references public.user_projects on delete set null,
  add column if not exists linked_exam_id uuid references public.user_exams on delete set null,
  add column if not exists description text;

-- -----------------------------------------------------------------------
-- EXTEND user_goals table
-- -----------------------------------------------------------------------
alter table public.user_goals
  add column if not exists subject_id uuid references public.user_subjects on delete set null,
  add column if not exists icon_emoji text default '🎯';

-- -----------------------------------------------------------------------
-- EXTEND study_sessions table
-- -----------------------------------------------------------------------
alter table public.study_sessions
  add column if not exists subject_id uuid references public.user_subjects on delete set null;

-- -----------------------------------------------------------------------
-- PERMISSIONS: Grant table privileges to authenticated and service_role
-- (Row Level Security still strictly isolates user rows)
-- -----------------------------------------------------------------------
grant select, insert, update, delete on table 
  public.onboarding_profiles,
  public.user_exams,
  public.user_subjects,
  public.dashboard_widgets,
  public.user_projects,
  public.calendar_events
to authenticated, service_role;

-- -----------------------------------------------------------------------
-- AUTOMATIC INITIALIZATION: Update master new user function
-- -----------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger as $$
declare
  raw_username text;
  clean_username text;
begin
  raw_username := coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1));
  clean_username := lower(regexp_replace(raw_username, '[^a-zA-Z0-9_]', '_', 'g'));

  -- 1. Profiles
  insert into public.profiles (id, username, display_name, email, avatar_url, role)
  values (
    new.id,
    clean_username || '_' || substr(new.id::text, 1, 4),
    coalesce(new.raw_user_meta_data->>'full_name', clean_username),
    new.email,
    coalesce(new.raw_user_meta_data->>'avatar_url', ''),
    'user'
  )
  on conflict (id) do nothing;

  -- 2. User Settings
  insert into public.user_settings (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  -- 3. Onboarding Profile
  insert into public.onboarding_profiles (user_id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', clean_username))
  on conflict (user_id) do nothing;

  -- 4. Dashboard Widgets
  insert into public.dashboard_widgets (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$$ language plpgsql security definer;
