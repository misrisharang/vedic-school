// ==============================================================================
// THE VEDIC SCHOOL — CENTRAL AUTHOR MANAGEMENT & DATA ACCESS UTILITIES
// ==============================================================================

import { supabase, isSupabaseConfigured } from './supabase';
import type { Author } from '@/types/blog';
import { DEFAULT_AUTHORS, MEENAKSHI_KOUL_AUTHOR } from '@/data/authors';

export { DEFAULT_AUTHORS, MEENAKSHI_KOUL_AUTHOR };

const AUTHORS_CACHE_KEY = 'the_vedic_school_authors_cache';

/**
 * Retrieves the local in-browser author cache (used for instant client updates).
 */
export function getLocalAuthorsCache(): Author[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(AUTHORS_CACHE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Persists an author record into local client cache and notifies open pages.
 */
export function saveAuthorToLocalCache(author: Author): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getLocalAuthorsCache();
    const existingIndex = current.findIndex(
      (a) => a.id === author.id || a.slug === author.slug
    );
    let updated: Author[];
    if (existingIndex >= 0) {
      updated = [...current];
      updated[existingIndex] = { ...updated[existingIndex], ...author };
    } else {
      updated = [...current, author];
    }
    localStorage.setItem(AUTHORS_CACHE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('vedic_school_author_updated', { detail: author }));
  } catch (err) {
    console.warn('Failed to save author to localStorage:', err);
  }
}

/**
 * Fetches all authors from Supabase, falling back gracefully to local cache and static defaults.
 */
export async function fetchAuthors(): Promise<{
  authors: Author[];
  error?: string;
}> {
  const localCache = getLocalAuthorsCache();

  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('authors')
        .select('*')
        .order('name', { ascending: true });

      if (!error && data && data.length > 0) {
        const dbAuthors = data as Author[];
        const merged = dbAuthors.map((dbA) => {
          const localMatch = localCache.find((lA) => lA.id === dbA.id || lA.slug === dbA.slug);
          if (
            localMatch &&
            (!dbA.updated_at ||
              !localMatch.updated_at ||
              new Date(localMatch.updated_at) >= new Date(dbA.updated_at))
          ) {
            return { ...dbA, ...localMatch };
          }
          return dbA;
        });
        return { authors: merged };
      }
      if (error) {
        console.warn('[Authors Service] Database authors table not accessible. Using static defaults:', error.message);
      }
    } catch (err: any) {
      console.warn('[Authors Service] Failed to query authors from Supabase:', err?.message);
    }
  }

  // Merge local cache over static defaults
  const merged = DEFAULT_AUTHORS.map((defA) => {
    const localMatch = localCache.find((lA) => lA.id === defA.id || lA.slug === defA.slug);
    return localMatch ? { ...defA, ...localMatch } : defA;
  });

  for (const lA of localCache) {
    if (!merged.some((m) => m.id === lA.id || m.slug === lA.slug)) {
      merged.push(lA);
    }
  }

  return { authors: merged };
}

/**
 * Fetches a single author by their unique URL slug.
 */
export async function fetchAuthorBySlug(slug: string): Promise<{
  author: Author | null;
  error?: string;
}> {
  if (!slug) return { author: null, error: 'Slug is required' };

  const localCache = getLocalAuthorsCache();
  const localMatch = localCache.find((a) => a.slug === slug);

  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('authors')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      if (!error && data) {
        const dbAuthor = data as Author;
        if (
          localMatch &&
          (!dbAuthor.updated_at ||
            !localMatch.updated_at ||
            new Date(localMatch.updated_at) >= new Date(dbAuthor.updated_at))
        ) {
          return { author: { ...dbAuthor, ...localMatch } };
        }
        return { author: dbAuthor };
      }
    } catch {
      // fallback
    }
  }

  if (localMatch) {
    return { author: localMatch };
  }

  const match = DEFAULT_AUTHORS.find((a) => a.slug === slug);
  return {
    author: match || null,
    error: match ? undefined : 'Author not found',
  };
}

/**
 * Fetches a single author by ID.
 */
export async function fetchAuthorById(id: string): Promise<{
  author: Author | null;
  error?: string;
}> {
  if (!id) return { author: null, error: 'ID is required' };

  const localCache = getLocalAuthorsCache();
  const localMatch = localCache.find((a) => a.id === id);

  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('authors')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (!error && data) {
        const dbAuthor = data as Author;
        if (
          localMatch &&
          (!dbAuthor.updated_at ||
            !localMatch.updated_at ||
            new Date(localMatch.updated_at) >= new Date(dbAuthor.updated_at))
        ) {
          return { author: { ...dbAuthor, ...localMatch } };
        }
        return { author: dbAuthor };
      }
    } catch {
      // fallback
    }
  }

  if (localMatch) {
    return { author: localMatch };
  }

  const match = DEFAULT_AUTHORS.find((a) => a.id === id);
  return {
    author: match || null,
    error: match ? undefined : 'Author not found',
  };
}

/**
 * Finds an author matching a name or returns the default author.
 */
export function findAuthorByNameOrSlug(
  authors: Author[],
  nameOrSlug: string
): Author | undefined {
  if (!nameOrSlug) return undefined;
  const clean = nameOrSlug.trim().toLowerCase();

  return authors.find(
    (a) =>
      a.name.toLowerCase() === clean ||
      a.slug.toLowerCase() === clean ||
      clean.includes(a.name.toLowerCase()) ||
      a.name.toLowerCase().includes(clean)
  );
}

/**
 * Checks if an author is associated with any articles before allowing deletion.
 */
export async function getAuthorArticleCount(
  authorId: string,
  authorName: string
): Promise<number> {
  if (!isSupabaseConfigured) return 0;

  try {
    const { count, error } = await supabase
      .from('blog_posts')
      .select('id', { count: 'exact', head: true })
      .or(`author_id.eq.${authorId},author.eq.${authorName}`);

    if (error) {
      // If author_id column does not exist yet, check legacy author name only
      const { count: nameCount } = await supabase
        .from('blog_posts')
        .select('id', { count: 'exact', head: true })
        .eq('author', authorName);
      return nameCount || 0;
    }

    return count || 0;
  } catch {
    return 0;
  }
}
