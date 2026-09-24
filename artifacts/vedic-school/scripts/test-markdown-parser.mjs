// ==============================================================================
// TEST SUITE: STANDARDIZED MARKDOWN IMPORTER COMPREHENSIVE QA
// ==============================================================================

import assert from 'node:assert';
import { parseMarkdownArticle, parseSourceLine, parseSourcesBlock, parseFaqsBlock } from '../src/lib/markdown-importer.js';
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
    console.error(err.stack);
  }
}

console.log('--- SECTION 1: OFFICIAL MARKDOWN SPECIFICATION & REQUIRED TEST CASES ---');

// Case 1: Three TL;DR bullets
test('Case 1: Exactly Three TL;DR bullets', () => {
  const md = `# Sample Article

## TL;DR

- First key takeaway
- Second key takeaway
- Third key takeaway

## Quick Verdict

A concise verdict on this subject.

## Article Content

## First Section

Article content goes here.
`;
  const res = parseMarkdownArticle(md);
  assert.strictEqual(res.title, 'Sample Article');
  assert.strictEqual(res.tldr.length, 3);
  assert.strictEqual(res.tldr[0], 'First key takeaway');
  assert.strictEqual(res.tldr[1], 'Second key takeaway');
  assert.strictEqual(res.tldr[2], 'Third key takeaway');
  assert.ok(!res.cleanContent.includes('First key takeaway'));
});

// Case 2: Five TL;DR bullets
test('Case 2: Exactly Five TL;DR bullets', () => {
  const md = `# Multi-Point Article

## TL;DR

- Point number one
- Point number two
- Point number three
- Point number four
- Point number five

## Article Content

## Overview

Here is the body.
`;
  const res = parseMarkdownArticle(md);
  assert.strictEqual(res.tldr.length, 5);
  assert.strictEqual(res.tldr[0], 'Point number one');
  assert.strictEqual(res.tldr[4], 'Point number five');
  assert.ok(!res.cleanContent.includes('Point number one'));
});

// Case 3: Quick Verdict
test('Case 3: Quick Verdict extraction', () => {
  const md = `# Verdict Article

## Quick Verdict

Vedic Maths builds spatial intuition and mental calculation speed when taught conceptually.

## Article Content

## Background

Some details.
`;
  const res = parseMarkdownArticle(md);
  assert.strictEqual(
    res.quickVerdict,
    'Vedic Maths builds spatial intuition and mental calculation speed when taught conceptually.'
  );
  assert.ok(!res.cleanContent.includes('Quick Verdict'));
});

// Case 4: Multiple H2/H3 article sections (preserving hierarchy for TOC)
test('Case 4: Multiple H2/H3 article sections preserved for TOC', () => {
  const md = `# Structured Post

## Article Content

## Foundational Mental Arithmetic

Foundations matter for young students.

### Why Visual Methods Work

Visualisation aids mental number line representation.

### Cognitive Load in Early Maths

Working memory constraints are real.

## Method Comparison

Comparing conventional vs alternative arithmetic.

### Standard Column Method

Column addition mechanics.

### Vedic Cross-Multiplication

Sutra based multiplication.
`;
  const res = parseMarkdownArticle(md);
  assert.ok(!res.cleanContent.includes('## Article Content'), 'Marker heading must be stripped');
  assert.ok(res.cleanContent.includes('## Foundational Mental Arithmetic'));
  assert.ok(res.cleanContent.includes('### Why Visual Methods Work'));
  assert.ok(res.cleanContent.includes('### Cognitive Load in Early Maths'));
  assert.ok(res.cleanContent.includes('## Method Comparison'));
  assert.ok(res.cleanContent.includes('### Standard Column Method'));
  assert.ok(res.cleanContent.includes('### Vedic Cross-Multiplication'));
});

// Case 5: Three Sources (structured format)
test('Case 5: Exactly Three structured Sources', () => {
  const md = `# Sourced Post

## Article Content

## Introduction
Content text...

## Sources

1. **Publication:** Oxford University Press
   **Title:** Learning mathematics in a visuospatial format
   **URL:** https://academic.oup.com/chidev/article/87/4/1168/2529321
   **Date:** 2026-09-20

2. **Publication:** British Psychological Society
   **Title:** The cognitive benefits of mental arithmetic
   **URL:** https://bps.org.uk/study/mental-maths
   **Date:** 2026-09-18

3. **Publication:** Cambridge Mathematics
   **Title:** Framework for Primary Number Sense
   **URL:** https://www.cambridgemaths.org/framework/
`;
  const res = parseMarkdownArticle(md);
  assert.strictEqual(res.sources.length, 3);
  assert.strictEqual(res.sources[0].publication, 'Oxford University Press');
  assert.strictEqual(res.sources[0].title, 'Learning mathematics in a visuospatial format');
  assert.strictEqual(res.sources[0].url, 'https://academic.oup.com/chidev/article/87/4/1168/2529321');
  assert.strictEqual(res.sources[0].date, '2026-09-20');

  assert.strictEqual(res.sources[1].publication, 'British Psychological Society');
  assert.strictEqual(res.sources[2].publication, 'Cambridge Mathematics');
  assert.strictEqual(res.sources[2].date, undefined);

  assert.ok(!res.cleanContent.includes('Oxford University Press'));
  assert.ok(!res.cleanContent.includes('## Sources'));
});

// Case 6: Ten Sources
test('Case 6: Ten structured Sources', () => {
  const sourcesMd = Array.from({ length: 10 }, (_, i) => `
${i + 1}. **Publication:** Research Journal ${i + 1}
   **Title:** Scholarly Study on Number Fluency ${i + 1}
   **URL:** https://example.com/journal-${i + 1}
   **Date:** 2026-09-${String(i + 1).padStart(2, '0')}
`).join('\n');

  const md = `# Heavy Research Article\n\n## Article Content\n\n## Body\nText.\n\n## Sources\n${sourcesMd}`;
  const res = parseMarkdownArticle(md);
  assert.strictEqual(res.sources.length, 10);
  assert.strictEqual(res.sources[0].publication, 'Research Journal 1');
  assert.strictEqual(res.sources[9].publication, 'Research Journal 10');
  assert.strictEqual(res.sources[9].url, 'https://example.com/journal-10');
  assert.strictEqual(res.sources[9].date, '2026-09-10');
});

// Case 7: Multiple FAQs
test('Case 7: Multiple structured FAQs', () => {
  const md = `# FAQ Post

## Article Content

## Body
Content...

## FAQs

### Is Vedic Maths useful for children?

Yes, when taught conceptually it builds speed, pattern recognition and confidence.

### Does Vedic Maths replace regular Maths?

No. It complements school curricula and equips children with alternative calculation methods.

### What age can children start Vedic Maths?

Children typically begin around age 8 once basic addition and times tables are understood.
`;
  const res = parseMarkdownArticle(md);
  assert.strictEqual(res.faqs.length, 3);
  assert.strictEqual(res.faqs[0].question, 'Is Vedic Maths useful for children?');
  assert.ok(res.faqs[0].answer.includes('builds speed'));
  assert.strictEqual(res.faqs[1].question, 'Does Vedic Maths replace regular Maths?');
  assert.strictEqual(res.faqs[2].question, 'What age can children start Vedic Maths?');
  assert.ok(!res.cleanContent.includes('## FAQs'));
  assert.ok(!res.cleanContent.includes('Is Vedic Maths useful for children?'));
});

// Case 8: No FAQs
test('Case 8: Article with no FAQs', () => {
  const md = `# Post Without FAQs

## TL;DR
- Quick point 1

## Article Content

## Main Content
This article has no FAQ section at all.
`;
  const res = parseMarkdownArticle(md);
  assert.strictEqual(res.faqs.length, 0);
  assert.ok(res.cleanContent.includes('This article has no FAQ section at all.'));
});

// Case 9: No Sources
test('Case 9: Article with no Sources', () => {
  const md = `# Post Without Sources

## Article Content

## Perspective
An opinion essay without academic sources.

## FAQs

### Is this an opinion piece?
Yes, it reflects classroom teaching experience.
`;
  const res = parseMarkdownArticle(md);
  assert.strictEqual(res.sources.length, 0);
  assert.strictEqual(res.faqs.length, 1);
  assert.ok(res.cleanContent.includes('An opinion essay without academic sources.'));
});

// Case 10: Sources + FAQs together
test('Case 10: Sources + FAQs together in the same article', () => {
  const md = `# Complete Study

## Article Content

## Analysis
Detailed analysis text.

## Sources

1. **Publication:** Harvard GSE
   **Title:** Early Math Mindsets
   **URL:** https://gse.harvard.edu/math

## FAQs

### What was the sample size?
The study observed 450 pupils over two school terms.
`;
  const res = parseMarkdownArticle(md);
  assert.strictEqual(res.sources.length, 1);
  assert.strictEqual(res.sources[0].publication, 'Harvard GSE');
  assert.strictEqual(res.faqs.length, 1);
  assert.strictEqual(res.faqs[0].question, 'What was the sample size?');
  assert.strictEqual(res.faqs[0].answer, 'The study observed 450 pupils over two school terms.');
  assert.ok(!res.cleanContent.includes('Harvard GSE'));
  assert.ok(!res.cleanContent.includes('What was the sample size?'));
});

// Case 11: URLs inside normal article content (MUST NOT be parsed as Sources)
test('Case 11: URLs inside normal article content are preserved and NOT detected as Sources', () => {
  const md = `# Linking Article

## Article Content

## In-Text Citations and Hyperlinks

Parents often visit [The National Curriculum Guide](https://gov.uk/national-curriculum) to check expectations.
You can also inspect raw data at https://data.gov.uk/education without visiting any other site.

## Next Section

Another mention: see https://en.wikipedia.org/wiki/Vedic_Mathematics for historical context.
`;
  const res = parseMarkdownArticle(md);
  // Must NOT classify embedded URLs as structured Sources
  assert.strictEqual(res.sources.length, 0, 'In-body URLs must not become sources without ## Sources');
  assert.ok(res.cleanContent.includes('https://gov.uk/national-curriculum'));
  assert.ok(res.cleanContent.includes('https://data.gov.uk/education'));
  assert.ok(res.cleanContent.includes('https://en.wikipedia.org/wiki/Vedic_Mathematics'));
});

// Case 12: Question sentences inside normal article content (MUST NOT be detected as FAQs)
test('Case 12: Question marks inside normal article content are preserved and NOT detected as FAQs', () => {
  const md = `# Inquisitive Article

## Article Content

## Why Do Children Struggle With Long Division?

Is it because the steps feel abstract? Many educators believe so.
What should parents do when a child asks for help? The answer is to pause and diagnose foundations.
Could there be a better method? Yes, mental breakdown helps.
`;
  const res = parseMarkdownArticle(md);
  // Must NOT classify questions in normal content as structured FAQs
  assert.strictEqual(res.faqs.length, 0, 'In-body questions must not become FAQs without ## FAQs');
  assert.ok(res.cleanContent.includes('## Why Do Children Struggle With Long Division?'));
  assert.ok(res.cleanContent.includes('Is it because the steps feel abstract?'));
});

// Case 13: Legacy Markdown format
test('Case 13: Backward compatibility with legacy Markdown format', () => {
  const legacyMd = `# Legacy Vedic Maths Guide

> **TL;DR**
* First takeaway point
* Second takeaway point

**Quick verdict:** Clear verdict text that provides quick summary.

By Meenakshi Koul

## What is Mental Maths

Regular content paragraphs here.

## Sources
* Barner, D. et al. (2016). Learning mathematics in a visuospatial format... https://academic.oup.com/chidev
- British Psychological Society, "Mental Abacus Study", https://bps.org.uk/study

## FAQs
### Can 7 year olds join?
Yes, age 7 is a suitable starting age.
`;
  const res = parseMarkdownArticle(legacyMd, DEFAULT_AUTHORS);
  assert.strictEqual(res.title, 'Legacy Vedic Maths Guide');
  assert.strictEqual(res.tldr.length, 2);
  assert.strictEqual(res.quickVerdict, 'Clear verdict text that provides quick summary.');
  assert.strictEqual(res.authorName, 'Meenakshi Koul');
  assert.ok(res.authorMatched);
  assert.strictEqual(res.sources.length, 2);
  assert.strictEqual(res.faqs.length, 1);
  assert.strictEqual(res.faqs[0].question, 'Can 7 year olds join?');
  assert.ok(res.cleanContent.includes('## What is Mental Maths'));
  assert.ok(!res.cleanContent.includes('**Quick verdict:**'));
  assert.ok(!res.cleanContent.includes('## Sources'));
  assert.ok(!res.cleanContent.includes('## FAQs'));
});

// Case 14: Complete real-world official article structure
test('Case 14: Complete real-world article adhering to official template', () => {
  const fullArticle = `# Vedic Maths vs Abacus: A Complete Comparison for Parents

## TL;DR

- Abacus relies on tactile bead-manipulation and mental visualisation of physical beads
- Vedic Maths uses algebraic patterns and mental sutras without requiring physical tools
- Both develop number confidence, but cater to different developmental stages

## Quick Verdict

Vedic Maths is more sustainable past primary school because its techniques translate directly into standard high school algebra.

## Article Content

## The Core Mechanical Difference

Abacus begins with a physical calculating instrument called the Soroban. Children spend the first 6 to 12 months physically manipulating beads before transitioning to mental visualisation.

### Tactile vs Algebraic Patterns

In contrast, Vedic Maths requires no hardware. It teaches 16 core Sanskrit sutras that represent algebraic shortcuts.

## Long-Term Academic Value

When students enter Grade 6 and beyond, physical bead calculation cannot represent quadratic polynomials or simultaneous equations. Vedic methods, however, generalise across algebra.

## Sources

1. **Publication:** Child Development Journal
   **Title:** Randomized trial of mental abacus training in primary education
   **URL:** https://example.com/abacus-trial
   **Date:** 2026-09-15

2. **Publication:** International Journal of Mathematical Education
   **Title:** Speed arithmetic and mental algebra through Vedic sutras
   **URL:** https://example.com/vedic-sutras
   **Date:** 2026-09-12

## FAQs

### Which should my 8-year-old child start with?

For an 8-year-old who already understands basic place value, Vedic Maths is typically the more durable pathway because it builds mental calculation without mechanical dependency.

### Can a child learn both at the same time?

We generally recommend focusing on one system first to avoid cognitive confusion between bead visualization and sutra shortcuts.
`;

  const res = parseMarkdownArticle(fullArticle);
  assert.strictEqual(res.title, 'Vedic Maths vs Abacus: A Complete Comparison for Parents');
  assert.strictEqual(res.tldr.length, 3);
  assert.ok(res.quickVerdict.includes('more sustainable past primary school'));
  assert.strictEqual(res.sources.length, 2);
  assert.strictEqual(res.sources[0].publication, 'Child Development Journal');
  assert.strictEqual(res.sources[1].publication, 'International Journal of Mathematical Education');
  assert.strictEqual(res.faqs.length, 2);
  assert.strictEqual(res.faqs[0].question, 'Which should my 8-year-old child start with?');
  assert.strictEqual(res.faqs[1].question, 'Can a child learn both at the same time?');

  // Verify TOC integrity
  assert.ok(res.cleanContent.includes('## The Core Mechanical Difference'));
  assert.ok(res.cleanContent.includes('### Tactile vs Algebraic Patterns'));
  assert.ok(res.cleanContent.includes('## Long-Term Academic Value'));
  assert.ok(!res.cleanContent.includes('## Article Content'));
  assert.ok(!res.cleanContent.includes('## Sources'));
  assert.ok(!res.cleanContent.includes('## FAQs'));
});

console.log('\n--- SECTION 2: REGRESSION TESTING ON THE 3 REAL PUBLISHED ARTICLES ---');

for (const article of PUBLISHED_ARTICLES) {
  test(`Real Published Article Regression: ${article.slug}`, () => {
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
