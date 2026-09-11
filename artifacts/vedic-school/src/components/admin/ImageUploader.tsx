// ==============================================================================
// THE VEDIC SCHOOL — BLOG IMAGE UPLOADER (SUPABASE STORAGE)
// ==============================================================================

import React, { useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { slugify } from '@/lib/blog-slug';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UploadCloud, X, Image as ImageIcon, Loader2, Link as LinkIcon, Check } from 'lucide-react';

interface ImageUploaderProps {
  value: string | null;
  altText?: string;
  onChange: (data: { url: string | null; altText?: string }) => void;
  label?: string;
  helperText?: string;
}

export function ImageUploader({
  value,
  altText = '',
  onChange,
  label = 'Featured Cover Image',
  helperText = 'Recommended: 1200×630px landscape (PNG, JPEG, WebP, max 10MB)',
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [directUrl, setDirectUrl] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    setError(null);

    // Validate type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/avif', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setError('Please upload a valid image file (JPEG, PNG, WebP, SVG, AVIF).');
      return;
    }

    // Validate size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setError('Image size exceeds 10MB limit.');
      return;
    }

    setUploading(true);
    try {
      // Create clean, unique file path
      const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const baseName = file.name.replace(/\.[^/.]+$/, '');
      const cleanName = slugify(baseName) || 'cover';
      const filePath = `covers/${Date.now()}-${cleanName}.${ext}`;

      const { data, error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        console.error('[Storage Upload Error]', uploadError);
        throw new Error(uploadError.message || 'Failed to upload image.');
      }

      // Get public CDN URL
      const {
        data: { publicUrl },
      } = supabase.storage.from('blog-images').getPublicUrl(data.path);

      onChange({
        url: publicUrl,
        altText: altText || baseName.replace(/[-_]/g, ' '),
      });
    } catch (err: any) {
      setError(err?.message || 'Error uploading image to storage.');
    } finally {
      setUploading(false);
    }
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleRemove = () => {
    onChange({ url: null, altText: '' });
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDirectUrlApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!directUrl.trim()) return;
    onChange({
      url: directUrl.trim(),
      altText,
    });
    setShowUrlInput(false);
    setDirectUrl('');
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-xs font-semibold text-[hsl(var(--foreground))]/85">
          {label}
        </Label>
        {!value && (
          <button
            type="button"
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="text-xs text-[hsl(var(--primary))] hover:underline flex items-center gap-1 font-medium"
          >
            <LinkIcon className="w-3 h-3" />
            {showUrlInput ? 'Upload file instead' : 'Enter URL instead'}
          </button>
        )}
      </div>

      {error && (
        <div className="text-xs p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700">
          {error}
        </div>
      )}

      {/* When Image is Present */}
      {value ? (
        <div className="space-y-2.5">
          <div className="relative rounded-xl overflow-hidden border border-stone-200 bg-stone-50 group aspect-video max-h-56 flex items-center justify-center">
            <img
              src={value}
              alt={altText || 'Featured preview'}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-4">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="bg-white/95 text-stone-800 hover:bg-white text-xs shadow"
              >
                Replace Image
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleRemove}
                disabled={uploading}
                className="text-xs shadow"
              >
                <X className="w-3.5 h-3.5 mr-1" />
                Remove
              </Button>
            </div>
          </div>

          {/* Alt text field for SEO/accessibility */}
          <div className="space-y-1">
            <Label className="text-[11px] font-medium text-stone-600">
              Image Alt Text (Accessibility & SEO)
            </Label>
            <Input
              type="text"
              value={altText}
              onChange={(e) => onChange({ url: value, altText: e.target.value })}
              placeholder="Descriptive text for this image..."
              className="text-xs h-8 bg-white border-stone-200"
            />
          </div>
        </div>
      ) : showUrlInput ? (
        /* Direct URL Form */
        <form onSubmit={handleDirectUrlApply} className="flex gap-2">
          <Input
            type="url"
            value={directUrl}
            onChange={(e) => setDirectUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="text-xs bg-white border-stone-200"
          />
          <Button type="submit" size="sm" className="shrink-0 bg-[hsl(var(--primary))] text-white text-xs">
            <Check className="w-3.5 h-3.5 mr-1" />
            Apply
          </Button>
        </form>
      ) : (
        /* Drag & Drop Upload Zone */
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
            isDragOver
              ? 'border-[hsl(var(--primary))] bg-[hsl(var(--primary))]/5'
              : 'border-stone-200 hover:border-stone-300 bg-stone-50/50 hover:bg-stone-50'
          }`}
        >
          {uploading ? (
            <div className="py-4 flex flex-col items-center justify-center gap-2 text-stone-500">
              <Loader2 className="w-6 h-6 animate-spin text-[hsl(var(--primary))]" />
              <p className="text-xs font-medium">Uploading to storage...</p>
            </div>
          ) : (
            <div className="py-3 flex flex-col items-center justify-center gap-1.5 text-stone-500">
              <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 mb-1">
                <UploadCloud className="w-5 h-5" />
              </div>
              <p className="text-xs font-semibold text-stone-700">
                Click to upload <span className="font-normal text-stone-500">or drag and drop</span>
              </p>
              <p className="text-[11px] text-stone-400">{helperText}</p>
            </div>
          )}
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/svg+xml,image/avif"
        onChange={onFileInputChange}
        className="hidden"
      />
    </div>
  );
}
