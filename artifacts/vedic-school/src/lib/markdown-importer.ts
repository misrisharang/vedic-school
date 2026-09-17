// ==============================================================================
// THE VEDIC SCHOOL — DETERMINISTIC SMART MARKDOWN IMPORT ENGINE
// ==============================================================================
// Pure, deterministic rule-based importer:
// 1. Detects & extracts TL;DR bullets (variable count, verbatim wording preserved)
// 2. Detects & extracts Quick Verdict (verbatim wording preserved)
// 3. Detects & extracts Sources & References (structured publication, title, url)
// 4. Detects & extracts Author metadata & matches against canonical authors
// 5. Detects & extracts FAQ items
// 6. Accurately de-duplicates: cleans the extracted blocks from the Main Article Content
// ==============================================================================

import type { BlogFAQItem, BlogSourceItem, Author } from '@/types/blog';
import { DEFAULT_AUTHORS } from '@/data/authors';
import { findAuthorByNameOrSlug } from './authors';

export interface MarkdownImportResult {
  title?: string;
  tldr: string[];
  quickVerdict: string;
  sources: BlogSourceItem[];
  faqs: BlogFAQItem[];
  authorName?: string;
  authorMatched?: Author | null;
  authorLinkedIn?: string;
  cleanContent: string;
  stats: {
    wordCount: number;
    tldrCount: number;
    quickVerdictDetected: boolean;
    sourcesCount: number;
    faqsCount: number;
    authorDetected: boolean;
  };
}

/**
 * Parses an individual source line into a structured BlogSourceItem.
 * Handles diverse citation styles, Markdown links, and naked URLs.
 */
export function parseSourceLine(rawLine: string): BlogSourceItem {
  let line = rawLine.trim();

  // Strip leading list bullet markers: '-', '*', '1.', '•'
  line = line.replace(/^[\s*•\-]+/, '').replace(/^\d+\.\s*/, '').trim();

  let url = '';
  let date: string | undefined = undefined;

  // 1. Extract URL: from markdown link [Text](https://...) or raw https?://...
  const mdLinkMatch = line.match(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/);
  if (mdLinkMatch) {
    url = mdLinkMatch[2].trim();
  } else {
    const rawUrlMatch = line.match(/(https?:\/\/[^\s\),]+)/);
    if (rawUrlMatch) {
      url = rawUrlMatch[1].trim();
    }
  }

  // 2. Extract Date / Year if present, e.g. (2016) or (all checked on 12 September 2026)
  const dateCheckMatch = line.match(/\((?:checked on|updated|accessed|published)?\s*([0-9]{1,2}\s+[A-Za-z]+\s+\d{4}|\d{4})\)/i);
  if (dateCheckMatch) {
    date = dateCheckMatch[1].trim();
  }

  // 3. Clean line for text parsing by removing the extracted URL and markdown brackets
  let textPart = line;
  if (url) {
    textPart = textPart.replace(url, '').replace(/\[\s*\]\(\s*\)/, '').trim();
  }

  // Remove markdown link syntax keeping link text: [Title](...) -> Title
  textPart = textPart.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

  // Strip trailing/leading punctuation
  textPart = textPart.replace(/^[–—\s,:.-]+|[–—\s,:.-]+$/g, '').trim();

  let publication = '';
  let title = '';

  // Format A: "Barner, D. et al. (2016). Learning mathematics in a visuospatial format..."
  const academicMatch = textPart.match(/^([A-Z][^()]+?\(\d{4}\))[\.\s]+(.*)/);
  if (academicMatch) {
    publication = academicMatch[1].trim();
    title = academicMatch[2].trim();
  }
  // Format B: "Publication — Title" or "Title — Publication"
  else if (textPart.includes('—') || textPart.includes(' – ') || textPart.includes(' - ')) {
    const parts = textPart.split(/\s*[—–]\s*|\s+-\s+/);
    if (parts.length >= 2) {
      publication = parts[0].trim();
      title = parts.slice(1).join(' — ').trim();
    } else {
      publication = textPart;
    }
  }
  // Format C: "Publication, \"Title\"" or "Publication: Title"
  else {
    const quoteMatch = textPart.match(/^([^,:]+?)[,:]\s*["']?([^"']+)["']?/);
    if (quoteMatch && quoteMatch[1].length < 60) {
      publication = quoteMatch[1].trim();
      title = quoteMatch[2].trim();
    } else {
      const commaMatch = textPart.match(/^([^,]+?),\s*(.*)/);
      if (commaMatch && commaMatch[1].length < 50) {
        publication = commaMatch[1].trim();
        title = commaMatch[2].trim();
      } else {
        publication = textPart;
        title = '';
      }
    }
  }

  // Clean remaining formatting asterisks/quotes
  publication = publication.replace(/^[*"']+|[*"']+$/g, '').trim();
  title = title.replace(/^[*"']+|[*"']+$/g, '').trim();

  // If title became publication and publication is empty
  if (!publication && title) {
    publication = title;
    title = '';
  }

  // If text part was completely empty (e.g. naked URL only)
  if (!publication && url) {
    try {
      const parsedUrl = new URL(url);
      publication = parsedUrl.hostname.replace(/^www\./, '');
    } catch {
      publication = 'Web Source';
    }
  }

  return {
    publication: publication || 'Source',
    title: title || '',
    url,
    date,
  };
}

/**
 * Extracts TL;DR bullets from markdown.
 * Recognizes:
 * - ## TL;DR / ## TLDR
 * - ## Key Takeaways
 * - ## Summary
 * - > **TL;DR** / **TL;DR**
 */
export function extractTldr(content: string): {
  bullets: string[];
  blockToStrip: string | null;
} {
  if (!content) return { bullets: [], blockToStrip: null };

  // Match heading or bold marker
  const tldrHeaderRegex = /(?:^|\n)(#{1,4}\s*(?:\*\*)?(?:TL;?\s*DR|Key Takeaways|Summary)(?:\*\*)?|>\s*\*\*(?:TL;?\s*DR|Key Takeaways|Summary)\*\*|\*\*(?:TL;?\s*DR|Key Takeaways|Summary)\*\*)([\s\S]*?)(?=(?:^|\n)#{1,3}\s+|(?:^|\n)(?:\*\*Quick verdict|Quick verdict:)|\n{3,}|$)/i;

  const match = content.match(tldrHeaderRegex);
  if (!match) return { bullets: [], blockToStrip: null };

  const fullBlock = match[0];
  const body = match[2] || '';

  const bulletLines = body
    .split('\n')
    .map((l) => l.replace(/^\s*>\s?/, '').trim())
    .filter((l) => l.startsWith('*') || l.startsWith('-') || /^\d+\.\s+/.test(l))
    .map((l) => l.replace(/^[\s*•\-]+/, '').replace(/^\d+\.\s*/, '').trim())
    .filter((l) => l.length > 0);

  return {
    bullets: bulletLines,
    blockToStrip: bulletLines.length > 0 ? fullBlock : null,
  };
}

/**
 * Extracts Quick Verdict text from markdown.
 * Recognizes:
 * - **Quick verdict:** ...
 * - **Quick Verdict:** ...
 * - ## Quick Verdict
 * - Quick Verdict: ...
 */
export function extractQuickVerdict(content: string): {
  verdict: string;
  blockToStrip: string | null;
} {
  if (!content) return { verdict: '', blockToStrip: null };

  // Pattern A: Inline bold or plain marker "**Quick verdict:** text"
  const inlineRegex = /(?:^|\n)(?:>\s*)?(?:\*\*(?:Quick\s*[Vv]erdict:?)\*\*|Quick\s*[Vv]erdict:)\s*([^\n]+(?:\n(?![#\n*>\-]|--)[^\n]+)*)/i;
  const inlineMatch = content.match(inlineRegex);

  if (inlineMatch) {
    const fullBlock = inlineMatch[0];
    const verdict = inlineMatch[1].trim();
    return { verdict, blockToStrip: fullBlock };
  }

  // Pattern B: Section heading "## Quick Verdict\n\nText..."
  const sectionRegex = /(?:^|\n)#{1,4}\s*(?:\*\*)?Quick\s*[Vv]erdict(?:\*\*)?\s*\n+([\s\S]*?)(?=(?:\n#{1,3}\s+|\n\*\*|$))/i;
  const sectionMatch = content.match(sectionRegex);

  if (sectionMatch) {
    const fullBlock = sectionMatch[0];
    const verdict = sectionMatch[1].trim();
    return { verdict, blockToStrip: fullBlock };
  }

  return { verdict: '', blockToStrip: null };
}

/**
 * Extracts Sources from markdown.
 * Recognizes:
 * - ## Sources
 * - ## Sources & References
 * - ## References
 * - ## Further Reading
 * - **Sources** (checked on ...)
 */
export function extractSources(content: string): {
  sources: BlogSourceItem[];
  blockToStrip: string | null;
} {
  if (!content) return { sources: [], blockToStrip: null };

  const sourcesRegex = /(?:^|\n)(?:#{1,4}\s*(?:\*\*)?(?:Sources(?:\s*&\s*References)?|References|Further Reading)(?:\*\*)?|\*\*(?:Sources|References)\*\*(?:\s*\([^)]*\))?)\s*([\s\S]*?)(?=(?:^|\n)#{1,3}\s+|$)/i;

  const match = content.match(sourcesRegex);
  if (!match) return { sources: [], blockToStrip: null };

  const fullBlock = match[0];
  const body = match[1].trim();

  const lines = body
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.startsWith('*') || l.startsWith('-') || /^\d+\.\s+/.test(l) || l.includes('http://') || l.includes('https://'));

  const parsedItems = lines.map(parseSourceLine).filter((item) => item.publication.length > 0 || item.url.length > 0);

  return {
    sources: parsedItems,
    blockToStrip: parsedItems.length > 0 ? fullBlock : null,
  };
}

/**
 * Extracts Author name and metadata from markdown.
 * Recognizes:
 * - By Meenakshi Koul
 * - **By Meenakshi Koul**
 * - Author: Meenakshi Koul
 * - **Author:** Meenakshi Koul
 * - By [Meenakshi Koul](url)
 * - **About the author** block
 */
export function extractAuthor(
  content: string,
  knownAuthors: Author[] = [...DEFAULT_AUTHORS]
): {
  authorName: string;
  authorMatched: Author | null;
  authorLinkedIn?: string;
  blockToStrip: string | null;
} {
  if (!content) {
    return { authorName: '', authorMatched: null, blockToStrip: null };
  }

  let authorName = '';
  let authorLinkedIn: string | undefined = undefined;
  let blockToStrip: string | null = null;

  // Pattern 1: Inline "By [Name]" or "**By [Name]**" or "Author: [Name]"
  const authorLineRegex = /(?:^|\n)(?:>\s*)?(?:\*\*)?(?:By|Author:?)\s+(?:\[([^\n\]]+)\]\(([^\n)]+)\)|([^\n*]+?))(?:\*\*)?(?=\s*\n|$)/i;
  const lineMatch = content.match(authorLineRegex);

  if (lineMatch) {
    if (lineMatch[1]) {
      authorName = lineMatch[1].trim();
      const link = lineMatch[2]?.trim();
      if (link && link.includes('linkedin.com')) {
        authorLinkedIn = link;
      }
    } else if (lineMatch[3]) {
      authorName = lineMatch[3].trim();
    }
  }

  // Pattern 2: "About the author" block (often with ## heading or --- rule)
  const aboutAuthorRegex = /(?:^|\n)(?:---\s*\n\s*)?(?:#{1,4}\s*)?(?:\*\*)?About the author(?:\*\*)?\s*\n+([\s\S]*?)(?=(?:^|\n)#{1,3}\s+(?!#)|(?:^|\n)\*\*Sources|$)/i;
  const aboutMatch = content.match(aboutAuthorRegex);

  if (aboutMatch) {
    blockToStrip = aboutMatch[0];
    const aboutText = aboutMatch[1];
    if (!authorName) {
      const boldNameMatch = aboutText.match(/\*\*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)\*\*/);
      if (boldNameMatch) {
        authorName = boldNameMatch[1].trim();
      }
    }
    const liMatch = aboutText.match(/https?:\/\/(?:www\.)?linkedin\.com\/in\/[^\s\)]+/);
    if (liMatch && !authorLinkedIn) {
      authorLinkedIn = liMatch[0];
    }
  }

  // Normalize author name (handle Khar -> Koul alias if legacy)
  if (authorName.toLowerCase() === 'meenakshi khar') {
    authorName = 'Meenakshi Koul';
  }

  const matched = findAuthorByNameOrSlug(knownAuthors, authorName) || null;

  return {
    authorName,
    authorMatched: matched,
    authorLinkedIn,
    blockToStrip,
  };
}

/**
 * Extracts FAQs from markdown content.
 */
export function extractFaqs(content: string): {
  faqs: BlogFAQItem[];
  blockToStrip: string | null;
} {
  if (!content) return { faqs: [], blockToStrip: null };

  const faqSectionRegex = /(?:^|\n)(#{1,4}\s*(?:\*\*)?[^\n]*FAQs?(?:\*\*)?[\s\S]*?)(?=(?:^|\n)(?:#{1,3}\s+(?!#)|---\s*\n\s*\*\*About the author|\*\*About the author|\*\*Sources|$))/i;
  const match = content.match(faqSectionRegex);
  if (!match) return { faqs: [], blockToStrip: null };

  const faqBlock = match[1];
  const items: BlogFAQItem[] = [];
  const qRegex = /###\s*(?:\*\*)?([^\n*]+?)(?:\*\*)?\s*\n+([\s\S]*?)(?=(?:###|$))/g;
  let qMatch: RegExpExecArray | null;

  while ((qMatch = qRegex.exec(faqBlock)) !== null) {
    const question = qMatch[1].trim();
    const answer = qMatch[2].trim().replace(/\n+/g, ' ');
    if (question && answer) {
      items.push({ question, answer });
    }
  }

  return {
    faqs: items,
    blockToStrip: items.length > 0 ? faqBlock : null,
  };
}

/**
 * Main parse function for the Smart Markdown Import engine.
 * Deterministically parses, structures, and de-duplicates an entire raw Markdown article.
 */
export function parseMarkdownArticle(
  rawMarkdown: string,
  knownAuthors: Author[] = [...DEFAULT_AUTHORS]
): MarkdownImportResult {
  if (!rawMarkdown || !rawMarkdown.trim()) {
    return {
      tldr: [],
      quickVerdict: '',
      sources: [],
      faqs: [],
      cleanContent: '',
      stats: {
        wordCount: 0,
        tldrCount: 0,
        quickVerdictDetected: false,
        sourcesCount: 0,
        faqsCount: 0,
        authorDetected: false,
      },
    };
  }

  let workingContent = rawMarkdown;

  // 1. Extract Title if markdown starts with H1 "# Title"
  let detectedTitle: string | undefined;
  const h1Match = workingContent.match(/^#\s+([^\n]+)/);
  if (h1Match) {
    detectedTitle = h1Match[1].replace(/^\*+|\*+$/g, '').trim();
    workingContent = workingContent.replace(h1Match[0], '').trim();
  }

  // 2. Extract Author
  const authorRes = extractAuthor(workingContent, knownAuthors);
  if (authorRes.blockToStrip) {
    workingContent = workingContent.replace(authorRes.blockToStrip, '\n\n');
  }

  // 3. Extract TL;DR
  const tldrRes = extractTldr(workingContent);
  if (tldrRes.blockToStrip) {
    workingContent = workingContent.replace(tldrRes.blockToStrip, '\n\n');
  }

  // 4. Extract Quick Verdict
  const qvRes = extractQuickVerdict(workingContent);
  if (qvRes.blockToStrip) {
    workingContent = workingContent.replace(qvRes.blockToStrip, '\n\n');
  }

  // 5. Extract FAQs
  const faqRes = extractFaqs(workingContent);
  if (faqRes.blockToStrip) {
    workingContent = workingContent.replace(faqRes.blockToStrip, '\n\n');
  }

  // 6. Extract Sources
  const sourcesRes = extractSources(workingContent);
  if (sourcesRes.blockToStrip) {
    workingContent = workingContent.replace(sourcesRes.blockToStrip, '\n\n');
  }

  // 7. Clean up remaining Main Article Content:
  // Normalize whitespace (no more than 2 consecutive newlines)
  const cleanContent = workingContent
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  // 8. Calculate word count for main article content
  const words = cleanContent
    .replace(/<[^>]*>/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[#*`_~>-]/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;

  return {
    title: detectedTitle,
    tldr: tldrRes.bullets,
    quickVerdict: qvRes.verdict,
    sources: sourcesRes.sources,
    faqs: faqRes.faqs,
    authorName: authorRes.authorName,
    authorMatched: authorRes.authorMatched,
    authorLinkedIn: authorRes.authorLinkedIn,
    cleanContent,
    stats: {
      wordCount: words,
      tldrCount: tldrRes.bullets.length,
      quickVerdictDetected: Boolean(qvRes.verdict),
      sourcesCount: sourcesRes.sources.length,
      faqsCount: faqRes.faqs.length,
      authorDetected: Boolean(authorRes.authorName || authorRes.authorMatched),
    },
  };
}
