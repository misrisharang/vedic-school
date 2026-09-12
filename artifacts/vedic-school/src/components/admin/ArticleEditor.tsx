// ==============================================================================
// THE VEDIC SCHOOL — ARTICLE EDITOR VIEW (CREATE & EDIT)
// ==============================================================================

import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import type { BlogPost, BlogCategory, BlogStatus, BlogFAQItem } from '@/types/blog';
import { BLOG_CATEGORIES, BLOG_CATEGORY_META } from '@/types/blog';
import { slugify, validateSlug } from '@/lib/blog-slug';
import { calculateReadingTime } from '@/lib/blog';
import { ImageUploader } from './ImageUploader';
import { MarkdownEditor } from './MarkdownEditor';
import { ArticlePreviewModal } from './ArticlePreviewModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  ArrowLeft,
  Save,
  Send,
  Eye,
  Trash2,
  Lock,
  Unlock,
  Star,
  Globe,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ChevronUp,
  ChevronDown,
  Plus,
  HelpCircle,
} from 'lucide-react';

interface ArticleEditorProps {
  post: BlogPost | null;
  onSaveSuccess: () => void;
  onCancel: () => void;
}

function extractFaqsFromContent(content: string): { cleanContent: string; faqs: BlogFAQItem[] } {
  if (!content) return { cleanContent: '', faqs: [] };
  const faqSectionRegex = /(?:^|\n)(##\s*(?:\*\*)?[^\n]*FAQs?(?:\*\*)?[\s\S]*?)(?=(?:^|\n)(?:##\s*(?:\*\*)?About the author|\*\*About the author|---\s*\n\s*\*\*About the author|$))/i;
  const match = content.match(faqSectionRegex);
  if (!match) return { cleanContent: content, faqs: [] };

  const faqBlock = match[1];
  const cleanContent = content.replace(faqBlock, '\n\n').replace(/\n{3,}/g, '\n\n');
  const items: BlogFAQItem[] = [];
  const qRegex = /###\s*(?:\*\*)?([^\n*]+?)(?:\*\*)?\s*\n+([\s\S]*?)(?=(?:###|$))/g;
  let qMatch: RegExpExecArray | null;
  while ((qMatch = qRegex.exec(faqBlock)) !== null) {
    const question = qMatch[1].trim();
    const answer = qMatch[2].trim();
    if (question && answer) items.push({ question, answer });
  }
  return { cleanContent, faqs: items };
}

export function ArticleEditor({ post, onSaveSuccess, onCancel }: ArticleEditorProps) {
  const isEditing = Boolean(post?.id);

  const parsed = useMemo(() => {
    if (post?.faqs && post.faqs.length > 0) {
      const { cleanContent } = extractFaqsFromContent(post?.content || '');
      return { cleanContent, faqs: post.faqs };
    }
    return extractFaqsFromContent(post?.content || '');
  }, [post]);

  // Form state
  const [title, setTitle] = useState(post?.title || '');
  const [slug, setSlug] = useState(post?.slug || '');
  const [isSlugLocked, setIsSlugLocked] = useState(isEditing); // Auto-generate slug while unlocked
  const [excerpt, setExcerpt] = useState(post?.excerpt || '');
  const [content, setContent] = useState(parsed.cleanContent || post?.content || '');
  const [featuredImage, setFeaturedImage] = useState<string | null>(post?.featured_image || null);
  const [imageAlt, setImageAlt] = useState('');
  const [category, setCategory] = useState<BlogCategory>(post?.category || 'vedic-maths');
  const [author, setAuthor] = useState(post?.author || 'Meenakshi Koul');
  const [readingTime, setReadingTime] = useState<number>(
    post?.reading_time || calculateReadingTime(post?.content || '')
  );
  const [status, setStatus] = useState<BlogStatus>(post?.status || 'draft');
  const [isFeatured, setIsFeatured] = useState<boolean>(post?.is_featured || false);
  const [seoTitle, setSeoTitle] = useState(post?.seo_title || '');
  const [seoDescription, setSeoDescription] = useState(post?.seo_description || '');
  const [faqs, setFaqs] = useState<BlogFAQItem[]>(parsed.faqs);

  // UI state
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // FAQ management helpers
  const handleAddFaq = () => {
    setFaqs((prev) => [...prev, { question: '', answer: '' }]);
  };

  const handleUpdateFaq = (index: number, field: 'question' | 'answer', val: string) => {
    setFaqs((prev) =>
      prev.map((faq, i) => (i === index ? { ...faq, [field]: val } : faq))
    );
  };

  const handleMoveFaq = (index: number, direction: 'up' | 'down') => {
    setFaqs((prev) => {
      const newFaqs = [...prev];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= newFaqs.length) return prev;
      const temp = newFaqs[index];
      newFaqs[index] = newFaqs[targetIndex];
      newFaqs[targetIndex] = temp;
      return newFaqs;
    });
  };

  const handleDeleteFaq = (index: number) => {
    setFaqs((prev) => prev.filter((_, i) => i !== index));
  };

  // Auto-generate slug when title changes (unless admin manually unlocked and typed a custom slug)
  useEffect(() => {
    if (!isSlugLocked && title) {
      setSlug(slugify(title));
    }
  }, [title, isSlugLocked]);

  // Validate form
  const validateForm = (): boolean => {
    setError(null);

    if (!title.trim()) {
      setError('Please provide an article title.');
      return false;
    }

    const slugCheck = validateSlug(slug);
    if (!slugCheck.valid) {
      setError(slugCheck.error || 'Please enter a valid URL slug.');
      return false;
    }

    if (!content.trim()) {
      setError('Article content cannot be empty.');
      return false;
    }

    return true;
  };

  // Save handler (draft or publish)
  const handleSave = async (targetStatus?: BlogStatus) => {
    if (!validateForm()) return;

    const finalStatus = targetStatus || status;
    setSaving(true);
    setError(null);
    setSuccessBanner(null);

    // Sanitize FAQs: trim whitespace and omit rows with empty question or answer
    const sanitizedFaqs: BlogFAQItem[] = (faqs || [])
      .map((item) => ({
        question: (item.question || '').trim(),
        answer: (item.answer || '').trim(),
      }))
      .filter((item) => item.question.length > 0 && item.answer.length > 0);

    const payload = {
      title: title.trim(),
      slug: slug.trim().toLowerCase(),
      excerpt: excerpt.trim() || null,
      content,
      featured_image: featuredImage,
      category,
      author: author.trim() || 'Meenakshi Koul',
      reading_time: readingTime,
      status: finalStatus,
      is_featured: isFeatured,
      seo_title: seoTitle.trim() || null,
      seo_description: seoDescription.trim() || null,
      faqs: sanitizedFaqs,
      published_at:
        finalStatus === 'published'
          ? post?.published_at || new Date().toISOString()
          : post?.published_at || null,
    };

    try {
      if (isEditing && post?.id) {
        const { error: updateError } = await supabase
          .from('blog_posts')
          .update(payload)
          .eq('id', post.id);

        if (updateError) throw updateError;
        setStatus(finalStatus);
        setSuccessBanner(
          finalStatus === 'published'
            ? 'Article published successfully!'
            : 'Draft saved successfully!'
        );
      } else {
        const { data: newRow, error: insertError } = await supabase
          .from('blog_posts')
          .insert([payload])
          .select()
          .single();

        if (insertError) throw insertError;
        setStatus(finalStatus);
        setSuccessBanner(
          finalStatus === 'published'
            ? 'Article created and published!'
            : 'Draft article created!'
        );
      }

      setTimeout(() => {
        onSaveSuccess();
      }, 700);
    } catch (err: any) {
      console.error('[Article Save Error]', err);
      if (err?.code === '23505' && err?.message?.includes('slug')) {
        setError('This URL slug is already taken by another article. Please customize the slug.');
      } else {
        setError(err?.message || 'Failed to save article.');
      }
    } finally {
      setSaving(false);
    }
  };

  // Delete handler
  const handleDelete = async () => {
    if (!post?.id) return;
    setDeleting(true);
    try {
      const { error: delError } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', post.id);

      if (delError) throw delError;
      onSaveSuccess();
    } catch (err: any) {
      setError(err?.message || 'Failed to delete article.');
      setDeleteConfirmOpen(false);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Top Action Bar */}
      <div className="sticky top-16 z-30 bg-[hsl(var(--background))]/95 backdrop-blur-md py-3 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="text-stone-600 hover:text-stone-900"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Articles
          </Button>

          <span className="text-stone-300">|</span>

          <span
            className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
              status === 'published'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-amber-50 text-amber-700 border border-amber-200'
            }`}
          >
            {status === 'published' ? 'Published' : 'Draft'}
          </span>

          {isFeatured && (
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-900">
              <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
              Featured
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setPreviewOpen(true)}
            className="text-xs border-stone-300 hover:bg-stone-100"
          >
            <Eye className="w-3.5 h-3.5 mr-1.5 text-stone-500" />
            Preview
          </Button>

          {status === 'published' ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={saving}
              onClick={() => handleSave('draft')}
              className="text-xs text-amber-700 border-amber-300 hover:bg-amber-50"
            >
              Unpublish
            </Button>
          ) : (
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={saving}
              onClick={() => handleSave('draft')}
              className="text-xs border-stone-300 hover:bg-stone-100"
            >
              <Save className="w-3.5 h-3.5 mr-1.5 text-stone-500" />
              Save Draft
            </Button>
          )}

          <Button
            type="button"
            size="sm"
            disabled={saving}
            onClick={() => handleSave('published')}
            className="text-xs bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/90 text-white font-medium shadow-xs"
          >
            {saving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5 mr-1.5" />
                {status === 'published' ? 'Update & Publish' : 'Publish Now'}
              </>
            )}
          </Button>

          {isEditing && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setDeleteConfirmOpen(true)}
              className="text-stone-400 hover:text-red-600 hover:bg-red-50 p-2"
              title="Delete Article"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Status Notifications */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Unable to save article</p>
            <p className="text-xs mt-0.5 text-red-700">{error}</p>
          </div>
        </div>
      )}

      {successBanner && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-medium">{successBanner}</span>
        </div>
      )}

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left / Main Column: Title, Slug, Excerpt, Content */}
        <div className="lg:col-span-8 space-y-6">
          {/* Title Input */}
          <div className="space-y-1.5">
            <Label htmlFor="article-title" className="text-xs font-semibold text-stone-700">
              Article Title *
            </Label>
            <Input
              id="article-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Why Understanding Matters More Than Speed in Maths"
              className="text-xl sm:text-2xl font-serif font-bold text-stone-900 h-14 bg-white border-stone-200 px-4 rounded-xl placeholder:font-normal placeholder:text-stone-300"
            />
          </div>

          {/* Slug URL Field */}
          <div className="p-3.5 rounded-xl bg-white border border-stone-200 space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold text-stone-700 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-stone-400" />
                URL Slug: <span className="text-stone-500 font-normal">/blog/{slug || 'your-slug-here'}</span>
              </Label>
              <button
                type="button"
                onClick={() => setIsSlugLocked(!isSlugLocked)}
                className="text-xs text-[hsl(var(--primary))] hover:underline flex items-center gap-1 font-medium"
              >
                {isSlugLocked ? (
                  <>
                    <Lock className="w-3 h-3" /> Edit slug manually
                  </>
                ) : (
                  <>
                    <Unlock className="w-3 h-3 text-amber-600" /> Auto-generate from title
                  </>
                )}
              </button>
            </div>

            {!isSlugLocked && (
              <Input
                type="text"
                value={slug}
                onChange={(e) => setSlug(slugify(e.target.value))}
                placeholder="custom-url-slug"
                className="text-xs font-mono h-8 bg-stone-50 border-stone-200"
              />
            )}
          </div>

          {/* Excerpt */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="article-excerpt" className="text-xs font-semibold text-stone-700">
                Article Excerpt / Summary
              </Label>
              <span className="text-[11px] text-stone-400">
                {excerpt.length} characters (ideal: 120-180)
              </span>
            </div>
            <Textarea
              id="article-excerpt"
              rows={2}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="A brief 1-2 sentence overview shown on blog cards and social sharing..."
              className="text-sm bg-white border-stone-200 rounded-xl resize-none text-stone-700"
            />
          </div>

          {/* Body Markdown Editor */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-stone-700">
              Article Content (Markdown) *
            </Label>
            <MarkdownEditor
              value={content}
              onChange={setContent}
              onReadingTimeChange={setReadingTime}
              minHeight="480px"
            />
          </div>

          {/* Article FAQs Section */}
          <div className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 space-y-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100">
              <div>
                <h3 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-[hsl(var(--primary))]" />
                  Article FAQs
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Frequently Asked Questions rendered as an interactive accordion on the article page and included in search engine FAQPage schema.
                </p>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddFaq}
                className="text-xs border-stone-300 hover:bg-stone-50 text-stone-700 shrink-0"
              >
                <Plus className="w-3.5 h-3.5 mr-1 text-[hsl(var(--primary))]" />
                Add FAQ
              </Button>
            </div>

            {faqs.length === 0 ? (
              <div className="text-center py-8 px-4 rounded-xl border border-dashed border-stone-200 bg-stone-50/50">
                <HelpCircle className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                <p className="text-xs font-medium text-stone-600">No FAQs added to this article yet</p>
                <p className="text-[11px] text-stone-400 mt-0.5 mb-3">
                  Add common reader questions and answers to enrich your article and improve SEO rich results.
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddFaq}
                  className="text-xs bg-white border-stone-300 hover:bg-stone-50"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  Add First FAQ
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-xl border border-stone-200 bg-stone-50/40 space-y-3 relative group hover:border-stone-300 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                        FAQ #{index + 1}
                      </span>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleMoveFaq(index, 'up')}
                          disabled={index === 0}
                          className="p-1 rounded text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed"
                          title="Move up"
                          aria-label={`Move FAQ #${index + 1} up`}
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveFaq(index, 'down')}
                          disabled={index === faqs.length - 1}
                          className="p-1 rounded text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed"
                          title="Move down"
                          aria-label={`Move FAQ #${index + 1} down`}
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteFaq(index)}
                          className="p-1 rounded text-rose-500 hover:text-rose-700 hover:bg-rose-50 ml-1 cursor-pointer"
                          title="Delete FAQ"
                          aria-label={`Delete FAQ #${index + 1}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs font-semibold text-stone-700">Question</Label>
                      <Input
                        type="text"
                        value={faq.question}
                        onChange={(e) => handleUpdateFaq(index, 'question', e.target.value)}
                        placeholder="e.g. What is the right age to start Vedic Maths?"
                        className="text-xs bg-white border-stone-200 h-9"
                      />
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs font-semibold text-stone-700">Answer</Label>
                      <Textarea
                        rows={3}
                        value={faq.answer}
                        onChange={(e) => handleUpdateFaq(index, 'answer', e.target.value)}
                        placeholder="Provide a clear, practical answer..."
                        className="text-xs bg-white border-stone-200 resize-y"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar: Publishing Settings & Metadata */}
        <div className="lg:col-span-4 space-y-6">
          {/* Card: Category & Status */}
          <div className="bg-white rounded-2xl border border-stone-200 p-5 space-y-5 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">
              Publishing Options
            </h3>

            {/* Category Selector */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-stone-700">
                Category *
              </Label>
              <div className="space-y-1.5">
                {BLOG_CATEGORIES.map((catKey) => {
                  const meta = BLOG_CATEGORY_META[catKey];
                  const isSelected = category === catKey;
                  return (
                    <button
                      key={catKey}
                      type="button"
                      onClick={() => setCategory(catKey)}
                      className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all flex items-center justify-between ${
                        isSelected
                          ? 'border-[hsl(var(--primary))] bg-[hsl(var(--primary))]/5 font-semibold text-stone-900 shadow-xs'
                          : 'border-stone-200 hover:border-stone-300 text-stone-600 bg-white'
                      }`}
                    >
                      <span>{meta.label}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${meta.badgeClass}`}
                      >
                        {meta.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Featured Article Toggle */}
            <div className="pt-3 border-t border-stone-100">
              <label className="flex items-start gap-3 cursor-pointer p-2.5 rounded-xl hover:bg-stone-50 transition-colors border border-transparent hover:border-stone-200">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-[hsl(var(--primary))] rounded border-stone-300 focus:ring-[hsl(var(--primary))]"
                />
                <div className="text-xs">
                  <span className="font-semibold text-stone-900 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    Featured Hero Article
                  </span>
                  <p className="text-stone-500 text-[11px] mt-0.5 leading-relaxed">
                    Setting this article as Featured will make it the hero article at the top of the blog and demote the current featured article.
                  </p>
                </div>
              </label>
            </div>

            {/* Author */}
            <div className="pt-3 border-t border-stone-100 space-y-1.5">
              <Label htmlFor="author-input" className="text-xs font-semibold text-stone-700">
                Author
              </Label>
              <Input
                id="author-input"
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Meenakshi Koul"
                className="text-xs h-9 bg-stone-50/50 border-stone-200"
              />
            </div>

            {/* Reading Time */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="reading-time" className="text-xs font-semibold text-stone-700">
                  Reading Time
                </Label>
                <span className="text-[11px] text-stone-400">auto-calculated</span>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  id="reading-time"
                  type="number"
                  min="1"
                  value={readingTime}
                  onChange={(e) => setReadingTime(parseInt(e.target.value, 10) || 1)}
                  className="text-xs h-9 bg-stone-50/50 border-stone-200 w-24"
                />
                <span className="text-xs text-stone-500">minutes</span>
              </div>
            </div>
          </div>

          {/* Card: Featured Image */}
          <div className="bg-white rounded-2xl border border-stone-200 p-5 space-y-4 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">
              Cover Image
            </h3>
            <ImageUploader
              value={featuredImage}
              altText={imageAlt}
              onChange={({ url, altText }) => {
                setFeaturedImage(url);
                if (altText) setImageAlt(altText);
              }}
            />
          </div>

          {/* Card: Search Engine Optimization (SEO) */}
          <div className="bg-white rounded-2xl border border-stone-200 p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                SEO & Social Meta
              </h3>
              <span className="text-[11px] text-stone-400">Optional</span>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="seo-title" className="text-xs font-semibold text-stone-700">
                  SEO Title
                </Label>
                <span className="text-[10px] text-stone-400">{seoTitle.length}/60</span>
              </div>
              <Input
                id="seo-title"
                type="text"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                placeholder={title || 'Search engine title'}
                className="text-xs h-9 bg-stone-50/50 border-stone-200"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="seo-desc" className="text-xs font-semibold text-stone-700">
                  Meta Description
                </Label>
                <span className="text-[10px] text-stone-400">{seoDescription.length}/160</span>
              </div>
              <Textarea
                id="seo-desc"
                rows={2}
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                placeholder={excerpt || 'Brief description for search results...'}
                className="text-xs bg-stone-50/50 border-stone-200 resize-none"
              />
            </div>

            {/* Google snippet preview */}
            <div className="pt-3 border-t border-stone-100">
              <span className="text-[10px] font-semibold text-stone-400 block mb-1">
                Google Search Preview
              </span>
              <div className="p-3 bg-stone-50 rounded-lg text-left text-xs space-y-1">
                <div className="text-[10px] text-emerald-700 truncate">
                  thevedicschool.com › blog › {slug || 'article'}
                </div>
                <div className="text-blue-700 font-medium truncate">
                  {seoTitle || title || 'The Vedic School Blog'}
                </div>
                <div className="text-stone-600 text-[11px] line-clamp-2">
                  {seoDescription || excerpt || 'Practical ideas, expert insights and real stories to support your child\'s Maths journey.'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full Article Preview Modal */}
      <ArticlePreviewModal
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        post={{
          title,
          slug,
          excerpt,
          content,
          featured_image: featuredImage,
          category,
          author,
          reading_time: readingTime,
          is_featured: isFeatured,
          status,
          published_at: post?.published_at || null,
        }}
      />

      {/* Delete Confirmation Modal */}
      {deleteConfirmOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-xl border border-stone-200">
            <h3 className="text-lg font-bold text-stone-900">Delete Article?</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Are you sure you want to permanently delete{' '}
              <strong className="text-stone-900">"{title || 'this article'}"</strong>? This action
              cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={deleting}
                onClick={() => setDeleteConfirmOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                disabled={deleting}
                onClick={handleDelete}
                className="text-xs bg-red-600 hover:bg-red-700"
              >
                {deleting ? 'Deleting...' : 'Yes, Delete'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
