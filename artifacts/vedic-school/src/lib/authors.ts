// ==============================================================================
// THE VEDIC SCHOOL — CENTRAL AUTHOR MANAGEMENT & DATA ACCESS UTILITIES
// ==============================================================================

import { supabase, isSupabaseConfigured } from './supabase';
import type { Author } from '@/types/blog';
import { DEFAULT_AUTHORS, MEENAKSHI_KOUL_AUTHOR } from '@/data/authors';

export { DEFAULT_AUTHORS, MEENAKSHI_KOUL_AUTHOR };

/**
 * Fetches all authors from Supabase, falling back gracefully to static defaults
 * if the `public.authors` table does not exist or Supabase is not reachable.
 */
export async function fetchAuthors(): Promise<{
  authors: Author[];
  error?: string;
}> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('authors')
        .select('*')
        .order('name', { ascending: true });

      if (!error && data && data.length > 0) {
        return { authors: data as Author[] };
      }
      if (error) {
        // Table may not exist yet in database
        console.warn('[Authors Service] Database authors table not accessible. Using static defaults:', error.message);
      }
    } catch (err: any) {
      console.warn('[Authors Service] Failed to query authors from Supabase:', err?.message);
    }
  }

  return { authors: [...DEFAULT_AUTHORS] };
}

/**
 * Fetches a single author by their unique URL slug.
 */
export async function fetchAuthorBySlug(slug: string): Promise<{
  author: Author | null;
  error?: string;
}> {
  if (!slug) return { author: null, error: 'Slug is required' };

  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('authors')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      if (!error && data) {
        return { author: data as Author };
      }
    } catch {
      // fallback
    }
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

  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('authors')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (!error && data) {
        return { author: data as Author };
      }
    } catch {
      // fallback
    }
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
