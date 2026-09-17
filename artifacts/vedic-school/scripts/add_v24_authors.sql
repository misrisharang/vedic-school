-- ==============================================================================
-- THE VEDIC SCHOOL — CMS v2.4+ CENTRAL AUTHOR MANAGEMENT MIGRATION
-- ==============================================================================
-- Purpose:
-- 1. Creates `public.authors` table for central, reusable author management.
-- 2. Adds `author_id` foreign key reference to `public.blog_posts`.
-- 3. Configures Row Level Security: public read, authenticated CMS admin write.
-- 4. Enforces permanent editorial records: NO DELETE policies or permissions.
-- 5. Seeds canonical author record for Meenakshi Koul with full approved bio.
-- 6. Backfills the three existing published articles to Meenakshi Koul's author_id.
-- 7. Preserves the legacy `author` text column for backward compatibility.
--
-- Authorization Architecture:
-- - In The Vedic School architecture, Supabase Auth is closed to public registration.
-- - Public website visitors operate strictly under the `anon` role (read-only for articles/authors).
-- - Authorized CMS administrators log in via /admin and operate under the `authenticated` role.
-- - Public visitors are granted SELECT-only access to author profiles.
-- - Only authorized CMS administrators can insert or update author records.
-- - No DELETE policy or permission is granted to prevent orphaned articles or broken bylines.
--
-- Safety & Integrity Guarantees:
-- - Idempotent and non-destructive: uses IF NOT EXISTS and ON CONFLICT.
-- - Does NOT modify blog article titles, slugs, content, or SEO fields.
-- - Does NOT delete any rows or drop any tables/columns.
-- - Does NOT modify unrelated tables (inquiries, registrations, storage, etc.).
--
-- Note:
-- This script is LOCAL ONLY and must NOT be automatically executed against
-- production Supabase until separately reviewed and approved.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. CREATE PUBLIC.AUTHORS TABLE
-- ------------------------------------------------------------------------------
create table if not exists public.authors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  role text,
  bio text,
  photo text,
  photo_alt text,
  linkedin_url text,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- Index on slug for fast public lookups (/authors/:slug)
create index if not exists idx_authors_slug on public.authors (slug);

-- ------------------------------------------------------------------------------
-- 2. ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------
alter table public.authors enable row level security;

-- Drop previous policies for clean re-runs
drop policy if exists "Allow public read of authors" on public.authors;
drop policy if exists "Allow authenticated read of authors" on public.authors;
drop policy if exists "Allow authenticated insert of authors" on public.authors;
drop policy if exists "Allow authenticated update of authors" on public.authors;
drop policy if exists "Allow authenticated delete of authors" on public.authors;

-- Policy 1: Public Read Access
-- All visitors (anon and authenticated) can view author profiles on the blog and /authors/:slug
create policy "Allow public read of authors"
  on public.authors
  for select
  to anon, authenticated
  using (true);

-- Policy 2: CMS Administrator Insert Access
-- Only authenticated users (CMS administrators) can create new author records
create policy "Allow authenticated insert of authors"
  on public.authors
  for insert
  to authenticated
  with check (true);

-- Policy 3: CMS Administrator Update Access
-- Only authenticated users (CMS administrators) can update author records
create policy "Allow authenticated update of authors"
  on public.authors
  for update
  to authenticated
  using (true)
  with check (true);

-- Note: NO DELETE policy is created.
-- In accordance with Vedic School editorial rules, authors are permanent records
-- and cannot be deleted to prevent orphaned blog posts or broken bylines.

-- Defense-in-depth table permissions (reusing project's existing authorization approach)
-- Revoke all mutation rights from anon; only grant select.
revoke all on public.authors from anon;
grant select on public.authors to anon;

-- Grant select, insert, update to authenticated CMS administrators (NO DELETE)
revoke delete on public.authors from authenticated;
grant select, insert, update on public.authors to authenticated;

-- ------------------------------------------------------------------------------
-- 3. ADD AUTHOR_ID FOREIGN KEY TO PUBLIC.BLOG_POSTS
-- ------------------------------------------------------------------------------
-- Preserves existing `author` string column for backward compatibility
alter table public.blog_posts 
  add column if not exists author_id uuid references public.authors(id);

create index if not exists idx_blog_posts_author_id on public.blog_posts (author_id);

-- ------------------------------------------------------------------------------
-- 4. SEED CANONICAL AUTHOR RECORD (MEENAKSHI KOUL)
-- ------------------------------------------------------------------------------
-- Complete approved canonical bio from the Vedic School About page
insert into public.authors (
  id,
  name,
  slug,
  role,
  bio,
  photo,
  photo_alt,
  linkedin_url
) values (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'Meenakshi Koul',
  'meenakshi-koul',
  'Founder & Educator, The Vedic School',
  'I''ve been teaching Mathematics for 20+ years, first in India, and more recently, to students across different time zones.

Over the years, I''ve realised that teaching Maths is rarely just about explaining the question in front of you. I''ve learnt to look for the pattern behind the problem.

My work has also been shaped by a deeper interest in how children learn, develop confidence and approach challenges. An Advanced Program in UX & Algorithms from IISc, Bangalore has further strengthened the way I think about problem-solving, learning and the way people interact with complex ideas.

Within the first few minutes of sitting with a child, I can often tell whether they are genuinely stuck on the Maths, or whether they have started believing that they simply aren''t good at it.

And that distinction matters.

If a child has missed a foundation, we need to go back and rebuild it.

If they understand the concept but don''t trust themselves, we need to give them opportunities to experience that they can solve it.

And if they are ready for more, we need to help them move forward without making speed the goal in itself.

That''s how I teach.

It''s time to change how your kids approach Maths.

To make them more willing to attempt a difficult question. More comfortable making mistakes. More capable of finding their own way through a problem. And, to replace "I''m not good at Maths" with something much more important:

"Let me try."',
  '/assets/meenakshi-founder-portrait.jpg',
  'Meenakshi Koul, founder and educator at The Vedic School',
  'https://www.linkedin.com/in/meenakshi-koul-14b101135/'
)
on conflict (slug) do update set
  name = excluded.name,
  role = excluded.role,
  bio = excluded.bio,
  photo = excluded.photo,
  photo_alt = excluded.photo_alt,
  linkedin_url = excluded.linkedin_url,
  updated_at = now();

-- ------------------------------------------------------------------------------
-- 5. BACKFILL EXISTING PUBLISHED ARTICLES TO MEENAKSHI KOUL
-- ------------------------------------------------------------------------------
update public.blog_posts
set
  author_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  author = 'Meenakshi Koul'
where slug in (
  'vedic-maths-vs-abacus',
  'is-vedic-maths-useful',
  'best-vedic-maths-online-classes-for-kids'
);
