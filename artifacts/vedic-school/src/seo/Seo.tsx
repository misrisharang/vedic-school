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
  articleMeta?: {
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
  };
}

export function Seo({
  title,
  description,
  path,
  schema,
  noindex = false,
  ogType = 'website',
  ogImage = '/og/home.jpg',
  ogImageWidth = 1200,
  ogImageHeight = 630,
  articleMeta,
}: SeoProps) {
  const canonicalUrl = abs(path);
  const effectiveOgImage = noindex ? undefined : ogImage;
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
    if (resolvedOgImage) {
      setMeta('property', 'og:image:width', String(ogImageWidth));
      setMeta('property', 'og:image:height', String(ogImageHeight));
    }

    // Twitter
    setMeta('name', 'twitter:card', resolvedOgImage ? 'summary_large_image' : 'summary');
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', resolvedOgImage);

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
    ogImageWidth,
    ogImageHeight,
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
      {resolvedOgImage && <meta property="og:image:width" content={String(ogImageWidth)} />}
      {resolvedOgImage && <meta property="og:image:height" content={String(ogImageHeight)} />}

      {/* Twitter */}
      <meta name="twitter:card" content={resolvedOgImage ? 'summary_large_image' : 'summary'} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {resolvedOgImage && <meta name="twitter:image" content={resolvedOgImage} />}

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
