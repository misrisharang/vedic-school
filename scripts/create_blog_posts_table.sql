-- ==============================================================================
-- THE VEDIC SCHOOL — BLOG CMS BACKEND MIGRATION (STAGE 1)
-- ==============================================================================
-- Run this script in your Supabase SQL Editor:
-- Supabase Dashboard > SQL Editor > New query > Paste & Run
--
-- What this script provisions:
-- 1. Table: public.blog_posts (with all requested columns, defaults & constraints)
-- 2. Constraints: strict category whitelist, status whitelist, slug format, reading time
-- 3. Featured Article: Partial Unique Index + Auto-demotion trigger (guarantees exactly 1 featured published post)
-- 4. Timestamps: Auto-update updated_at on modify + auto-set published_at on publish
-- 5. Row Level Security: Public read-only for published posts, authenticated-only for CRUD/admin
-- 6. Storage: 'blog-images' bucket with public read and authenticated-only write/delete
-- 7. Performance Indexes: Optimized for slug lookups and chronological published listings
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. CREATE TABLE: public.blog_posts
-- ------------------------------------------------------------------------------
create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null,
  excerpt text,
  content text not null,
  featured_image text,
  category text not null,
  author text not null default 'Meenakshi Koul',
  reading_time integer,
  status text not null default 'draft',
  published_at timestamptz,
  is_featured boolean not null default false,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- Unique constraint on slug
  constraint blog_posts_slug_unique unique (slug),

  -- Whitelist categories: only allow vedic-maths, curriculum-support, parenting
  constraint blog_posts_category_check check (
    category in ('vedic-maths', 'curriculum-support', 'parenting')
  ),

  -- Whitelist statuses: only allow draft or published
  constraint blog_posts_status_check check (
    status in ('draft', 'published')
  ),

  -- URL-safe slug: lowercase letters, numbers, and hyphens (no consecutive hyphens, 3 to 120 chars)
  constraint blog_posts_slug_format_check check (
    slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$' and length(slug) between 3 and 120
  ),

  -- Reading time must be a positive integer if provided
  constraint blog_posts_reading_time_check check (
    reading_time is null or reading_time >= 1
  )
);

-- ------------------------------------------------------------------------------
-- 2. PERFORMANCE INDEXES
-- ------------------------------------------------------------------------------
-- Fast slug lookup for public article reading and admin editing
create index if not exists blog_posts_slug_idx
  on public.blog_posts (slug);

-- Fast chronological query for published blog feed
create index if not exists blog_posts_published_feed_idx
  on public.blog_posts (published_at desc)
  where status = 'published';

-- Fast filtered query for category tabs
create index if not exists blog_posts_category_feed_idx
  on public.blog_posts (category, published_at desc)
  where status = 'published';

-- ------------------------------------------------------------------------------
-- 3. SINGLE FEATURED PUBLISHED ARTICLE (CONSTRAINT & TRIGGER)
-- ------------------------------------------------------------------------------
-- 3A. Database-level partial unique index:
-- Guarantees at the storage engine level that there can NEVER be more than ONE
-- published article with is_featured = true simultaneously.
create unique index if not exists blog_posts_single_featured_published_idx
  on public.blog_posts (is_featured)
  where is_featured = true and status = 'published';

-- 3B. Auto-demote trigger function:
-- When an admin publishes or marks an article as is_featured = true,
-- any previously featured published post is automatically demoted (is_featured = false).
-- This gives the administrator a seamless CMS experience without constraint violation errors.
create or replace function public.handle_single_featured_blog_post()
returns trigger as $$
begin
  if new.is_featured = true and new.status = 'published' then
    update public.blog_posts
    set is_featured = false, updated_at = now()
    where id <> new.id
      and is_featured = true
      and status = 'published';
  end if;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists trg_ensure_single_featured_blog_post on public.blog_posts;
create trigger trg_ensure_single_featured_blog_post
  before insert or update of is_featured, status on public.blog_posts
  for each row
  when (new.is_featured = true and new.status = 'published')
  execute function public.handle_single_featured_blog_post();

-- ------------------------------------------------------------------------------
-- 4. AUTOMATIC TIMESTAMP HANDLING
-- ------------------------------------------------------------------------------
-- Automatically updates updated_at whenever a post is updated.
-- Also auto-sets published_at to now() if an article transitions to 'published'
-- and published_at was not explicitly specified.
create or replace function public.handle_blog_posts_timestamps()
returns trigger as $$
begin
  new.updated_at = now();

  -- Auto-populate published_at when published for the first time
  if new.status = 'published' and new.published_at is null then
    new.published_at = now();
  end if;

  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_set_blog_posts_timestamps on public.blog_posts;
create trigger trg_set_blog_posts_timestamps
  before update on public.blog_posts
  for each row
  execute function public.handle_blog_posts_timestamps();

-- Handle insert timestamps: if inserted directly as published without published_at
create or replace function public.handle_blog_posts_insert_timestamps()
returns trigger as $$
begin
  if new.status = 'published' and new.published_at is null then
    new.published_at = now();
  end if;
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_set_blog_posts_insert_timestamps on public.blog_posts;
create trigger trg_set_blog_posts_insert_timestamps
  before insert on public.blog_posts
  for each row
  execute function public.handle_blog_posts_insert_timestamps();

-- ------------------------------------------------------------------------------
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------
alter table public.blog_posts enable row level security;

-- Drop any previous policies for clean re-runs
drop policy if exists "Allow public anonymous read of published blog posts" on public.blog_posts;
drop policy if exists "Allow authenticated full read of blog posts" on public.blog_posts;
drop policy if exists "Allow authenticated insert of blog posts" on public.blog_posts;
drop policy if exists "Allow authenticated update of blog posts" on public.blog_posts;
drop policy if exists "Allow authenticated delete of blog posts" on public.blog_posts;

-- Policy 1: Public/anonymous visitors can ONLY read published posts.
-- Drafts are strictly invisible to anonymous visitors.
create policy "Allow public anonymous read of published blog posts"
  on public.blog_posts
  for select
  to anon
  using (status = 'published');

-- Policy 2: Authenticated users (admin) can view ALL posts (drafts and published).
-- Needed for the private admin dashboard and draft previews.
create policy "Allow authenticated full read of blog posts"
  on public.blog_posts
  for select
  to authenticated
  using (true);

-- Policy 3: Authenticated users can insert new blog posts.
create policy "Allow authenticated insert of blog posts"
  on public.blog_posts
  for insert
  to authenticated
  with check (true);

-- Policy 4: Authenticated users can update existing blog posts.
create policy "Allow authenticated update of blog posts"
  on public.blog_posts
  for update
  to authenticated
  using (true)
  with check (true);

-- Policy 5: Authenticated users can delete blog posts.
create policy "Allow authenticated delete of blog posts"
  on public.blog_posts
  for delete
  to authenticated
  using (true);

-- Explicitly enforce table permissions (defense-in-depth)
-- Revoke all mutation rights from anon; only grant select.
revoke all on public.blog_posts from anon;
grant select on public.blog_posts to anon;

-- Grant full CRUD rights to authenticated users.
grant select, insert, update, delete on public.blog_posts to authenticated;

-- ------------------------------------------------------------------------------
-- 6. SUPABASE STORAGE BUCKET: blog-images
-- ------------------------------------------------------------------------------
-- Create the blog-images bucket with public access for image serving,
-- 10MB maximum file size, and restricted image MIME types.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'blog-images',
  'blog-images',
  true,
  10485760, -- 10MB
  array['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/avif', 'image/gif']
)
on conflict (id) do update set
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/avif', 'image/gif'];

-- Storage Object Policies
drop policy if exists "Allow public read of blog images" on storage.objects;
drop policy if exists "Allow authenticated upload of blog images" on storage.objects;
drop policy if exists "Allow authenticated update of blog images" on storage.objects;
drop policy if exists "Allow authenticated delete of blog images" on storage.objects;

-- 6A. Anyone (anon & authenticated) can view/display images from blog-images bucket
create policy "Allow public read of blog images"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'blog-images');

-- 6B. Only authenticated users can upload new images to blog-images bucket
create policy "Allow authenticated upload of blog images"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'blog-images');

-- 6C. Only authenticated users can update/replace images in blog-images bucket
create policy "Allow authenticated update of blog images"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'blog-images')
  with check (bucket_id = 'blog-images');

-- 6D. Only authenticated users can delete images from blog-images bucket
create policy "Allow authenticated delete of blog images"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'blog-images');

-- ==============================================================================
-- END OF STAGE 1 MIGRATION
-- ==============================================================================
