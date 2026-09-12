// ==============================================================================
// THE VEDIC SCHOOL — PUBLIC BLOG INDEX PAGE (/blog)
// ==============================================================================

import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'wouter';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { BlogPost, BlogCategory } from '@/types/blog';
import { BLOG_CATEGORY_META } from '@/types/blog';
import { getBlogImageUrl, fetchPublishedBlogPosts } from '@/lib/blog';
import {
  Search,
  X,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  Clock,
  Calendar,
  User,
  BookOpen,
  Loader2,
} from 'lucide-react';
import { Seo } from '@/seo/Seo';
import { getBlogHubSchema } from '@/seo/schema';

const POSTS_PER_PAGE = 6;

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [featuredPost, setFeaturedPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters, Search, Sort & Pagination
  const [selectedCategory, setSelectedCategory] = useState<'all' | BlogCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'latest' | 'oldest'>('latest');
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch published blog posts
  useEffect(() => {
    async function loadBlogData() {
      setLoading(true);
      setError(null);

      try {
        const { posts: published, error: fetchErr } = await fetchPublishedBlogPosts();
        if (fetchErr && published.length === 0) {
          setError(fetchErr);
        } else {
          setPosts(published);
          const featured =
            published.find((p) => p.is_featured) || (published.length > 0 ? published[0] : null);
          setFeaturedPost(featured);
        }
      } catch (err: any) {
        console.error('[Blog Load Error]', err);
        setError(err?.message || 'Failed to load blog posts.');
      } finally {
        setLoading(false);
      }
    }

    loadBlogData();
  }, []);

  // Filter posts (excluding featured from main grid when viewing All without search)
  const filteredPosts = useMemo(() => {
    return posts.filter((p) => {
      // If a featured post is highlighted at top, exclude it from grid in "All" view without search
      if (!searchQuery.trim() && selectedCategory === 'all' && featuredPost && p.id === featuredPost.id) {
        return false;
      }

      const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;

      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        (p.excerpt && p.excerpt.toLowerCase().includes(q)) ||
        p.slug.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [posts, selectedCategory, searchQuery, featuredPost]);

  // Sort posts by published_at (or created_at)
  const sortedAndFilteredPosts = useMemo(() => {
    return [...filteredPosts].sort((a, b) => {
      const dateA = new Date(a.published_at || a.created_at).getTime();
      const dateB = new Date(b.published_at || b.created_at).getTime();
      return sortOrder === 'latest' ? dateB - dateA : dateA - dateB;
    });
  }, [filteredPosts, sortOrder]);

  // Pagination calculation
  const totalPages = Math.ceil(sortedAndFilteredPosts.length / POSTS_PER_PAGE);
  const paginatedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
    return sortedAndFilteredPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);
  }, [sortedAndFilteredPosts, currentPage]);

  // Reset to page 1 on category filter, search, or sort change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery, sortOrder]);

  const categoriesList: Array<{ id: 'all' | BlogCategory; label: string }> = [
    { id: 'all', label: 'All' },
    { id: 'vedic-maths', label: 'Vedic Maths' },
    { id: 'curriculum-support', label: 'Curriculum Support' },
    { id: 'parenting', label: 'Parenting' },
  ];

  // Helper to generate compact, responsive page numbers
  const pageNumbers = useMemo(() => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (currentPage <= 3) {
      return [1, 2, 3, 4, '...', totalPages];
    }
    if (currentPage >= totalPages - 2) {
      return [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }
    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  }, [currentPage, totalPages]);

  return (
    <div className="bg-[hsl(var(--background))] min-h-screen">
      <Seo
        title="Insights & Ideas | The Vedic School Blog"
        description="Practical ideas and insights for a calmer, more confident Maths journey."
        path="/blog"
        schema={getBlogHubSchema()}
      />
      {/* Top Hero Section with Approved Decorative Background */}
      <section className="relative overflow-hidden pt-28 pb-10 sm:pb-14 border-b border-stone-200/70">
        {/* Decorative Background Elements from Approved Reference */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none">
          {/* Soft Light Sage organic circle entering from top edge (upper-middle) */}
          <div
            className="absolute -top-28 right-1/4 w-[360px] h-[360px] sm:w-[460px] sm:h-[460px] rounded-full opacity-60 blur-2xl transition-all"
            style={{ backgroundColor: 'hsl(var(--block-sage-light))' }}
          />

          {/* Soft Light Peach/Terracotta organic circle (upper-right) */}
          <div
            className="absolute -top-16 -right-12 w-[320px] h-[320px] sm:w-[420px] sm:h-[420px] rounded-full opacity-70 blur-2xl transition-all"
            style={{ backgroundColor: 'hsl(var(--block-terracotta-light))' }}
          />

          {/* Thin curved sweeping line between forms */}
          <svg
            className="absolute top-0 right-0 w-[420px] h-[280px] sm:w-[560px] sm:h-[340px] opacity-35 text-[hsl(var(--primary))]"
            viewBox="0 0 560 340"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M140 -40 C 260 60, 380 180, 520 280"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M240 -20 C 340 100, 440 160, 560 220"
              stroke="currentColor"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
          </svg>

          {/* Floating decorative typography in upper-right area */}
          <div className="absolute top-6 right-6 sm:right-16 hidden xl:block select-none text-right rotate-[5deg]">
            <p className="font-serif italic text-lg lg:text-xl text-[hsl(var(--primary))]/75 leading-tight font-medium tracking-wide">
              Calmer<br />
              Brighter<br />
              Stronger<br />
              <span className="text-xs font-sans not-italic font-normal text-stone-500">in Maths</span>
            </p>
          </div>
        </div>

        {/* Hero Content Container */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 max-w-6xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            {/* Left: Heading & Intro */}
            <div className="max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[hsl(var(--primary))]">
                <span>Insights & Ideas</span>
                <span>•</span>
                <span>The Vedic School Blog</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-stone-900 tracking-tight leading-tight">
                Practical ideas for a calmer, more confident Maths journey.
              </h1>

              <p className="text-base sm:text-lg text-stone-600 font-sans leading-relaxed">
                Practical ideas, expert insights and real stories to support your child's Maths journey.
              </p>
            </div>

            {/* Right: Search Input */}
            <div className="w-full md:w-80 space-y-3 shrink-0">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search articles..."
                  className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-white/90 backdrop-blur-xs border border-stone-200 text-xs sm:text-sm text-stone-800 placeholder-stone-400 focus:outline-hidden focus:border-[hsl(var(--primary))] shadow-xs"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-1"
                    title="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Category Navigation Tabs */}
          <div className="mt-8 sm:mt-12 flex items-center gap-1 sm:gap-2 border-b border-stone-200 overflow-x-auto no-scrollbar">
            {categoriesList.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`pb-3 px-3 sm:px-4 text-xs sm:text-sm font-semibold transition-all relative whitespace-nowrap ${
                    isActive
                      ? 'text-[hsl(var(--primary))]'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {cat.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[hsl(var(--primary))] rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-10 sm:py-14">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl space-y-12">
          {/* Loading Indicator */}
          {loading && (
            <div className="py-20 text-center text-stone-500">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-[hsl(var(--primary))]" />
              <p className="text-sm font-medium">Loading articles...</p>
            </div>
          )}

          {/* Error Notice */}
          {!loading && error && (
            <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
              Unable to load blog articles at this time. Please try again shortly.
            </div>
          )}

          {/* Featured Article Card (Shown when on "All" tab and no active search query) */}
          {!loading && !searchQuery.trim() && selectedCategory === 'all' && featuredPost && (
            <div className="relative rounded-3xl overflow-hidden bg-[hsl(var(--block-terracotta-light))] border border-[#E6C5B9] shadow-sm hover:shadow-md transition-shadow">
              <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
                {/* Featured Cover Image (Left half) */}
                <div className="lg:col-span-6 relative aspect-16/10 lg:aspect-auto min-h-[260px] lg:min-h-[340px] bg-[#EED1C7]">
                  {featuredPost.featured_image ? (
                    <img
                      src={getBlogImageUrl(featuredPost.featured_image) || featuredPost.featured_image}
                      alt={featuredPost.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center text-[hsl(var(--primary))]/70">
                      <BookOpen className="w-12 h-12 mb-2 stroke-1" />
                      <span className="font-serif italic text-sm">The Vedic School Insights</span>
                    </div>
                  )}
                </div>

                {/* Featured Content (Right half) */}
                <div className="lg:col-span-6 p-6 sm:p-10 flex flex-col justify-between space-y-6">
                  <div className="space-y-3">
                    <div className="inline-flex items-center gap-2">
                      <span className="text-[11px] font-bold tracking-wider uppercase text-[hsl(var(--primary))]">
                        FEATURED
                      </span>
                      <span>•</span>
                      <span className="text-[11px] font-semibold text-stone-700">
                        {BLOG_CATEGORY_META[featuredPost.category]?.label || 'Vedic Maths'}
                      </span>
                    </div>

                    <Link href={`/blog/${featuredPost.slug}`}>
                      <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 hover:text-[hsl(var(--primary))] transition-colors tracking-tight leading-tight">
                        {featuredPost.title}
                      </h2>
                    </Link>

                    {featuredPost.excerpt && (
                      <p className="text-sm sm:text-base text-stone-700 font-sans leading-relaxed line-clamp-3">
                        {featuredPost.excerpt}
                      </p>
                    )}
                  </div>

                  {/* Byline & Circular Arrow Action */}
                  <div className="pt-4 border-t border-[#E6C5B9] flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 text-xs">
                      <div className="w-9 h-9 rounded-full bg-white/80 border border-[#E6C5B9] flex items-center justify-center text-[hsl(var(--primary))] font-semibold">
                        <User className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold text-stone-900">{featuredPost.author || 'Meenakshi Koul'}</div>
                        <div className="text-[11px] text-stone-600">
                          Founder • The Vedic School
                          {featuredPost.published_at && (
                            <>
                              <span className="mx-1.5">•</span>
                              {new Date(featuredPost.published_at).toLocaleDateString('en-GB', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <Link
                      href={`/blog/${featuredPost.slug}`}
                      className="w-10 h-10 rounded-full bg-[hsl(var(--primary))] text-white flex items-center justify-center hover:bg-[hsl(var(--primary))]/90 hover:scale-105 transition-all shadow-xs shrink-0"
                      aria-label={`Read article: ${featuredPost.title}`}
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Section Header with Sort by Control matching Reference */}
          {!loading && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-3">
              <div className="flex items-baseline gap-2.5">
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 tracking-tight">
                  {selectedCategory === 'all'
                    ? 'All blog posts'
                    : `${BLOG_CATEGORY_META[selectedCategory]?.label} articles`}
                </h2>

                <span className="text-xs text-stone-500 font-medium">
                  ({sortedAndFilteredPosts.length})
                </span>
              </div>

              {/* Sort by Dropdown */}
              <div className="flex items-center gap-2 text-xs self-start sm:self-auto">
                <span className="text-stone-500 font-medium whitespace-nowrap">Sort by</span>
                <div className="relative">
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value as 'latest' | 'oldest')}
                    className="appearance-none bg-white border border-stone-200 text-stone-800 text-xs font-medium pl-3 pr-8 py-1.5 rounded-xl shadow-2xs hover:border-stone-300 focus:outline-hidden focus:border-[hsl(var(--primary))] cursor-pointer transition-colors"
                  >
                    <option value="latest">Latest first</option>
                    <option value="oldest">Oldest first</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                </div>
              </div>
            </div>
          )}

          {/* Empty State: Zero Published Posts in Database */}
          {!loading && !searchQuery.trim() && posts.length === 0 && (
            <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center max-w-lg mx-auto space-y-4 shadow-xs">
              <div className="w-14 h-14 rounded-2xl bg-[hsl(var(--block-sage-light))] text-[#2E4A2C] flex items-center justify-center mx-auto">
                <BookOpen className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-serif font-bold text-stone-900">
                New articles are on the way
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Meenakshi Koul is currently writing practical insights on Vedic maths, curriculum confidence, and parenting strategies. Check back soon.
              </p>
              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/vedic-maths"
                  className="text-xs font-semibold text-[hsl(var(--primary))] hover:underline"
                >
                  Explore Vedic Maths →
                </Link>
                <span className="text-stone-300">•</span>
                <Link
                  href="/curriculum-aligned"
                  className="text-xs font-semibold text-[hsl(var(--primary))] hover:underline"
                >
                  Curriculum-Aligned Maths →
                </Link>
              </div>
            </div>
          )}

          {/* Empty State: Search or category filter produced 0 results */}
          {!loading && searchQuery.trim() && sortedAndFilteredPosts.length === 0 && (
            <div className="bg-white rounded-3xl border border-stone-200 p-10 text-center max-w-md mx-auto space-y-3 shadow-xs">
              <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
                <Search className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-serif font-bold text-stone-900">
                No matching articles found
              </h3>
              <p className="text-xs text-stone-500">
                We couldn't find any published articles matching "{searchQuery}".
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="mt-2 text-xs font-semibold text-[hsl(var(--primary))] hover:underline"
              >
                Reset search and filters
              </button>
            </div>
          )}

          {/* Articles Grid */}
          {!loading && paginatedPosts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {paginatedPosts.map((post) => {
                const catMeta = BLOG_CATEGORY_META[post.category] || BLOG_CATEGORY_META['vedic-maths'];
                const imageUrl = getBlogImageUrl(post.featured_image) || post.featured_image;

                const displayDate = post.published_at
                  ? new Date(post.published_at).toLocaleDateString('en-GB', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  : '';

                return (
                  <article
                    key={post.id}
                    className="group bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md hover:border-stone-300 transition-all flex flex-col justify-between h-full"
                  >
                    <div>
                      {/* Cover Photo */}
                      <Link href={`/blog/${post.slug}`} className="block relative aspect-16/10 overflow-hidden bg-stone-100">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-[hsl(var(--block-sage-light))]/50 text-[#2E4A2C]/60">
                            <BookOpen className="w-8 h-8 stroke-1" />
                          </div>
                        )}
                      </Link>

                      {/* Content Details */}
                      <div className="p-5 sm:p-6 space-y-3">
                        {/* Category Badge */}
                        <div>
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${catMeta.badgeClass}`}
                          >
                            {catMeta.label}
                          </span>
                        </div>

                        {/* Title */}
                        <Link href={`/blog/${post.slug}`}>
                          <h3 className="text-lg sm:text-xl font-serif font-bold text-stone-900 group-hover:text-[hsl(var(--primary))] transition-colors tracking-tight leading-snug line-clamp-2">
                            {post.title}
                          </h3>
                        </Link>

                        {/* Excerpt */}
                        {post.excerpt && (
                          <p className="text-xs sm:text-sm text-stone-600 font-sans leading-relaxed line-clamp-3">
                            {post.excerpt}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Card Footer: Author & Read More */}
                    <div className="px-5 sm:px-6 pb-5 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 text-[10px] font-semibold">
                          <User className="w-3 h-3" />
                        </div>
                        <div className="text-[11px]">
                          <span className="font-semibold text-stone-800 block">{post.author || 'Meenakshi Koul'}</span>
                          <span>{displayDate}</span>
                        </div>
                      </div>

                      <Link
                        href={`/blog/${post.slug}`}
                        className="inline-flex items-center text-xs font-semibold text-[hsl(var(--primary))] group-hover:translate-x-0.5 transition-transform"
                      >
                        <span>Read</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {/* Pagination Controls matching Reference [ ← ] 1 2 3 4 5 [ → ] */}
          {!loading && totalPages > 1 && (
            <nav
              aria-label="Blog pagination"
              className="pt-10 flex items-center justify-center gap-1.5 sm:gap-2 select-none"
            >
              {/* Previous Arrow */}
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => {
                  setCurrentPage((p) => Math.max(1, p - 1));
                  window.scrollTo({ top: 380, behavior: 'smooth' });
                }}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-stone-200 bg-white flex items-center justify-center text-stone-600 disabled:opacity-30 disabled:pointer-events-none hover:bg-stone-50 transition-colors shadow-2xs"
                aria-label="Previous page"
              >
                <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>

              {/* Numbered Page Buttons */}
              {pageNumbers.map((page, idx) => {
                if (typeof page !== 'number') {
                  return (
                    <span
                      key={`ellipsis-${idx}`}
                      className="px-1.5 text-stone-400 text-xs select-none"
                    >
                      …
                    </span>
                  );
                }

                const isCurrent = page === currentPage;
                return (
                  <button
                    key={page}
                    type="button"
                    onClick={() => {
                      setCurrentPage(page);
                      window.scrollTo({ top: 380, behavior: 'smooth' });
                    }}
                    className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full text-xs font-semibold transition-all ${
                      isCurrent
                        ? 'bg-[hsl(var(--primary))] text-white shadow-xs'
                        : 'text-stone-700 hover:bg-stone-100 border border-transparent'
                    }`}
                    aria-current={isCurrent ? 'page' : undefined}
                  >
                    {page}
                  </button>
                );
              })}

              {/* Next Arrow */}
              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => {
                  setCurrentPage((p) => Math.min(totalPages, p + 1));
                  window.scrollTo({ top: 380, behavior: 'smooth' });
                }}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-stone-200 bg-white flex items-center justify-center text-stone-600 disabled:opacity-30 disabled:pointer-events-none hover:bg-stone-50 transition-colors shadow-2xs"
                aria-label="Next page"
              >
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </nav>
          )}
        </div>
      </section>
    </div>
  );
}
