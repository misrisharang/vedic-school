// ==============================================================================
// THE VEDIC SCHOOL — BLOG DATA ACCESS & CLIENT UTILITIES (STAGE 1)
// ==============================================================================

import { supabase, isSupabaseConfigured } from './supabase';
import type { BlogPost, BlogCategory } from '@/types/blog';

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
 */
export function getBlogImageUrl(pathOrUrl: string | null | undefined): string | null {
  if (!pathOrUrl) return null;

  if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) {
    return pathOrUrl;
  }

  // Treat as object path in the 'blog-images' bucket
  const cleanPath = pathOrUrl.replace(/^\/+/, '');
  const { data } = supabase.storage.from('blog-images').getPublicUrl(cleanPath);
  return data?.publicUrl || null;
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
  if (!isSupabaseConfigured) {
    return { posts: [], count: 0, error: 'Database service is not configured.' };
  }

  try {
    let query = supabase
      .from('blog_posts')
      .select('*', { count: 'exact' })
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    if (options?.category) {
      query = query.eq('category', options.category);
    }

    if (typeof options?.offset === 'number' && typeof options?.limit === 'number') {
      query = query.range(options.offset, options.offset + options.limit - 1);
    } else if (typeof options?.limit === 'number') {
      query = query.limit(options.limit);
    }

    const { data, count, error } = await query;

    if (error) {
      console.error('[Blog Fetch Error]', error);
      return { posts: [], count: 0, error: error.message };
    }

    return { posts: (data as BlogPost[]) || [], count };
  } catch (err: any) {
    console.error('[Blog Unexpected Fetch Error]', err);
    return { posts: [], count: 0, error: err?.message || 'Failed to fetch posts.' };
  }
}

/**
 * Fetches the currently featured published blog post.
 */
export async function fetchFeaturedBlogPost(): Promise<{
  post: BlogPost | null;
  error?: string;
}> {
  if (!isSupabaseConfigured) {
    return { post: null, error: 'Database service is not configured.' };
  }

  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('status', 'published')
      .eq('is_featured', true)
      .maybeSingle();

    if (error) {
      console.error('[Featured Post Error]', error);
      return { post: null, error: error.message };
    }

    return { post: (data as BlogPost) || null };
  } catch (err: any) {
    console.error('[Featured Post Unexpected Error]', err);
    return { post: null, error: err?.message || 'Failed to fetch featured post.' };
  }
}

/**
 * Fetches a single published post by slug.
 */
export async function fetchPublishedPostBySlug(slug: string): Promise<{
  post: BlogPost | null;
  error?: string;
}> {
  if (!isSupabaseConfigured) {
    return { post: null, error: 'Database service is not configured.' };
  }

  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('status', 'published')
      .eq('slug', slug)
      .maybeSingle();

    if (error) {
      console.error('[Post By Slug Error]', error);
      return { post: null, error: error.message };
    }

    return { post: (data as BlogPost) || null };
  } catch (err: any) {
    console.error('[Post By Slug Unexpected Error]', err);
    return { post: null, error: err?.message || 'Failed to fetch post.' };
  }
}
