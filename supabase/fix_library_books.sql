-- ==============================================================================
-- STUDYHUB - FIX LIBRARY BOOKS ACCESS & RLS
-- Run this in Supabase SQL Editor to allow public access to approved books
-- ==============================================================================

-- 1. Ensure RLS policies allow reading approved public books
drop policy if exists "Authenticated users can browse approved public books" on public.books;
drop policy if exists "Public books are viewable by everyone" on public.books;

create policy "Public books are viewable by everyone"
  on public.books for select
  using (
    (is_public = true and is_approved = true) or
    (auth.uid() is not null and auth.uid() = uploader_id)
  );

-- 2. Allow authenticated users to upload books freely
drop policy if exists "Authenticated users can upload books" on public.books;
drop policy if exists "Users can upload books" on public.books;

create policy "Users can upload books"
  on public.books for insert
  with check (true);

-- 3. Ensure permissions are granted to anon and authenticated
grant select on table public.books to anon, authenticated;
grant insert, update, delete on table public.books to authenticated;
