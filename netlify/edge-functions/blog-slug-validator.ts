// ==============================================================================
// THE VEDIC SCHOOL — NETLIFY EDGE FUNCTION: BLOG SLUG VALIDATOR
// ==============================================================================
// Validates /blog/:slug routes dynamically against Supabase.
// - If published post exists: rewrites to /index.html with HTTP 200.
// - If post does not exist: rewrites to /404.html with HTTP 404.
// ==============================================================================

import type { Context } from "@netlify/edge-functions";

const slugCache = new Map<string, { valid: boolean; expires: number }>();
const CACHE_TTL_MS = 60000;

export default async function handler(request: Request, context: Context) {
  const url = new URL(request.url);
  const pathname = url.pathname.replace(/\/$/, "");

  // Allow the base /blog list page to pass through
  if (pathname === "/blog" || pathname === "") {
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
      return context.rewrite("/index.html");
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
    return context.rewrite("/index.html");
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
        return context.rewrite("/index.html");
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
