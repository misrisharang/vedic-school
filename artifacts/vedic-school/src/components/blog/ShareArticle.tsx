import React, { useState } from 'react';
import { Share2, Check, Link as LinkIcon, Linkedin } from 'lucide-react';

interface ShareArticleProps {
  title: string;
  url: string;
}

export const ShareArticle: React.FC<ShareArticleProps> = ({ title, url }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      if (typeof window !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // Fallback
    }
  };

  const encodedTitle = encodeURIComponent(title || 'The Vedic School Article');
  const encodedUrl = encodeURIComponent(url);

  return (
    <div className="space-y-2.5">
      <div className="flex items-center gap-1.5 text-stone-400 text-[11px] font-bold uppercase tracking-wider font-sans">
        <Share2 className="w-3.5 h-3.5 text-stone-400" aria-hidden="true" />
        <span>Share Article</span>
      </div>

      <div className="flex items-center gap-2">
        {/* Copy Link */}
        <button
          type="button"
          onClick={handleCopy}
          title={copied ? 'Link copied!' : 'Copy link to clipboard'}
          aria-label={copied ? 'Link copied to clipboard' : 'Copy link to clipboard'}
          className="w-8 h-8 rounded-lg bg-stone-50 hover:bg-stone-100 text-stone-600 hover:text-stone-900 border border-stone-200/90 flex items-center justify-center transition-colors shadow-2xs focus:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--primary))]/40"
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
          ) : (
            <LinkIcon className="w-3.5 h-3.5" aria-hidden="true" />
          )}
        </button>

        {/* X / Twitter */}
        <a
          href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          title="Share on X (Twitter)"
          aria-label="Share this article on X (opens in a new tab)"
          className="w-8 h-8 rounded-lg bg-stone-50 hover:bg-stone-100 text-stone-600 hover:text-stone-900 border border-stone-200/90 flex items-center justify-center transition-colors shadow-2xs focus:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--primary))]/40"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5" aria-hidden="true">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </a>

        {/* LinkedIn */}
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          title="Share on LinkedIn"
          aria-label="Share this article on LinkedIn (opens in a new tab)"
          className="w-8 h-8 rounded-lg bg-stone-50 hover:bg-stone-100 text-stone-600 hover:text-stone-900 border border-stone-200/90 flex items-center justify-center transition-colors shadow-2xs focus:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--primary))]/40"
        >
          <Linkedin className="w-3.5 h-3.5" aria-hidden="true" />
        </a>

        {/* WhatsApp */}
        <a
          href={`https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          title="Share via WhatsApp"
          aria-label="Share this article via WhatsApp (opens in a new tab)"
          className="w-8 h-8 rounded-lg bg-stone-50 hover:bg-stone-100 text-stone-600 hover:text-stone-900 border border-stone-200/90 flex items-center justify-center transition-colors shadow-2xs focus:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--primary))]/40"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5" aria-hidden="true">
            <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.44 0-2.85-.38-4.09-1.11l-.29-.17-3.11.82.83-3.03-.19-.31a8.216 8.216 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.53c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.24-.75-.67-1.26-1.49-1.41-1.74-.14-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.47c-.17 0-.44.06-.67.31-.23.25-.87.85-.87 2.08s.89 2.42 1.01 2.59c.13.17 1.75 2.67 4.24 3.74.59.26 1.05.41 1.41.53.6.19 1.14.16 1.57.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.07-.11-.23-.17-.48-.3" />
          </svg>
        </a>
      </div>
    </div>
  );
};
