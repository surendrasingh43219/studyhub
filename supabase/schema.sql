-- ==============================================================================
-- STUDYHUB PLATFORM - MASTER DATABASE SCHEMA & ROW LEVEL SECURITY (RLS)
-- Target Database: Supabase PostgreSQL (Supports Full-Text Search & pg_trgm)
-- ==============================================================================

-- Enable required PostgreSQL extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pg_trgm";

-- 1. ENUMS
do $$ begin
  create type user_role as enum ('user', 'moderator', 'admin');
exception when duplicate_object then null; end $$;

do $$ begin
  create type book_license as enum (
    'Public Domain',
    'Creative Commons (CC-BY)',
    'Creative Commons (CC-BY-SA)',
    'Creative Commons (CC-BY-NC)',
    'Open Source / Free Documentation',
    'Author Permission'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type reading_status as enum ('want_to_read', 'reading', 'completed');
exception when duplicate_object then null; end $$;

do $$ begin
  create type task_priority as enum ('low', 'medium', 'high');
exception when duplicate_object then null; end $$;

-- 2. PROFILES TABLE (Linked directly to auth.users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique not null,
  display_name text not null,
  email text not null,
  avatar_url text,
  bio text,
  role user_role default 'user' not null,
  is_public boolean default false not null,
  theme_color text default 'blue',
  font_size text default 'medium',
  layout_settings jsonb default '{"widgets": ["stats", "recent_book", "goals", "exams", "bookmarks"]}'::jsonb,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  constraint username_format check (username ~* '^[a-zA-Z0-9_]{3,20}$')
);

alter table public.profiles enable row level security;

-- Profile RLS: Users can view public profiles or their own; only owner can update
create policy "Profiles viewable by everyone if public, or by owner"
  on public.profiles for select
  using (is_public = true or auth.uid() = id);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- 3. USER SETTINGS TABLE (1:1 with user, private preferences)
create table if not exists public.user_settings (
  user_id uuid references auth.users on delete cascade primary key,
  email_notifications boolean default true not null,
  push_notifications boolean default false not null,
  daily_study_goal_minutes integer default 120 not null,
  pomodoro_work_minutes integer default 25 not null,
  pomodoro_break_minutes integer default 5 not null,
  sound_effects boolean default true not null,
  theme text default 'system' not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.user_settings enable row level security;

create policy "Users can only access their own settings"
  on public.user_settings for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 4. USER GOALS & HABITS
create table if not exists public.user_goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  type text check (type in ('daily', 'weekly', 'monthly', 'exam', 'habit')) default 'daily' not null,
  target_value numeric default 1 not null,
  current_value numeric default 0 not null,
  unit text default 'hours' not null,
  deadline date,
  is_completed boolean default false not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.user_goals enable row level security;

create policy "Strict isolation for user goals"
  on public.user_goals for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 5. TASKS (Personal Todo List)
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  category text default 'General' not null,
  priority task_priority default 'medium' not null,
  due_date date default current_date,
  is_completed boolean default false not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.tasks enable row level security;

create policy "Strict isolation for tasks"
  on public.tasks for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 6. STUDY SESSIONS & TIMERS (Pomodoro / Stopwatch log)
create table if not exists public.study_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  subject text default 'General Study' not null,
  duration_minutes integer not null,
  session_type text check (session_type in ('pomodoro', 'stopwatch', 'free')) default 'pomodoro' not null,
  notes text,
  created_at timestamptz default now() not null
);

alter table public.study_sessions enable row level security;

create policy "Strict isolation for study sessions"
  on public.study_sessions for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 7. BOOKS CATALOG (Digital Library Master)
create table if not exists public.books (
  id uuid primary key default gen_random_uuid(),
  uploader_id uuid references auth.users on delete set null,
  title text not null,
  author text default 'Unknown Author' not null,
  subject text default 'Other' not null,
  class_level text default 'All Levels' not null,
  category text default 'General' not null,
  language text default 'English' not null,
  description text,
  cover_url text,
  file_path text not null, -- Supabase Storage private path (signed URLs generated server-side)
  file_format text check (file_format in ('pdf', 'epub')) default 'pdf' not null,
  file_size_bytes bigint default 0 not null,
  file_hash text,
  license book_license not null,
  rights_confirmed boolean default true not null,
  is_approved boolean default true not null, -- Admin moderation approval
  is_public boolean default true not null,
  download_count integer default 0 not null,
  view_count integer default 0 not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.books enable row level security;

-- Only authenticated users can browse approved public books or their own uploads
create policy "Authenticated users can browse approved public books"
  on public.books for select
  using (
    auth.role() = 'authenticated' and (
      (is_public = true and is_approved = true) or
      auth.uid() = uploader_id
    )
  );

create policy "Authenticated users can upload books"
  on public.books for insert
  with check (auth.role() = 'authenticated' and auth.uid() = uploader_id);

create policy "Users can update their own uploads"
  on public.books for update
  using (auth.uid() = uploader_id);

create policy "Users can delete their own uploads"
  on public.books for delete
  using (auth.uid() = uploader_id);

-- Full-text search indexes on books
create index if not exists books_search_idx on public.books
  using gin(to_tsvector('english', title || ' ' || author || ' ' || subject || ' ' || coalesce(description, '')));
create index if not exists books_trgm_title_idx on public.books using gin(title gin_trgm_ops);
create index if not exists books_trgm_author_idx on public.books using gin(author gin_trgm_ops);

-- 8. PERSONAL BOOKSHELF (User's private saved collection)
create table if not exists public.personal_books (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  book_id uuid references public.books on delete cascade not null,
  status reading_status default 'want_to_read' not null,
  is_favorite boolean default false not null,
  personal_notes text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  unique (user_id, book_id)
);

alter table public.personal_books enable row level security;

create policy "Strict isolation for personal bookshelf"
  on public.personal_books for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 9. READING PROGRESS (Sync reading position per user & book)
create table if not exists public.reading_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  book_id uuid references public.books on delete cascade not null,
  current_page integer default 1 not null,
  total_pages integer default 1 not null,
  percentage numeric default 0 not null,
  last_read_at timestamptz default now() not null,
  unique (user_id, book_id)
);

alter table public.reading_progress enable row level security;

create policy "Strict isolation for reading progress"
  on public.reading_progress for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 10. BOOKMARKS & HIGHLIGHTS
create table if not exists public.bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  book_id uuid references public.books on delete cascade not null,
  page_number integer not null,
  title text default 'Bookmark' not null,
  note text,
  created_at timestamptz default now() not null
);

alter table public.bookmarks enable row level security;

create policy "Strict isolation for bookmarks"
  on public.bookmarks for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create table if not exists public.book_highlights (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  book_id uuid references public.books on delete cascade not null,
  page_number integer not null,
  selected_text text not null,
  note text,
  color text default 'yellow' not null,
  created_at timestamptz default now() not null
);

alter table public.book_highlights enable row level security;

create policy "Strict isolation for book highlights"
  on public.book_highlights for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 11. NOTES APP (Markdown notes linked to books & study subjects)
create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  content text default '' not null,
  linked_book_id uuid references public.books on delete set null,
  linked_page integer,
  tags text[] default array[]::text[],
  is_pinned boolean default false not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.notes enable row level security;

create policy "Strict isolation for notes"
  on public.notes for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 12. FLASHCARDS WITH SPACED REPETITION (SM-2 Algorithm support)
create table if not exists public.flashcard_decks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  subject text default 'General' not null,
  description text,
  created_at timestamptz default now() not null
);

alter table public.flashcard_decks enable row level security;

create policy "Strict isolation for flashcard decks"
  on public.flashcard_decks for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create table if not exists public.flashcards (
  id uuid primary key default gen_random_uuid(),
  deck_id uuid references public.flashcard_decks on delete cascade not null,
  user_id uuid references auth.users on delete cascade not null,
  front text not null,
  back text not null,
  repetitions integer default 0 not null,
  interval_days integer default 1 not null,
  ease_factor numeric default 2.5 not null,
  next_review_date date default current_date not null,
  created_at timestamptz default now() not null
);

alter table public.flashcards enable row level security;

create policy "Strict isolation for flashcards"
  on public.flashcards for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 13. BOOK REVIEWS & COPYRIGHT REPORTS
create table if not exists public.book_reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  book_id uuid references public.books on delete cascade not null,
  rating integer check (rating between 1 and 5) not null,
  comment text,
  created_at timestamptz default now() not null,
  unique (user_id, book_id)
);

alter table public.book_reviews enable row level security;

create policy "Authenticated users can read book reviews"
  on public.book_reviews for select
  using (auth.role() = 'authenticated');

create policy "Users can write their own review"
  on public.book_reviews for insert
  with check (auth.uid() = user_id);

create policy "Users can edit their own review"
  on public.book_reviews for update
  using (auth.uid() = user_id);

create table if not exists public.book_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  book_id uuid references public.books on delete cascade not null,
  reason text not null,
  details text,
  status text check (status in ('pending', 'reviewed', 'resolved')) default 'pending' not null,
  created_at timestamptz default now() not null
);

alter table public.book_reports enable row level security;

create policy "Users can submit copyright reports"
  on public.book_reports for insert
  with check (auth.uid() = user_id);

create policy "Users can view their submitted reports"
  on public.book_reports for select
  using (auth.uid() = user_id);

-- 14. AUDIT LOGS & SECURITY LOGS
create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete set null,
  action text not null,
  ip_address text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now() not null
);

alter table public.audit_logs enable row level security;

create policy "Audit logs accessible by admins only"
  on public.audit_logs for select
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

-- 15. AUTOMATIC PROFILE CREATION TRIGGER
create or replace function public.handle_new_user()
returns trigger as $$
declare
  raw_username text;
  clean_username text;
begin
  raw_username := coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1));
  clean_username := lower(regexp_replace(raw_username, '[^a-zA-Z0-9_]', '_', 'g'));

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

  insert into public.user_settings (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 16. STORAGE BUCKET CONFIGURATION (Private Storage with Signed URLs)
insert into storage.buckets (id, name, public)
values ('study-documents', 'study-documents', false),
       ('avatars', 'avatars', true)
on conflict (id) do update set public = excluded.public;

-- Secure storage policies: only authenticated users can read or upload to study-documents
create policy "Authenticated users can upload study files"
  on storage.objects for insert
  with check (bucket_id = 'study-documents' and auth.role() = 'authenticated');

create policy "Authenticated users can access study documents"
  on storage.objects for select
  using (bucket_id = 'study-documents' and auth.role() = 'authenticated');
