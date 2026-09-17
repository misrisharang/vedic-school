// ==============================================================================
// THE VEDIC SCHOOL — ARTICLE PREVIEW MODAL
// ==============================================================================

import React from 'react';
import { marked } from 'marked';
import type { BlogPost, BlogCategory, BlogFAQItem, BlogSourceItem } from '@/types/blog';
import { BLOG_CATEGORY_META } from '@/types/blog';
import { Button } from '@/components/ui/button';
import { X, Clock, Calendar, User, Star, ExternalLink, HelpCircle } from 'lucide-react';

interface ArticlePreviewModalProps {
  post: Partial<BlogPost> & {
    title: string;
    content: string;
    category: BlogCategory;
    tldr?: string[];
    quick_verdict?: string | null;
    sources?: BlogSourceItem[];
    featured_image_alt?: string | null;
    faqs?: BlogFAQItem[];
  };
  open: boolean;
  onClose: () => void;
}

export function ArticlePreviewModal({ post, open, onClose }: ArticlePreviewModalProps) {
  if (!open) return null;

  const categoryMeta = BLOG_CATEGORY_META[post.category] || BLOG_CATEGORY_META['vedic-maths'];

  // 1. Process TL;DR
  const effectiveTldrBullets: string[] = React.useMemo(() => {
    if (post.tldr && post.tldr.length > 0) {
      return post.tldr;
    }
    // Extract from content if not provided as structured array
    const tldrRegex = /(?:^|\n)(?:##\s*(?:\*\*)?TL;DR(?:\*\*)?|\*\*TL;DR\*\*|> \*\*TL;DR\*\*)([\s\S]*?)(?=(?:^|\n)#{2,3}\s+|$)/i;
    const match = (post.content || '').match(tldrRegex);
    if (!match) return [];
    return match[1]
      .split('\n')
      .map((l) => l.replace(/^\s*>\s?/, '').trim())
      .filter((l) => l.startsWith('*') || l.startsWith('-'))
      .map((l) => l.replace(/^[\s*-]+/, '').trim())
      .filter(Boolean);
  }, [post.tldr, post.content]);

  // 2. Process Quick Verdict
  const effectiveQuickVerdict: string = React.useMemo(() => {
    if (post.quick_verdict && post.quick_verdict.trim()) {
      return post.quick_verdict.trim();
    }
    const qvRegex = /(?:^|\n)(?:\*\*Quick verdict:\*\*|Quick verdict:?)\s*([\s\S]*?)(?=(?:\n\s*\n|\n#{1,3}\s+|$))/i;
    const match = (post.content || '').match(qvRegex);
    return match ? match[1].trim() : '';
  }, [post.quick_verdict, post.content]);

  // 3. Process Sources
  const effectiveSources: BlogSourceItem[] = React.useMemo(() => {
    if (post.sources && post.sources.length > 0) {
      return post.sources;
    }
    const sourceRegex = /(?:^|\n)(?:##\s*(?:\*\*)?Sources(?:\*\*)?|\*\*Sources\*\*(?:\s*\([^)]*\))?)\s*([\s\S]*?)$/i;
    const match = (post.content || '').match(sourceRegex);
    if (!match) return [];
    const lines = match[1]
      .split('\n')
      .filter((l) => l.trim().startsWith('*') || l.trim().startsWith('-'));
    return lines.map((rawLine) => {
      let line = rawLine.replace(/^[\s*-]+/, '').trim();
      let url = '';
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
      const splitMatch = line.match(/^([^,:]+?)\s*[,:]\s*(.*)/);
      if (splitMatch && splitMatch[1].length < 60) {
        publication = splitMatch[1].trim();
        title = splitMatch[2].trim();
      } else {
        publication = line;
      }
      return { publication, title, url };
    });
  }, [post.sources, post.content]);

  // 4. Clean content of any duplicate TL;DR, Quick verdict, or Sources
  const cleanBodyMarkdown = React.useMemo(() => {
    let text = post.content || '*No content written yet.*';
    text = text.replace(/^#\s+[^\n]+\n+/, '').trim();

    // Strip TL;DR block
    const tldrRegex = /(?:^|\n)(?:##\s*(?:\*\*)?TL;DR(?:\*\*)?|\*\*TL;DR\*\*|> \*\*TL;DR\*\*)([\s\S]*?)(?=(?:^|\n)#{2,3}\s+|$)/i;
    text = text.replace(tldrRegex, '\n\n');

    // Strip Quick verdict block
    const qvRegex = /(?:^|\n)(?:\*\*Quick verdict:\*\*|Quick verdict:?)\s*([\s\S]*?)(?=(?:\n\s*\n|\n#{1,3}\s+|$))/i;
    text = text.replace(qvRegex, '\n\n');

    // Strip Sources block
    const sourceRegex = /(?:^|\n)(?:##\s*(?:\*\*)?Sources(?:\*\*)?|\*\*Sources\*\*(?:\s*\([^)]*\))?)\s*([\s\S]*?)$/i;
    text = text.replace(sourceRegex, '\n\n');

    return text.replace(/\n{3,}/g, '\n\n').trim();
  }, [post.content]);

  const renderedContent = React.useMemo(() => {
    try {
      return marked.parse(cleanBodyMarkdown || '*No content written yet.*');
    } catch {
      return '<p>Error rendering content preview.</p>';
    }
  }, [cleanBodyMarkdown]);

  const renderedTldrHtml = React.useMemo(() => {
    if (effectiveTldrBullets.length === 0) return '';
    try {
      return marked.parse(effectiveTldrBullets.map((b) => `- ${b}`).join('\n')) as string;
    } catch {
      return '';
    }
  }, [effectiveTldrBullets]);

  const renderedQuickVerdictHtml = React.useMemo(() => {
    if (!effectiveQuickVerdict) return '';
    try {
      return marked.parse(effectiveQuickVerdict) as string;
    } catch {
      return '';
    }
  }, [effectiveQuickVerdict]);

  const displayDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : 'Draft Preview';

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[hsl(var(--background))] rounded-2xl shadow-2xl border border-stone-200 my-8 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-stone-900 text-white border-b border-stone-800 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Preview Mode
            </span>
            <span className="text-xs text-stone-300 hidden sm:inline">
              Simulating live public article layout (v2.4)
            </span>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 text-stone-300 hover:text-white hover:bg-stone-800"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Scrollable Article View */}
        <div className="overflow-y-auto p-6 sm:p-10 space-y-8 bg-white">
          {/* 1. Category, Read Time, Date (Center-aligned matching v2.4) */}
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-xs text-stone-500 text-center font-sans">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold border ${categoryMeta.badgeClass}`}
            >
              {categoryMeta.label}
            </span>

            {post.is_featured && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                Featured
              </span>
            )}

            <span>•</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-stone-400" />
              {displayDate}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-stone-400" />
              <span
                className="font-medium text-stone-700 hover:text-[hsl(var(--primary))] underline decoration-stone-300 underline-offset-2 transition-colors cursor-default"
                title="Author Profile: /authors/:slug"
              >
                {post.author || 'Meenakshi Koul'}
              </span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-stone-400" />
              {post.reading_time || 1} min read
            </span>
          </div>

          {/* 2. Article Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-stone-900 tracking-tight leading-tight text-center max-w-3xl mx-auto">
            {post.title || 'Untitled Article'}
          </h1>

          {/* 3. Excerpt */}
          {post.excerpt && (
            <p className="text-base sm:text-lg text-stone-600 font-sans leading-relaxed border-l-2 border-[hsl(var(--primary))] pl-4 italic max-w-3xl mx-auto">
              {post.excerpt}
            </p>
          )}

          {/* 4. Featured Cover Image */}
          {post.featured_image && (
            <div className="rounded-2xl overflow-hidden border border-stone-200 shadow-xs aspect-16/9 max-h-[440px] bg-stone-100">
              <img
                src={post.featured_image}
                alt={post.featured_image_alt || post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* 5. Dedicated TL;DR Editorial Container */}
          {renderedTldrHtml && (
            <div className="bg-[#FAF7F2] border border-[#E7E2DA] rounded-2xl p-5 sm:p-6 shadow-2xs">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-bold tracking-[0.14em] text-[hsl(var(--primary))] uppercase font-sans select-none">
                  TL;DR
                </span>
              </div>
              <div
                className="prose prose-stone prose-sm sm:prose-base max-w-none text-stone-700 leading-relaxed marker:text-[hsl(var(--primary))] [&>ul]:my-0 [&>ul]:space-y-1.5 [&_li]:my-0.5 [&_li>p]:my-0 [&>p]:my-1"
                dangerouslySetInnerHTML={{ __html: renderedTldrHtml }}
              />
            </div>
          )}

          {/* 6. Dedicated Quick Verdict Editorial Block */}
          {renderedQuickVerdictHtml && (
            <div className="bg-[#FAF7F2] border-l-4 border-l-[hsl(var(--primary))] border border-[#E7E2DA] rounded-2xl p-5 sm:p-6 shadow-2xs">
              <div className="text-[11px] font-bold tracking-[0.14em] uppercase text-[hsl(var(--primary))] font-sans mb-2.5 select-none">
                Quick Verdict
              </div>
              <div
                className="prose prose-stone prose-sm sm:prose-base max-w-none text-stone-800 leading-relaxed font-sans [&>p]:my-0"
                dangerouslySetInnerHTML={{ __html: renderedQuickVerdictHtml }}
              />
            </div>
          )}

          {/* 7. Article Markdown Content (Justified text presentation) */}
          <article
            className="prose prose-stone prose-lg max-w-none font-sans leading-relaxed text-stone-800 text-left sm:text-justify [text-justify:inter-word]"
            dangerouslySetInnerHTML={{ __html: renderedContent }}
          />

          {/* 8. Dedicated Sources Section */}
          {effectiveSources.length > 0 && (
            <section className="mt-12 pt-8 border-t border-stone-200">
              <div className="mb-6">
                <p className="text-xs font-sans font-bold tracking-[0.15em] uppercase text-[hsl(var(--primary))] mb-2">
                  References & Research
                </p>
                <h2 className="text-2xl font-serif font-bold text-stone-900 tracking-tight">
                  Sources
                </h2>
              </div>
              <ol className="space-y-4 list-decimal list-inside text-stone-800 font-sans text-sm sm:text-base leading-relaxed">
                {effectiveSources.map((item, idx) => (
                  <li key={idx} className="pl-1 text-stone-500 marker:font-semibold marker:text-stone-700">
                    <span className="font-semibold text-stone-900">{item.publication}</span>
                    {item.title && <span className="text-stone-700"> — {item.title}</span>}
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

          {/* 9. FAQs Section */}
          {post.faqs && post.faqs.length > 0 && (
            <div className="mt-12 pt-8 border-t border-stone-200">
              <div className="mb-6">
                <p className="text-xs font-sans font-bold tracking-[0.15em] uppercase text-[hsl(var(--primary))] mb-2">
                  Frequently Asked Questions
                </p>
                <h2 className="text-2xl font-serif font-bold text-stone-900 tracking-tight flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-[hsl(var(--primary))]" />
                  Questions Parents Often Ask
                </h2>
              </div>
              <div className="space-y-4">
                {post.faqs.map((faq, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-stone-200 bg-stone-50/50">
                    <h4 className="font-serif text-base sm:text-lg font-bold text-stone-900 mb-2">
                      {faq.question}
                    </h4>
                    <p className="text-stone-700 text-sm leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end px-6 py-3 bg-stone-50 border-t border-stone-200 shrink-0">
          <Button
            type="button"
            onClick={onClose}
            className="bg-stone-800 hover:bg-stone-900 text-white text-xs px-4 cursor-pointer"
          >
            Close Preview
          </Button>
        </div>
      </div>
    </div>
  );
}

