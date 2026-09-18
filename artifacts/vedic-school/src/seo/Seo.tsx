// ==============================================================================
// THE VEDIC SCHOOL — DECLARATIVE SEO & STRUCTURED DATA COMPONENT
// ==============================================================================
// Renders document title, meta description, canonical link, Open Graph,
// Twitter card, and JSON-LD schema.
// React 19 hoists title/meta/link tags to document <head>, while the JSON-LD script
// is captured directly into static HTML by Puppeteer prerendering.
// ==============================================================================

import React, { useEffect } from 'react';
import { abs } from './site';

export interface SeoProps {
  title: string;
  description: string;
  path: string;
  schema?: Record<string, unknown>;
  noindex?: boolean;
  ogType?: 'website' | 'article';
  ogImage?: string;
  ogImageWidth?: number;
  ogImageHeight?: number;
  ogImageAlt?: string;
  articleMeta?: {
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
  };
}

const DEFAULT_OG_IMAGE = '/assets/vedic-school-og-image.png';
const DEFAULT_OG_WIDTH = 1024;
const DEFAULT_OG_HEIGHT = 576;
const DEFAULT_OG_ALT = 'The Vedic School with Vedic Maths and Curriculum-Aligned Maths';

export function Seo({
  title,
  description,
  path,
  schema,
  noindex = false,
  ogType = 'website',
  ogImage,
  ogImageWidth,
  ogImageHeight,
  ogImageAlt,
  articleMeta,
}: SeoProps) {
  const canonicalUrl = abs(path);

  // Normalize ogImage: fallback to default if unspecified or if pointing to legacy /og/home.jpg
  const effectiveOgImage = noindex
    ? undefined
    : (!ogImage || ogImage === '/og/home.jpg' ? DEFAULT_OG_IMAGE : ogImage);

  const isDefaultImage = effectiveOgImage === DEFAULT_OG_IMAGE;
  const effectiveOgWidth = (isDefaultImage && (!ogImageWidth || ogImageWidth === 1200))
    ? DEFAULT_OG_WIDTH
    : (ogImageWidth || (isDefaultImage ? DEFAULT_OG_WIDTH : 1200));
  const effectiveOgHeight = (isDefaultImage && (!ogImageHeight || ogImageHeight === 630))
    ? DEFAULT_OG_HEIGHT
    : (ogImageHeight || (isDefaultImage ? DEFAULT_OG_HEIGHT : 630));
  const effectiveOgAlt = ogImageAlt || (isDefaultImage ? DEFAULT_OG_ALT : title);

  const resolvedOgImage = effectiveOgImage
    ? effectiveOgImage.startsWith('http')
      ? effectiveOgImage
      : abs(effectiveOgImage)
    : undefined;

  useEffect(() => {
    document.title = title;

    // Helper to set or create meta tag
    const setMeta = (attribute: 'name' | 'property', attrValue: string, content: string | undefined) => {
      let el = document.querySelector(`meta[${attribute}="${attrValue}"]`);
      if (!content) {
        if (el) el.remove();
        return;
      }
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attribute, attrValue);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    setMeta('name', 'description', description);

    // Canonical link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', canonicalUrl);

    // Open Graph
    setMeta('property', 'og:type', ogType);
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', canonicalUrl);
    setMeta('property', 'og:image', resolvedOgImage);
    setMeta('property', 'og:image:url', resolvedOgImage);
    if (resolvedOgImage?.startsWith('https://')) {
      setMeta('property', 'og:image:secure_url', resolvedOgImage);
    } else {
      setMeta('property', 'og:image:secure_url', undefined);
    }
    if (resolvedOgImage) {
      setMeta('property', 'og:image:width', String(effectiveOgWidth));
      setMeta('property', 'og:image:height', String(effectiveOgHeight));
      if (effectiveOgAlt) {
        setMeta('property', 'og:image:alt', effectiveOgAlt);
      }
    }

    // Twitter
    setMeta('name', 'twitter:card', resolvedOgImage ? 'summary_large_image' : 'summary');
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', resolvedOgImage);
    if (resolvedOgImage && effectiveOgAlt) {
      setMeta('name', 'twitter:image:alt', effectiveOgAlt);
    }

    // Article
    if (ogType === 'article') {
      setMeta('property', 'article:published_time', articleMeta?.publishedTime);
      setMeta('property', 'article:modified_time', articleMeta?.modifiedTime);
      setMeta('property', 'article:author', articleMeta?.author);
    }
  }, [
    title,
    description,
    canonicalUrl,
    ogType,
    resolvedOgImage,
    effectiveOgWidth,
    effectiveOgHeight,
    effectiveOgAlt,
    articleMeta,
  ]);

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      {!noindex && <link rel="canonical" href={canonicalUrl} />}
      {noindex && <meta name="robots" content="noindex, follow" />}

      {/* Open Graph */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      {resolvedOgImage && <meta property="og:image" content={resolvedOgImage} />}
      {resolvedOgImage && <meta property="og:image:url" content={resolvedOgImage} />}
      {resolvedOgImage?.startsWith('https://') && <meta property="og:image:secure_url" content={resolvedOgImage} />}
      {resolvedOgImage && <meta property="og:image:width" content={String(effectiveOgWidth)} />}
      {resolvedOgImage && <meta property="og:image:height" content={String(effectiveOgHeight)} />}
      {resolvedOgImage && effectiveOgAlt && <meta property="og:image:alt" content={effectiveOgAlt} />}

      {/* Twitter */}
      <meta name="twitter:card" content={resolvedOgImage ? 'summary_large_image' : 'summary'} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {resolvedOgImage && <meta name="twitter:image" content={resolvedOgImage} />}
      {resolvedOgImage && effectiveOgAlt && <meta name="twitter:image:alt" content={effectiveOgAlt} />}

      {/* Article Meta */}
      {ogType === 'article' && articleMeta?.publishedTime && (
        <meta property="article:published_time" content={articleMeta.publishedTime} />
      )}
      {ogType === 'article' && articleMeta?.modifiedTime && (
        <meta property="article:modified_time" content={articleMeta.modifiedTime} />
      )}
      {ogType === 'article' && articleMeta?.author && (
        <meta property="article:author" content={articleMeta.author} />
      )}

      {/* Structured Data */}
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
    </>
  );
}
