// ==============================================================================
// THE VEDIC SCHOOL — URL SLUG UTILITIES FOR BLOG POSTS
// ==============================================================================

/**
 * Regex matching the PostgreSQL check constraint:
 * - Starts and ends with lowercase alphanumeric character
 * - Words separated by single hyphens
 * - No consecutive hyphens, no special characters, no spaces
 * - Length between 3 and 120 characters
 */
export const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const MIN_SLUG_LENGTH = 3;
export const MAX_SLUG_LENGTH = 120;

/**
 * Generates a clean, URL-safe slug from a blog post title.
 * Examples:
 *   "Why Understanding Matters More Than Speed in Maths" -> "why-understanding-matters-more-than-speed-in-maths"
 *   "5 Ways to Make Maths Practice Less Stressful!" -> "5-ways-to-make-maths-practice-less-stressful"
 */
export function slugify(title: string): string {
  if (!title) return '';

  return (
    title
      // Normalize accented Latin characters (é -> e, etc.)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      // Lowercase
      .toLowerCase()
      // Replace ampersand with 'and' for readability
      .replace(/&/g, '-and-')
      // Remove all non-alphanumeric characters except hyphens and spaces
      .replace(/[^a-z0-9\s-]/g, '')
      // Replace whitespace and multiple consecutive hyphens with a single hyphen
      .replace(/[\s_]+/g, '-')
      .replace(/-+/g, '-')
      // Trim leading and trailing hyphens
      .replace(/^-+|-+$/g, '')
      // Limit to 100 characters to comfortably stay within 120 DB limit
      .slice(0, 100)
      // Re-trim trailing hyphen if cut in the middle of a hyphen
      .replace(/-+$/, '')
  );
}

/**
 * Validates whether a candidate slug satisfies the database constraints.
 */
export function validateSlug(slug: string): { valid: boolean; error?: string } {
  if (!slug || typeof slug !== 'string') {
    return { valid: false, error: 'Slug is required.' };
  }

  const trimmed = slug.trim();

  if (trimmed.length < MIN_SLUG_LENGTH) {
    return {
      valid: false,
      error: `Slug must be at least ${MIN_SLUG_LENGTH} characters long.`,
    };
  }

  if (trimmed.length > MAX_SLUG_LENGTH) {
    return {
      valid: false,
      error: `Slug cannot exceed ${MAX_SLUG_LENGTH} characters.`,
    };
  }

  if (trimmed !== trimmed.toLowerCase()) {
    return { valid: false, error: 'Slug must be all lowercase.' };
  }

  if (/--/.test(trimmed)) {
    return { valid: false, error: 'Slug cannot contain consecutive hyphens.' };
  }

  if (/^-|-$/.test(trimmed)) {
    return { valid: false, error: 'Slug cannot start or end with a hyphen.' };
  }

  if (!SLUG_REGEX.test(trimmed)) {
    return {
      valid: false,
      error: 'Slug may only contain lowercase letters, numbers, and single hyphens.',
    };
  }

  return { valid: true };
}
