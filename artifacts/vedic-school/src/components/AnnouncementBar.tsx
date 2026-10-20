import React, { useRef, useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import { useLocation } from 'wouter';
import { useDemoModal } from '@/context/DemoModalContext';
import { trackCtaClick } from '@/lib/analytics';
import { cn } from '@/lib/utils';

/**
 * ==============================================================================
 * THE VEDIC SCHOOL — TOP ANNOUNCEMENT BAR
 * ==============================================================================
 *
 * Configurable destination for the campaign CTA:
 * - When null or empty: Opens the existing Sunday Demo registration modal.
 * - When set to a URL string (e.g. "/canada-demo"): Navigates to that destination.
 */
export const ANNOUNCEMENT_CAMPAIGN_URL: string | null = '/canada-demo';

export interface AnnouncementBarProps {
  onDismiss?: () => void;
  className?: string;
}

/**
 * Crisp Canadian Flag SVG (2:1 aspect ratio)
 * Cross-platform vector rendering ensures sharp, faithful red-and-white display
 * on all operating systems and browsers without relying on OS emoji variations.
 */
function CanadaFlag({ className = 'w-5 h-3.5 sm:w-6 sm:h-4' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 4 2"
      className={cn('shrink-0 rounded-[2px] shadow-2xs select-none', className)}
      role="img"
      aria-label="Canada 🇨🇦"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="4" height="2" fill="#FFFFFF" />
      <rect width="1" height="2" fill="#D80621" />
      <rect x="3" width="1" height="2" fill="#D80621" />
      {/* 11-point Canadian Maple Leaf */}
      <path
        d="M2.0 0.35 L2.08 0.62 L2.35 0.55 L2.22 0.78 L2.45 0.85 L2.18 0.95 L2.28 1.15 L2.05 1.05 L2.0 1.3 L1.95 1.05 L1.72 1.15 L1.82 0.95 L1.55 0.85 L1.78 0.78 L1.65 0.55 L1.92 0.62 Z"
        fill="#D80621"
      />
    </svg>
  );
}

export function AnnouncementBar({ onDismiss, className }: AnnouncementBarProps) {
  const barRef = useRef<HTMLDivElement>(null);
  const { openDemoModal } = useDemoModal();
  const [, setLocation] = useLocation();

  // Measure and synchronize the announcement bar height into a CSS variable
  // so the layout/hero section can push down seamlessly without any overlap.
  useEffect(() => {
    const updateHeight = () => {
      if (barRef.current) {
        const height = barRef.current.offsetHeight;
        document.documentElement.style.setProperty('--announcement-bar-height', `${height}px`);
      }
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);

    return () => {
      window.removeEventListener('resize', updateHeight);
    };
  }, []);

  const handleCtaClick = useCallback(() => {
    trackCtaClick('book_free_demo', 'announcement_bar', 'vedic_maths');

    if (ANNOUNCEMENT_CAMPAIGN_URL) {
      if (ANNOUNCEMENT_CAMPAIGN_URL.startsWith('http://') || ANNOUNCEMENT_CAMPAIGN_URL.startsWith('https://')) {
        window.location.href = ANNOUNCEMENT_CAMPAIGN_URL;
      } else {
        setLocation(ANNOUNCEMENT_CAMPAIGN_URL);
      }
    } else {
      openDemoModal();
    }
  }, [openDemoModal, setLocation]);

  const handleDismiss = useCallback(() => {
    document.documentElement.style.setProperty('--announcement-bar-height', '0px');
    onDismiss?.();
  }, [onDismiss]);

  return (
    <aside
      ref={barRef}
      role="region"
      aria-label="Announcement"
      className={cn(
        'w-full bg-primary text-white relative z-50 selection:bg-white/20 selection:text-white',
        className
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 xl:px-8 py-2 sm:py-2.5 flex items-center justify-between gap-3 text-xs sm:text-[13px] md:text-sm">
        {/* Main Content Area (Centered) */}
        <div className="flex-1 flex flex-wrap items-center justify-center text-center gap-x-2.5 sm:gap-x-3 gap-y-1.5 pr-8 sm:pr-10 lg:pr-0 pl-1 sm:pl-0">
          {/* Flag + Combined Copy (Single spacebar gap) */}
          <div className="inline-flex items-center gap-1.5 sm:gap-2 flex-wrap justify-center text-center">
            <CanadaFlag />
            <span className="tracking-tight text-center">
              <span className="font-semibold text-white">What if Maths felt easier for your child?</span>{' '}
              <span className="text-white/95 font-normal">Book your spot for a free Vedic Maths demo class.</span>
            </span>
          </div>

          {/* Subtle Divider (Desktop lg+) */}
          <span
            className="hidden lg:inline text-white/40 select-none font-light"
            aria-hidden="true"
          >
            |
          </span>

          {/* Contrasting Cream CTA Button */}
          <button
            type="button"
            onClick={handleCtaClick}
            className="inline-flex items-center gap-1 px-3 sm:px-3.5 py-1 sm:py-1 rounded-full bg-[#FAF6F0] hover:bg-white text-primary font-medium text-xs sm:text-[13px] shadow-2xs hover:shadow-xs transition-all active:scale-[0.98] cursor-pointer whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary shrink-0"
            aria-label="Reserve a spot for a free Vedic Maths demo class"
          >
            <span>Reserve a Spot</span>
            <span className="font-sans leading-none text-xs sm:text-sm transition-transform group-hover:translate-x-0.5">
              →
            </span>
          </button>
        </div>

        {/* Dismiss Button (Far Right) */}
        <div className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 shrink-0">
          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Dismiss announcement"
            className="p-1 rounded-md text-white/80 hover:text-white hover:bg-black/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
