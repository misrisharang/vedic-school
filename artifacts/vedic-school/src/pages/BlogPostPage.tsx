// ==============================================================================
// THE VEDIC SCHOOL — INDIVIDUAL ARTICLE PAGE (/blog/:slug)
// ==============================================================================

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useRoute, Link } from 'wouter';
import { marked } from 'marked';
import NotFound from '@/pages/not-found';
import type { BlogPost, BlogCategory, BlogFAQItem, BlogSourceItem, Author } from '@/types/blog';
import { BLOG_CATEGORY_META } from '@/types/blog';
import { getBlogImageUrl, fetchPublishedPostBySlug, fetchPublishedBlogPosts } from '@/lib/blog';
import { fetchAuthorById, fetchAuthors, findAuthorByNameOrSlug } from '@/lib/authors';
import { Seo } from '@/seo/Seo';
import { abs } from '@/seo/site';
import { getBlogPostSchema, getVedicMathsVsAbacusArticleSchema } from '@/seo/schema';
import { PUBLISHED_ARTICLES } from '@/data/published-articles';
import { DEFAULT_AUTHORS } from '@/data/authors';
import { useDemoModal } from '@/context/DemoModalContext';
import { SummariseWithAI } from '@/components/blog/SummariseWithAI';
import { TableOfContents, type TocItem } from '@/components/blog/TableOfContents';
import { ShareArticle } from '@/components/blog/ShareArticle';
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
  BookOpen,
  ArrowRight,
  Loader2,
  ExternalLink,
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

/**
 * Parses a single Markdown source bullet line into structured BlogSourceItem.
 */
function parseSourceItem(rawLine: string): BlogSourceItem {
  let line = rawLine.replace(/^[\s*-]+/, '').trim();
  let url = '';
  let date = '';

  const mdMatch = line.match(/\[(https?:\/\/[^\]]+)\]\((https?:\/\/[^\)]+)\)/);
  if (mdMatch) {
    url = mdMatch[2].trim();
    line = line.replace(mdMatch[0], '').trim();
  } else {
    const rawMatch = line.match(/(https?:\/\/[^\s\)]+)/);
    if (rawMatch) {
      url = rawMatch[1].trim();
      line = line.replace(rawMatch[0], '').trim();
    }
  }

  line = line.replace(/[\s\.,]+$/, '').trim();

  let publication = '';
  let title = '';

  const yearMatch = line.match(/^([A-Z][^()]+?\(\d{4}\))\.\s*(.*)/);
  if (yearMatch) {
    publication = yearMatch[1].trim();
    title = yearMatch[2].trim();
  } else {
    const splitMatch = line.match(/^([^,:]+?)\s*[,:]\s*(.*)/);
    if (splitMatch && splitMatch[1].length < 60) {
      publication = splitMatch[1].trim();
      title = splitMatch[2].trim();
    } else {
      publication = line;
      title = '';
    }
  }

  publication = publication.replace(/^\*+|\*+$/g, '').trim();
  title = title.replace(/^\*+|\*+$/g, '').trim();

  return { publication: publication || line, title, url, date };
}

/**
 * Extracts Sources from raw markdown and removes the duplicated markdown block
 * so it can be rendered in the dedicated Sources editorial section.
 */
function extractSourcesAndCleanContent(
  rawContent: string,
  existingSources?: BlogSourceItem[]
): {
  cleanContent: string;
  effectiveSources: BlogSourceItem[];
} {
  if (!rawContent) {
    return { cleanContent: '', effectiveSources: existingSources || [] };
  }

  const regex = /(?:^|\n)(?:##\s*(?:\*\*)?Sources(?:\*\*)?|\*\*Sources\*\*(?:\s*\([^)]*\))?)\s*([\s\S]*?)$/i;
  const match = rawContent.match(regex);

  if (!match) {
    return { cleanContent: rawContent, effectiveSources: existingSources || [] };
  }

  const sourceBlock = match[0];
  const sourceText = match[1].trim();
  const cleanContent = rawContent.replace(sourceBlock, '\n\n').replace(/\n{3,}/g, '\n\n').trim();

  if (existingSources && existingSources.length > 0) {
    return { cleanContent, effectiveSources: existingSources };
  }

  const lines = sourceText.split('\n').filter((l) => l.trim().startsWith('*') || l.trim().startsWith('-'));
  const items = lines.map(parseSourceItem);
  return { cleanContent, effectiveSources: items };
}

/**
 * Extracts Quick verdict block from markdown and strips it from the article body so it can be
 * rendered in its own dedicated editorial block without duplication.
 */
function extractQuickVerdictAndCleanContent(
  rawContent: string,
  existingVerdict?: string | null
): {
  cleanContent: string;
  effectiveQuickVerdict: string | null;
} {
  if (!rawContent) {
    return { cleanContent: '', effectiveQuickVerdict: existingVerdict || null };
  }

  const qvRegex = /(?:^|\n)(?:\*\*Quick verdict:\*\*|Quick verdict:?)\s*([\s\S]*?)(?=(?:\n\s*\n|\n#{1,3}\s+|$))/i;
  const match = rawContent.match(qvRegex);

  if (!match) {
    return { cleanContent: rawContent, effectiveQuickVerdict: existingVerdict || null };
  }

  const fullMatch = match[0];
  const verdictBody = match[1].trim();
  const cleanContent = rawContent.replace(fullMatch, '\n\n').replace(/\n{3,}/g, '\n\n');

  return { cleanContent, effectiveQuickVerdict: existingVerdict || verdictBody };
}

/**
 * Extracts TL;DR block from markdown and strips it from the article body so it can be
 * rendered in the dedicated top editorial container without duplication.
 */
function extractTldrAndCleanContent(
  rawContent: string,
  existingTldr?: string[] | null
): {
  cleanContent: string;
  effectiveTldr: string[];
} {
  if (!rawContent) {
    return { cleanContent: '', effectiveTldr: existingTldr || [] };
  }

  const tldrRegex = /(?:^|\n)(?:##\s*(?:\*\*)?TL;DR(?:\*\*)?|\*\*TL;DR\*\*|> \*\*TL;DR\*\*)([\s\S]*?)(?=(?:^|\n)#{2,3}\s+|$)/i;
  const match = rawContent.match(tldrRegex);

  if (!match) {
    return { cleanContent: rawContent, effectiveTldr: existingTldr || [] };
  }

  const tldrBlock = match[0];
  const rawTldrBody = match[1].trim();
  const cleanContent = rawContent.replace(tldrBlock, '\n\n').replace(/\n{3,}/g, '\n\n');

  if (existingTldr && existingTldr.length > 0) {
    return { cleanContent, effectiveTldr: existingTldr };
  }

  const bullets = rawTldrBody
    .split('\n')
    .map((line) => line.replace(/^\s*>\s?/, '').trim())
    .filter((line) => line.startsWith('*') || line.startsWith('-'))
    .map((line) => line.replace(/^[\s*-]+/, '').trim())
    .filter(Boolean);

  return {
    cleanContent,
    effectiveTldr: bullets.length > 0 ? bullets : (rawTldrBody ? [rawTldrBody] : []),
  };
}

/**
 * Removes any leading `# Title` to prevent duplicate H1 tags on the page.
 */
function stripLeadingH1(content: string): string {
  return content.replace(/^#\s+[^\n]+\n+/, '').trim();
}

/**
 * Decodes HTML entities commonly output by Markdown parsers.
 */
function decodeHtmlEntities(str: string): string {
  return str
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–');
}

export default function BlogPostPage() {
  const [, params] = useRoute('/blog/:slug');
  const slug = params?.slug;
  const { openDemoModal } = useDemoModal();

  const [post, setPost] = useState<BlogPost | null>(null);
  const [authorRecord, setAuthorRecord] = useState<Author | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Active section & reading progress states
  const [activeHeadingId, setActiveHeadingId] = useState<string | null>(null);
  const [sectionProgress, setSectionProgress] = useState<number>(0);

  const articleRef = useRef<HTMLElement | null>(null);

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

        // Fetch dynamic author record from centralized author system
        if (loadedPost.author_id) {
          const { author: a } = await fetchAuthorById(loadedPost.author_id);
          if (a) setAuthorRecord(a);
        } else if (loadedPost.author) {
          const { authors: allA } = await fetchAuthors();
          const matched = findAuthorByNameOrSlug(allA, loadedPost.author);
          if (matched) setAuthorRecord(matched);
        }

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

    // Listen for live author updates from CMS
    const handleAuthorUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<Author>;
      if (customEvent.detail) {
        setAuthorRecord((prev) => {
          if (!prev) return customEvent.detail;
          if (prev.id === customEvent.detail.id || prev.slug === customEvent.detail.slug) {
            return customEvent.detail;
          }
          return prev;
        });
      }
    };
    window.addEventListener('vedic_school_author_updated', handleAuthorUpdate);

    return () => {
      window.removeEventListener('vedic_school_author_updated', handleAuthorUpdate);
    };
  }, [slug]);

  // 1. Extract FAQs and de-duplicate raw Markdown FAQ block
  const { cleanContent: contentAfterFaqs, effectiveFaqs } = useMemo(() => {
    return extractFaqsAndCleanContent(post?.content || '', post?.faqs);
  }, [post?.content, post?.faqs]);

  // 2. Extract Sources and de-duplicate raw Markdown Sources block
  const { cleanContent: contentAfterSources, effectiveSources } = useMemo(() => {
    return extractSourcesAndCleanContent(contentAfterFaqs, post?.sources);
  }, [contentAfterFaqs, post?.sources]);

  // 3. Extract Quick verdict and de-duplicate from markdown body
  const { cleanContent: contentAfterVerdict, effectiveQuickVerdict } = useMemo(() => {
    return extractQuickVerdictAndCleanContent(contentAfterSources, post?.quick_verdict);
  }, [contentAfterSources, post?.quick_verdict]);

  // 4. Extract TL;DR block and de-duplicate from markdown body
  const { cleanContent: contentAfterTldr, effectiveTldr } = useMemo(() => {
    return extractTldrAndCleanContent(contentAfterVerdict, post?.tldr);
  }, [contentAfterVerdict, post?.tldr]);

  // Render TL;DR HTML
  const tldrHtml = useMemo(() => {
    if (!effectiveTldr || effectiveTldr.length === 0) return '';
    const tldrMd = effectiveTldr.map((b) => `- ${b}`).join('\n\n');
    try {
      return marked.parse(tldrMd) as string;
    } catch {
      return '';
    }
  }, [effectiveTldr]);

  // Render Quick Verdict HTML
  const quickVerdictHtml = useMemo(() => {
    if (!effectiveQuickVerdict) return '';
    try {
      return marked.parse(effectiveQuickVerdict) as string;
    } catch {
      return '';
    }
  }, [effectiveQuickVerdict]);

  // 5. Author profile record matching (used for both the byline link and structured data)
  const resolvedAuthor = useMemo(() => {
    if (authorRecord) return authorRecord;
    if (!post) return null;
    if (post.author_rel) return post.author_rel;
    const authorName = (post.author || 'Meenakshi Koul').trim().toLowerCase();
    return (
      DEFAULT_AUTHORS.find(
        (a) =>
          a.id === post.author_id ||
          a.name.toLowerCase() === authorName ||
          a.slug.toLowerCase() === authorName
      ) || null
    );
  }, [post, authorRecord]);

  const authorSlug = resolvedAuthor?.slug || null;

  // Process markdown into HTML with stable heading IDs and collect TOC items
  const { renderedContent, headings } = useMemo(() => {
    if (!contentAfterTldr) return { renderedContent: '', headings: [] };

    const cleanArticleMarkdown = stripLeadingH1(contentAfterTldr);

    let rawHtml = '';
    try {
      rawHtml = marked.parse(cleanArticleMarkdown) as string;
    } catch {
      return { renderedContent: '<p>Error rendering article content.</p>', headings: [] };
    }

    const collectedHeadings: TocItem[] = [];
    const slugCounts: Record<string, number> = {};

    // Inject stable id and scroll-mt-28 to every H2 heading
    const processedHtml = rawHtml.replace(/<h2(?:\s+[^>]*)?>(.*?)<\/h2>/gi, (_fullMatch, inner) => {
      const rawTitle = inner.replace(/<[^>]+>/g, '').trim();
      const plainTitle = decodeHtmlEntities(rawTitle);
      let baseId = plainTitle.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-') || 'section';
      const count = (slugCounts[baseId] = (slugCounts[baseId] || 0) + 1);
      const id = count > 1 ? `${baseId}-${count}` : baseId;

      collectedHeadings.push({ id, title: plainTitle });
      return `<h2 id="${id}" class="scroll-mt-28">${inner}</h2>`;
    });

    // If Sources exist, add Sources section to TOC
    if (effectiveSources && effectiveSources.length > 0) {
      collectedHeadings.push({
        id: 'sources',
        title: 'Sources',
      });
    }

    // If FAQs exist, add FAQ accordion to TOC
    if (effectiveFaqs && effectiveFaqs.length > 0) {
      collectedHeadings.push({
        id: 'questions-parents-often-ask',
        title: 'Questions Parents Often Ask',
      });
    }

    return { renderedContent: processedHtml, headings: collectedHeadings };
  }, [contentAfterTldr, effectiveSources, effectiveFaqs]);

  // Live active heading and section progress tracking
  useEffect(() => {
    if (typeof window === 'undefined' || headings.length === 0) return;

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const windowHeight = window.innerHeight;
          const docHeight = document.documentElement.scrollHeight;

          // Reading line: 140px below top of viewport (clearing fixed navbar + comfort offset)
          const readingLine = scrollY + 140;

          // If near very bottom of page, highlight last section at 100%
          if (scrollY + windowHeight >= docHeight - 80) {
            const lastHeading = headings[headings.length - 1];
            setActiveHeadingId(lastHeading.id);
            setSectionProgress(1);
            ticking = false;
            return;
          }

          const article = articleRef.current;
          const articleTop = article ? article.getBoundingClientRect().top + scrollY : 0;
          const articleBottom = article ? article.getBoundingClientRect().bottom + scrollY : docHeight;

          // Gather section bounding positions
          const sections: { id: string; top: number; bottom: number }[] = [];
          for (let i = 0; i < headings.length; i++) {
            const el = document.getElementById(headings[i].id);
            if (!el) continue;
            const top = el.getBoundingClientRect().top + scrollY;
            sections.push({ id: headings[i].id, top, bottom: top });
          }

          if (sections.length === 0) {
            ticking = false;
            return;
          }

          for (let i = 0; i < sections.length; i++) {
            if (i < sections.length - 1) {
              sections[i].bottom = sections[i + 1].top;
            } else {
              sections[i].bottom = articleBottom;
            }
          }

          let currentActiveId = sections[0].id;
          let currentProgress = 0;

          if (readingLine < sections[0].top) {
            // Reader is in the upper article content (intro, TL;DR, Quick verdict) before the first H2
            currentActiveId = sections[0].id;
            const introHeight = Math.max(sections[0].top - articleTop, 1);
            currentProgress = Math.min(Math.max((readingLine - articleTop) / introHeight, 0), 1);
          } else {
            for (let i = 0; i < sections.length; i++) {
              const s = sections[i];
              if (readingLine >= s.top && (i === sections.length - 1 || readingLine < s.bottom)) {
                currentActiveId = s.id;
                const sectionHeight = Math.max(s.bottom - s.top, 1);
                currentProgress = Math.min(Math.max((readingLine - s.top) / sectionHeight, 0), 1);
                break;
              }
            }
          }

          setActiveHeadingId(currentActiveId);
          setSectionProgress(currentProgress);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [headings]);

  // Smooth scroll handler for TOC items
  const handleHeadingClick = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const navHeight = 90;
    const y = el.getBoundingClientRect().top + window.scrollY - navHeight;
    const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({
      top: y,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
    if (typeof window !== 'undefined' && window.history?.replaceState) {
      window.history.replaceState(null, '', `#${id}`);
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
      ? getVedicMathsVsAbacusArticleSchema(effectiveFaqs, coverUrl || undefined, {
          authorRecord: resolvedAuthor,
          publishedAt: post.published_at,
          updatedAt: post.updated_at,
        })
      : getBlogPostSchema({
          ...post,
          faqs: effectiveFaqs,
          featured_image: coverUrl,
          authorRecord: resolvedAuthor,
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
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl mb-6 sm:mb-8">
        <Link
          href="/blog"
          className="inline-flex items-center text-xs sm:text-sm font-medium text-stone-500 hover:text-[hsl(var(--primary))] transition-colors gap-1.5 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to all articles
        </Link>
      </div>

      {/* Article Header & Editorial Cover Image */}
      <header className="container mx-auto px-4 sm:px-6 max-w-6xl mb-10 sm:mb-14">
        {/* 1. Metadata row: [Tag] • [Date] • [Author] • [Reading time] */}
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-xs text-stone-500 mb-4 sm:mb-5 font-sans text-center">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold border ${categoryMeta.badgeClass}`}
          >
            {categoryMeta.label}
          </span>
          {displayDate && (
            <>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-stone-400" />
                {displayDate}
              </span>
            </>
          )}
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-stone-400" />
            {authorSlug ? (
              <Link
                href={`/authors/${authorSlug}`}
                className="hover:text-[hsl(var(--primary))] hover:underline underline-offset-2 transition-colors font-medium text-stone-700"
              >
                {resolvedAuthor?.name || post.author || 'Meenakshi Koul'}
              </Link>
            ) : (
              <span>{resolvedAuthor?.name || post.author || 'Meenakshi Koul'}</span>
            )}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-stone-400" />
            {post.reading_time || 1} min read
          </span>
        </div>

        {/* 2. Article Title */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-stone-900 tracking-tight leading-tight max-w-4xl mb-6 sm:mb-8">
          {post.title}
        </h1>

        {/* 3. Cover Image (Full Container Width) */}
        {coverUrl && (
          <div className="w-full rounded-2xl sm:rounded-3xl overflow-hidden border border-stone-200 aspect-16/9 bg-stone-100 shadow-xs">
            <img
              src={coverUrl}
              alt={post.featured_image_alt || post.title}
              className="w-full h-full object-cover"
              loading="eager"
            />
          </div>
        )}
      </header>

      {/* Main Reading Layout (Below Cover Image) */}
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Sticky Sidebar (Desktop ~25%) */}
          <aside className="hidden lg:block lg:col-span-4 xl:col-span-3 sticky top-28 self-start z-10 space-y-6">
            {/* 1. AI Summary */}
            <SummariseWithAI
              title={post.title}
              canonicalUrl={abs(`/blog/${post.slug}`)}
              variant="sidebar"
            />

            {/* 2. Table of Contents */}
            <TableOfContents
              items={headings}
              activeId={activeHeadingId}
              sectionProgress={sectionProgress}
              onItemClick={handleHeadingClick}
            />

            {/* 3. Share Article */}
            <div className="border-t border-stone-200/80 pt-4">
              <ShareArticle
                title={post.title}
                url={abs(`/blog/${post.slug}`)}
              />
            </div>
          </aside>

          {/* Right Article Column (~75%) */}
          <article ref={articleRef} className="lg:col-span-8 xl:col-span-9 max-w-3xl min-w-0">
            {/* Mobile-only AI Summary + Table of Contents */}
            <div className="lg:hidden mb-8 space-y-6">
              <SummariseWithAI
                title={post.title}
                canonicalUrl={abs(`/blog/${post.slug}`)}
                variant="sidebar"
              />
              <TableOfContents
                items={headings}
                activeId={activeHeadingId}
                sectionProgress={sectionProgress}
                onItemClick={handleHeadingClick}
                isMobile
              />
            </div>

            {/* Dedicated TL;DR Editorial Container */}
            {tldrHtml && (
              <div className="bg-[#FAF7F2] border border-[#E7E2DA] rounded-2xl p-5 sm:p-6 mb-8 sm:mb-10 shadow-2xs">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-bold tracking-[0.14em] text-[hsl(var(--primary))] uppercase font-sans select-none">
                    TL;DR
                  </span>
                </div>
                <div
                  className="prose prose-stone prose-sm sm:prose-base max-w-none text-stone-700 leading-relaxed marker:text-[hsl(var(--primary))] [&>ul]:my-0 [&>ul]:space-y-1.5 [&_li]:my-0.5 [&_li>p]:my-0 [&>p]:my-1"
                  dangerouslySetInnerHTML={{ __html: tldrHtml }}
                />
              </div>
            )}

            {/* Dedicated Quick Verdict Editorial Block */}
            {quickVerdictHtml && (
              <div className="bg-[#FAF7F2] border-l-4 border-l-[hsl(var(--primary))] border border-[#E7E2DA] rounded-2xl p-5 sm:p-6 mb-8 sm:mb-10 shadow-2xs">
                <div className="text-[11px] font-bold tracking-[0.14em] uppercase text-[hsl(var(--primary))] font-sans mb-2.5 select-none">
                  Quick Verdict
                </div>
                <div
                  className="prose prose-stone prose-sm sm:prose-base max-w-none text-stone-800 leading-relaxed font-sans [&>p]:my-0"
                  dangerouslySetInnerHTML={{ __html: quickVerdictHtml }}
                />
              </div>
            )}

            {/* Article Markdown Content (Justified text presentation) */}
            <div
              className="prose prose-stone prose-lg max-w-none font-sans leading-relaxed text-stone-800 text-left sm:text-justify [text-justify:inter-word]"
              dangerouslySetInnerHTML={{ __html: renderedContent }}
            />

            {/* Dedicated Sources Section */}
            {effectiveSources && effectiveSources.length > 0 && (
              <section id="sources" className="mt-12 pt-8 border-t border-stone-200 scroll-mt-28">
                <div className="mb-6">
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 tracking-tight">
                    Sources
                  </h2>
                </div>
                <ol className="space-y-4 list-decimal list-inside text-stone-800 font-sans text-sm sm:text-base leading-relaxed">
                  {effectiveSources.map((item, idx) => (
                    <li key={idx} className="pl-1 text-stone-500 marker:font-semibold marker:text-stone-700">
                      <span className="font-semibold text-stone-900">{item.publication}</span>
                      {item.title && <span className="text-stone-700">: {item.title}</span>}
                      {item.date && <span className="text-stone-500 text-xs ml-1.5">({item.date})</span>}
                      {item.url && (
                        <div className="mt-1 ml-5">
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs sm:text-sm text-[hsl(var(--primary))] hover:underline break-all inline-flex items-center gap-1 group/link"
                          >
                            <span>{item.url}</span>
                            <ExternalLink className="w-3 h-3 shrink-0 opacity-70 group-hover/link:opacity-100 transition-opacity" />
                          </a>
                        </div>
                      )}
                    </li>
                  ))}
                </ol>
              </section>
            )}

            {/* CMS-Managed FAQ Accordion */}
            {effectiveFaqs && effectiveFaqs.length > 0 && (
              <div id="questions-parents-often-ask" className="mt-12 pt-8 border-t border-stone-200 scroll-mt-28">
                <div className="mb-6">
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

            {/* Mobile Share Section at bottom of article */}
            <div className="lg:hidden mt-10 pt-6 border-t border-stone-200">
              <ShareArticle
                title={post.title}
                url={abs(`/blog/${post.slug}`)}
              />
            </div>
          </article>
        </div>
      </div>

      {/* Related Articles Section */}
      {relatedPosts.length > 0 && (
        <section className="container mx-auto px-4 sm:px-6 max-w-6xl mt-16 sm:mt-20">
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
