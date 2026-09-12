// ==============================================================================
// THE VEDIC SCHOOL — 404 NOT FOUND PAGE
// ==============================================================================

import { useEffect } from 'react';
import { Link } from 'wouter';
import { ArrowRight, Compass } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  // Manage SEO metadata for the 404 page
  useEffect(() => {
    const originalTitle = document.title;
    document.title = 'Page not found | The Vedic School';

    // 1. Ensure robots meta is set to noindex, follow
    let robotsMeta = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    let createdRobots = false;
    let originalRobots = '';

    if (!robotsMeta) {
      robotsMeta = document.createElement('meta');
      robotsMeta.name = 'robots';
      robotsMeta.content = 'noindex, follow';
      document.head.appendChild(robotsMeta);
      createdRobots = true;
    } else {
      originalRobots = robotsMeta.content;
      robotsMeta.content = 'noindex, follow';
    }

    // 2. Remove any canonical tag so 404 page never inherits homepage canonical
    const canonicalLink = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    const originalCanonical = canonicalLink?.getAttribute('href') || null;
    if (canonicalLink) {
      canonicalLink.remove();
    }

    // 3. Remove all JSON-LD schemas so 404 never provides structured data
    const jsonLdScripts = document.querySelectorAll('script[type="application/ld+json"]');
    const removedScripts: { node: Node; parent: Node }[] = [];
    jsonLdScripts.forEach((script) => {
      if (script.parentNode) {
        removedScripts.push({ node: script, parent: script.parentNode });
        script.parentNode.removeChild(script);
      }
    });

    // Cleanup on unmount (when user navigates away from 404)
    return () => {
      // If originalTitle was already a 404 title (e.g. direct landing on 404 page),
      // restore the canonical site title rather than preserving the 404 title.
      if (
        !originalTitle ||
        originalTitle.toLowerCase().includes('not found') ||
        originalTitle.includes('404')
      ) {
        document.title = 'The Vedic School — Vedic Maths & Curriculum-Aligned Classes';
      } else {
        document.title = originalTitle;
      }

      // If robots meta was dynamically created or previously contained noindex from 404.html,
      // remove it so legitimate destination pages are not marked as noindex.
      if (robotsMeta) {
        if (createdRobots || originalRobots.includes('noindex')) {
          robotsMeta.remove();
        } else {
          robotsMeta.content = originalRobots;
        }
      }

      if (originalCanonical) {
        const restoredCanonical = document.createElement('link');
        restoredCanonical.rel = 'canonical';
        restoredCanonical.href = originalCanonical;
        document.head.appendChild(restoredCanonical);
      }

      removedScripts.forEach(({ node, parent }) => {
        parent.appendChild(node);
      });
    };
  }, []);

  return (
    <div className="min-h-[70vh] w-full flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16 bg-[hsl(var(--background))]">
      <div className="max-w-lg w-full text-center space-y-8">
        {/* Soft decorative badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[hsl(var(--block-terracotta-light))] text-[hsl(var(--primary))] border border-[hsl(var(--block-terracotta-light-border))] text-xs font-semibold tracking-wide uppercase">
          <Compass className="w-3.5 h-3.5" />
          <span>404 • Page Not Found</span>
        </div>

        {/* Heading & description */}
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-stone-900 tracking-tight">
            Page not found
          </h1>
          <p className="text-base sm:text-lg text-stone-600 font-sans leading-relaxed max-w-md mx-auto">
            The page you're looking for doesn't exist or may have moved.
          </p>
        </div>

        {/* Action button */}
        <div className="pt-2">
          <Link href="/">
            <Button
              size="lg"
              className="inline-flex items-center gap-2 bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/90 text-white px-6 py-3 rounded-xl font-medium shadow-sm transition-all text-sm group"
            >
              <span>Back to home</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </Link>
        </div>

        {/* Secondary helper links */}
        <div className="pt-6 border-t border-stone-200/60 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-stone-500 font-medium">
          <Link href="/vedic-maths" className="hover:text-[hsl(var(--primary))] transition-colors">
            Vedic Maths
          </Link>
          <span className="text-stone-300">•</span>
          <Link href="/curriculum-aligned" className="hover:text-[hsl(var(--primary))] transition-colors">
            Curriculum Classes
          </Link>
          <span className="text-stone-300">•</span>
          <Link href="/about" className="hover:text-[hsl(var(--primary))] transition-colors">
            About
          </Link>
          <span className="text-stone-300">•</span>
          <Link href="/blog" className="hover:text-[hsl(var(--primary))] transition-colors">
            Blog
          </Link>
          <span className="text-stone-300">•</span>
          <Link href="/contact" className="hover:text-[hsl(var(--primary))] transition-colors">
            Contact
          </Link>
        </div>
      </div>
    </div>
  );
}

