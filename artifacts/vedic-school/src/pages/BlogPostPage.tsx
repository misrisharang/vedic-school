// ==============================================================================
// THE VEDIC SCHOOL — INDIVIDUAL ARTICLE PAGE (/blog/:slug)
// ==============================================================================

import React, { useState, useEffect } from 'react';
import { useRoute, Link } from 'wouter';
import { marked } from 'marked';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { BlogPost, BlogCategory } from '@/types/blog';
import { BLOG_CATEGORY_META } from '@/types/blog';
import { getBlogImageUrl } from '@/lib/blog';
import { useDemoModal } from '@/context/DemoModalContext';
import {
  ArrowLeft,
  Clock,
  Calendar,
  User,
  Share2,
  BookOpen,
  ArrowRight,
  Sparkles,
  Loader2,
  Check,
} from 'lucide-react';

export default function BlogPostPage() {
  const [, params] = useRoute('/blog/:slug');
  const slug = params?.slug;
  const { openDemoModal } = useDemoModal();

  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Load article and related articles
  useEffect(() => {
    async function loadPost() {
      if (!slug) return;
      setLoading(true);
      setError(null);

      if (!isSupabaseConfigured) {
        setError('Database service not configured.');
        setLoading(false);
        return;
      }

      try {
        // Query strictly published posts where slug matches
        const { data, error: fetchError } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('slug', slug)
          .eq('status', 'published')
          .maybeSingle();

        if (fetchError) throw fetchError;

        if (!data) {
          setError('Article not found.');
          setPost(null);
          setLoading(false);
          return;
        }

        const currentPost = data as BlogPost;
        setPost(currentPost);

        // Fetch up to 3 related published posts (preferring same category)
        const { data: relatedData } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('status', 'published')
          .neq('id', currentPost.id)
          .order('published_at', { ascending: false })
          .limit(6);

        const relatedList = (relatedData as BlogPost[]) || [];
        // Prioritize same category first
        const sortedRelated = [
          ...relatedList.filter((p) => p.category === currentPost.category),
          ...relatedList.filter((p) => p.category !== currentPost.category),
        ].slice(0, 3);

        setRelatedPosts(sortedRelated);
      } catch (err: any) {
        console.error('[Article Load Error]', err);
        setError(err?.message || 'Failed to load article.');
      } finally {
        setLoading(false);
      }
    }

    loadPost();
  }, [slug]);

  // Dynamic SEO Title, Meta Tags & JSON-LD Structured Data
  useEffect(() => {
    if (!post) return;

    // Document title
    const prevTitle = document.title;
    document.title = post.seo_title || `${post.title} | The Vedic School`;

    // Meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    const prevMetaDesc = metaDesc ? metaDesc.getAttribute('content') : null;
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute(
      'content',
      post.seo_description || post.excerpt || 'Practical ideas and insights from The Vedic School.'
    );

    // Canonical link
    let canonical = document.querySelector('link[rel="canonical"]');
    const canonicalUrl = `${window.location.origin}/blog/${post.slug}`;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', canonicalUrl);

    // JSON-LD Schema.org Structured Data
    const scriptId = 'blog-post-schema';
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }

    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.excerpt || post.seo_description,
      image: post.featured_image ? [getBlogImageUrl(post.featured_image)] : [],
      datePublished: post.published_at || post.created_at,
      dateModified: post.updated_at || post.published_at,
      author: {
        '@type': 'Person',
        name: post.author || 'Meenakshi Koul',
        jobTitle: 'Founder & Educator',
        worksFor: {
          '@type': 'EducationalOrganization',
          name: 'The Vedic School',
          url: 'https://thevedicschool.com',
        },
      },
      publisher: {
        '@type': 'Organization',
        name: 'The Vedic School',
        url: 'https://thevedicschool.com',
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': canonicalUrl,
      },
    };

    script.textContent = JSON.stringify(structuredData);

    return () => {
      document.title = prevTitle;
      if (prevMetaDesc && metaDesc) metaDesc.setAttribute('content', prevMetaDesc);
      if (script && script.parentNode) script.parentNode.removeChild(script);
    };
  }, [post]);

  // Render markdown content
  const renderedContent = React.useMemo(() => {
    if (!post?.content) return '';
    try {
      return marked.parse(post.content);
    } catch {
      return '<p>Error rendering article content.</p>';
    }
  }, [post?.content]);

  // Share handler
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post?.title,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  // Loading View
  if (loading) {
    return (
      <div className="min-h-screen bg-[hsl(var(--background))] pt-32 pb-20 flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[hsl(var(--primary))] mb-3" />
        <p className="text-xs sm:text-sm text-stone-500 font-medium">Loading article...</p>
      </div>
    );
  }

  // Not Found / Error View
  if (error || !post) {
    return (
      <div className="min-h-screen bg-[hsl(var(--background))] pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-lg text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mx-auto border border-amber-200">
            <BookOpen className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-stone-900">
            Article Not Found
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            The article you're looking for doesn't exist, has been unpublished, or the link may have changed.
          </p>
          <div className="pt-2">
            <Link
              href="/blog"
              className="inline-flex items-center text-xs font-semibold text-[hsl(var(--primary))] hover:underline gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              Return to The Vedic School Blog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const categoryMeta = BLOG_CATEGORY_META[post.category] || BLOG_CATEGORY_META['vedic-maths'];
  const coverUrl = getBlogImageUrl(post.featured_image) || post.featured_image;

  const displayDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '';

  return (
    <div className="bg-[hsl(var(--background))] min-h-screen pt-28 pb-20">
      {/* Top Breadcrumb & Return Link */}
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl mb-6 sm:mb-8">
        <Link
          href="/blog"
          className="inline-flex items-center text-xs sm:text-sm font-medium text-stone-500 hover:text-[hsl(var(--primary))] transition-colors gap-1.5 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to all articles
        </Link>
      </div>

      {/* Main Article Container */}
      <article className="container mx-auto px-4 sm:px-6 max-w-4xl">
        <div className="bg-white rounded-3xl border border-stone-200 shadow-xs p-6 sm:p-10 lg:p-14 space-y-8 sm:space-y-10">
          {/* Header Metadata: Category, Date, Read Time */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold border ${categoryMeta.badgeClass}`}
              >
                {categoryMeta.label}
              </span>

              <div className="flex items-center gap-3 text-stone-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {post.reading_time || 1} min read
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {displayDate}
                </span>
              </div>
            </div>

            {/* Share Button */}
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-800 transition-colors p-1.5 rounded-lg hover:bg-stone-50 border border-stone-200"
              title="Share article link"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-medium">Link copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share</span>
                </>
              )}
            </button>
          </div>

          {/* Article Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-stone-900 tracking-tight leading-tight">
            {post.title}
          </h1>

          {/* Excerpt / Dek */}
          {post.excerpt && (
            <p className="text-lg sm:text-xl text-stone-600 font-sans leading-relaxed border-l-2 border-[hsl(var(--primary))] pl-4 sm:pl-5 italic">
              {post.excerpt}
            </p>
          )}

          {/* Author Byline */}
          <div className="flex items-center gap-3 py-4 border-y border-stone-100 text-xs text-stone-600">
            <div className="w-10 h-10 rounded-full bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))] flex items-center justify-center font-bold text-sm">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold text-stone-900 text-sm">{post.author || 'Meenakshi Koul'}</div>
              <div className="text-stone-500 text-xs">Founder & Educator • The Vedic School</div>
            </div>
          </div>

          {/* Cover Photo */}
          {coverUrl && (
            <div className="rounded-2xl overflow-hidden border border-stone-200 aspect-16/9 bg-stone-100 shadow-xs">
              <img
                src={coverUrl}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Formatted Markdown Body */}
          <div
            className="prose prose-stone prose-lg max-w-none pt-2 font-sans leading-relaxed text-stone-800"
            dangerouslySetInnerHTML={{ __html: renderedContent }}
          />

          {/* Category-Specific Vedic School Programme CTA */}
          <div className="mt-12 pt-8 border-t border-stone-200">
            <ProgrammeCTA category={post.category} onOpenDemo={openDemoModal} />
          </div>
        </div>
      </article>

      {/* Related Articles Section */}
      {relatedPosts.length > 0 && (
        <section className="container mx-auto px-4 sm:px-6 max-w-5xl mt-16 sm:mt-20">
          <div className="border-t border-stone-200 pt-10 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-serif font-bold text-stone-900">
                Related Articles
              </h2>
              <Link
                href="/blog"
                className="text-xs font-semibold text-[hsl(var(--primary))] hover:underline flex items-center gap-1"
              >
                <span>View all</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((related) => {
                const rMeta = BLOG_CATEGORY_META[related.category] || BLOG_CATEGORY_META['vedic-maths'];
                const rImage = getBlogImageUrl(related.featured_image) || related.featured_image;

                return (
                  <article
                    key={related.id}
                    className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md hover:border-stone-300 transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Cover */}
                      <Link href={`/blog/${related.slug}`} className="block relative aspect-16/10 overflow-hidden bg-stone-100">
                        {rImage ? (
                          <img
                            src={rImage}
                            alt={related.title}
                            className="w-full h-full object-cover hover:scale-102 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-[hsl(var(--block-sage-light))]/50 text-[#2E4A2C]/60">
                            <BookOpen className="w-8 h-8 stroke-1" />
                          </div>
                        )}
                      </Link>

                      <div className="p-5 space-y-2.5">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${rMeta.badgeClass}`}
                        >
                          {rMeta.label}
                        </span>

                        <Link href={`/blog/${related.slug}`}>
                          <h3 className="text-base font-serif font-bold text-stone-900 hover:text-[hsl(var(--primary))] transition-colors line-clamp-2 leading-snug">
                            {related.title}
                          </h3>
                        </Link>

                        {related.excerpt && (
                          <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                            {related.excerpt}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="px-5 pb-4 pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400">
                      <span>{related.reading_time || 1} min read</span>
                      <Link
                        href={`/blog/${related.slug}`}
                        className="font-semibold text-[hsl(var(--primary))] hover:underline flex items-center gap-0.5"
                      >
                        Read →
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

/**
 * Contextual Teacher-Led Programme Call-To-Action Box
 */
function ProgrammeCTA({
  category,
  onOpenDemo,
}: {
  category: BlogCategory;
  onOpenDemo: () => void;
}) {
  if (category === 'vedic-maths') {
    return (
      <div className="rounded-2xl p-6 sm:p-8 bg-[hsl(var(--block-sage-light))] border border-[#B7D2B5] flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#2E4A2C]">
            Live Experience
          </div>
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">
            Experience Vedic Maths in Action
          </h3>
          <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
            See how mental maths shortcuts, speed calculation, and number sense rebuild confidence. Join our live parent-child Sunday demo.
          </p>
        </div>

        <div className="shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <button
            type="button"
            onClick={onOpenDemo}
            className="px-5 py-2.5 rounded-xl bg-[#446342] hover:bg-[#385236] text-white text-xs font-semibold shadow-xs transition-colors whitespace-nowrap text-center"
          >
            Join Sunday's Free Demo
          </button>
          <Link
            href="/vedic-maths"
            className="px-4 py-2.5 rounded-xl bg-white/80 hover:bg-white text-stone-800 text-xs font-medium border border-[#B7D2B5] transition-colors whitespace-nowrap text-center"
          >
            Explore Curriculum →
          </Link>
        </div>
      </div>
    );
  }

  if (category === 'curriculum-support') {
    return (
      <div className="rounded-2xl p-6 sm:p-8 bg-[hsl(var(--block-terracotta-light))] border border-[#E6C5B9] flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[hsl(var(--primary))]">
            Personalised Guidance
          </div>
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">
            Need Support with Your Child's School Maths?
          </h3>
          <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
            We diagnose foundational gaps and build personalized learning plans aligned to your child's syllabus and upcoming exams.
          </p>
        </div>

        <div className="shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <Link
            href="/curriculum-aligned"
            className="px-5 py-2.5 rounded-xl bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/90 text-white text-xs font-semibold shadow-xs transition-colors whitespace-nowrap text-center"
          >
            Book a Personal Assessment
          </Link>
          <Link
            href="/contact"
            className="px-4 py-2.5 rounded-xl bg-white/80 hover:bg-white text-stone-800 text-xs font-medium border border-[#E6C5B9] transition-colors whitespace-nowrap text-center"
          >
            Contact Meenakshi →
          </Link>
        </div>
      </div>
    );
  }

  // Parenting category: Dual pathway
  return (
    <div className="rounded-2xl p-6 sm:p-8 bg-[hsl(var(--block-terracotta-light))] border border-[#E6C5B9] flex flex-col sm:flex-row sm:items-center justify-between gap-6">
      <div className="space-y-2 max-w-xl">
        <div className="text-[11px] font-bold uppercase tracking-wider text-[hsl(var(--primary))]">
          The Vedic School Approach
        </div>
        <h3 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">
          Transform How Your Child Experiences Maths
        </h3>
        <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
          Whether rebuilding foundational confidence with Vedic techniques or mastering school curriculum, we guide children toward calm, lasting fluency.
        </p>
      </div>

      <div className="shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
        <button
          type="button"
          onClick={onOpenDemo}
          className="px-4 py-2.5 rounded-xl bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/90 text-white text-xs font-semibold shadow-xs transition-colors whitespace-nowrap text-center"
        >
          Sunday Demo Class
        </button>
        <Link
          href="/curriculum-aligned"
          className="px-4 py-2.5 rounded-xl bg-white/80 hover:bg-white text-stone-800 text-xs font-medium border border-[#E6C5B9] transition-colors whitespace-nowrap text-center"
        >
          Curriculum Classes →
        </Link>
      </div>
    </div>
  );
}
