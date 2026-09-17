// ==============================================================================
// THE VEDIC SCHOOL — PUBLIC AUTHOR PROFILE PAGE (/authors/:slug)
// ==============================================================================

import React, { useState, useEffect } from 'react';
import { useRoute, Link } from 'wouter';
import type { Author, BlogPost } from '@/types/blog';
import { fetchAuthorBySlug } from '@/lib/authors';
import { fetchPublishedBlogPosts } from '@/lib/blog';
import { Seo } from '@/seo/Seo';
import { Button } from '@/components/ui/button';
import {
  User,
  Linkedin,
  BookOpen,
  Calendar,
  Clock,
  ArrowLeft,
  ArrowRight,
  Loader2,
  ChevronRight,
} from 'lucide-react';
import meenakshiPortrait from '@assets/meenakshi-founder-portrait.jpg';

export default function AuthorProfile() {
  const [, params] = useRoute('/authors/:slug');
  const slug = params?.slug || '';

  const [author, setAuthor] = useState<Author | null>(null);
  const [articles, setArticles] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadAuthorAndArticles() {
      if (!slug) return;
      setLoading(true);
      setError(null);

      try {
        const { author: foundAuthor, error: authorErr } = await fetchAuthorBySlug(slug);
        if (authorErr || !foundAuthor) {
          setError('Author not found.');
          setLoading(false);
          return;
        }

        setAuthor(foundAuthor);

        // Fetch published articles by this author
        const { posts } = await fetchPublishedBlogPosts();
        const authorArticles = posts.filter(
          (p) =>
            p.author_id === foundAuthor.id ||
            p.author.toLowerCase() === foundAuthor.name.toLowerCase()
        );
        setArticles(authorArticles);
      } catch (err: any) {
        setError(err?.message || 'Failed to load author profile.');
      } finally {
        setLoading(false);
      }
    }

    loadAuthorAndArticles();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-[hsl(var(--primary))]" />
        <p className="text-xs text-stone-500 font-medium">Loading author profile...</p>
      </div>
    );
  }

  if (error || !author) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        <div className="w-14 h-14 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 mb-4">
          <User className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-serif font-bold text-stone-900 mb-2">
          Author Not Found
        </h1>
        <p className="text-sm text-stone-500 max-w-md mb-6">
          The author profile you are looking for does not exist or may have been updated.
        </p>
        <Link href="/blog">
          <Button variant="outline" size="sm" className="gap-2 text-xs">
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Button>
        </Link>
      </div>
    );
  }

  // Sourced portrait fallback for Meenakshi Koul
  const photoSrc =
    author.slug === 'meenakshi-koul'
      ? meenakshiPortrait
      : author.photo || undefined;

  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: author.name,
    jobTitle: author.role || 'Educator',
    description: author.bio || undefined,
    url: `https://www.thevedicschool.com/authors/${author.slug}`,
    sameAs: author.linkedin_url ? [author.linkedin_url] : [],
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--background))]">
      <Seo
        title={`${author.name} — Author Profile | The Vedic School`}
        description={
          author.bio?.slice(0, 155) ||
          `${author.name} is an educator and contributor at The Vedic School.`
        }
        path={`/authors/${author.slug}`}
        schema={personSchema}
      />

      {/* Breadcrumb Header */}
      <div className="border-b border-stone-200/60 bg-white/50 backdrop-blur-xs pt-24 sm:pt-28 pb-4">
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
          <nav className="flex items-center gap-1.5 text-xs text-stone-500">
            <Link href="/" className="hover:text-stone-900 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3 h-3 text-stone-400" />
            <Link href="/blog" className="hover:text-stone-900 transition-colors">
              Blog
            </Link>
            <ChevronRight className="w-3 h-3 text-stone-400" />
            <span className="text-stone-400">Authors</span>
            <ChevronRight className="w-3 h-3 text-stone-400" />
            <span className="text-stone-800 font-medium truncate">{author.name}</span>
          </nav>
        </div>
      </div>

      {/* Author Hero Section */}
      <section className="py-12 sm:py-16 border-b border-stone-200/60 bg-white">
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
          <div className="flex flex-col sm:flex-row items-start gap-8 sm:gap-10">
            {/* Portrait Image */}
            <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden bg-stone-100 border border-stone-200/80 shadow-md shrink-0">
              {photoSrc ? (
                <img
                  src={photoSrc}
                  alt={author.photo_alt || author.name}
                  className="w-full h-full object-cover object-center"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-stone-400">
                  <User className="w-12 h-12" />
                </div>
              )}
            </div>

            {/* Bio & Details */}
            <div className="flex-1 space-y-4">
              <div>
                <span className="text-[11px] uppercase tracking-widest font-semibold text-[hsl(var(--primary))] font-sans">
                  Author Profile
                </span>
                <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 mt-1">
                  {author.name}
                </h1>
                {author.role && (
                  <p className="text-sm sm:text-base text-stone-600 font-medium mt-1">
                    {author.role}
                  </p>
                )}
              </div>

              {author.bio && (
                <div className="prose prose-stone text-sm sm:text-base text-stone-700 leading-relaxed max-w-3xl space-y-3">
                  {author.bio.split('\n\n').map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>
              )}

              {/* Social / External Links */}
              {author.linkedin_url && (
                <div className="pt-2 flex items-center gap-3">
                  <a
                    href={author.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium bg-[#0A66C2]/10 text-[#0A66C2] hover:bg-[#0A66C2]/20 transition-colors"
                  >
                    <Linkedin className="w-3.5 h-3.5" />
                    Connect on LinkedIn
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Articles by Author Section */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-serif font-bold text-stone-900">
                Articles by {author.name}
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 mt-1">
                {articles.length} published {articles.length === 1 ? 'article' : 'articles'}
              </p>
            </div>

            <Link href="/blog">
              <span className="text-xs sm:text-sm text-[hsl(var(--primary))] hover:underline flex items-center gap-1 font-medium">
                View all blog posts <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          </div>

          {articles.length === 0 ? (
            <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center text-stone-500">
              <BookOpen className="w-8 h-8 mx-auto mb-2 text-stone-400" />
              <p className="text-sm font-medium">No published articles yet by this author.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <article className="group h-full bg-white rounded-2xl border border-stone-200/80 p-5 sm:p-6 shadow-xs hover:shadow-md hover:border-stone-300 transition-all flex flex-col justify-between cursor-pointer">
                    <div className="space-y-3">
                      {/* Category & Time */}
                      <div className="flex items-center justify-between text-xs text-stone-500">
                        <span className="uppercase tracking-wider text-[10px] font-bold text-[hsl(var(--primary))] bg-[hsl(var(--primary))]/10 px-2 py-0.5 rounded-full">
                          {post.category.replace('-', ' ')}
                        </span>
                        <span className="flex items-center gap-1 text-[11px] text-stone-400">
                          <Clock className="w-3 h-3" />
                          {post.reading_time || 1} min
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="font-serif text-lg font-bold text-stone-900 group-hover:text-[hsl(var(--primary))] transition-colors line-clamp-2 leading-snug">
                        {post.title}
                      </h3>

                      {/* Excerpt */}
                      {post.excerpt && (
                        <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed">
                          {post.excerpt}
                        </p>
                      )}
                    </div>

                    <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                      <span className="flex items-center gap-1 text-[11px] text-stone-400">
                        <Calendar className="w-3 h-3" />
                        {post.published_at
                          ? new Date(post.published_at).toLocaleDateString('en-GB', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })
                          : 'Recent'}
                      </span>

                      <span className="text-[hsl(var(--primary))] font-medium flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform text-xs">
                        Read <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
