-- ==============================================================================
-- THE VEDIC SCHOOL — AUTO-REBUILD SITE WHEN BLOG POSTS GO LIVE / COME DOWN
-- ==============================================================================
-- Run this script in your Supabase SQL Editor:
-- Supabase Dashboard > SQL Editor > New query > Paste & Run
--
-- Why: blog articles, the /blog listing and sitemap.xml are prerendered at build
-- time. Without a rebuild, a newly published post has no prerendered HTML (so
-- crawlers get the homepage shell and its canonical) and is missing from the
-- sitemap until the next release.
--
-- What this script provisions:
-- 1. Extension: pg_net (async HTTP from Postgres; never blocks or fails a save)
-- 2. Trigger: calls the Netlify build hook when a post is published,
--    unpublished, deleted while live, or edited while live. Draft-only saves
--    are ignored, and at most one build is requested per transaction.
--
-- The build hook builds the `production` branch (what is live), NOT `main`, so
-- publishing a post never releases unreleased code.
--
-- ------------------------------------------------------------------------------
-- BEFORE RUNNING: store the build hook URL in Supabase Vault (run once)
-- ------------------------------------------------------------------------------
-- Netlify > Project configuration > Build & deploy > Build hooks > Add build hook
--   Name: Blog publish   Branch: production
--
-- select vault.create_secret(
--   'https://api.netlify.com/build_hooks/<YOUR_HOOK_ID>',
--   'netlify_build_hook_url',
--   'Netlify build hook (production branch) for blog publish rebuilds'
-- );
--
-- To rotate it later:
-- select vault.update_secret(
--   (select id from vault.secrets where name = 'netlify_build_hook_url'),
--   'https://api.netlify.com/build_hooks/<NEW_HOOK_ID>'
-- );
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. EXTENSION
-- ------------------------------------------------------------------------------
create extension if not exists pg_net;

-- ------------------------------------------------------------------------------
-- 2. TRIGGER FUNCTION
-- ------------------------------------------------------------------------------
create or replace function public.handle_blog_posts_netlify_rebuild()
returns trigger as $$
declare
  hook_url text;
begin
  -- Only changes that touch a live post affect the public site
  if coalesce(old.status, '') <> 'published' and coalesce(new.status, '') <> 'published' then
    return null;
  end if;

  -- Ignore updates that change nothing visible (e.g. a re-save with no edits)
  if tg_op = 'UPDATE' and (to_jsonb(old) - 'updated_at') = (to_jsonb(new) - 'updated_at') then
    return null;
  end if;

  -- One build per transaction (publishing a featured post also demotes the old one)
  if current_setting('vedic.netlify_rebuild_queued', true) = 'on' then
    return null;
  end if;

  select decrypted_secret into hook_url
  from vault.decrypted_secrets
  where name = 'netlify_build_hook_url'
  limit 1;

  if hook_url is null then
    raise warning 'netlify_build_hook_url is not set in Vault; skipping site rebuild';
    return null;
  end if;

  perform set_config('vedic.netlify_rebuild_queued', 'on', true);
  perform net.http_post(
    url := hook_url,
    body := '{}'::jsonb,
    params := jsonb_build_object(
      'trigger_title',
      'Blog ' || lower(tg_op) || ': ' || coalesce(new.slug, old.slug)
    )
  );

  return null;
end;
$$ language plpgsql security definer set search_path = '';

drop trigger if exists trg_blog_posts_netlify_rebuild on public.blog_posts;
create trigger trg_blog_posts_netlify_rebuild
  after insert or update or delete on public.blog_posts
  for each row
  execute function public.handle_blog_posts_netlify_rebuild();

-- ------------------------------------------------------------------------------
-- 3. VERIFY (optional)
-- ------------------------------------------------------------------------------
-- After publishing a post, check the request went out (status_code 201 = queued):
-- select id, status_code, created from net._http_response order by created desc limit 5;
--
-- To remove:
-- drop trigger if exists trg_blog_posts_netlify_rebuild on public.blog_posts;
-- drop function if exists public.handle_blog_posts_netlify_rebuild();
-- ==============================================================================
