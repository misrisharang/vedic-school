// ==============================================================================
// THE VEDIC SCHOOL — MARKDOWN ARTICLE EDITOR (NON-TECHNICAL WRITING INTERFACE)
// ==============================================================================

import React, { useState, useRef } from 'react';
import { marked } from 'marked';
import { supabase } from '@/lib/supabase';
import { slugify } from '@/lib/blog-slug';
import { calculateReadingTime } from '@/lib/blog';
import { Button } from '@/components/ui/button';
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Image as ImageIcon,
  Minus,
  Eye,
  Edit3,
  Loader2,
  Columns,
} from 'lucide-react';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  onReadingTimeChange?: (minutes: number) => void;
  minHeight?: string;
}

export function MarkdownEditor({
  value,
  onChange,
  onReadingTimeChange,
  minHeight = '420px',
}: MarkdownEditorProps) {
  const [activeTab, setActiveTab] = useState<'write' | 'preview' | 'split'>('write');
  const [uploadingImage, setUploadingImage] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Calculate stats
  const wordCount = value
    ? value
        .replace(/<[^>]*>/g, ' ')
        .replace(/[#*`_~>-]/g, ' ')
        .trim()
        .split(/\s+/)
        .filter(Boolean).length
    : 0;

  const readingTime = calculateReadingTime(value);

  // Notify parent of reading time updates if callback provided
  React.useEffect(() => {
    if (onReadingTimeChange) {
      onReadingTimeChange(readingTime);
    }
  }, [readingTime, onReadingTimeChange]);

  // Insert markdown helpers around selection
  const insertFormatting = (before: string, after: string = '', defaultText: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end) || defaultText;
    const replacement = `${before}${selectedText}${after}`;

    const newValue =
      textarea.value.substring(0, start) +
      replacement +
      textarea.value.substring(end);

    onChange(newValue);

    // Restore focus and cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        start + before.length + selectedText.length
      );
    }, 0);
  };

  const handleLinkInsert = () => {
    const url = window.prompt('Enter the web address (URL):', 'https://');
    if (!url) return;
    const label = window.prompt('Enter link text:', 'click here');
    insertFormatting(`[${label || 'link'}](${url})`);
  };

  const handleInlineImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const baseName = file.name.replace(/\.[^/.]+$/, '');
      const cleanName = slugify(baseName) || 'inline-image';
      const filePath = `inline/${Date.now()}-${cleanName}.${ext}`;

      const { data, error } = await supabase.storage
        .from('blog-images')
        .upload(filePath, file);

      if (error) throw error;

      const {
        data: { publicUrl },
      } = supabase.storage.from('blog-images').getPublicUrl(data.path);

      insertFormatting(`\n\n![${baseName}](${publicUrl})\n\n`);
    } catch (err: any) {
      alert(`Image upload failed: ${err?.message || 'Unknown error'}`);
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Convert markdown to HTML for preview
  const getRenderedHtml = () => {
    try {
      return marked.parse(value || '*No content yet. Start writing above.*');
    } catch {
      return '<p>Error rendering preview</p>';
    }
  };

  return (
    <div className="border border-stone-200 rounded-xl overflow-hidden bg-white shadow-xs">
      {/* Editor Header / Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 bg-stone-50 border-b border-stone-200">
        {/* Formatting Buttons */}
        <div className="flex flex-wrap items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => insertFormatting('**', '**', 'bold text')}
            className="h-8 w-8 p-0 text-stone-700 hover:bg-stone-200/70"
            title="Bold (**text**)"
          >
            <Bold className="w-4 h-4" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => insertFormatting('*', '*', 'italic text')}
            className="h-8 w-8 p-0 text-stone-700 hover:bg-stone-200/70"
            title="Italic (*text*)"
          >
            <Italic className="w-4 h-4" />
          </Button>

          <div className="w-px h-5 bg-stone-300 mx-1" />

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => insertFormatting('\n\n## ', '\n', 'Section Heading')}
            className="h-8 px-2 text-xs font-semibold text-stone-700 hover:bg-stone-200/70"
            title="Heading 2 (## Heading)"
          >
            <Heading2 className="w-4 h-4 mr-0.5" />
            H2
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => insertFormatting('\n\n### ', '\n', 'Sub-heading')}
            className="h-8 px-2 text-xs font-semibold text-stone-700 hover:bg-stone-200/70"
            title="Heading 3 (### Heading)"
          >
            <Heading3 className="w-4 h-4 mr-0.5" />
            H3
          </Button>

          <div className="w-px h-5 bg-stone-300 mx-1" />

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => insertFormatting('\n- ', '\n', 'List item')}
            className="h-8 w-8 p-0 text-stone-700 hover:bg-stone-200/70"
            title="Bullet list (- item)"
          >
            <List className="w-4 h-4" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => insertFormatting('\n1. ', '\n', 'Numbered item')}
            className="h-8 w-8 p-0 text-stone-700 hover:bg-stone-200/70"
            title="Numbered list (1. item)"
          >
            <ListOrdered className="w-4 h-4" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => insertFormatting('\n> ', '\n', 'Inspiring quote or key takeaway')}
            className="h-8 w-8 p-0 text-stone-700 hover:bg-stone-200/70"
            title="Blockquote (> quote)"
          >
            <Quote className="w-4 h-4" />
          </Button>

          <div className="w-px h-5 bg-stone-300 mx-1" />

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleLinkInsert}
            className="h-8 w-8 p-0 text-stone-700 hover:bg-stone-200/70"
            title="Insert link"
          >
            <LinkIcon className="w-4 h-4" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={uploadingImage}
            onClick={() => fileInputRef.current?.click()}
            className="h-8 px-2 text-xs text-stone-700 hover:bg-stone-200/70 flex items-center gap-1"
            title="Upload and insert inline image"
          >
            {uploadingImage ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[hsl(var(--primary))]" />
            ) : (
              <ImageIcon className="w-3.5 h-3.5" />
            )}
            <span>Image</span>
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => insertFormatting('\n\n---\n\n', '', '')}
            className="h-8 w-8 p-0 text-stone-700 hover:bg-stone-200/70"
            title="Horizontal divider (---)"
          >
            <Minus className="w-4 h-4" />
          </Button>
        </div>

        {/* View Mode Switcher (Write / Preview / Split) */}
        <div className="flex items-center bg-stone-200/60 p-0.5 rounded-lg text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('write')}
            className={`px-2.5 py-1 rounded-md font-medium flex items-center gap-1 transition-all ${
              activeTab === 'write'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            Write
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`px-2.5 py-1 rounded-md font-medium flex items-center gap-1 transition-all ${
              activeTab === 'preview'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            Preview
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('split')}
            className={`hidden md:flex px-2.5 py-1 rounded-md font-medium items-center gap-1 transition-all ${
              activeTab === 'split'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            Split
          </button>
        </div>
      </div>

      {/* Editor Body */}
      <div className="relative">
        {/* Write Only */}
        {activeTab === 'write' && (
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Write your article in simple paragraphs. Use the toolbar above to add headings, bullet points, quotes and images..."
            style={{ minHeight }}
            className="w-full p-4 sm:p-6 text-[15px] leading-relaxed text-stone-800 placeholder-stone-400 focus:outline-hidden resize-y font-sans"
          />
        )}

        {/* Preview Only */}
        {activeTab === 'preview' && (
          <div
            style={{ minHeight }}
            className="p-4 sm:p-6 prose prose-stone max-w-none bg-white overflow-y-auto"
            dangerouslySetInnerHTML={{ __html: getRenderedHtml() }}
          />
        )}

        {/* Split View */}
        {activeTab === 'split' && (
          <div className="grid grid-cols-2 divide-x divide-stone-200">
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Write your article here..."
              style={{ minHeight }}
              className="w-full p-4 sm:p-6 text-[15px] leading-relaxed text-stone-800 placeholder-stone-400 focus:outline-hidden resize-y font-sans"
            />
            <div
              style={{ minHeight }}
              className="p-4 sm:p-6 prose prose-stone max-w-none bg-stone-50/30 overflow-y-auto"
              dangerouslySetInnerHTML={{ __html: getRenderedHtml() }}
            />
          </div>
        )}
      </div>

      {/* Footer Stats Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-stone-50/70 border-t border-stone-200 text-xs text-stone-500">
        <div className="flex items-center gap-3">
          <span>{wordCount.toLocaleString()} words</span>
          <span>•</span>
          <span>~{readingTime} min read</span>
        </div>
        <div className="text-[11px] text-stone-400">
          Markdown formatted
        </div>
      </div>

      {/* Hidden file input for inline images */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/svg+xml,image/avif"
        onChange={handleInlineImageUpload}
        className="hidden"
      />
    </div>
  );
}
