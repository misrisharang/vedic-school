// ==============================================================================
// THE VEDIC SCHOOL — ARTICLE PREVIEW MODAL
// ==============================================================================

import React from 'react';
import { marked } from 'marked';
import type { BlogPost, BlogCategory } from '@/types/blog';
import { BLOG_CATEGORY_META } from '@/types/blog';
import { Button } from '@/components/ui/button';
import { X, Clock, Calendar, User, Star } from 'lucide-react';

interface ArticlePreviewModalProps {
  post: Partial<BlogPost> & { title: string; content: string; category: BlogCategory };
  open: boolean;
  onClose: () => void;
}

export function ArticlePreviewModal({ post, open, onClose }: ArticlePreviewModalProps) {
  if (!open) return null;

  const categoryMeta = BLOG_CATEGORY_META[post.category] || BLOG_CATEGORY_META['vedic-maths'];

  const renderedContent = React.useMemo(() => {
    try {
      return marked.parse(post.content || '*No content written yet.*');
    } catch {
      return '<p>Error rendering content preview.</p>';
    }
  }, [post.content]);

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
              Simulating live public article layout
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
          {/* Category, Read Time, Date */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold border ${categoryMeta.badgeClass}`}
            >
              {categoryMeta.label}
            </span>

            {post.is_featured && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                Featured Article
              </span>
            )}

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

          {/* Article Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-stone-900 tracking-tight leading-tight">
            {post.title || 'Untitled Article'}
          </h1>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-lg sm:text-xl text-stone-600 font-sans leading-relaxed border-l-2 border-[hsl(var(--primary))] pl-4 italic">
              {post.excerpt}
            </p>
          )}

          {/* Author Byline */}
          <div className="flex items-center gap-3 py-3 border-y border-stone-100 text-xs text-stone-600">
            <div className="w-9 h-9 rounded-full bg-[hsl(var(--primary))]/10 flex items-center justify-center text-[hsl(var(--primary))] font-semibold">
              <User className="w-4 h-4" />
            </div>
            <div>
              <div className="font-semibold text-stone-900">{post.author || 'Meenakshi Koul'}</div>
              <div className="text-stone-500">Founder & Educator • The Vedic School</div>
            </div>
          </div>

          {/* Featured Cover Image */}
          {post.featured_image && (
            <div className="rounded-2xl overflow-hidden border border-stone-200 shadow-xs aspect-video max-h-[440px] bg-stone-100">
              <img
                src={post.featured_image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Article Body */}
          <article
            className="prose prose-stone prose-lg max-w-none pt-2 font-sans"
            dangerouslySetInnerHTML={{ __html: renderedContent }}
          />
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end px-6 py-3 bg-stone-50 border-t border-stone-200 shrink-0">
          <Button
            type="button"
            onClick={onClose}
            className="bg-stone-800 hover:bg-stone-900 text-white text-xs px-4"
          >
            Close Preview
          </Button>
        </div>
      </div>
    </div>
  );
}
