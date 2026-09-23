import type { Context } from "@netlify/edge-functions";

const ASSET_EXT_REGEX = /\.(js|mjs|cjs|ts|tsx|css|svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|eot|json|map|txt|xml|pdf|html|avif)$/i;

export default async function handler(request: Request, context: Context) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // 1. Skip internal sub-requests
  if (request.headers.get("x-nf-prerender-internal") === "1") {
    return context.next();
  }

  // 2. Skip static assets, Netlify system paths, and root '/'
  if (
    pathname === "/" ||
    pathname.startsWith("/.netlify/") ||
    ASSET_EXT_REGEX.test(pathname)
  ) {
    return context.next();
  }

  // 3. Trailing slash redirect:
  // If request has a trailing slash (e.g. /about/), issue a single HTTP 301
  // redirect directly to the canonical no-slash URL, preserving query parameters.
  if (pathname.endsWith("/")) {
    const cleanPath = pathname.replace(/\/+$/, "");
    return new Response(null, {
      status: 301,
      headers: {
        Location: `${url.origin}${cleanPath}${url.search}`,
        "Cache-Control": "public, max-age=31536000",
      },
    });
  }

  // 4. For canonical no-slash URLs (e.g. /about, /vedic-maths):
  // Let Netlify process the request to origin.
  const res = await context.next();

  // If Netlify's origin static server issued a 301/308 redirect from /route to /route/
  // because of directory index normalization, intercept it and rewrite to the route's
  // index.html so the client receives HTTP 200 directly at the canonical no-slash URL.
  if (res.status === 301 || res.status === 308) {
    const location = res.headers.get("location");
    if (location) {
      try {
        const targetUrl = new URL(location, url.origin);
        if (targetUrl.pathname === `${pathname}/` || targetUrl.pathname === pathname + "/") {
          // Serve the prerendered index.html file directly at HTTP 200
          return context.rewrite(`${pathname}/index.html${url.search}`);
        }
      } catch (err) {
        console.error("Trailing slash rewrite error:", err);
      }
    }
  }

  return res;
}
