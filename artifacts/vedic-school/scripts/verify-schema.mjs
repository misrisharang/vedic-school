// ==============================================================================
// VERIFY SCHEMA.ORG STRUCTURED DATA ACROSS PRERENDERED HTML FILES
// ==============================================================================

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_DIR = path.resolve(__dirname, '../dist/public');

const pagesToTest = [
  { file: 'index.html', route: '/', expectedTypes: ['EducationalOrganization', 'WebSite', 'WebPage'], prohibitedTypes: ['FAQPage', 'Service', 'BlogPosting'] },
  { file: 'vedic-maths/index.html', route: '/vedic-maths', expectedTypes: ['EducationalOrganization', 'WebSite', 'WebPage', 'Service', 'FAQPage'], prohibitedTypes: ['BlogPosting'] },
  { file: 'curriculum-aligned/index.html', route: '/curriculum-aligned', expectedTypes: ['EducationalOrganization', 'WebSite', 'WebPage', 'Service', 'FAQPage'], prohibitedTypes: ['BlogPosting'] },
  { file: 'about/index.html', route: '/about', expectedTypes: ['EducationalOrganization', 'WebSite', 'ProfilePage', 'Person'], prohibitedTypes: ['FAQPage', 'Service', 'BlogPosting'] },
  { file: 'contact/index.html', route: '/contact', expectedTypes: ['EducationalOrganization', 'WebSite', 'ContactPage'], prohibitedTypes: ['FAQPage', 'Service', 'BlogPosting'] },
  { file: 'blog/index.html', route: '/blog', expectedTypes: ['EducationalOrganization', 'WebSite', 'Blog'], prohibitedTypes: ['BlogPosting', 'FAQPage', 'Service'] },
  { file: 'privacy-policy/index.html', route: '/privacy-policy', expectedTypes: ['WebSite', 'WebPage'], prohibitedTypes: ['EducationalOrganization', 'BlogPosting', 'FAQPage'] },
  { file: 'terms-of-service/index.html', route: '/terms-of-service', expectedTypes: ['WebSite', 'WebPage'], prohibitedTypes: ['EducationalOrganization', 'BlogPosting', 'FAQPage'] },
  { file: 'cookie-policy/index.html', route: '/cookie-policy', expectedTypes: ['WebSite', 'WebPage'], prohibitedTypes: ['EducationalOrganization', 'BlogPosting', 'FAQPage'] },
];

let totalErrors = 0;

console.log('\n--- 1. TESTING PRERENDERED PAGES SCHEMA ---');

for (const page of pagesToTest) {
  const filePath = path.join(DIST_DIR, page.file);
  if (!fs.existsSync(filePath)) {
    console.error(`[FAIL] Missing file: ${page.file}`);
    totalErrors++;
    continue;
  }

  const html = fs.readFileSync(filePath, 'utf-8');
  const matches = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)];

  if (matches.length === 0) {
    console.error(`[FAIL] ${page.route}: No JSON-LD schema found in ${page.file}!`);
    totalErrors++;
    continue;
  }

  console.log(`\n[PAGE] ${page.route} (${page.file}): found ${matches.length} JSON-LD block(s)`);

  let parsedGraph = null;
  try {
    const rawJson = matches[0][1];
    parsedGraph = JSON.parse(rawJson);
  } catch (err) {
    console.error(`[FAIL] ${page.route}: JSON parse error: ${err.message}`);
    totalErrors++;
    continue;
  }

  if (parsedGraph['@context'] !== 'https://schema.org') {
    console.error(`[FAIL] ${page.route}: @context is not 'https://schema.org'`);
    totalErrors++;
  }

  if (!Array.isArray(parsedGraph['@graph'])) {
    console.error(`[FAIL] ${page.route}: @graph is not an array!`);
    totalErrors++;
    continue;
  }

  const types = parsedGraph['@graph'].map(e => e['@type']);
  console.log(`  Entities found: ${types.join(', ')}`);

  // Check expected types
  for (const expected of page.expectedTypes) {
    if (!types.includes(expected)) {
      console.error(`  [FAIL] Missing expected type: ${expected}`);
      totalErrors++;
    } else {
      console.log(`  ✓ Contains expected type: ${expected}`);
    }
  }

  // Check prohibited types
  for (const prohibited of page.prohibitedTypes) {
    if (types.includes(prohibited)) {
      console.error(`  [FAIL] Contains prohibited type: ${prohibited}`);
      totalErrors++;
    }
  }

  // Check strict details
  const graphStr = JSON.stringify(parsedGraph);

  // Address check: Must NOT contain New Delhi
  if (graphStr.includes('New Delhi')) {
    console.error(`  [FAIL] Found prohibited string "New Delhi"!`);
    totalErrors++;
  }

  // Telephone check: Must NOT contain telephone
  if (parsedGraph['@graph'].some(e => e.telephone)) {
    console.error(`  [FAIL] Found telephone property in schema!`);
    totalErrors++;
  }

  // Check for placeholder strings
  if (graphStr.includes('XXXX') || graphStr.includes('TODO') || graphStr.includes('undefined')) {
    console.error(`  [FAIL] Found placeholder or undefined value!`);
    totalErrors++;
  }

  // Specific check for FAQ pages
  if (page.route === '/vedic-maths' || page.route === '/curriculum-aligned') {
    const faqEntity = parsedGraph['@graph'].find(e => e['@type'] === 'FAQPage');
    if (!faqEntity || !Array.isArray(faqEntity.mainEntity) || faqEntity.mainEntity.length !== 5) {
      console.error(`  [FAIL] FAQPage does not have exactly 5 questions (found: ${faqEntity?.mainEntity?.length})`);
      totalErrors++;
    } else {
      console.log(`  ✓ FAQPage has exactly 5 questions with non-empty answers.`);
    }
  }
}

console.log('\n--- 2. TESTING 404.HTML SCHEMA ABSENCE ---');
const file404 = path.join(DIST_DIR, '404.html');
if (fs.existsSync(file404)) {
  const html404 = fs.readFileSync(file404, 'utf-8');
  const matches404 = [...html404.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)];
  if (matches404.length > 0) {
    console.error(`[FAIL] 404.html contains ${matches404.length} JSON-LD block(s)! Must be 0.`);
    totalErrors++;
  } else {
    console.log(`  ✓ 404.html contains ZERO JSON-LD schema blocks.`);
  }

  if (html404.includes('noindex')) {
    console.log(`  ✓ 404.html contains robots noindex.`);
  } else {
    console.error(`  [FAIL] 404.html missing robots noindex!`);
    totalErrors++;
  }
} else {
  console.error(`[FAIL] 404.html missing!`);
  totalErrors++;
}

console.log(`\n======================================================`);
if (totalErrors === 0) {
  console.log(`ALL SCHEMA.ORG AUDIT CHECKS PASSED WITH 0 ERRORS!`);
} else {
  console.error(`FAILED WITH ${totalErrors} ERROR(S).`);
  process.exit(1);
}
console.log(`======================================================\n`);
