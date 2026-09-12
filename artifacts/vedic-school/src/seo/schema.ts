// ==============================================================================
// THE VEDIC SCHOOL — SCHEMA.ORG / STRUCTURED DATA GRAPH GENERATOR
// ==============================================================================
// Generates Schema.org @graph JSON-LD structures for all public pages.
// Uses stable @id anchors and ensures all absolute URLs derive from SITE_URL.
// Contains NO invented telephone numbers, addresses, ratings, or claims.
// ==============================================================================

import { abs } from './site';
import { VEDIC_MATHS_FAQS, CURRICULUM_ALIGNED_FAQS, FAQItem } from '@/data/faqs';
import { VEDIC_MATHS_VS_ABACUS_FAQS } from '@/data/published-articles';

// ------------------------------------------------------------------------------
// 1. REUSABLE GLOBAL ENTITIES
// ------------------------------------------------------------------------------

/**
 * Primary EducationalOrganization entity representing The Vedic School.
 * @id: abs('/#organization')
 */
export function getEducationalOrganizationEntity() {
  return {
    '@type': 'EducationalOrganization',
    '@id': abs('/#organization'),
    name: 'The Vedic School',
    url: abs('/'),
    logo: {
      '@type': 'ImageObject',
      url: abs('/logo-512.png'),
    },
    description:
      'Teacher-led mathematics education offering Vedic Maths and curriculum-aligned learning, focused on building genuine understanding, fluency, and lasting confidence.',
    email: 'meenakshi@thevedicschool.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Emaar Emerald Estate, Maidawas Road, Sector 65',
      addressLocality: 'Gurugram',
      addressRegion: 'Haryana',
      postalCode: '122101',
      addressCountry: 'IN',
    },
    sameAs: ['https://www.instagram.com/thevedicschool/'],
  };
}

/**
 * Primary WebSite entity.
 * @id: abs('/#website')
 */
export function getWebSiteEntity() {
  return {
    '@type': 'WebSite',
    '@id': abs('/#website'),
    url: abs('/'),
    name: 'The Vedic School',
    description:
      'Teacher-led Vedic Maths and curriculum-aligned classes helping children build genuine understanding, mathematical fluency, and confidence.',
    publisher: {
      '@id': abs('/#organization'),
    },
  };
}

/**
 * Primary Person entity representing educator Meenakshi Koul.
 * @id: abs('/about#meenakshi-koul')
 */
export function getMeenakshiKoulEntity() {
  return {
    '@type': 'Person',
    '@id': abs('/about#meenakshi-koul'),
    name: 'Meenakshi Koul',
    url: abs('/about'),
    jobTitle: 'Founder and Maths Teacher',
    worksFor: {
      '@id': abs('/#organization'),
    },
    sameAs: ['https://www.linkedin.com/in/meenakshi-koul-14b101135/'],
    knowsAbout: [
      'Vedic Maths',
      'Mental calculation',
      'CBSE Mathematics',
      'ICSE Mathematics',
      'IB Mathematics',
    ],
    description:
      'Founder and educator at The Vedic School, dedicated to helping children develop mathematical reasoning, fluency, and confidence through Vedic Maths and curriculum-aligned support.',
  };
}

// ------------------------------------------------------------------------------
// 2. HELPER: WRAP IN SCHEMA.ORG GRAPH
// ------------------------------------------------------------------------------

export function createSchemaGraph(entities: Record<string, unknown>[]) {
  return {
    '@context': 'https://schema.org',
    '@graph': entities,
  };
}

/**
 * Global JSON-LD Entity Graph containing the core canonical entities:
 * - EducationalOrganization (#organization)
 * - WebSite (#website)
 * - Person (#meenakshi-koul)
 */
export function getGlobalEntityGraph() {
  return [
    getEducationalOrganizationEntity(),
    getWebSiteEntity(),
    getMeenakshiKoulEntity(),
  ];
}

/**
 * Global Schema.org graph object ready for JSON-LD script insertion.
 */
export function getGlobalSchema() {
  return createSchemaGraph(getGlobalEntityGraph());
}

// ------------------------------------------------------------------------------
// 3. PAGE-SPECIFIC SCHEMAS
// ------------------------------------------------------------------------------

/**
 * Homepage (/) Schema
 * Contains the global entity graph (EducationalOrganization, WebSite, Person)
 * plus the canonical WebPage entity for the Homepage.
 * Does NOT contain FAQPage, Service, BlogPosting, or ProfilePage.
 */
export function getHomeSchema() {
  return createSchemaGraph([
    getEducationalOrganizationEntity(),
    getWebSiteEntity(),
    getMeenakshiKoulEntity(),
    {
      '@type': 'WebPage',
      '@id': abs('/#webpage'),
      url: abs('/'),
      name: 'The Vedic School — Vedic Maths & Curriculum-Aligned Classes',
      description:
        'Meenakshi Koul teaches Vedic Maths and curriculum-aligned classes across CBSE, ICSE, IB and beyond, in Gurugram and online. Book a free demo class.',
      isPartOf: {
        '@id': abs('/#website'),
      },
      about: {
        '@id': abs('/#organization'),
      },
    },
  ]);
}

/**
 * Vedic Maths (/vedic-maths) Schema
 * Contains WebPage + Service + FAQPage (using exact 5 visible Vedic Maths FAQs).
 * References global #website and #organization without duplicating them.
 */
export function getVedicMathsSchema(faqs: FAQItem[] = VEDIC_MATHS_FAQS) {
  return createSchemaGraph([
    {
      '@type': 'WebPage',
      '@id': abs('/vedic-maths#webpage'),
      url: abs('/vedic-maths'),
      name: 'Vedic Maths Classes | The Vedic School',
      description:
        'Discover how Vedic Maths helps children calculate with speed, develop mental agility, and build genuine number confidence.',
      isPartOf: {
        '@id': abs('/#website'),
      },
      about: {
        '@id': abs('/#organization'),
      },
    },
    {
      '@type': 'Service',
      '@id': abs('/vedic-maths#service'),
      name: 'Vedic Maths Classes',
      serviceType: 'Vedic Mathematics Instruction',
      provider: {
        '@id': abs('/#organization'),
      },
      url: abs('/vedic-maths'),
      description:
        'Teacher-led Vedic Maths classes helping children develop mental calculation skills, flexible thinking, and confidence with numbers.',
    },
    {
      '@type': 'FAQPage',
      '@id': abs('/vedic-maths#faq'),
      isPartOf: {
        '@id': abs('/vedic-maths#webpage'),
      },
      mainEntity: faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    },
  ]);
}

/**
 * Curriculum-Aligned Classes (/curriculum-aligned) Schema
 * Contains WebPage + Service + FAQPage (using exact 5 visible Curriculum FAQs).
 * References global #website and #organization without duplicating them.
 */
export function getCurriculumAlignedSchema(faqs: FAQItem[] = CURRICULUM_ALIGNED_FAQS) {
  return createSchemaGraph([
    {
      '@type': 'WebPage',
      '@id': abs('/curriculum-aligned#webpage'),
      url: abs('/curriculum-aligned'),
      name: 'Curriculum-Aligned Classes | The Vedic School',
      description:
        'Focused Maths teaching aligned with school curriculum (CBSE, ICSE, IB), addressing conceptual gaps and building lasting confidence.',
      isPartOf: {
        '@id': abs('/#website'),
      },
      about: {
        '@id': abs('/#organization'),
      },
    },
    {
      '@type': 'Service',
      '@id': abs('/curriculum-aligned#service'),
      name: 'Curriculum-Aligned Classes',
      serviceType: 'Curriculum Mathematics Tutoring',
      provider: {
        '@id': abs('/#organization'),
      },
      url: abs('/curriculum-aligned'),
      description:
        'Personalised teaching through your child’s school curriculum (CBSE, ICSE, IB) while addressing the conceptual gaps that may be getting in the way.',
    },
    {
      '@type': 'FAQPage',
      '@id': abs('/curriculum-aligned#faq'),
      isPartOf: {
        '@id': abs('/curriculum-aligned#webpage'),
      },
      mainEntity: faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    },
  ]);
}

/**
 * About Page (/about) Schema
 * Contains ProfilePage + canonical Person (Meenakshi Koul).
 * References global #website and #organization without duplicating them.
 */
export function getAboutSchema() {
  return createSchemaGraph([
    getMeenakshiKoulEntity(),
    {
      '@type': 'ProfilePage',
      '@id': abs('/about#webpage'),
      url: abs('/about'),
      name: 'About Meenakshi Koul | The Vedic School',
      description:
        'Learn about Meenakshi Koul, founder and educator at The Vedic School, and her approach to teaching mathematics.',
      isPartOf: {
        '@id': abs('/#website'),
      },
      about: {
        '@id': abs('/#organization'),
      },
      mainEntity: {
        '@id': abs('/about#meenakshi-koul'),
      },
    },
  ]);
}

/**
 * Contact Page (/contact) Schema
 * Contains ContactPage referencing global #website and #organization.
 * Contains NO fake phone numbers, opening hours, or coordinates.
 */
export function getContactSchema() {
  return createSchemaGraph([
    {
      '@type': 'ContactPage',
      '@id': abs('/contact#webpage'),
      url: abs('/contact'),
      name: 'Contact The Vedic School',
      description:
        'Get in touch with Meenakshi Koul at The Vedic School in Gurugram or online for Vedic Maths and curriculum-aligned classes.',
      isPartOf: {
        '@id': abs('/#website'),
      },
      about: {
        '@id': abs('/#organization'),
      },
      mainEntity: {
        '@id': abs('/#organization'),
      },
    },
  ]);
}

/**
 * Blog Hub (/blog) Schema
 * Contains CollectionPage + Blog referencing global #website and #organization.
 * Does NOT contain BlogPosting.
 */
export function getBlogHubSchema() {
  return createSchemaGraph([
    {
      '@type': 'CollectionPage',
      '@id': abs('/blog#webpage'),
      url: abs('/blog'),
      name: 'Insights & Ideas — The Vedic School Blog',
      description:
        'Teacher-authored articles, practical ideas, and guidance for parents who want to understand how their child learns Maths.',
      isPartOf: {
        '@id': abs('/#website'),
      },
      about: {
        '@id': abs('/#organization'),
      },
    },
    {
      '@type': 'Blog',
      '@id': abs('/blog#blog'),
      url: abs('/blog'),
      name: 'The Vedic School Blog',
      description:
        'Practical ideas and insights for a calmer, more confident Maths journey.',
      isPartOf: {
        '@id': abs('/#website'),
      },
      publisher: {
        '@id': abs('/#organization'),
      },
    },
  ]);
}

export interface BlogPostSchemaInput {
  slug: string;
  title: string;
  excerpt?: string | null;
  seo_description?: string | null;
  featured_image?: string | null;
  published_at?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  author?: string | null;
}

/**
 * Published Blog Article (/blog/:slug) Schema
 * Contains BlogPosting linked to Author (Person) and Publisher (EducationalOrganization).
 */
export function getBlogPostSchema(post: BlogPostSchemaInput) {
  const canonicalUrl = abs(`/blog/${post.slug}`);
  const description =
    post.seo_description || post.excerpt || 'Practical ideas and insights from The Vedic School.';

  return createSchemaGraph([
    {
      '@type': 'WebPage',
      '@id': `${canonicalUrl}#webpage`,
      url: canonicalUrl,
      name: `${post.title} | The Vedic School`,
      description,
      isPartOf: {
        '@id': abs('/#website'),
      },
      about: {
        '@id': abs('/#organization'),
      },
    },
    {
      '@type': 'BlogPosting',
      '@id': `${canonicalUrl}#article`,
      url: canonicalUrl,
      headline: post.title,
      description,
      image: post.featured_image ? [post.featured_image] : undefined,
      datePublished: post.published_at || post.created_at,
      dateModified: post.updated_at || post.published_at || post.created_at,
      author: {
        '@id': abs('/about#meenakshi-koul'),
      },
      publisher: {
        '@id': abs('/#organization'),
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `${canonicalUrl}#webpage`,
      },
      isPartOf: {
        '@id': abs('/#website'),
      },
    },
  ]);
}

/**
 * Vedic Maths vs Abacus Article (/blog/vedic-maths-vs-abacus) Schema
 * Full Schema.org graph matching exact user specifications:
 * - WebPage
 * - BreadcrumbList
 * - FAQPage (11 FAQs)
 * - BlogPosting
 * Zero hardcoded Netlify URLs. References canonical #organization, #website, and #meenakshi-koul.
 */
export function getVedicMathsVsAbacusArticleSchema() {
  const articleUrl = abs('/blog/vedic-maths-vs-abacus');
  const imageUrl = abs('/og/vedic-maths-vs-abacus.jpg');

  return createSchemaGraph([
    {
      '@type': 'WebPage',
      '@id': `${articleUrl}#webpage`,
      url: articleUrl,
      name: 'Vedic Maths vs Abacus: Which Is Better? (Teacher + Reddit)',
      isPartOf: {
        '@id': abs('/#website'),
      },
      breadcrumb: {
        '@id': `${articleUrl}#breadcrumb`,
      },
      primaryImageOfPage: {
        '@type': 'ImageObject',
        url: imageUrl,
      },
      inLanguage: 'en',
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${articleUrl}#breadcrumb`,
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: abs('/'),
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Blog',
          item: abs('/blog'),
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'Vedic Maths vs Abacus',
        },
      ],
    },
    {
      '@type': 'FAQPage',
      '@id': `${articleUrl}#faq`,
      isPartOf: {
        '@id': `${articleUrl}#webpage`,
      },
      mainEntity: VEDIC_MATHS_VS_ABACUS_FAQS.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    },
    {
      '@type': 'BlogPosting',
      '@id': `${articleUrl}#article`,
      headline:
        "Vedic Maths vs Abacus: Which Is Better for Your Child? A Maths Teacher's Honest Comparison",
      description:
        'A Maths teacher compares Vedic Maths and abacus: what each trains, the right age, what research and Reddit parents say, and how to choose.',
      image: {
        '@type': 'ImageObject',
        url: imageUrl,
        width: 1200,
        height: 630,
      },
      datePublished: '2026-09-12',
      dateModified: '2026-09-12',
      inLanguage: 'en',
      articleSection: 'Guides',
      keywords: [
        'vedic maths vs abacus',
        'abacus or vedic maths which is better',
        'difference between abacus and vedic maths',
        'is vedic maths and abacus same',
        'vedic maths vs abacus reddit',
      ],
      author: {
        '@id': abs('/about#meenakshi-koul'),
      },
      publisher: {
        '@id': abs('/#organization'),
      },
      mainEntityOfPage: {
        '@id': `${articleUrl}#webpage`,
      },
      isPartOf: {
        '@id': abs('/#website'),
      },
      about: [
        {
          '@type': 'Thing',
          name: 'Abacus',
          sameAs: 'https://en.wikipedia.org/wiki/Abacus',
        },
        {
          '@type': 'Thing',
          name: 'Vedic Mathematics',
          sameAs: 'https://en.wikipedia.org/wiki/Vedic_Mathematics',
        },
      ],
      mentions: [
        {
          '@type': 'Thing',
          name: 'Soroban',
          sameAs: 'https://en.wikipedia.org/wiki/Soroban',
        },
        {
          '@type': 'Person',
          name: 'Bharati Krishna Tirtha',
          sameAs: 'https://en.wikipedia.org/wiki/Bharati_Krishna_Tirtha',
        },
      ],
      citation: [
        {
          '@type': 'ScholarlyArticle',
          name: 'Learning Mathematics in a Visuospatial Format: A Randomized, Controlled Trial of Mental Abacus Instruction',
          datePublished: '2016',
          isPartOf: {
            '@type': 'Periodical',
            name: 'Child Development',
          },
          url: 'https://academic.oup.com/chidev/article/87/4/1146/8258418',
        },
        {
          '@type': 'ScholarlyArticle',
          name: 'A One-Year Classroom-Randomized Trial of Mental Abacus Instruction for First- and Second-Grade Students',
          datePublished: '2018',
          isPartOf: {
            '@type': 'Periodical',
            name: 'Journal of Numerical Cognition',
          },
          url: 'https://jnc.psychopen.eu/index.php/jnc/article/download/5761/5761.html?inline=1',
        },
        {
          '@type': 'ScholarlyArticle',
          name: 'Training on Abacus-Based Mental Calculation Enhances Visuospatial Working Memory in Children',
          datePublished: '2019',
          isPartOf: {
            '@type': 'Periodical',
            name: 'Journal of Neuroscience',
          },
          url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC6697396/',
        },
      ],
    },
  ]);
}

/**
 * Legal Pages (/privacy-policy, /terms-of-service, /cookie-policy) Schema
 * Contains clean WebPage entity.
 */
export function getLegalPageSchema(path: string, title: string, description: string) {
  const canonicalUrl = abs(path);
  return createSchemaGraph([
    {
      '@type': 'WebPage',
      '@id': `${canonicalUrl}#webpage`,
      url: canonicalUrl,
      name: `${title} | The Vedic School`,
      description,
      isPartOf: {
        '@id': abs('/#website'),
      },
    },
  ]);
}
