// ==============================================================================
// THE VEDIC SCHOOL — ARTICLE LIST DASHBOARD VIEW
// ==============================================================================

import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import type { BlogPost, BlogCategory, BlogStatus } from '@/types/blog';
import { BLOG_CATEGORIES, BLOG_CATEGORY_META } from '@/types/blog';
import { ArticlePreviewModal } from './ArticlePreviewModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Plus,
  Search,
  FileText,
  CheckCircle2,
  Clock,
  Star,
  Edit,
  Eye,
  Trash2,
  Calendar,
  Loader2,
  ExternalLink,
  BookOpen,
} from 'lucide-react';

interface ArticleListProps {
  onNewArticle: () => void;
  onEditArticle: (post: BlogPost) => void;
}

export function ArticleList({ onNewArticle, onEditArticle }: ArticleListProps) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | BlogStatus>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | BlogCategory>('all');

  // Preview & Delete state
  const [previewPost, setPreviewPost] = useState<BlogPost | null>(null);
  const [postToDelete, setPostToDelete] = useState<BlogPost | null>(null);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);

  // Fetch all articles from Supabase (authenticated query returns both drafts & published)
  const loadPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setPosts((data as BlogPost[]) || []);
    } catch (err: any) {
      console.error('[Load Posts Error]', err);
      setError(err?.message || 'Failed to fetch blog posts from database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  // Quick toggle publish/unpublish
  const handleTogglePublish = async (post: BlogPost) => {
    const newStatus: BlogStatus = post.status === 'published' ? 'draft' : 'published';
    setActionInProgress(post.id);
    try {
      const { error: updateError } = await supabase
        .from('blog_posts')
        .update({
          status: newStatus,
          published_at:
            newStatus === 'published' && !post.published_at
              ? new Date().toISOString()
              : post.published_at,
        })
        .eq('id', post.id);

      if (updateError) throw updateError;
      await loadPosts();
    } catch (err: any) {
      alert(`Could not update status: ${err?.message}`);
    } finally {
      setActionInProgress(null);
    }
  };

  // Quick toggle featured
  const handleToggleFeatured = async (post: BlogPost) => {
    const newFeatured = !post.is_featured;
    setActionInProgress(post.id);
    // Optimistic UI update: if setting to true, demote any other featured posts immediately
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === post.id) return { ...p, is_featured: newFeatured };
        if (newFeatured && p.is_featured) return { ...p, is_featured: false };
        return p;
      })
    );
    try {
      const { error: updateError } = await supabase
        .from('blog_posts')
        .update({
          is_featured: newFeatured,
        })
        .eq('id', post.id);

      if (updateError) throw updateError;
      await loadPosts();
    } catch (err: any) {
      alert(`Could not update featured status: ${err?.message}`);
      await loadPosts();
    } finally {
      setActionInProgress(null);
    }
  };

  // Confirm delete
  const handleDelete = async () => {
    if (!postToDelete) return;
    setActionInProgress(postToDelete.id);
    try {
      const { error: delError } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', postToDelete.id);

      if (delError) throw delError;
      setPostToDelete(null);
      await loadPosts();
    } catch (err: any) {
      alert(`Failed to delete post: ${err?.message}`);
    } finally {
      setActionInProgress(null);
    }
  };

  // Metrics summary
  const metrics = useMemo(() => {
    const total = posts.length;
    const published = posts.filter((p) => p.status === 'published').length;
    const drafts = posts.filter((p) => p.status === 'draft').length;
    const featured = posts.filter((p) => p.is_featured && p.status === 'published').length;
    return { total, published, drafts, featured };
  }, [posts]);

  // Filtered posts
  const filteredPosts = useMemo(() => {
    return posts.filter((p) => {
      const matchesSearch =
        !searchQuery.trim() ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.excerpt && p.excerpt.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
      const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [posts, searchQuery, statusFilter, categoryFilter]);

  return (
    <div className="space-y-6">
      {/* Top Header & New Post CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 tracking-tight">
            Blog Articles
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Manage your educational articles, Vedic maths guides, and parenting insights.
          </p>
        </div>

        <Button
          onClick={onNewArticle}
          className="bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/90 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          New Article
        </Button>
      </div>

      {/* Metrics Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
              Total Articles
            </span>
            <div className="text-2xl font-bold text-stone-900 mt-1">{metrics.total}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-stone-600">
            <BookOpen className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-emerald-600 uppercase tracking-wider">
              Published
            </span>
            <div className="text-2xl font-bold text-stone-900 mt-1">{metrics.published}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-amber-600 uppercase tracking-wider">
              Drafts
            </span>
            <div className="text-2xl font-bold text-stone-900 mt-1">{metrics.drafts}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-amber-600 uppercase tracking-wider">
              Featured Hero
            </span>
            <div className="text-2xl font-bold text-stone-900 mt-1">{metrics.featured}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, excerpt or slug..."
              className="pl-9 text-xs h-9 bg-stone-50/50 border-stone-200"
            />
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center bg-stone-100 p-1 rounded-lg text-xs self-start md:self-auto">
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 rounded-md font-medium transition-all ${
                statusFilter === 'all'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              All ({metrics.total})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('published')}
              className={`px-3 py-1 rounded-md font-medium transition-all ${
                statusFilter === 'published'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Published ({metrics.published})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('draft')}
              className={`px-3 py-1 rounded-md font-medium transition-all ${
                statusFilter === 'draft'
                  ? 'bg-white text-amber-800 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Drafts ({metrics.drafts})
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-stone-100 text-xs">
          <span className="text-[11px] font-semibold text-stone-400 mr-1">Categories:</span>
          <button
            type="button"
            onClick={() => setCategoryFilter('all')}
            className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
              categoryFilter === 'all'
                ? 'bg-stone-800 text-white border-stone-800 shadow-xs'
                : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
            }`}
          >
            All
          </button>
          {BLOG_CATEGORIES.map((catKey) => {
            const meta = BLOG_CATEGORY_META[catKey];
            const isSelected = categoryFilter === catKey;
            return (
              <button
                key={catKey}
                type="button"
                onClick={() => setCategoryFilter(catKey)}
                className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
                  isSelected
                    ? `${meta.badgeClass} shadow-xs font-semibold`
                    : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                }`}
              >
                {meta.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Error Notice */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs">
          {error}
        </div>
      )}

      {/* Articles Table / Cards */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center text-stone-500">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-[hsl(var(--primary))]" />
          <p className="text-sm font-medium">Loading blog articles...</p>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center text-stone-500 space-y-3">
          <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-stone-800">
              {posts.length === 0 ? 'No blog articles yet' : 'No articles match your filters'}
            </h3>
            <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
              {posts.length === 0
                ? 'Create your first article to start sharing insights, Vedic maths techniques, and parent guides.'
                : 'Try adjusting your search terms or filter categories to find what you need.'}
            </p>
          </div>
          {posts.length === 0 && (
            <Button
              onClick={onNewArticle}
              size="sm"
              className="mt-2 bg-[hsl(var(--primary))] text-white text-xs"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Create Article
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredPosts.map((post) => {
            const catMeta = BLOG_CATEGORY_META[post.category] || BLOG_CATEGORY_META['vedic-maths'];
            const displayDate = post.published_at
              ? new Date(post.published_at).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })
              : new Date(post.created_at).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                });

            const isProcessing = actionInProgress === post.id;

            return (
              <div
                key={post.id}
                className="bg-white rounded-xl border border-stone-200 p-4 sm:p-5 shadow-xs hover:border-stone-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Left: Info */}
                <div className="space-y-1.5 flex-1 min-w-0">
                  {/* Category, Status, Featured Badges */}
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${catMeta.badgeClass}`}
                    >
                      {catMeta.label}
                    </span>

                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                        post.status === 'published'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {post.status === 'published' ? 'Published' : 'Draft'}
                    </span>

                    {post.is_featured && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-900 border border-amber-300">
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                        Featured
                      </span>
                    )}

                    <span className="text-stone-400 text-[11px] flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.reading_time || 1}m read
                    </span>

                    <span className="text-stone-400 text-[11px] flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {displayDate}
                    </span>
                  </div>

                  {/* Title */}
                  <h3
                    onClick={() => onEditArticle(post)}
                    className="text-base sm:text-lg font-serif font-bold text-stone-900 hover:text-[hsl(var(--primary))] cursor-pointer truncate transition-colors"
                  >
                    {post.title}
                  </h3>

                  {/* Slug and Excerpt */}
                  <div className="text-xs text-stone-500 truncate flex items-center gap-2">
                    <span className="font-mono text-[11px] text-stone-400">/blog/{post.slug}</span>
                    {post.excerpt && (
                      <>
                        <span>•</span>
                        <span className="truncate max-w-md">{post.excerpt}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-1.5 shrink-0 self-end md:self-center pt-2 md:pt-0 border-t md:border-t-0 border-stone-100">
                  {/* Quick Feature Toggle */}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={isProcessing}
                    onClick={() => handleToggleFeatured(post)}
                    className={`h-8 px-2 text-xs ${
                      post.is_featured
                        ? 'text-amber-600 bg-amber-50 hover:bg-amber-100'
                        : 'text-stone-400 hover:text-amber-600'
                    }`}
                    title={post.is_featured ? 'Unfeature article' : 'Feature as hero article'}
                  >
                    <Star
                      className={`w-3.5 h-3.5 ${post.is_featured ? 'fill-amber-500' : ''}`}
                    />
                  </Button>

                  {/* Quick Publish / Unpublish */}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={isProcessing}
                    onClick={() => handleTogglePublish(post)}
                    className={`h-8 px-2.5 text-xs font-medium ${
                      post.status === 'published'
                        ? 'text-stone-600 hover:text-amber-700'
                        : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                    }`}
                  >
                    {post.status === 'published' ? 'Unpublish' : 'Publish'}
                  </Button>

                  {/* Preview Button */}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setPreviewPost(post)}
                    className="h-8 w-8 p-0 text-stone-500 hover:text-stone-800"
                    title="Preview article"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </Button>

                  {/* Edit Button */}
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => onEditArticle(post)}
                    className="h-8 px-3 text-xs font-semibold bg-stone-900 hover:bg-stone-800 text-white"
                  >
                    <Edit className="w-3.5 h-3.5 mr-1" />
                    Edit
                  </Button>

                  {/* Delete Button */}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setPostToDelete(post)}
                    className="h-8 w-8 p-0 text-stone-400 hover:text-red-600 hover:bg-red-50"
                    title="Delete article"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Preview Modal */}
      {previewPost && (
        <ArticlePreviewModal
          open={Boolean(previewPost)}
          onClose={() => setPreviewPost(null)}
          post={previewPost}
        />
      )}

      {/* Delete Confirmation Modal */}
      {postToDelete && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-xl border border-stone-200">
            <h3 className="text-lg font-bold text-stone-900">Delete Article?</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Are you sure you want to permanently delete{' '}
              <strong className="text-stone-900">"{postToDelete.title}"</strong>?
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setPostToDelete(null)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                disabled={Boolean(actionInProgress)}
                onClick={handleDelete}
                className="text-xs bg-red-600 hover:bg-red-700"
              >
                {actionInProgress ? 'Deleting...' : 'Yes, Delete'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
