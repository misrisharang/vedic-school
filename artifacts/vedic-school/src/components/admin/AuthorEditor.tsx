// ==============================================================================
// THE VEDIC SCHOOL — ADMIN AUTHOR EDITOR COMPONENT
// ==============================================================================

import React, { useState, useEffect } from 'react';
import type { Author } from '@/types/blog';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  User,
  ArrowLeft,
  Save,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Upload,
} from 'lucide-react';

interface AuthorEditorProps {
  author: Author | null; // null for creating new author
  onSaveSuccess: (savedAuthor: Author) => void;
  onCancel: () => void;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function AuthorEditor({ author, onSaveSuccess, onCancel }: AuthorEditorProps) {
  const isEditing = Boolean(author?.id);

  const [name, setName] = useState(author?.name || '');
  const [slug, setSlug] = useState(author?.slug || '');
  const [isSlugCustom, setIsSlugCustom] = useState(isEditing);
  const [role, setRole] = useState(author?.role || '');
  const [bio, setBio] = useState(author?.bio || '');
  const [photo, setPhoto] = useState(author?.photo || '');
  const [photoAlt, setPhotoAlt] = useState(author?.photo_alt || '');
  const [linkedinUrl, setLinkedinUrl] = useState(author?.linkedin_url || '');

  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Auto-slugify name unless customized
  useEffect(() => {
    if (!isSlugCustom && name) {
      setSlug(slugify(name));
    }
  }, [name, isSlugCustom]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isSupabaseConfigured) {
      alert('Supabase credentials are not configured for image uploads.');
      return;
    }

    setUploadingImage(true);
    setError(null);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `authors/${Date.now()}-${slugify(name || 'author')}.${fileExt}`;
      const { data, error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('blog-images')
        .getPublicUrl(data.path);

      if (urlData?.publicUrl) {
        setPhoto(urlData.publicUrl);
        if (!photoAlt) {
          setPhotoAlt(`${name}, ${role || 'Educator'}`);
        }
      }
    } catch (err: any) {
      setError(`Image upload failed: ${err.message}`);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!name.trim()) {
      setError('Author name is required.');
      return;
    }

    const cleanSlug = slugify(slug || name);
    if (!cleanSlug) {
      setError('A valid author slug is required.');
      return;
    }

    setSaving(true);

    const authorPayload: Author = {
      id: author?.id || `auth-${Date.now()}`,
      name: name.trim(),
      slug: cleanSlug,
      role: role.trim() || null,
      bio: bio.trim() || null,
      photo: photo.trim() || null,
      photo_alt: photoAlt.trim() || null,
      linkedin_url: linkedinUrl.trim() || null,
      updated_at: new Date().toISOString(),
    };

    try {
      if (isSupabaseConfigured) {
        if (isEditing) {
          const { error: updateError } = await supabase
            .from('authors')
            .update({
              name: authorPayload.name,
              slug: authorPayload.slug,
              role: authorPayload.role,
              bio: authorPayload.bio,
              photo: authorPayload.photo,
              photo_alt: authorPayload.photo_alt,
              linkedin_url: authorPayload.linkedin_url,
              updated_at: authorPayload.updated_at,
            })
            .eq('id', authorPayload.id);

          if (updateError) {
            console.warn('[Author Save] Could not update Supabase authors table (table may not exist yet):', updateError);
          }
        } else {
          const { error: insertError } = await supabase
            .from('authors')
            .insert([{
              name: authorPayload.name,
              slug: authorPayload.slug,
              role: authorPayload.role,
              bio: authorPayload.bio,
              photo: authorPayload.photo,
              photo_alt: authorPayload.photo_alt,
              linkedin_url: authorPayload.linkedin_url,
            }]);

          if (insertError) {
            console.warn('[Author Save] Could not insert to Supabase authors table (table may not exist yet):', insertError);
          }
        }
      }

      setSuccess('Author saved successfully!');
      setTimeout(() => {
        onSaveSuccess(authorPayload);
      }, 500);
    } catch (err: any) {
      setError(err?.message || 'Failed to save author.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Top action bar */}
      <div className="flex items-center justify-between gap-4">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onCancel}
          className="text-xs text-stone-600 hover:text-stone-900"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Back to Authors
        </Button>

        <h2 className="text-lg font-serif font-bold text-stone-900">
          {isEditing ? `Edit Author: ${author?.name}` : 'Create New Author'}
        </h2>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-xs space-y-6">
        {/* Name & Slug */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="author-name" className="text-xs font-semibold text-stone-700">
              Author Full Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="author-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Meenakshi Koul"
              className="text-xs h-9 bg-stone-50/50"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="author-slug" className="text-xs font-semibold text-stone-700">
              URL Slug <span className="text-red-500">*</span>
            </Label>
            <div className="flex items-center">
              <span className="text-stone-400 text-xs px-2.5 py-1.5 bg-stone-100 border border-r-0 border-stone-200 rounded-l-md font-mono">
                /authors/
              </span>
              <Input
                id="author-slug"
                value={slug}
                onChange={(e) => {
                  setSlug(e.target.value);
                  setIsSlugCustom(true);
                }}
                placeholder="meenakshi-koul"
                className="text-xs h-9 rounded-l-none bg-stone-50/50 font-mono"
                required
              />
            </div>
          </div>
        </div>

        {/* Role & LinkedIn */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="author-role" className="text-xs font-semibold text-stone-700">
              Role / Job Title
            </Label>
            <Input
              id="author-role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Founder & Educator, The Vedic School"
              className="text-xs h-9 bg-stone-50/50"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="author-linkedin" className="text-xs font-semibold text-stone-700">
              LinkedIn Profile URL
            </Label>
            <Input
              id="author-linkedin"
              type="url"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              placeholder="https://www.linkedin.com/in/..."
              className="text-xs h-9 bg-stone-50/50 font-mono"
            />
          </div>
        </div>

        {/* Bio */}
        <div className="space-y-1.5">
          <Label htmlFor="author-bio" className="text-xs font-semibold text-stone-700">
            Author Biography & Background
          </Label>
          <Textarea
            id="author-bio"
            rows={5}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Share the educator's teaching experience, educational philosophy, and background..."
            className="text-xs sm:text-sm bg-stone-50/50 leading-relaxed text-stone-800"
          />
          <p className="text-[11px] text-stone-400">
            Displayed on individual blog post bylines and the dedicated public author profile page.
          </p>
        </div>

        {/* Photo Upload & Preview */}
        <div className="space-y-3 pt-4 border-t border-stone-100">
          <Label className="text-xs font-semibold text-stone-700">Author Portrait Photo</Label>
          
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-stone-100 border border-stone-200 overflow-hidden shrink-0 flex items-center justify-center text-stone-400">
              {photo ? (
                <img
                  src={photo}
                  alt={photoAlt || name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-8 h-8" />
              )}
            </div>

            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <Input
                  value={photo}
                  onChange={(e) => setPhoto(e.target.value)}
                  placeholder="/assets/meenakshi-founder-portrait.jpg or Supabase image URL"
                  className="text-xs h-9 bg-stone-50/50 font-mono flex-1"
                />
                
                <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-md text-xs font-medium transition-colors shrink-0">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{uploadingImage ? 'Uploading...' : 'Upload'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                    className="hidden"
                  />
                </label>
              </div>

              <Input
                value={photoAlt}
                onChange={(e) => setPhotoAlt(e.target.value)}
                placeholder="Image alt text (e.g. Meenakshi Koul, founder and educator)"
                className="text-xs h-8 bg-stone-50/50"
              />
            </div>
          </div>
        </div>

        {/* Form actions */}
        <div className="pt-4 border-t border-stone-100 flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onCancel}
            disabled={saving}
            className="text-xs"
          >
            Cancel
          </Button>

          <Button
            type="submit"
            size="sm"
            disabled={saving}
            className="bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/90 text-white text-xs"
          >
            {saving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                Saving Author...
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5 mr-1.5" />
                Save Author Profile
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
