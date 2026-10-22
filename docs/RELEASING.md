# Releasing

Netlify deploys production from the **`production`** branch. `main` is the
working branch: pushing to it never changes the live site, so `[skip netlify]`
is no longer needed on commits.

## Ship a release

```bash
git checkout production && git merge --ff-only main && git push && git checkout main
```

## Blog posts rebuild the site automatically

Publishing, unpublishing, deleting or editing a live post in the admin panel
calls a Netlify build hook that rebuilds the `production` branch. This
prerenders the post and updates `sitemap.xml` within a few minutes. Drafts never
trigger a build, and unreleased work on `main` is never deployed.

Setup lives in [`scripts/setup_blog_rebuild_trigger.sql`](../scripts/setup_blog_rebuild_trigger.sql).
To check recent hook calls, run in the Supabase SQL Editor:

```sql
select id, status_code, created from net._http_response order by created desc limit 5;
```
