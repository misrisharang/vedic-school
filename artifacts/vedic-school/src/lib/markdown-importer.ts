// ==============================================================================
// THE VEDIC SCHOOL — STANDARDIZED & DETERMINISTIC MARKDOWN IMPORT ENGINE
// ==============================================================================
// Pure, deterministic rule-based importer adhering to The Vedic School official format:
// 1. # Title (H1 article title)
// 2. ## TL;DR (Variable count of bullets, verbatim wording preserved)
// 3. ## Quick Verdict (Concise editorial verdict)
// 4. ## Article Content (Preserved verbatim, H2/H3 hierarchy intact for Table of Contents)
// 5. ## Sources (Structured: Publication, Title, URL, Date)
// 6. ## FAQs (Structured: ### Question? with Answers)
// 7. Complete backward compatibility for legacy formats & published articles
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
  unidentifiedSections?: string[];
  stats: {
    wordCount: number;
    tldrCount: number;
    quickVerdictDetected: boolean;
    sourcesCount: number;
    faqsCount: number;
    authorDetected: boolean;
    articleContentDetected: boolean;
  };
}

/**
 * Parses an individual source line into a structured BlogSourceItem.
 * Handles diverse legacy citation styles, Markdown links, and naked URLs.
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

  // 2. Extract Date / Year if present, e.g. (2016) or (checked on 12 September 2026)
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

  if (!publication && title) {
    publication = title;
    title = '';
  }

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
 * Parses the body under a ## Sources heading into structured BlogSourceItem records.
 * First handles the official multi-field format:
 * 1. **Publication:** Name
 *    **Title:** Source Title
 *    **URL:** https://...
 *    **Date:** YYYY-MM-DD
 * Falls back to line-by-line parsing for legacy formats.
 */
export function parseSourcesBlock(rawBlock: string): BlogSourceItem[] {
  if (!rawBlock || !rawBlock.trim()) return [];

  const text = rawBlock.trim();
  const items: BlogSourceItem[] = [];

  // Check if structured markers (**Publication:** or Publication:) exist
  const hasStructuredMarkers = /(?:\*\*)?Publication:(?:\*\*)?/i.test(text);

  if (hasStructuredMarkers) {
    const itemChunks = text
      .split(/(?:^|\n)\s*(?:\d+\.|\*|\-)\s*(?=(?:\*\*)?Publication:)/i)
      .map((c) => c.trim())
      .filter(Boolean);

    for (const chunk of itemChunks) {
      const pubMatch = chunk.match(/(?:\*\*)?Publication:(?:\*\*)?\s*([^\n*]+)/i);
      const titleMatch = chunk.match(/(?:\*\*)?Title:(?:\*\*)?\s*([^\n*]+)/i);
      const urlMatch = chunk.match(/(?:\*\*)?URL:(?:\*\*)?\s*([^\s*\n]+)/i);
      const dateMatch = chunk.match(/(?:\*\*)?Date:(?:\*\*)?\s*([^\n*]+)/i);

      let publication = pubMatch ? pubMatch[1].trim() : '';
      let title = titleMatch ? titleMatch[1].trim() : '';
      let url = urlMatch ? urlMatch[1].trim() : '';
      let date = dateMatch ? dateMatch[1].trim() : undefined;

      if (!url) {
        const mdLinkMatch = chunk.match(/\[([^\]]*)\]\((https?:\/\/[^\s)]+)\)/);
        if (mdLinkMatch) {
          url = mdLinkMatch[2].trim();
          if (!title && mdLinkMatch[1]) {
            title = mdLinkMatch[1].trim();
          }
        } else {
          const rawUrlMatch = chunk.match(/https?:\/\/[^\s)\],]+/);
          if (rawUrlMatch) {
            url = rawUrlMatch[0].trim();
          }
        }
      }

      publication = publication.replace(/^[*"'`]+|[*"'`]+$/g, '').trim();
      title = title.replace(/^[*"'`]+|[*"'`]+$/g, '').trim();
      if (date) {
        date = date.replace(/^[*"'`()]+|[*"'`()]+$/g, '').trim();
      }

      if (publication || title || url) {
        items.push({
          publication: publication || (url ? new URL(url).hostname.replace(/^www\./, '') : 'Source'),
          title: title || '',
          url,
          date,
        });
      }
    }
  }

  // Fallback to line-based parsing if no structured items found (legacy format)
  if (items.length === 0) {
    const lines = text
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.startsWith('*') || l.startsWith('-') || /^\d+\.\s+/.test(l) || l.includes('http://') || l.includes('https://'));

    for (const line of lines) {
      const parsed = parseSourceLine(line);
      if (parsed.publication || parsed.url) {
        items.push(parsed);
      }
    }
  }

  return items;
}

/**
 * Parses the body under a ## FAQs heading into structured BlogFAQItem records.
 * Uses ### Question as explicit boundary for each question.
 */
export function parseFaqsBlock(rawBlock: string): BlogFAQItem[] {
  if (!rawBlock || !rawBlock.trim()) return [];

  const text = rawBlock.trim();
  const items: BlogFAQItem[] = [];

  // Match H3 questions: ### Question
  const qRegex = /(?:^|\n)###\s*(?:\*\*)?([^\n*]+?)(?:\*\*)?\s*\n+([\s\S]*?)(?=(?:\n###|$))/g;
  let qMatch: RegExpExecArray | null;

  while ((qMatch = qRegex.exec(text)) !== null) {
    const question = qMatch[1].trim().replace(/^[*"'`]+|[*"'`]+$/g, '');
    const rawAnswer = qMatch[2].trim();

    const answer = rawAnswer
      .replace(/\r\n/g, '\n')
      .split(/\n{2,}/)
      .map((para) => para.replace(/\n+/g, ' ').trim())
      .filter(Boolean)
      .join('\n\n');

    if (question && answer) {
      items.push({ question, answer });
    }
  }

  // Fallback for legacy format with **Q:** or Q: if no ### H3 headers exist
  if (items.length === 0) {
    const qAltRegex = /(?:^|\n)(?:\*\*Q(?:uestion)?:?\*\*|Q:)\s*([^\n*]+)\s*\n+(?:\*\*A(?:nswer)?:?\*\*|A:)?\s*([\s\S]*?)(?=(?:\n(?:\*\*Q|Q:)|$))/gi;
    let altMatch: RegExpExecArray | null;
    while ((altMatch = qAltRegex.exec(text)) !== null) {
      const question = altMatch[1].trim();
      const answer = altMatch[2].trim().replace(/\n+/g, ' ');
      if (question && answer) {
        items.push({ question, answer });
      }
    }
  }

  return items;
}

/**
 * Parses bullets from the TL;DR section.
 */
export function parseTldrBlock(rawBlock: string): string[] {
  if (!rawBlock || !rawBlock.trim()) return [];

  const lines = rawBlock.trim().split('\n');
  const bullets: string[] = [];

  for (const rawLine of lines) {
    const line = rawLine.replace(/^\s*>\s?/, '').trim();
    if (!line) continue;
    const isBullet = /^[\-*•]|\d+\.\s+/.test(line);
    if (isBullet) {
      const clean = line.replace(/^[\s*•\-]+/, '').replace(/^\d+\.\s*/, '').trim();
      if (clean) bullets.push(clean);
    } else if (bullets.length === 0) {
      bullets.push(line);
    }
  }

  return bullets;
}

/**
 * Extracts Author name and metadata from markdown content.
 */
export function extractAuthor(
  content: string,
  knownAuthors: Author[] = [...DEFAULT_AUTHORS]
): {
  authorName: string;
  authorMatched: Author | null;
  authorLinkedIn?: string;
  blockToStrip: string | null;
  blocksToStrip?: string[];
} {
  if (!content) {
    return { authorName: '', authorMatched: null, blockToStrip: null, blocksToStrip: [] };
  }

  let authorName = '';
  let authorLinkedIn: string | undefined = undefined;
  const blocksToStrip: string[] = [];

  // Pattern 1: Inline "By [Name](url)" or "**By [Name](url)**, Founder..."
  const linkByMatch = content.match(/(?:^|\n)(?:>\s*)?(?:\*\*)?(?:By|Author:?)\s+\[([^\]]+)\]\(([^\n)]+)\)[^\n]*/i);
  if (linkByMatch) {
    authorName = linkByMatch[1].trim();
    const linkUrl = linkByMatch[2].trim();
    if (linkUrl.includes('linkedin.com')) {
      authorLinkedIn = linkUrl;
    }
    blocksToStrip.push(linkByMatch[0]);
  } else {
    // Pattern 2: Inline "By Name" or "**By Name**" or "Author: Name"
    const plainByMatch = content.match(/(?:^|\n)(?:>\s*)?(?:\*\*)?(?:By|Author:?)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)[^\n]*/i);
    if (plainByMatch) {
      authorName = plainByMatch[1].trim();
      blocksToStrip.push(plainByMatch[0]);
    }
  }

  // Pattern 3: "About the author" section (## About the author or **About the author**)
  const aboutAuthorRegex = /(?:^|\n)(?:---\s*\n\s*)?(?:##\s*|\*\*)About the (?:author|founder)(?:\*\*)?\s*\n+([\s\S]*?)(?=(?:^|\n)(?:##|\*\*(?:Sources|References)|---)|$)/i;
  const aboutMatch = content.match(aboutAuthorRegex);

  if (aboutMatch) {
    blocksToStrip.push(aboutMatch[0]);
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

  if (authorName.toLowerCase() === 'meenakshi khar') {
    authorName = 'Meenakshi Koul';
  }

  const matched = findAuthorByNameOrSlug(knownAuthors, authorName) || null;

  return {
    authorName,
    authorMatched: matched,
    authorLinkedIn,
    blockToStrip: blocksToStrip.join('\n\n') || null,
    blocksToStrip,
  };
}

interface HeadingEntry {
  rawHeading: string;
  cleanTitle: string;
  type: 'tldr' | 'quick_verdict' | 'article_content' | 'sources' | 'faqs' | 'about_author' | 'article_section';
  startIndex: number; // index where `## ` begins in text
  headerEndIndex: number; // index where the heading line ends (\n)
}

/**
 * Main parse function for the Standardized Markdown Import engine.
 * Deterministically parses, structures, and de-duplicates raw Markdown articles.
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
        articleContentDetected: false,
      },
    };
  }

  let text = rawMarkdown.replace(/\r\n/g, '\n');

  // 1. Extract Title if markdown starts with H1 "# Title"
  let detectedTitle: string | undefined;
  const h1Match = text.match(/^#\s+([^\n]+)/);
  if (h1Match) {
    detectedTitle = h1Match[1].replace(/^\*+|\*+$/g, '').trim();
    text = text.replace(h1Match[0], '').trim();
  }

  // 2. Extract Author byline
  const authorRes = extractAuthor(text, knownAuthors);
  if (authorRes.blocksToStrip && authorRes.blocksToStrip.length > 0) {
    for (const b of authorRes.blocksToStrip) {
      text = text.replace(b, '\n\n');
    }
  } else if (authorRes.blockToStrip) {
    text = text.replace(authorRes.blockToStrip, '\n\n');
  }

  // 3. Fallback for legacy inline Quick Verdict: **Quick verdict:**
  let legacyQuickVerdict = '';
  const inlineQvRegex = /(?:^|\n)(?:>\s*)?(?:\*\*(?:Quick\s*[Vv]erdict:?)\*\*|Quick\s*[Vv]erdict:)\s*([^\n]+(?:\n(?![#\n*>\-]|--)[^\n]+)*)/i;
  const qvInlineMatch = text.match(inlineQvRegex);
  if (qvInlineMatch) {
    legacyQuickVerdict = qvInlineMatch[1].trim();
    text = text.replace(qvInlineMatch[0], '\n\n');
  }

  // 4. Fallback for legacy TL;DR with blockquote/bold marker: > **TL;DR** or **TL;DR**
  let legacyTldrBullets: string[] = [];
  const legacyTldrRegex = /(?:^|\n)(?:>\s*\*\*(?:TL;?\s*DR|Key Takeaways|Summary)\*\*|\*\*(?:TL;?\s*DR|Key Takeaways|Summary)\*\*)\s*\n+([\s\S]*?)(?=(?:\n##|\n{3,}|$))/i;
  const legTldrMatch = text.match(legacyTldrRegex);
  if (legTldrMatch) {
    legacyTldrBullets = parseTldrBlock(legTldrMatch[1]);
    text = text.replace(legTldrMatch[0], '\n\n');
  }

  // 5. Scan all `## ` headings and standalone bold structural headings in text
  const headings: HeadingEntry[] = [];
  const headingRegex = /(?:^|\n)(?:(##\s*([^\n]+))|(\*\*(?:Sources(?:\s*&\s*References)?|References|About the (?:author|founder)|TL;?\s*DR|Key Takeaways|Summary|FAQs?|Frequently Asked Questions|Quick\s*[Vv]erdict|Article\s*Content)\*\*(?:[^\S\r\n]*(?:\([^)\n]*\)|:))?[^\S\r\n]*))(?=\n|$)/gi;
  let hMatch: RegExpExecArray | null;

  while ((hMatch = headingRegex.exec(text)) !== null) {
    const isH2 = Boolean(hMatch[1]);
    const rawHeading = (isH2 ? hMatch[1] : hMatch[3]).trim();
    const rawTitle = isH2 ? hMatch[2] : hMatch[3];
    const cleanTitle = rawTitle
      .trim()
      .replace(/\s*\([^)]*\)$/, '')
      .replace(/:$/, '')
      .replace(/^[*_~`]+|[*_~`]+$/g, '')
      .trim();
    const startIndex = hMatch.index + (hMatch[0].startsWith('\n') ? 1 : 0);
    const headerEndIndex = startIndex + rawHeading.length;

    let type: HeadingEntry['type'] = 'article_section';

    if (/^(?:tl;?\s*dr|key takeaways|summary)$/i.test(cleanTitle)) {
      type = 'tldr';
    } else if (/^quick\s*verdict$/i.test(cleanTitle)) {
      type = 'quick_verdict';
    } else if (/^article\s*content$/i.test(cleanTitle)) {
      type = 'article_content';
    } else if (/^(?:sources(?:\s*&\s*references)?|references|further reading)$/i.test(cleanTitle)) {
      type = 'sources';
    } else if (/^(?:faqs?|frequently asked questions|questions parents(?: often)? ask)$/i.test(cleanTitle)) {
      type = 'faqs';
    } else if (/^about the (?:author|founder)$/i.test(cleanTitle)) {
      type = 'about_author';
    }

    headings.push({
      rawHeading,
      cleanTitle,
      type,
      startIndex,
      headerEndIndex,
    });
  }

  headings.sort((a, b) => a.startIndex - b.startIndex);

  let tldrBullets = legacyTldrBullets;
  let quickVerdict = legacyQuickVerdict;
  let sourcesList: BlogSourceItem[] = [];
  let faqsList: BlogFAQItem[] = [];
  let articleContentDetected = false;

  const tldrEntry = headings.find((h) => h.type === 'tldr');
  const qvEntry = headings.find((h) => h.type === 'quick_verdict');
  const acEntry = headings.find((h) => h.type === 'article_content');
  const sourcesEntry = headings.find((h) => h.type === 'sources');
  const faqsEntry = headings.find((h) => h.type === 'faqs');
  const aboutEntry = headings.find((h) => h.type === 'about_author');

  // Parse TL;DR from `## TL;DR` heading
  // Strict boundary: ends at the very next `## ` heading of any kind
  if (tldrEntry) {
    const nextH = headings.find((h) => h.startIndex > tldrEntry.startIndex);
    const endIdx = nextH ? nextH.startIndex : text.length;
    const body = text.slice(tldrEntry.headerEndIndex, endIdx);
    tldrBullets = parseTldrBlock(body);
  }

  // Parse Quick Verdict from `## Quick Verdict` heading
  // Strict boundary: ends at the very next `## ` heading of any kind
  if (qvEntry) {
    const nextH = headings.find((h) => h.startIndex > qvEntry.startIndex);
    const endIdx = nextH ? nextH.startIndex : text.length;
    const body = text.slice(qvEntry.headerEndIndex, endIdx);
    quickVerdict = body.trim();
  }

  // Parse Sources from `## Sources`
  // Boundary: ends at next terminal heading (faqs or about_author) or end of text
  if (sourcesEntry) {
    const nextTerminal = headings.find(
      (h) => h.startIndex > sourcesEntry.startIndex && (h.type === 'faqs' || h.type === 'about_author')
    );
    const endIdx = nextTerminal ? nextTerminal.startIndex : text.length;
    const body = text.slice(sourcesEntry.headerEndIndex, endIdx);
    sourcesList = parseSourcesBlock(body);
  }

  // Parse FAQs from `## FAQs`
  // Boundary: ends at next terminal heading (sources or about_author) or end of text
  if (faqsEntry) {
    const nextTerminal = headings.find(
      (h) => h.startIndex > faqsEntry.startIndex && (h.type === 'sources' || h.type === 'about_author')
    );
    const endIdx = nextTerminal ? nextTerminal.startIndex : text.length;
    const body = text.slice(faqsEntry.headerEndIndex, endIdx);
    faqsList = parseFaqsBlock(body);
  }

  // Determine Main Article Content Boundaries
  let contentStartIdx = 0;
  if (acEntry) {
    articleContentDetected = true;
    contentStartIdx = acEntry.headerEndIndex;
  } else {
    // If no ## Article Content marker:
    // Content starts at the first heading that is not tldr, quick_verdict, sources, faqs, or about_author
    const firstArticleHeading = headings.find(
      (h) =>
        h.type !== 'tldr' &&
        h.type !== 'quick_verdict' &&
        h.type !== 'sources' &&
        h.type !== 'faqs' &&
        h.type !== 'about_author'
    );
    if (firstArticleHeading) {
      contentStartIdx = firstArticleHeading.startIndex;
    } else {
      // If no headings exist, content starts after intro sections
      const introH = [tldrEntry, qvEntry].filter(Boolean) as HeadingEntry[];
      if (introH.length > 0) {
        const lastIntro = introH.reduce((max, h) => (h.startIndex > max.startIndex ? h : max), introH[0]);
        const nextH = headings.find((h) => h.startIndex > lastIntro.startIndex);
        contentStartIdx = nextH ? nextH.startIndex : lastIntro.headerEndIndex;
      }
    }
  }

  // End of article content: earliest terminal heading (Sources, FAQs, About Author)
  const terminalHeadings = [sourcesEntry, faqsEntry, aboutEntry]
    .filter(Boolean)
    .filter((h) => (h as HeadingEntry).startIndex >= contentStartIdx) as HeadingEntry[];

  const contentEndIdx = terminalHeadings.length > 0
    ? Math.min(...terminalHeadings.map((h) => h.startIndex))
    : text.length;

  let rawContent = text.slice(contentStartIdx, contentEndIdx);

  // If there was no ## Article Content marker, clean any leftover introductory TLDR or Quick Verdict blocks
  if (!acEntry) {
    if (tldrEntry && rawContent.includes(tldrEntry.rawHeading)) {
      rawContent = rawContent.replace(tldrEntry.rawHeading, '').trim();
    }
    if (qvEntry && rawContent.includes(qvEntry.rawHeading)) {
      rawContent = rawContent.replace(qvEntry.rawHeading, '').trim();
    }
  }

  // Clean article content: normalize whitespace while strictly preserving all H2s and H3s
  const cleanContent = rawContent
    .replace(/\r\n/g, '\n')
    .replace(/^\s*\n+/, '')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/(?:\n\s*---\s*)+$/, '')
    .trim();

  // Calculate word count
  const words = cleanContent
    .replace(/<[^>]*>/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[#*`_~>-]/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;

  // Unidentified structured sections reporting
  const unidentifiedSections: string[] = [];
  if (tldrBullets.length === 0) unidentifiedSections.push('TL;DR');
  if (!quickVerdict) unidentifiedSections.push('Quick Verdict');
  if (sourcesList.length === 0) unidentifiedSections.push('Sources');
  if (faqsList.length === 0) unidentifiedSections.push('FAQs');

  return {
    title: detectedTitle,
    tldr: tldrBullets,
    quickVerdict,
    sources: sourcesList,
    faqs: faqsList,
    authorName: authorRes.authorName,
    authorMatched: authorRes.authorMatched,
    authorLinkedIn: authorRes.authorLinkedIn,
    cleanContent,
    unidentifiedSections,
    stats: {
      wordCount: words,
      tldrCount: tldrBullets.length,
      quickVerdictDetected: Boolean(quickVerdict),
      sourcesCount: sourcesList.length,
      faqsCount: faqsList.length,
      authorDetected: Boolean(authorRes.authorName || authorRes.authorMatched),
      articleContentDetected: articleContentDetected || cleanContent.length > 0,
    },
  };
}
