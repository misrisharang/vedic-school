// ==============================================================================
// THE VEDIC SCHOOL — ARTICLE EDITOR VIEW (CREATE & EDIT)
// ==============================================================================

import React, { useState, useEffect, useMemo } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { BlogPost, BlogCategory, BlogStatus, BlogFAQItem, BlogSourceItem, Author } from '@/types/blog';
import { BLOG_CATEGORIES, BLOG_CATEGORY_META } from '@/types/blog';
import { slugify, validateSlug } from '@/lib/blog-slug';
import { calculateReadingTime } from '@/lib/blog';
import { parseMarkdownArticle, type MarkdownImportResult } from '@/lib/markdown-importer';
import { fetchAuthors, findAuthorByNameOrSlug } from '@/lib/authors';
import { DEFAULT_AUTHORS } from '@/data/authors';
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
  ListOrdered,
  Quote,
  BookOpen,
  FileDown,
  UserPlus,
  Check,
  X,
  Sparkles,
  FileText,
  User,
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

function extractSourcesFromContent(rawContent: string): { cleanContent: string; sources: BlogSourceItem[] } {
  if (!rawContent) return { cleanContent: '', sources: [] };
  const regex = /(?:^|\n)(?:##\s*(?:\*\*)?Sources(?:\*\*)?|\*\*Sources\*\*(?:\s*\([^)]*\))?)\s*([\s\S]*?)$/i;
  const match = rawContent.match(regex);
  if (!match) return { cleanContent: rawContent, sources: [] };

  const sourceBlock = match[0];
  const sourceText = match[1].trim();
  const cleanContent = rawContent.replace(sourceBlock, '\n\n').replace(/\n{3,}/g, '\n\n').trim();
  const lines = sourceText.split('\n').filter((l) => l.trim().startsWith('*') || l.trim().startsWith('-'));
  const items = lines.map(parseSourceItem);
  return { cleanContent, sources: items };
}

function extractTldrFromContent(rawContent: string): { cleanContent: string; tldr: string[] } {
  if (!rawContent) return { cleanContent: '', tldr: [] };
  const tldrRegex = /(?:^|\n)(?:##\s*(?:\*\*)?TL;DR(?:\*\*)?|\*\*TL;DR\*\*|> \*\*TL;DR\*\*)([\s\S]*?)(?=(?:^|\n)#{2,3}\s+|$)/i;
  const match = rawContent.match(tldrRegex);
  if (!match) return { cleanContent: rawContent, tldr: [] };

  const fullBlock = match[0];
  const rawBody = match[1].trim();
  const cleanContent = rawContent.replace(fullBlock, '\n\n').replace(/\n{3,}/g, '\n\n').trim();

  const bullets = rawBody
    .split('\n')
    .map((line) => line.replace(/^\s*>\s?/, '').trim())
    .filter((line) => line.startsWith('*') || line.startsWith('-'))
    .map((line) => line.replace(/^[\s*-]+/, '').trim())
    .filter(Boolean);

  return { cleanContent, tldr: bullets };
}

function extractQuickVerdictFromContent(rawContent: string): { cleanContent: string; quickVerdict: string } {
  if (!rawContent) return { cleanContent: '', quickVerdict: '' };
  const qvRegex = /(?:^|\n)(?:\*\*Quick verdict:\*\*|Quick verdict:?)\s*([\s\S]*?)(?=(?:\n\s*\n|\n#{1,3}\s+|$))/i;
  const match = rawContent.match(qvRegex);
  if (!match) return { cleanContent: rawContent, quickVerdict: '' };

  const fullBlock = match[0];
  const verdictBody = match[1].trim();
  const cleanContent = rawContent.replace(fullBlock, '\n\n').replace(/\n{3,}/g, '\n\n').trim();
  return { cleanContent, quickVerdict: verdictBody };
}

export function ArticleEditor({ post, onSaveSuccess, onCancel }: ArticleEditorProps) {
  const isEditing = Boolean(post?.id);

  const parsed = useMemo(() => {
    let currentContent = post?.content || '';

    // 1. FAQs
    let effectiveFaqs: BlogFAQItem[] = post?.faqs || [];
    if (effectiveFaqs.length === 0) {
      const extracted = extractFaqsFromContent(currentContent);
      currentContent = extracted.cleanContent;
      effectiveFaqs = extracted.faqs;
    } else {
      const extracted = extractFaqsFromContent(currentContent);
      currentContent = extracted.cleanContent;
    }

    // 2. Sources
    let effectiveSources: BlogSourceItem[] = post?.sources || [];
    if (effectiveSources.length === 0) {
      const extracted = extractSourcesFromContent(currentContent);
      currentContent = extracted.cleanContent;
      effectiveSources = extracted.sources;
    } else {
      const extracted = extractSourcesFromContent(currentContent);
      currentContent = extracted.cleanContent;
    }

    // 3. Quick Verdict
    let effectiveQuickVerdict: string = post?.quick_verdict || '';
    if (!effectiveQuickVerdict) {
      const extracted = extractQuickVerdictFromContent(currentContent);
      currentContent = extracted.cleanContent;
      effectiveQuickVerdict = extracted.quickVerdict;
    } else {
      const extracted = extractQuickVerdictFromContent(currentContent);
      currentContent = extracted.cleanContent;
    }

    // 4. TL;DR
    let effectiveTldr: string[] = post?.tldr || [];
    if (effectiveTldr.length === 0) {
      const extracted = extractTldrFromContent(currentContent);
      currentContent = extracted.cleanContent;
      effectiveTldr = extracted.tldr;
    } else {
      const extracted = extractTldrFromContent(currentContent);
      currentContent = extracted.cleanContent;
    }

    return {
      cleanContent: currentContent,
      faqs: effectiveFaqs,
      sources: effectiveSources,
      quickVerdict: effectiveQuickVerdict,
      tldr: effectiveTldr,
    };
  }, [post]);

  // Form state
  const [title, setTitle] = useState(post?.title || '');
  const [slug, setSlug] = useState(post?.slug || '');
  const [isSlugLocked, setIsSlugLocked] = useState(isEditing); // Auto-generate slug while unlocked
  const [excerpt, setExcerpt] = useState(post?.excerpt || '');
  const [content, setContent] = useState(parsed.cleanContent || post?.content || '');
  const [tldr, setTldr] = useState<string[]>(parsed.tldr);
  const [quickVerdict, setQuickVerdict] = useState<string>(parsed.quickVerdict);
  const [sources, setSources] = useState<BlogSourceItem[]>(parsed.sources);
  const [featuredImage, setFeaturedImage] = useState<string | null>(post?.featured_image || null);
  const [imageAlt, setImageAlt] = useState(post?.featured_image_alt || '');
  const [category, setCategory] = useState<BlogCategory>(post?.category || 'vedic-maths');
  const [author, setAuthor] = useState(post?.author || 'Meenakshi Koul');
  const [authorId, setAuthorId] = useState<string | null>(post?.author_id || null);
  const [authors, setAuthors] = useState<Author[]>([...DEFAULT_AUTHORS]);
  const [createAuthorOpen, setCreateAuthorOpen] = useState(false);
  const [newAuthorName, setNewAuthorName] = useState('');
  const [newAuthorRole, setNewAuthorRole] = useState('');
  const [newAuthorSlug, setNewAuthorSlug] = useState('');

  // Markdown Import Modal state
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [rawMarkdownInput, setRawMarkdownInput] = useState('');
  const [parsedResult, setParsedResult] = useState<MarkdownImportResult | null>(null);

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

  // Load canonical authors on mount
  useEffect(() => {
    async function loadAuthors() {
      try {
        const { authors: list } = await fetchAuthors();
        if (list && list.length > 0) {
          setAuthors(list);
          if (!authorId && post?.author) {
            const matched = findAuthorByNameOrSlug(list, post.author);
            if (matched) {
              setAuthorId(matched.id);
            }
          } else if (!authorId && !post?.id) {
            const defaultA = list.find((a) => a.slug === 'meenakshi-koul') || list[0];
            if (defaultA) {
              setAuthorId(defaultA.id);
              setAuthor(defaultA.name);
            }
          }
        }
      } catch (err) {
        console.warn('Failed to load authors:', err);
      }
    }
    loadAuthors();
  }, []);

  // Quick author selector change
  const handleAuthorChange = (selectedId: string) => {
    setAuthorId(selectedId);
    const matched = authors.find((a) => a.id === selectedId);
    if (matched) {
      setAuthor(matched.name);
    }
  };

  // Quick create author inline without losing article state
  const handleQuickCreateAuthor = async () => {
    if (!newAuthorName.trim()) return;
    const cleanSlug = slugify(newAuthorSlug || newAuthorName);
    const newAuthor: Author = {
      id: `auth-${Date.now()}`,
      name: newAuthorName.trim(),
      slug: cleanSlug,
      role: newAuthorRole.trim() || 'Educator',
      bio: null,
      photo: null,
      photo_alt: null,
      linkedin_url: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured) {
      try {
        await supabase.from('authors').insert([{
          name: newAuthor.name,
          slug: newAuthor.slug,
          role: newAuthor.role,
        }]);
      } catch (err) {
        console.warn('Could not insert to Supabase authors table (table may not exist yet):', err);
      }
    }

    setAuthors((prev) => [...prev, newAuthor]);
    setAuthorId(newAuthor.id);
    setAuthor(newAuthor.name);
    setCreateAuthorOpen(false);
    setNewAuthorName('');
    setNewAuthorRole('');
    setNewAuthorSlug('');
  };

  // Markdown Import Engine Triggers
  const handleRunParseMarkdown = () => {
    if (!rawMarkdownInput.trim()) return;
    const result = parseMarkdownArticle(rawMarkdownInput, authors);
    setParsedResult(result);
  };

  const handleApplyParsedMarkdown = () => {
    if (!parsedResult) return;

    if (parsedResult.title && !title.trim()) {
      setTitle(parsedResult.title);
    }

    if (parsedResult.tldr && parsedResult.tldr.length > 0) {
      setTldr(parsedResult.tldr);
    }

    if (parsedResult.quickVerdict) {
      setQuickVerdict(parsedResult.quickVerdict);
    }

    if (parsedResult.sources && parsedResult.sources.length > 0) {
      setSources(parsedResult.sources);
    }

    if (parsedResult.faqs && parsedResult.faqs.length > 0) {
      setFaqs(parsedResult.faqs);
    }

    if (parsedResult.authorMatched) {
      setAuthorId(parsedResult.authorMatched.id);
      setAuthor(parsedResult.authorMatched.name);
    } else if (parsedResult.authorName) {
      setAuthor(parsedResult.authorName);
    }

    if (parsedResult.cleanContent) {
      setContent(parsedResult.cleanContent);
      setReadingTime(calculateReadingTime(parsedResult.cleanContent));
    }

    setImportModalOpen(false);
    setRawMarkdownInput('');
    setParsedResult(null);
    setSuccessBanner('Markdown article parsed and structured fields successfully applied to editor!');
  };

  // TL;DR management helpers
  const handleAddTldrBullet = () => {
    setTldr((prev) => [...prev, '']);
  };

  const handleUpdateTldrBullet = (index: number, val: string) => {
    setTldr((prev) => prev.map((item, i) => (i === index ? val : item)));
  };

  const handleMoveTldrBullet = (index: number, direction: 'up' | 'down') => {
    setTldr((prev) => {
      const newBullets = [...prev];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= newBullets.length) return prev;
      const temp = newBullets[index];
      newBullets[index] = newBullets[targetIndex];
      newBullets[targetIndex] = temp;
      return newBullets;
    });
  };

  const handleDeleteTldrBullet = (index: number) => {
    setTldr((prev) => prev.filter((_, i) => i !== index));
  };

  // Sources management helpers
  const handleAddSource = () => {
    setSources((prev) => [...prev, { publication: '', title: '', url: '', date: '' }]);
  };

  const handleUpdateSource = (
    index: number,
    field: keyof BlogSourceItem,
    val: string
  ) => {
    setSources((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: val } : item))
    );
  };

  const handleMoveSource = (index: number, direction: 'up' | 'down') => {
    setSources((prev) => {
      const newSources = [...prev];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= newSources.length) return prev;
      const temp = newSources[index];
      newSources[index] = newSources[targetIndex];
      newSources[targetIndex] = temp;
      return newSources;
    });
  };

  const handleDeleteSource = (index: number) => {
    setSources((prev) => prev.filter((_, i) => i !== index));
  };

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

    // Sanitize TL;DR: filter out empty bullets
    const sanitizedTldr = (tldr || [])
      .map((b) => b.trim())
      .filter((b) => b.length > 0);

    // Sanitize Sources: filter out items with no publication, title, or url
    const sanitizedSources = (sources || [])
      .map((item) => ({
        publication: (item.publication || '').trim(),
        title: (item.title || '').trim(),
        url: (item.url || '').trim(),
        date: item.date ? item.date.trim() : undefined,
      }))
      .filter((item) => item.publication.length > 0 || item.title.length > 0 || item.url.length > 0);

    // Sanitize FAQs: trim whitespace and omit rows with empty question or answer
    const sanitizedFaqs: BlogFAQItem[] = (faqs || [])
      .map((item) => ({
        question: (item.question || '').trim(),
        answer: (item.answer || '').trim(),
      }))
      .filter((item) => item.question.length > 0 && item.answer.length > 0);

    const fullPayload = {
      title: title.trim(),
      slug: slug.trim().toLowerCase(),
      excerpt: excerpt.trim() || null,
      content,
      featured_image: featuredImage,
      featured_image_alt: imageAlt.trim() || null,
      category,
      author: author.trim() || 'Meenakshi Koul',
      author_id: authorId || null,
      reading_time: readingTime,
      status: finalStatus,
      is_featured: isFeatured,
      seo_title: seoTitle.trim() || null,
      seo_description: seoDescription.trim() || null,
      tldr: sanitizedTldr,
      quick_verdict: quickVerdict.trim() || null,
      sources: sanitizedSources,
      faqs: sanitizedFaqs,
      published_at:
        finalStatus === 'published'
          ? post?.published_at || new Date().toISOString()
          : post?.published_at || null,
    };

    // Baseline payload fallback if columns not yet migrated in Supabase table
    const baselinePayload = {
      title: fullPayload.title,
      slug: fullPayload.slug,
      excerpt: fullPayload.excerpt,
      content: fullPayload.content,
      featured_image: fullPayload.featured_image,
      category: fullPayload.category,
      author: fullPayload.author,
      reading_time: fullPayload.reading_time,
      status: fullPayload.status,
      is_featured: fullPayload.is_featured,
      seo_title: fullPayload.seo_title,
      seo_description: fullPayload.seo_description,
      faqs: fullPayload.faqs,
      published_at: fullPayload.published_at,
    };

    try {
      if (isEditing && post?.id) {
        let { error: updateError } = await supabase
          .from('blog_posts')
          .update(fullPayload)
          .eq('id', post.id);

        if (
          updateError &&
          (updateError.message?.includes('column') ||
            updateError.code === 'PGRST204' ||
            updateError.code === '42703')
        ) {
          console.warn(
            '[Article Save] Structured columns not yet present in Supabase table. Falling back to baseline columns.',
            updateError
          );
          const fallbackResult = await supabase
            .from('blog_posts')
            .update(baselinePayload)
            .eq('id', post.id);
          updateError = fallbackResult.error;
        }

        if (updateError) throw updateError;
        setStatus(finalStatus);
        setSuccessBanner(
          finalStatus === 'published'
            ? 'Article published successfully!'
            : 'Draft saved successfully!'
        );
      } else {
        let insertResult = await supabase
          .from('blog_posts')
          .insert([fullPayload])
          .select()
          .single();

        if (
          insertResult.error &&
          (insertResult.error.message?.includes('column') ||
            insertResult.error.code === 'PGRST204' ||
            insertResult.error.code === '42703')
        ) {
          console.warn(
            '[Article Save] Structured columns not yet present in Supabase table. Falling back to baseline columns.',
            insertResult.error
          );
          insertResult = await supabase
            .from('blog_posts')
            .insert([baselinePayload])
            .select()
            .single();
        }

        if (insertResult.error) throw insertResult.error;
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
            onClick={() => setImportModalOpen(true)}
            className="text-xs border-stone-300 hover:bg-stone-100 text-stone-700 font-medium"
          >
            <FileDown className="w-3.5 h-3.5 mr-1.5 text-stone-500" />
            Import Markdown
          </Button>

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

          {/* Card: Dedicated TL;DR (Key Takeaways) */}
          <div className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 space-y-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                    <ListOrdered className="w-4 h-4 text-[hsl(var(--primary))]" />
                    TL;DR (Key Takeaways)
                  </h3>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 border border-stone-200">
                    v2.4 Editorial Block
                  </span>
                </div>
                <p className="text-xs text-stone-500 mt-0.5">
                  High-impact bullet points rendered in the prominent top summary container directly below the cover image.
                </p>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddTldrBullet}
                className="text-xs border-stone-300 hover:bg-stone-50 self-start sm:self-auto shrink-0"
              >
                <Plus className="w-3.5 h-3.5 mr-1 text-[hsl(var(--primary))]" />
                Add bullet point
              </Button>
            </div>

            {tldr.length === 0 ? (
              <div className="text-center py-6 px-4 border border-dashed border-stone-200 rounded-xl bg-stone-50/50">
                <ListOrdered className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                <p className="text-xs font-medium text-stone-600">No TL;DR bullets added yet</p>
                <p className="text-[11px] text-stone-400 mt-0.5 mb-3">
                  Add key takeaway bullet points so readers can quickly grasp the core conclusions.
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddTldrBullet}
                  className="text-xs bg-white border-stone-300 hover:bg-stone-50"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  Add bullet point
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {tldr.map((bullet, index) => (
                  <div
                    key={index}
                    className="p-3 sm:p-4 rounded-xl border border-stone-200 bg-stone-50/40 space-y-2 relative group hover:border-stone-300 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-[hsl(var(--primary))] uppercase tracking-wider">
                        Bullet #{index + 1}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleMoveTldrBullet(index, 'up')}
                          disabled={index === 0}
                          className="p-1 rounded text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed"
                          title="Move up"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveTldrBullet(index, 'down')}
                          disabled={index === tldr.length - 1}
                          className="p-1 rounded text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed"
                          title="Move down"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteTldrBullet(index)}
                          className="p-1 rounded text-stone-400 hover:text-red-600 hover:bg-red-50 cursor-pointer ml-1"
                          title="Delete bullet"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <Textarea
                      rows={2}
                      value={bullet}
                      onChange={(e) => handleUpdateTldrBullet(index, e.target.value)}
                      placeholder="e.g. Abacus is a bead-based method that trains arithmetic speed..."
                      className="text-xs sm:text-sm bg-white border-stone-200 rounded-lg resize-none text-stone-800"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Card: Dedicated Quick Verdict */}
          <div className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 space-y-4 shadow-xs">
            <div className="pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                  <Quote className="w-4 h-4 text-[hsl(var(--primary))]" />
                  Quick Verdict
                </h3>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 border border-stone-200">
                  v2.4 Editorial Block
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                The author's concise executive verdict. Rendered with a warm cream background and distinctive left accent bar before the main body.
              </p>
            </div>

            <div className="space-y-1.5">
              <Textarea
                rows={4}
                value={quickVerdict}
                onChange={(e) => setQuickVerdict(e.target.value)}
                placeholder="e.g. Neither is better for every child. Abacus trains very fast arithmetic by picturing beads... Vedic Maths teaches flexible calculation methods..."
                className="text-xs sm:text-sm bg-stone-50/50 border-stone-200 rounded-xl leading-relaxed text-stone-800"
              />
              <div className="flex justify-between items-center text-[11px] text-stone-400 pt-1">
                <span>Supports plain text or Markdown formatting (e.g. bold, italics).</span>
                <span>{quickVerdict.length} characters</span>
              </div>
            </div>
          </div>

          {/* Body Markdown Editor */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold text-stone-700">
                Article Content (Markdown) *
              </Label>
              <span className="text-[11px] text-stone-400">
                H2 headings automatically populate the sticky Table of Contents
              </span>
            </div>
            <MarkdownEditor
              value={content}
              onChange={setContent}
              onReadingTimeChange={setReadingTime}
              minHeight="480px"
            />
          </div>

          {/* Card: Dedicated Sources Section */}
          <div className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 space-y-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-[hsl(var(--primary))]" />
                    Sources & References
                  </h3>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 border border-stone-200">
                    v2.4 Editorial Block
                  </span>
                </div>
                <p className="text-xs text-stone-500 mt-0.5">
                  Academic papers, published research, articles, and external citations. Rendered as a dedicated numbered section with clickable secure links.
                </p>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddSource}
                className="text-xs border-stone-300 hover:bg-stone-50 self-start sm:self-auto shrink-0"
              >
                <Plus className="w-3.5 h-3.5 mr-1 text-[hsl(var(--primary))]" />
                Add Source
              </Button>
            </div>

            {sources.length === 0 ? (
              <div className="text-center py-6 px-4 border border-dashed border-stone-200 rounded-xl bg-stone-50/50">
                <BookOpen className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                <p className="text-xs font-medium text-stone-600">No sources added yet</p>
                <p className="text-[11px] text-stone-400 mt-0.5 mb-3">
                  Add research citations, journal articles, or web references to substantiate claims.
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddSource}
                  className="text-xs bg-white border-stone-300 hover:bg-stone-50"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  Add First Source
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {sources.map((source, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-xl border border-stone-200 bg-stone-50/40 space-y-3 relative group hover:border-stone-300 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                        Source #{index + 1}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleMoveSource(index, 'up')}
                          disabled={index === 0}
                          className="p-1 rounded text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed"
                          title="Move up"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveSource(index, 'down')}
                          disabled={index === sources.length - 1}
                          className="p-1 rounded text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed"
                          title="Move down"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteSource(index)}
                          className="p-1 rounded text-stone-400 hover:text-red-600 hover:bg-red-50 cursor-pointer ml-1"
                          title="Delete source"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-[11px] font-medium text-stone-600">
                          Publication / Author / Source Name *
                        </Label>
                        <Input
                          type="text"
                          value={source.publication}
                          onChange={(e) => handleUpdateSource(index, 'publication', e.target.value)}
                          placeholder="e.g. Barner, D. et al. (2016) or British Psychological Society"
                          className="text-xs h-8 bg-white border-stone-200"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[11px] font-medium text-stone-600">
                          Date / Year (Optional)
                        </Label>
                        <Input
                          type="text"
                          value={source.date || ''}
                          onChange={(e) => handleUpdateSource(index, 'date', e.target.value)}
                          placeholder="e.g. 2016 or Checked 12 Sept 2026"
                          className="text-xs h-8 bg-white border-stone-200"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label className="text-[11px] font-medium text-stone-600">
                        Article / Study Title (Optional)
                      </Label>
                      <Input
                        type="text"
                        value={source.title}
                        onChange={(e) => handleUpdateSource(index, 'title', e.target.value)}
                        placeholder="e.g. Learning mathematics in a visuospatial format: A randomized, controlled trial"
                        className="text-xs h-8 bg-white border-stone-200"
                      />
                    </div>

                    <div className="space-y-1">
                      <Label className="text-[11px] font-medium text-stone-600">
                        URL (Optional)
                      </Label>
                      <Input
                        type="url"
                        value={source.url}
                        onChange={(e) => handleUpdateSource(index, 'url', e.target.value)}
                        placeholder="https://academic.oup.com/chidev/article/..."
                        className="text-xs h-8 bg-white border-stone-200"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
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

            {/* Author Selector */}
            <div className="pt-3 border-t border-stone-100 space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="author-select" className="text-xs font-semibold text-stone-700">
                  Author *
                </Label>
                <button
                  type="button"
                  onClick={() => setCreateAuthorOpen(true)}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-[hsl(var(--primary))] hover:underline cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  Add Author
                </button>
              </div>

              <select
                id="author-select"
                value={authorId || ''}
                onChange={(e) => handleAuthorChange(e.target.value)}
                className="w-full text-xs h-9 bg-white border border-stone-200 rounded-lg px-2.5 py-1.5 text-stone-800 focus:outline-hidden focus:ring-2 focus:ring-[hsl(var(--primary))] cursor-pointer"
              >
                <option value="" disabled>
                  Select an author...
                </option>
                {authors.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} ({a.role || 'Author'})
                  </option>
                ))}
              </select>

              {author && (
                <div className="flex items-center justify-between text-[11px] text-stone-500 pt-0.5">
                  <span className="truncate">
                    Name: <strong className="text-stone-700">{author}</strong>
                  </span>
                  {authorId && (
                    <span className="text-[10px] text-stone-400 font-mono shrink-0 ml-2">
                      /authors/{authors.find((a) => a.id === authorId)?.slug || slugify(author)}
                    </span>
                  )}
                </div>
              )}
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
          featured_image_alt: imageAlt,
          category,
          author,
          author_id: authorId,
          reading_time: readingTime,
          is_featured: isFeatured,
          status,
          published_at: post?.published_at || null,
          tldr: tldr.filter((b) => b.trim().length > 0),
          quick_verdict: quickVerdict.trim() || null,
          sources: sources.filter(
            (s) =>
              (s.publication || '').trim().length > 0 ||
              (s.title || '').trim().length > 0 ||
              (s.url || '').trim().length > 0
          ),
          faqs: faqs.filter(
            (f) => (f.question || '').trim().length > 0 && (f.answer || '').trim().length > 0
          ),
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

      {/* Markdown Import Modal */}
      {importModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-stone-200 flex items-center justify-between bg-stone-50/50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[hsl(var(--primary))]/10 flex items-center justify-center text-[hsl(var(--primary))] shrink-0">
                  <FileDown className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-stone-900">
                    Import & Parse Markdown Article
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Paste raw Markdown. Deterministically extracts TL;DR, Quick Verdict, Sources, and FAQs into structured fields.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setImportModalOpen(false);
                  setParsedResult(null);
                }}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto p-5 sm:p-6 space-y-4 flex-1">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="raw-markdown-input" className="text-xs font-semibold text-stone-700">
                    Raw Article Markdown
                  </Label>
                  <span className="text-[11px] text-stone-400">
                    Supports H1 title, ## TL;DR, **Quick verdict:**, ## Sources, ## FAQs, and Author
                  </span>
                </div>
                <Textarea
                  id="raw-markdown-input"
                  rows={10}
                  value={rawMarkdownInput}
                  onChange={(e) => {
                    setRawMarkdownInput(e.target.value);
                    if (parsedResult) setParsedResult(null);
                  }}
                  placeholder={`Paste full Markdown article here...\n\n# Article Title\n\n## TL;DR\n* First key takeaway bullet...\n* Second key takeaway bullet...\n\n**Quick verdict:** Clear concise verdict...\n\nArticle introduction and paragraphs...\n\n## Sources\n* Cambridge Primary Mathematics (2024). Resource title: https://...\n\n## FAQs\n### What is Vedic Maths?\nIt is a system of mental math...`}
                  className="font-mono text-xs bg-stone-50/50 border-stone-200 resize-y"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <Button
                  type="button"
                  size="sm"
                  onClick={handleRunParseMarkdown}
                  disabled={!rawMarkdownInput.trim()}
                  className="text-xs bg-stone-900 hover:bg-stone-800 text-white font-medium"
                >
                  <Sparkles className="w-3.5 h-3.5 mr-1.5 text-amber-300" />
                  Parse Markdown
                </Button>
                {parsedResult && (
                  <span className="text-xs font-medium text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Parsing complete
                  </span>
                )}
              </div>

              {/* Parsing Results Breakdown */}
              {parsedResult && (
                <div className="p-4 bg-[#FBF9F5] rounded-xl border border-stone-200 space-y-3">
                  <div className="flex items-center justify-between border-b border-stone-200/80 pb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-600">
                      Extraction Summary
                    </span>
                    <span className="text-[11px] text-stone-500">
                      ~{parsedResult.cleanContent.split(/\s+/).filter(Boolean).length} clean body words
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                    <div className="bg-white p-2.5 rounded-lg border border-stone-200">
                      <span className="text-[10px] text-stone-400 block uppercase font-medium">H1 Title</span>
                      <span className="font-semibold text-stone-800 truncate block">
                        {parsedResult.title ? parsedResult.title : '— (Keep current)'}
                      </span>
                    </div>

                    <div className="bg-white p-2.5 rounded-lg border border-stone-200">
                      <span className="text-[10px] text-stone-400 block uppercase font-medium">TL;DR Bullets</span>
                      <span className="font-semibold text-stone-800">
                        {parsedResult.tldr.length > 0 ? (
                          <span className="text-emerald-700 font-bold">{parsedResult.tldr.length} bullet(s)</span>
                        ) : (
                          'None'
                        )}
                      </span>
                    </div>

                    <div className="bg-white p-2.5 rounded-lg border border-stone-200">
                      <span className="text-[10px] text-stone-400 block uppercase font-medium">Quick Verdict</span>
                      <span className="font-semibold text-stone-800">
                        {parsedResult.quickVerdict ? (
                          <span className="text-emerald-700 font-bold">Detected</span>
                        ) : (
                          'None'
                        )}
                      </span>
                    </div>

                    <div className="bg-white p-2.5 rounded-lg border border-stone-200">
                      <span className="text-[10px] text-stone-400 block uppercase font-medium">Sources</span>
                      <span className="font-semibold text-stone-800">
                        {parsedResult.sources.length > 0 ? (
                          <span className="text-emerald-700 font-bold">{parsedResult.sources.length} source(s)</span>
                        ) : (
                          'None'
                        )}
                      </span>
                    </div>

                    <div className="bg-white p-2.5 rounded-lg border border-stone-200">
                      <span className="text-[10px] text-stone-400 block uppercase font-medium">FAQs</span>
                      <span className="font-semibold text-stone-800">
                        {parsedResult.faqs.length > 0 ? (
                          <span className="text-emerald-700 font-bold">{parsedResult.faqs.length} parsed</span>
                        ) : (
                          'None'
                        )}
                      </span>
                    </div>

                    <div className="bg-white p-2.5 rounded-lg border border-stone-200">
                      <span className="text-[10px] text-stone-400 block uppercase font-medium">Author</span>
                      <span className="font-semibold text-stone-800 truncate block">
                        {parsedResult.authorMatched
                          ? `${parsedResult.authorMatched.name} ✓`
                          : parsedResult.authorName || 'Meenakshi Koul'}
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] text-stone-500 leading-relaxed pt-1">
                    Clicking <strong>Apply to Editor</strong> will populate the structured fields and clean the article body so headings are not duplicated in the markdown.
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 border-t border-stone-200 flex items-center justify-end gap-2 bg-stone-50/50">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setImportModalOpen(false);
                  setParsedResult(null);
                }}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="button"
                size="sm"
                disabled={!parsedResult}
                onClick={handleApplyParsedMarkdown}
                className="text-xs bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/90 text-white font-semibold shadow-xs"
              >
                <Check className="w-3.5 h-3.5 mr-1.5" />
                Apply to Editor
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Add Author Modal */}
      {createAuthorOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[hsl(var(--primary))]/10 flex items-center justify-center text-[hsl(var(--primary))]">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-stone-900">Add New Author</h3>
                  <p className="text-xs text-stone-500">Register a new educator or contributor</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCreateAuthorOpen(false)}
                className="p-1 rounded text-stone-400 hover:text-stone-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-left">
              <div className="space-y-1">
                <Label htmlFor="new-author-name" className="text-xs font-semibold text-stone-700">
                  Full Name *
                </Label>
                <Input
                  id="new-author-name"
                  type="text"
                  value={newAuthorName}
                  onChange={(e) => {
                    setNewAuthorName(e.target.value);
                    if (!newAuthorSlug) {
                      setNewAuthorSlug(slugify(e.target.value));
                    }
                  }}
                  placeholder="e.g. Meenakshi Koul"
                  className="text-xs bg-white border-stone-200"
                  autoFocus
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="new-author-role" className="text-xs font-semibold text-stone-700">
                  Role / Title
                </Label>
                <Input
                  id="new-author-role"
                  type="text"
                  value={newAuthorRole}
                  onChange={(e) => setNewAuthorRole(e.target.value)}
                  placeholder="e.g. Founder & Vedic Maths Educator"
                  className="text-xs bg-white border-stone-200"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="new-author-slug" className="text-xs font-semibold text-stone-700">
                  Profile URL Slug
                </Label>
                <Input
                  id="new-author-slug"
                  type="text"
                  value={newAuthorSlug}
                  onChange={(e) => setNewAuthorSlug(slugify(e.target.value))}
                  placeholder="e.g. meenakshi-koul"
                  className="text-xs bg-white border-stone-200 font-mono"
                />
                <p className="text-[10px] text-stone-400">
                  Public profile will resolve at /authors/{newAuthorSlug || slugify(newAuthorName) || 'author-slug'}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setCreateAuthorOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="button"
                size="sm"
                disabled={!newAuthorName.trim()}
                onClick={handleQuickCreateAuthor}
                className="text-xs bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/90 text-white font-medium shadow-xs"
              >
                Create Author
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
