// ==============================================================================
// THE VEDIC SCHOOL — INDIVIDUAL ARTICLE PAGE (/blog/:slug)
// ==============================================================================

import React, { useState, useEffect } from 'react';
import { useRoute, Link } from 'wouter';
import { marked } from 'marked';
import NotFound from '@/pages/not-found';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { BlogPost, BlogCategory, BlogFAQItem } from '@/types/blog';
import { BLOG_CATEGORY_META } from '@/types/blog';
import { getBlogImageUrl, fetchPublishedPostBySlug, fetchPublishedBlogPosts } from '@/lib/blog';
import { Seo } from '@/seo/Seo';
import { abs } from '@/seo/site';
import { getBlogPostSchema, getVedicMathsVsAbacusArticleSchema } from '@/seo/schema';
import { PUBLISHED_ARTICLES } from '@/data/published-articles';
import { useDemoModal } from '@/context/DemoModalContext';
import { SummariseWithAI } from '@/components/blog/SummariseWithAI';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
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

/**
 * Extracts FAQ questions and answers from article markdown and removes the duplicated
 * raw markdown FAQ block so it never appears as literal markdown headings in the article body.
 */
function extractFaqsAndCleanContent(
  rawContent: string,
  currentFaqs?: BlogFAQItem[]
): {
  cleanContent: string;
  effectiveFaqs: BlogFAQItem[];
} {
  if (!rawContent) {
    return { cleanContent: '', effectiveFaqs: currentFaqs || [] };
  }

  // Regex to match FAQ section: starts with ## **...FAQ... and ends before About the author, Sources, or horizontal rule
  const faqSectionRegex = /(?:^|\n)(##\s*(?:\*\*)?[^\n]*FAQs?(?:\*\*)?[\s\S]*?)(?=(?:^|\n)(?:##\s*(?:\*\*)?About the author|\*\*About the author|---\s*\n\s*\*\*About the author|$))/i;

  const match = rawContent.match(faqSectionRegex);
  if (!match) {
    return { cleanContent: rawContent, effectiveFaqs: currentFaqs || [] };
  }

  const faqBlock = match[1];
  const cleanContent = rawContent.replace(faqBlock, '\n\n').replace(/\n{3,}/g, '\n\n');

  if (currentFaqs && currentFaqs.length > 0) {
    return { cleanContent, effectiveFaqs: currentFaqs };
  }

  // Parse questions and answers from the markdown FAQ block
  const items: BlogFAQItem[] = [];
  const qRegex = /###\s*(?:\*\*)?([^\n*]+?)(?:\*\*)?\s*\n+([\s\S]*?)(?=(?:###|$))/g;
  let qMatch: RegExpExecArray | null;
  while ((qMatch = qRegex.exec(faqBlock)) !== null) {
    const question = qMatch[1].trim();
    const answer = qMatch[2].trim();
    if (question && answer) {
      items.push({ question, answer });
    }
  }

  return { cleanContent, effectiveFaqs: items };
}

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

      try {
        const { post: loadedPost, error: fetchErr } = await fetchPublishedPostBySlug(slug);

        if (fetchErr || !loadedPost) {
          setError(fetchErr || 'Article not found.');
          setPost(null);
          setLoading(false);
          return;
        }

        setPost(loadedPost);

        // Fetch related published posts (preferring same category)
        const { posts: allPublished } = await fetchPublishedBlogPosts();
        const relatedList = allPublished.filter((p) => p.slug !== loadedPost.slug);
        const sortedRelated = [
          ...relatedList.filter((p) => p.category === loadedPost.category),
          ...relatedList.filter((p) => p.category !== loadedPost.category),
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

  // Extract FAQs and de-duplicate raw Markdown FAQ block
  const { cleanContent, effectiveFaqs } = React.useMemo(() => {
    return extractFaqsAndCleanContent(post?.content || '', post?.faqs);
  }, [post?.content, post?.faqs]);

  // Render markdown content
  const renderedContent = React.useMemo(() => {
    if (!cleanContent) return '';
    try {
      return marked.parse(cleanContent);
    } catch {
      return '<p>Error rendering article content.</p>';
    }
  }, [cleanContent]);

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
    return <NotFound />;
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

  const schema =
    post.slug === 'vedic-maths-vs-abacus'
      ? getVedicMathsVsAbacusArticleSchema(effectiveFaqs, coverUrl || undefined)
      : getBlogPostSchema({
          ...post,
          faqs: effectiveFaqs,
          featured_image: coverUrl,
        });

  const staticArticle = PUBLISHED_ARTICLES.find((p) => p.slug === post.slug);
  const effectiveSeoDescription =
    post.slug === 'is-vedic-maths-useful' && post.seo_description?.includes('Compared 8')
      ? (staticArticle?.seo_description ||
        "Vedic Maths isn't from the Vedas, and the '10x faster' claims are marketing. But the techniques are real algebra, not tricks, when taught right. A teacher makes the honest case, including where critics are correct.")
      : (post.seo_description || post.excerpt || 'Practical ideas and insights from The Vedic School.');

  return (
    <div className="bg-[hsl(var(--background))] min-h-screen pt-28 pb-20">
      <Seo
        title={post.seo_title || `${post.title} | The Vedic School`}
        description={effectiveSeoDescription}
        path={`/blog/${post.slug}`}
        ogType="article"
        ogImage={coverUrl || undefined}
        ogImageWidth={1200}
        ogImageHeight={630}
        articleMeta={{
          publishedTime: post.published_at ? post.published_at.split('T')[0] : '2026-09-12',
          modifiedTime: post.updated_at ? post.updated_at.split('T')[0] : '2026-09-12',
          author: post.author || 'Meenakshi Koul',
        }}
        schema={schema}
      />
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

          {/* AI Summarisation Toolbar */}
          <SummariseWithAI
            title={post.title}
            canonicalUrl={abs(`/blog/${post.slug}`)}
          />

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

          {/* CMS-Managed FAQ Accordion */}
          {effectiveFaqs && effectiveFaqs.length > 0 && (
            <div className="mt-12 pt-8 border-t border-stone-200">
              <div className="mb-6">
                <p className="text-xs font-sans font-bold tracking-[0.15em] uppercase text-[hsl(var(--primary))] mb-2">
                  Frequently Asked Questions
                </p>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 tracking-tight">
                  Questions Parents Often Ask
                </h2>
              </div>
              <Accordion type="single" collapsible className="w-full">
                {effectiveFaqs.map((faq, idx) => (
                  <AccordionItem key={idx} value={`faq-${idx}`} className="border-stone-200">
                    <AccordionTrigger className="font-serif text-lg sm:text-xl text-stone-900 py-5 hover:no-underline text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent forceMount className="text-stone-700 leading-relaxed text-base pb-5">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          )}

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
          Curriculum-Aligned Maths →
        </Link>
      </div>
    </div>
  );
}
