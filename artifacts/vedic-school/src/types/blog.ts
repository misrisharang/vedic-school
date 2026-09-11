// ==============================================================================
// THE VEDIC SCHOOL — BLOG DATA TYPES & SCHEMAS (STAGE 1)
// ==============================================================================

export type BlogCategory = 'vedic-maths' | 'curriculum-support' | 'parenting';

export type BlogStatus = 'draft' | 'published';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  featured_image: string | null;
  category: BlogCategory;
  author: string;
  reading_time: number | null;
  status: BlogStatus;
  published_at: string | null;
  is_featured: boolean;
  seo_title: string | null;
  seo_description: string | null;
  created_at: string;
  updated_at: string;
}

export type BlogPostInsert = Omit<BlogPost, 'id' | 'created_at' | 'updated_at'> & {
  id?: string;
  author?: string;
  status?: BlogStatus;
  is_featured?: boolean;
};

export type BlogPostUpdate = Partial<BlogPostInsert>;

export interface BlogCategoryMeta {
  id: BlogCategory;
  label: string;
  description: string;
  badgeClass: string;
}

export const BLOG_CATEGORIES: readonly BlogCategory[] = [
  'vedic-maths',
  'curriculum-support',
  'parenting',
] as const;

export const BLOG_CATEGORY_META: Record<BlogCategory, BlogCategoryMeta> = {
  'vedic-maths': {
    id: 'vedic-maths',
    label: 'Vedic Maths',
    description: 'Practical mental math techniques, speed tricks, and foundational number sense.',
    badgeClass: 'bg-[hsl(var(--block-sage-light))] text-[#2E4A2C] border-[#B7D2B5]',
  },
  'curriculum-support': {
    id: 'curriculum-support',
    label: 'Curriculum Support',
    description: 'School syllabus alignment, exam readiness, and bridging classroom confidence.',
    badgeClass: 'bg-[hsl(var(--block-terracotta-light))] text-[#8C3415] border-[#E6C5B9]',
  },
  'parenting': {
    id: 'parenting',
    label: 'Parenting',
    description: 'Encouraging growth mindsets, supporting homework challenges, and reducing math anxiety.',
    badgeClass: 'bg-[hsl(var(--block-terracotta-light))] text-[#8C3415] border-[#E6C5B9]',
  },
};
