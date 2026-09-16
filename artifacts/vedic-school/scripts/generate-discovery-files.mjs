// ==============================================================================
// THE VEDIC SCHOOL — DISCOVERY FILES GENERATOR
// ==============================================================================
// Generates robots.txt, sitemap.xml, llm.txt, and llms.txt using canonical SITE_URL.
// Supports dynamic blog articles from Supabase and strict XML validation.
// ==============================================================================

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PUBLIC_DIR = path.resolve(__dirname, '../public');
const DIST_PUBLIC_DIR = path.resolve(__dirname, '../dist/public');

// Read environment variables (supports .env and .env.local)
function loadEnv() {
  const env = { ...process.env };
  const envFiles = [
    path.resolve(__dirname, '../.env'),
    path.resolve(__dirname, '../.env.local'),
  ];
  for (const f of envFiles) {
    if (fs.existsSync(f)) {
      const content = fs.readFileSync(f, 'utf-8');
      for (const line of content.split('\n')) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
          const idx = trimmed.indexOf('=');
          const k = trimmed.slice(0, idx).trim();
          const v = trimmed.slice(idx + 1).trim();
          if (!env[k]) {
            env[k] = v;
          }
        }
      }
    }
  }
  return env;
}

const env = loadEnv();
const SITE_URL = (env.VITE_SITE_URL || 'https://www.thevedicschool.com').replace(/\/+$/, '');

// Static public routes
const STATIC_PUBLIC_ROUTES = [
  '/',
  '/vedic-maths',
  '/curriculum-aligned',
  '/about',
  '/contact',
  '/blog',
  '/blog/vedic-maths-vs-abacus',
  '/blog/is-vedic-maths-useful',
  '/blog/best-vedic-maths-online-classes-for-kids',
  '/privacy-policy',
  '/terms-of-service',
  '/cookie-policy',
];

// Fetch published blog slugs from Supabase
async function fetchPublishedBlogSlugs() {
  const supabaseUrl = env.VITE_SUPABASE_URL;
  const supabaseKey = env.VITE_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return [];
  }

  try {
    const res = await fetch(
      `${supabaseUrl}/rest/v1/blog_posts?select=slug&status=eq.published`,
      {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
      }
    );
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        return data.map((item) => `/blog/${item.slug}`);
      }
    }
  } catch (err) {
    console.warn('[discovery] Supabase query for blog slugs skipped:', err.message);
  }
  return [];
}

async function main() {
  console.log('Generating discovery files with SITE_URL:', SITE_URL);

  const dynamicBlogRoutes = await fetchPublishedBlogSlugs();
  const allRoutes = Array.from(new Set([...STATIC_PUBLIC_ROUTES, ...dynamicBlogRoutes]));

  // 1. Generate sitemap.xml
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes.map(route => {
  const loc = route === '/' ? `${SITE_URL}/` : `${SITE_URL}${route}`;
  return `  <url>\n    <loc>${loc}</loc>\n  </url>`;
}).join('\n')}
</urlset>
`;

  // Validate sitemap XML structure before writing
  if (!sitemapXml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')) {
    throw new Error('Sitemap XML validation failed: Missing XML declaration');
  }
  if (!sitemapXml.includes('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')) {
    throw new Error('Sitemap XML validation failed: Missing urlset namespace');
  }
  if (!sitemapXml.trimEnd().endsWith('</urlset>')) {
    throw new Error('Sitemap XML validation failed: Unclosed urlset tag');
  }
  if (sitemapXml.includes('<!DOCTYPE') || sitemapXml.includes('<html')) {
    throw new Error('Sitemap XML validation failed: HTML tags detected in XML sitemap');
  }

  // Write to public/
  fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), sitemapXml, 'utf8');
  console.log(`✓ Generated public/sitemap.xml (${allRoutes.length} URLs)`);

  // Also write to dist/public/ if it already exists
  if (fs.existsSync(DIST_PUBLIC_DIR)) {
    fs.writeFileSync(path.join(DIST_PUBLIC_DIR, 'sitemap.xml'), sitemapXml, 'utf8');
    console.log(`✓ Synchronized dist/public/sitemap.xml (${allRoutes.length} URLs)`);
  }

  // 2. Generate robots.txt
  const robotsTxt = `User-agent: *
Allow: /
Disallow: /admin

Sitemap: ${SITE_URL}/sitemap.xml
`;

  fs.writeFileSync(path.join(PUBLIC_DIR, 'robots.txt'), robotsTxt, 'utf8');
  console.log('✓ Generated public/robots.txt');
  if (fs.existsSync(DIST_PUBLIC_DIR)) {
    fs.writeFileSync(path.join(DIST_PUBLIC_DIR, 'robots.txt'), robotsTxt, 'utf8');
    console.log('✓ Synchronized dist/public/robots.txt');
  }

  // 3. Generate llm.txt and llms.txt
  const llmTxt = `# The Vedic School

> Teacher-led mathematics education providing Vedic Maths and curriculum-aligned Maths, focused on building genuine understanding, fluency, and lasting confidence.

The Vedic School is a learning institution founded and taught by Meenakshi Koul. The school offers two core paths: Vedic Maths classes that develop number sense, mental calculation fluency, and confidence, and curriculum-aligned Maths across CBSE, ICSE, IB, and international curricula that help students develop understanding and apply that understanding to schoolwork and exams. Vedic Maths does not replace mathematical understanding; it builds on it.

## About

- [About Meenakshi Koul](${SITE_URL}/about): Academic authority, 20+ years of teaching experience, educational philosophy, and the diagnostic teaching methodology behind The Vedic School.

## Programs

- [Vedic Maths](${SITE_URL}/vedic-maths): Structured mental mathematics and Vedic calculation methods to build number fluency, speed, and confidence.
- [Curriculum-Aligned Maths](${SITE_URL}/curriculum-aligned): Personalised school curriculum support (CBSE, ICSE, IB, and international curricula) from primary through senior grades.

## Resources

- [The Vedic School Blog](${SITE_URL}/blog): Articles and practical insights on mathematics education, learning strategies, and parent guidance.
- [Vedic Maths vs Abacus: Which Is Better for Your Child?](${SITE_URL}/blog/vedic-maths-vs-abacus): A comprehensive, honest comparison of Vedic Maths and Abacus methods, pedagogical foundations, age suitability, and school curriculum alignment.

## Contact

- [Contact The Vedic School](${SITE_URL}/contact): Inquiries, consultations, and class admissions.

## Policies

- [Privacy Policy](${SITE_URL}/privacy-policy): How personal information and student data are handled.
- [Terms of Service](${SITE_URL}/terms-of-service): Terms and conditions for using The Vedic School website and services.
- [Cookie Policy](${SITE_URL}/cookie-policy): Details on cookies and tracking technologies used on the site.
`;

  fs.writeFileSync(path.join(PUBLIC_DIR, 'llm.txt'), llmTxt, 'utf8');
  fs.writeFileSync(path.join(PUBLIC_DIR, 'llms.txt'), llmTxt, 'utf8');
  console.log('✓ Generated public/llm.txt and public/llms.txt');
  if (fs.existsSync(DIST_PUBLIC_DIR)) {
    fs.writeFileSync(path.join(DIST_PUBLIC_DIR, 'llm.txt'), llmTxt, 'utf8');
    fs.writeFileSync(path.join(DIST_PUBLIC_DIR, 'llms.txt'), llmTxt, 'utf8');
    console.log('✓ Synchronized dist/public/llm.txt and dist/public/llms.txt');
  }
}

main().catch((err) => {
  console.error('[discovery] Fatal error generating discovery files:', err);
  process.exit(1);
});

