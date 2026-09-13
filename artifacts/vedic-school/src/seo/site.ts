// ==============================================================================
// THE VEDIC SCHOOL — CENTRAL CANONICAL SITE URL SOURCE OF TRUTH
// ==============================================================================

/**
 * Base site URL for canonical tags, Open Graph meta tags, structured data,
 * and sitemaps. Configurable via VITE_SITE_URL environment variable with
 * fallback to the production Netlify deployment URL.
 * Trailing slash is automatically stripped to guarantee consistent formatting.
 */
export const SITE_URL: string = (
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SITE_URL) ||
  'https://thevedicschool.com'
).replace(/\/+$/, '');

/**
 * Resolves a relative path to an absolute URL using the canonical SITE_URL.
 * Ensures that the path begins with a single leading slash and avoids double slashes.
 *
 * @example
 * abs('/about')  // 'https://thevedicschool.com/about'
 * abs('about')   // 'https://thevedicschool.com/about'
 * abs('/')       // 'https://thevedicschool.com/'
 * abs('')        // 'https://thevedicschool.com'
 */
export function abs(path: string = ''): string {
  if (!path) {
    return SITE_URL;
  }
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${normalizedPath}`;
}
