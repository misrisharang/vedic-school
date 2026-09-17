// ==============================================================================
// THE VEDIC SCHOOL — BLOG DATA TYPES & SCHEMAS (STAGE 1)
// ==============================================================================

export type BlogCategory = 'vedic-maths' | 'curriculum-support' | 'parenting';

export type BlogStatus = 'draft' | 'published';

export interface BlogFAQItem {
  question: string;
  answer: string;
}

export interface BlogSourceItem {
  publication: string;
  title: string;
  url: string;
  date?: string;
}

export interface Author {
  id: string;
  name: string;
  slug: string;
  bio: string | null;
  role: string | null;
  photo: string | null;
  photo_alt?: string | null;
  linkedin_url?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  featured_image: string | null;
  featured_image_alt?: string | null;
  category: BlogCategory;
  author: string;
  author_id?: string | null;
  author_rel?: Author | null;
  reading_time: number | null;
  status: BlogStatus;
  published_at: string | null;
  is_featured: boolean;
  seo_title: string | null;
  seo_description: string | null;
  tldr?: string[];
  quick_verdict?: string | null;
  sources?: BlogSourceItem[];
  faqs?: BlogFAQItem[];
  created_at: string;
  updated_at: string;
}

export type BlogPostInsert = Omit<BlogPost, 'id' | 'created_at' | 'updated_at'> & {
  id?: string;
  author?: string;
  author_id?: string | null;
  status?: BlogStatus;
  is_featured?: boolean;
  featured_image_alt?: string | null;
  tldr?: string[];
  quick_verdict?: string | null;
  sources?: BlogSourceItem[];
  faqs?: BlogFAQItem[];
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
