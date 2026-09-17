// ==============================================================================
// TEST SUITE: MARKDOWN PARSER & REGRESSION VERIFICATION
// ==============================================================================

import assert from 'node:assert';
import { parseMarkdownArticle, parseSourceLine } from '../src/lib/markdown-importer.js';
import { DEFAULT_AUTHORS } from '../src/data/authors.js';
import { PUBLISHED_ARTICLES } from '../src/data/published-articles.js';

let passed = 0;
let total = 0;

function test(name, fn) {
  total++;
  try {
    fn();
    console.log(`✓ PASS: ${name}`);
    passed++;
  } catch (err) {
    console.error(`✗ FAIL: ${name}\n  Error: ${err.message}`);
  }
}

console.log('--- 1. TESTING SPECIFIC EDGE CASES ---');

// Edge Case 1: 3 TL;DR bullets
test('Edge Case 1: Article with 3 TL;DR bullets', () => {
  const md = `
## TL;DR
- First key takeaway
- Second key takeaway
- Third key takeaway

## Introduction
Content here...
`;
  const res = parseMarkdownArticle(md);
  assert.strictEqual(res.tldr.length, 3);
  assert.strictEqual(res.tldr[0], 'First key takeaway');
  assert.strictEqual(res.tldr[2], 'Third key takeaway');
  assert.ok(!res.cleanContent.includes('First key takeaway'));
});

// Edge Case 2: 6 TL;DR bullets
test('Edge Case 2: Article with 6 TL;DR bullets', () => {
  const md = `
## Key Takeaways
- Point 1
- Point 2
- Point 3
- Point 4
- Point 5
- Point 6

Body text...
`;
  const res = parseMarkdownArticle(md);
  assert.strictEqual(res.tldr.length, 6);
  assert.strictEqual(res.tldr[5], 'Point 6');
});

// Edge Case 3: 10 TL;DR bullets
test('Edge Case 3: Article with 10 TL;DR bullets', () => {
  const bullets = Array.from({ length: 10 }, (_, i) => `- Detailed bullet ${i + 1}`).join('\n');
  const md = `## TLDR\n${bullets}\n\n## Next Section\nMore text.`;
  const res = parseMarkdownArticle(md);
  assert.strictEqual(res.tldr.length, 10);
  assert.strictEqual(res.tldr[9], 'Detailed bullet 10');
});

// Edge Case 4: No TL;DR
test('Edge Case 4: Article with no TL;DR', () => {
  const md = `## Introduction\nJust standard article content with no summary.\n`;
  const res = parseMarkdownArticle(md);
  assert.strictEqual(res.tldr.length, 0);
  assert.ok(res.cleanContent.includes('Just standard article content'));
});

// Edge Case 5: With Quick Verdict
test('Edge Case 5: Article with Quick Verdict (**Quick verdict:**)', () => {
  const md = `
**Quick verdict:** This is the executive decision and final verdict text.

## Details
Body...
`;
  const res = parseMarkdownArticle(md);
  assert.strictEqual(res.quickVerdict, 'This is the executive decision and final verdict text.');
  assert.ok(!res.cleanContent.includes('Quick verdict'));
});

// Edge Case 6: Without Quick Verdict
test('Edge Case 6: Article without Quick Verdict', () => {
  const md = `## Overview\nNo quick verdict here.\n`;
  const res = parseMarkdownArticle(md);
  assert.strictEqual(res.quickVerdict, '');
});

// Edge Case 7: 3 sources
test('Edge Case 7: Article with 3 sources', () => {
  const md = `
## Sources
- Source One, "Title 1", https://example.com/1
- Source Two, "Title 2", https://example.com/2
- Source Three, "Title 3", https://example.com/3
`;
  const res = parseMarkdownArticle(md);
  assert.strictEqual(res.sources.length, 3);
  assert.strictEqual(res.sources[0].publication, 'Source One');
  assert.strictEqual(res.sources[2].url, 'https://example.com/3');
  assert.ok(!res.cleanContent.includes('Source One'));
});

// Edge Case 8: 10+ sources
test('Edge Case 8: Article with 10+ sources', () => {
  const list = Array.from({ length: 14 }, (_, i) => `- Pub ${i + 1}, Title ${i + 1}, https://example.com/${i + 1}`).join('\n');
  const md = `## References\n${list}`;
  const res = parseMarkdownArticle(md);
  assert.strictEqual(res.sources.length, 14);
});

// Edge Case 9: No sources
test('Edge Case 9: Article with no Sources', () => {
  const md = `## Introduction\nNo citations needed.`;
  const res = parseMarkdownArticle(md);
  assert.strictEqual(res.sources.length, 0);
});

// Edge Case 10: Markdown source links
test('Edge Case 10: Markdown source links [Title](url) — Pub', () => {
  const line = '- [Child Development Research](https://oxford.edu/study) — Oxford University Press';
  const item = parseSourceLine(line);
  assert.strictEqual(item.url, 'https://oxford.edu/study');
  assert.ok(item.publication.includes('Oxford') || item.title.includes('Oxford'));
});

// Edge Case 11: Markdown source bullets
test('Edge Case 11: Markdown source bullets with asterisks and hyphens', () => {
  const md = `
## Sources
* British Psychological Society, "Mental Abacus Trial", https://bps.org.uk/study
- Innovare Journal of Education: Vedic Study https://journals.org/vedic
`;
  const res = parseMarkdownArticle(md);
  assert.strictEqual(res.sources.length, 2);
  assert.strictEqual(res.sources[0].url, 'https://bps.org.uk/study');
  assert.strictEqual(res.sources[1].url, 'https://journals.org/vedic');
});

// Edge Case 12: Source with publication + title + URL
test('Edge Case 12: Source with publication + title + URL', () => {
  const line = '- Harvard Business Review, "The Architecture of Mathematics", https://hbr.org/math';
  const item = parseSourceLine(line);
  assert.strictEqual(item.publication, 'Harvard Business Review');
  assert.strictEqual(item.title, 'The Architecture of Mathematics');
  assert.strictEqual(item.url, 'https://hbr.org/math');
});

// Edge Case 13: Source with URL only
test('Edge Case 13: Source with URL only', () => {
  const line = '- https://www.nature.com/articles/d41586-024-00123-x';
  const item = parseSourceLine(line);
  assert.strictEqual(item.url, 'https://www.nature.com/articles/d41586-024-00123-x');
  assert.strictEqual(item.publication, 'nature.com');
});

// Edge Case 14: Existing author match
test('Edge Case 14: Existing author match (By Meenakshi Koul)', () => {
  const md = `
# How to Teach Mental Maths
By Meenakshi Koul

Article text...
`;
  const res = parseMarkdownArticle(md, DEFAULT_AUTHORS);
  assert.strictEqual(res.authorName, 'Meenakshi Koul');
  assert.ok(res.authorMatched);
  assert.strictEqual(res.authorMatched.slug, 'meenakshi-koul');
});

// Edge Case 15: Unknown author
test('Edge Case 15: Unknown author detection (By Jane Doe)', () => {
  const md = `
# How to Teach Mental Maths
By Jane Doe

Article text...
`;
  const res = parseMarkdownArticle(md, DEFAULT_AUTHORS);
  assert.strictEqual(res.authorName, 'Jane Doe');
  assert.strictEqual(res.authorMatched, null);
});

// Edge Case 16: Author with LinkedIn URL
test('Edge Case 16: Author with LinkedIn URL', () => {
  const md = `
By [Meenakshi Koul](https://www.linkedin.com/in/meenakshi-koul-14b101135/)

Content...
`;
  const res = parseMarkdownArticle(md, DEFAULT_AUTHORS);
  assert.strictEqual(res.authorName, 'Meenakshi Koul');
  assert.strictEqual(res.authorLinkedIn, 'https://www.linkedin.com/in/meenakshi-koul-14b101135/');
});

// Edge Case 17: Markdown without an author
test('Edge Case 17: Markdown without an author', () => {
  const md = `
# Anonymous Guide
No author byline here.
`;
  const res = parseMarkdownArticle(md, DEFAULT_AUTHORS);
  assert.strictEqual(res.authorName, '');
  assert.strictEqual(res.authorMatched, null);
});

console.log('\n--- 2. REGRESSION TESTING ON THE 3 REAL PUBLISHED ARTICLES ---');

for (const article of PUBLISHED_ARTICLES) {
  test(`Real Article: ${article.slug}`, () => {
    const res = parseMarkdownArticle(article.content, DEFAULT_AUTHORS);

    if (article.slug === 'vedic-maths-vs-abacus') {
      assert.strictEqual(res.tldr.length, 6, `Expected 6 TLDR bullets, got ${res.tldr.length}`);
      assert.strictEqual(res.sources.length, 9, `Expected 9 sources, got ${res.sources.length}`);
      assert.ok(res.quickVerdict.length > 50, 'Quick verdict should be populated');
      assert.ok(res.authorMatched?.slug === 'meenakshi-koul', 'Author should match Meenakshi Koul');
    } else if (article.slug === 'is-vedic-maths-useful') {
      assert.strictEqual(res.tldr.length, 6, `Expected 6 TLDR bullets, got ${res.tldr.length}`);
      assert.strictEqual(res.sources.length, 7, `Expected 7 sources, got ${res.sources.length}`);
      assert.ok(res.quickVerdict.length > 50, 'Quick verdict should be populated');
      assert.ok(res.authorMatched?.slug === 'meenakshi-koul', 'Author should match Meenakshi Koul');
    } else if (article.slug === 'best-vedic-maths-online-classes-for-kids') {
      assert.strictEqual(res.tldr.length, 7, `Expected 7 TLDR bullets, got ${res.tldr.length}`);
      assert.strictEqual(res.sources.length, 13, `Expected 13 sources, got ${res.sources.length}`);
      assert.ok(res.quickVerdict.length > 50, 'Quick verdict should be populated');
      assert.ok(res.authorMatched?.slug === 'meenakshi-koul', 'Author should match Meenakshi Koul');
    }

    // Verify main content does not retain duplicate TLDR, Sources, or Verdict
    assert.ok(!res.cleanContent.includes('## Sources'), 'Sources heading must be stripped');
    assert.ok(!res.cleanContent.includes('## TL;DR') && !res.cleanContent.includes('**TL;DR**'), 'TLDR heading must be stripped');
    assert.ok(!res.cleanContent.includes('**Quick verdict:**') && !res.cleanContent.includes('## Quick Verdict'), 'Quick verdict must be stripped');
  });
}

console.log(`\n======================================================`);
console.log(`TEST SUMMARY: ${passed}/${total} TESTS PASSED`);
console.log(`======================================================\n`);

if (passed !== total) {
  process.exit(1);
}
