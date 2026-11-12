-- ==============================================================================
-- STUDYHUB PRO: ROW LEVEL SECURITY & PUBLIC LIBRARY SQL PATCH
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql
-- ==============================================================================

-- 1. PUBLIC BOOK CATALOG ACCESS (Enables public browsing without login)
-- Drop existing restrictive policy
drop policy if exists "Authenticated users can browse approved public books" on public.books;
drop policy if exists "Public and approved books are readable by everyone" on public.books;

-- Allow EVERYONE (anon + authenticated) to browse approved public books
create policy "Public and approved books are readable by everyone"
  on public.books for select
  using (
    (is_public = true and is_approved = true)
    or
    (auth.role() = 'authenticated' and auth.uid() = uploader_id)
  );

-- Only authenticated users can insert new uploads (tagged with their own auth.uid())
drop policy if exists "Authenticated users can upload books" on public.books;
create policy "Authenticated users can upload books"
  on public.books for insert
  with check (auth.role() = 'authenticated' and auth.uid() = uploader_id);

-- Only owner can update or delete their uploads
drop policy if exists "Users can update their own uploads" on public.books;
create policy "Users can update their own uploads"
  on public.books for update
  using (auth.uid() = uploader_id);

drop policy if exists "Users can delete their own uploads" on public.books;
create policy "Users can delete their own uploads"
  on public.books for delete
  using (auth.uid() = uploader_id);

-- 2. PROFILE SECURITY: Prevent users from self-elevating to 'admin' or 'moderator'
drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (
    auth.uid() = id
    -- Regular users cannot change their role; role changes must be done by service_role or admin
    and (role = 'user' or auth.jwt()->>'role' = 'service_role')
  );

-- 3. ENSURE STRICT RLS ON ALL SENSITIVE TABLES
alter table public.profiles enable row level security;
alter table public.user_settings enable row level security;
alter table public.user_goals enable row level security;
alter table public.tasks enable row level security;
alter table public.study_sessions enable row level security;
alter table public.personal_books enable row level security;
alter table public.reading_progress enable row level security;
alter table public.bookmarks enable row level security;
alter table public.book_highlights enable row level security;
alter table public.notes enable row level security;

-- 4. PERSONALIZATION TABLES RLS
do $$ begin
  if exists (select from pg_tables where schemaname = 'public' and tablename = 'onboarding_profiles') then
    alter table public.onboarding_profiles enable row level security;
  end if;
  if exists (select from pg_tables where schemaname = 'public' and tablename = 'user_exams') then
    alter table public.user_exams enable row level security;
  end if;
  if exists (select from pg_tables where schemaname = 'public' and tablename = 'user_subjects') then
    alter table public.user_subjects enable row level security;
  end if;
  if exists (select from pg_tables where schemaname = 'public' and tablename = 'dashboard_widgets') then
    alter table public.dashboard_widgets enable row level security;
  end if;
  if exists (select from pg_tables where schemaname = 'public' and tablename = 'user_projects') then
    alter table public.user_projects enable row level security;
  end if;
  if exists (select from pg_tables where schemaname = 'public' and tablename = 'calendar_events') then
    alter table public.calendar_events enable row level security;
  end if;
end $$;

-- 5. GRANT MINIMUM NECESSARY PRIVILEGES
grant select on table public.books to anon, authenticated;
