// ==============================================================================
// THE VEDIC SCHOOL — NETLIFY EDGE FUNCTION: BLOG SLUG VALIDATOR
// ==============================================================================
// Validates /blog/:slug routes dynamically against Supabase.
// - If published post exists: serves its prerendered /blog/<slug>.html with
//   HTTP 200 (falls back to the /index.html app shell if not prerendered yet).
// - If post does not exist: rewrites to /404.html with HTTP 404.
// ==============================================================================

import type { Context } from "@netlify/edge-functions";

const slugCache = new Map<string, { valid: boolean; expires: number }>();
const CACHE_TTL_MS = 60000;

// Serve the article's own prerendered HTML so crawlers get its real title,
// content and canonical tag. /index.html is the prerendered homepage, so it is
// only used for posts published after the last build.
async function serveArticle(context: Context, slug: string) {
  const prerendered = await context.rewrite(`/blog/${slug}.html`);
  if (prerendered.status === 200) {
    return prerendered;
  }
  return context.rewrite("/index.html");
}

export default async function handler(request: Request, context: Context) {
  const url = new URL(request.url);
  const pathname = url.pathname.replace(/\/$/, "");

  // Allow the base /blog list page and direct prerendered file requests to pass through
  if (pathname === "/blog" || pathname === "" || pathname.endsWith(".html")) {
    return context.next();
  }

  const slug = pathname.replace(/^\/blog\//, "");
  if (!slug || slug.includes("/")) {
    const notFoundRes = await context.rewrite("/404.html");
    return new Response(await notFoundRes.text(), {
      status: 404,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }

  const now = Date.now();
  const cached = slugCache.get(slug);
  if (cached && now < cached.expires) {
    if (cached.valid) {
      return serveArticle(context, slug);
    } else {
      const notFoundRes = await context.rewrite("/404.html");
      return new Response(await notFoundRes.text(), {
        status: 404,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  }

  const supabaseUrl = Netlify.env.get("VITE_SUPABASE_URL");
  const supabaseKey = Netlify.env.get("VITE_SUPABASE_PUBLISHABLE_KEY");

  if (!supabaseUrl || !supabaseKey) {
    return serveArticle(context, slug);
  }

  try {
    const res = await fetch(
      `${supabaseUrl}/rest/v1/blog_posts?select=id&slug=eq.${encodeURIComponent(slug)}&status=eq.published&limit=1`,
      {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
      }
    );

    if (res.ok) {
      const data = await res.json();
      const isValid = Array.isArray(data) && data.length > 0;
      slugCache.set(slug, { valid: isValid, expires: now + CACHE_TTL_MS });

      if (isValid) {
        return serveArticle(context, slug);
      }
    }
  } catch (err) {
    console.error("Edge function blog slug validation error:", err);
  }

  // Not found in Supabase -> Genuine HTTP 404
  const notFoundRes = await context.rewrite("/404.html");
  return new Response(await notFoundRes.text(), {
    status: 404,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

export const config = {
  path: "/blog/*",
};
