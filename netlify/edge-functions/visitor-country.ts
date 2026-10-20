import type { Context } from "@netlify/edge-functions";

/**
 * GET /api/visitor-country -> { "country": "CA" } | { "country": null }
 *
 * Exposes only the visitor's country code (ISO 3166-1 alpha-2) from Netlify's
 * edge geolocation (context.geo), so the client can decide whether to show the
 * Canada campaign pop-up. No IP, city, coordinates or identifiers are returned
 * or stored. Query parameters are ignored, so a URL cannot spoof the country.
 * Unknown or malformed values return null (the client then shows nothing).
 */
export default async function handler(_request: Request, context: Context) {
  const code = context.geo?.country?.code;
  const country = typeof code === "string" && /^[A-Z]{2}$/.test(code) ? code : null;

  return new Response(JSON.stringify({ country }), {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      // Per-visitor answer: never cache at the CDN or in shared caches.
      "Cache-Control": "private, no-store, max-age=0",
      "X-Content-Type-Options": "nosniff",
      "X-Robots-Tag": "noindex",
    },
  });
}

// Route is declared in netlify.toml ([[edge_functions]] visitor-country).
