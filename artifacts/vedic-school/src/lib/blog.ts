// ==============================================================================
// THE VEDIC SCHOOL — BLOG DATA ACCESS & CLIENT UTILITIES (STAGE 1)
// ==============================================================================

import { supabase, isSupabaseConfigured } from './supabase';
import type { BlogPost, BlogCategory } from '@/types/blog';
import { PUBLISHED_ARTICLES } from '@/data/published-articles';

/**
 * Calculates estimated reading time in minutes based on content.
 * Uses the industry standard of ~200 words per minute, with a minimum of 1 minute.
 */
export function calculateReadingTime(content: string): number {
  if (!content) return 1;

  // Strip HTML tags and markdown formatting for clean word counting
  const plainText = content
    .replace(/<[^>]*>/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[#*`_~>-]/g, ' ')
    .trim();

  const words = plainText.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

/**
 * Resolves a storage path or URL for a blog image.
 * If the image is stored in the 'blog-images' bucket, returns the public Supabase CDN URL.
 * If it's already an absolute URL (e.g. external or CDN), returns it directly.
 * If it's a local public path (e.g. /og/...), returns it directly.
 */
export function getBlogImageUrl(pathOrUrl: string | null | undefined): string | null {
  if (!pathOrUrl) return null;

  if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) {
    return pathOrUrl;
  }

  // Preserve local public paths
  if (pathOrUrl.startsWith('/')) {
    return pathOrUrl;
  }

  // Treat as object path in the 'blog-images' bucket
  const cleanPath = pathOrUrl.replace(/^\/+/, '');
  const { data } = supabase.storage.from('blog-images').getPublicUrl(cleanPath);
  return data?.publicUrl || null;
}

function normalizePost(post: BlogPost): BlogPost {
  let { author, content } = post;
  if (author === 'Meenakshi Khar') {
    author = 'Meenakshi Koul';
  }
  if (content && content.includes('Meenakshi Khar')) {
    content = content.replaceAll('Meenakshi Khar', 'Meenakshi Koul');
  }
  return { ...post, author, content };
}

/**
 * Fetches published blog posts, optionally filtered by category.
 * Ordered chronologically by published_at DESC.
 */
export async function fetchPublishedBlogPosts(options?: {
  category?: BlogCategory;
  limit?: number;
  offset?: number;
}): Promise<{ posts: BlogPost[]; count: number | null; error?: string }> {
  let supabasePosts: BlogPost[] = [];
  let fetchError: string | undefined;

  if (isSupabaseConfigured) {
    try {
      let query = supabase
        .from('blog_posts')
        .select('*', { count: 'exact' })
        .eq('status', 'published')
        .order('published_at', { ascending: false });

      if (options?.category) {
        query = query.eq('category', options.category);
      }

      const { data, error } = await query;
      if (!error && data) {
        supabasePosts = (data as BlogPost[]).map(normalizePost);
      } else if (error) {
        fetchError = error.message;
      }
    } catch (err: any) {
      fetchError = err?.message;
    }
  }

  // Combine with baseline published articles (avoiding duplicates by slug)
  const existingSlugs = new Set(supabasePosts.map((p) => p.slug));
  let staticMatches = PUBLISHED_ARTICLES.filter((p) => !existingSlugs.has(p.slug)).map(normalizePost);

  if (options?.category) {
    staticMatches = staticMatches.filter((p) => p.category === options.category);
  }

  const allPosts = [...supabasePosts, ...staticMatches].sort((a, b) => {
    const timeA = a.published_at ? new Date(a.published_at).getTime() : 0;
    const timeB = b.published_at ? new Date(b.published_at).getTime() : 0;
    return timeB - timeA;
  });

  const totalCount = allPosts.length;
  const offset = options?.offset || 0;
  const limit = options?.limit || allPosts.length;
  const pagedPosts = allPosts.slice(offset, offset + limit);

  return { posts: pagedPosts, count: totalCount, error: fetchError };
}

/**
 * Fetches the currently featured published blog post.
 */
export async function fetchFeaturedBlogPost(): Promise<{
  post: BlogPost | null;
  error?: string;
}> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('status', 'published')
        .eq('is_featured', true)
        .maybeSingle();

      if (!error && data) {
        return { post: normalizePost(data as BlogPost) };
      }
    } catch {
      // fallback
    }
  }

  const staticFeatured =
    PUBLISHED_ARTICLES.find((p) => p.is_featured) || PUBLISHED_ARTICLES[0] || null;
  return { post: staticFeatured ? normalizePost(staticFeatured) : null };
}

/**
 * Fetches a single published post by slug.
 */
export async function fetchPublishedPostBySlug(slug: string): Promise<{
  post: BlogPost | null;
  error?: string;
}> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('status', 'published')
        .eq('slug', slug)
        .maybeSingle();

      if (!error && data) {
        return { post: normalizePost(data as BlogPost) };
      }
    } catch {
      // fallback
    }
  }

  const staticPost = PUBLISHED_ARTICLES.find((p) => p.slug === slug) || null;
  return { post: staticPost ? normalizePost(staticPost) : null, error: staticPost ? undefined : 'Article not found.' };
}
