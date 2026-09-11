import React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X, Lock } from 'lucide-react';
import { officialLogoSrc } from '@/assets/officialLogo';
import { cn } from '@/lib/utils';

interface RegistrationModalBaseProps {
  isOpen: boolean;
  onClose: () => void;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  maxWidthClass?: string;
  isSubmitted?: boolean;
  successContent?: React.ReactNode;
}

export function RegistrationModalBase({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidthClass = 'max-w-[500px]',
  isSubmitted,
  successContent,
}: RegistrationModalBaseProps) {
  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogPrimitive.Portal>
        {/* Soft Backdrop Overlay */}
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/55 backdrop-blur-xs transition-opacity duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />

        {/* Modal Surface Container */}
        <DialogPrimitive.Content
          className={cn(
            'fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[94%] sm:w-full max-h-[92vh] overflow-y-auto',
            maxWidthClass,
            'bg-[#FAF6F0]/95 backdrop-blur-md border border-[#E8DFCFA0] shadow-[0_25px_60px_-15px_rgba(59,66,76,0.28)] rounded-[2rem] p-6 sm:p-8 md:p-9',
            'focus:outline-none transition-all duration-300',
            'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
            'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
            'data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]',
            'data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]'
          )}
        >
          {/* Subtle learning & math background illustration (strictly no botanicals) */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[2rem] z-0 opacity-[0.06] text-foreground select-none" aria-hidden="true">
            {/* Top-right mathematical coordinate circle & pyramid geometry */}
            <svg
              className="absolute -top-8 -right-8 w-56 h-56"
              viewBox="0 0 200 200"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            >
              <circle cx="100" cy="100" r="85" strokeDasharray="4 4" />
              <circle cx="100" cy="100" r="60" />
              <circle cx="100" cy="100" r="35" strokeDasharray="2 2" />
              <line x1="15" y1="100" x2="185" y2="100" strokeWidth="0.75" />
              <line x1="100" y1="15" x2="100" y2="185" strokeWidth="0.75" />
              {/* Pyramid geometry from reference */}
              <polygon points="100,25 160,140 40,140" strokeWidth="0.75" />
              <line x1="100" y1="25" x2="100" y2="140" strokeWidth="0.5" strokeDasharray="2 2" />
            </svg>

            {/* Bottom-left abacus and calculation motif */}
            <svg
              className="absolute -bottom-10 -left-10 w-48 h-48"
              viewBox="0 0 180 180"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            >
              <line x1="20" y1="45" x2="160" y2="45" strokeWidth="0.6" />
              <line x1="20" y1="75" x2="160" y2="75" strokeWidth="0.6" />
              <line x1="20" y1="105" x2="160" y2="105" strokeWidth="0.6" />
              <line x1="20" y1="135" x2="160" y2="135" strokeWidth="0.6" />
              {/* Subtle beads */}
              <circle cx="55" cy="45" r="7" fill="currentColor" fillOpacity="0.1" />
              <circle cx="95" cy="75" r="7" fill="currentColor" fillOpacity="0.1" />
              <circle cx="130" cy="105" r="7" fill="currentColor" fillOpacity="0.1" />
              <circle cx="70" cy="135" r="7" fill="currentColor" fillOpacity="0.1" />
              {/* Calculation text watermark */}
              <text x="35" y="165" fontSize="11" fontFamily="serif" fill="currentColor" stroke="none">21 × 11</text>
              <text x="100" y="165" fontSize="11" fontFamily="serif" fill="currentColor" stroke="none">9² = 81</text>
            </svg>
          </div>

          {/* Close 'X' Button */}
          <DialogPrimitive.Close
            onClick={onClose}
            className="absolute right-4 top-4 sm:right-6 sm:top-6 z-20 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-foreground/70 hover:text-foreground shadow-2xs border border-border/50 flex items-center justify-center transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/40"
            aria-label="Close popup"
          >
            <X className="w-4 h-4" />
          </DialogPrimitive.Close>

          {/* Modal Content */}
          <div className="relative z-10">
            {isSubmitted && successContent ? (
              successContent
            ) : (
              <div>
                {/* Standardized Brand Header */}
                <div className="flex flex-col items-center justify-center text-center mb-4 sm:mb-5">
                  <div className="flex items-center justify-center gap-2.5 mb-3">
                    {/* Official Uploaded Logo: exact proportions, no distortion */}
                    <img
                      src={officialLogoSrc}
                      alt="The Vedic School"
                      className="w-7 h-7 sm:w-8 sm:h-8 object-contain shrink-0"
                      width={32}
                      height={32}
                    />
                    <span className="text-[11px] sm:text-xs font-sans font-semibold tracking-[0.2em] text-[#6E5A44] uppercase">
                      THE VEDIC SCHOOL
                    </span>
                  </div>

                  {/* Accessible Dialog Title */}
                  <DialogPrimitive.Title asChild>
                    <div className="w-full">
                      {title}
                    </div>
                  </DialogPrimitive.Title>

                  {/* Optional Subtitle (used in Sunday Demo, omitted in Personal Assessment) */}
                  {subtitle && (
                    <DialogPrimitive.Description className="text-xs sm:text-sm text-foreground/75 leading-relaxed mt-2 max-w-sm mx-auto">
                      {subtitle}
                    </DialogPrimitive.Description>
                  )}
                </div>

                {/* Body Form */}
                {children}
              </div>
            )}
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

/**
 * Reusable Trust Indicator displayed at the bottom of forms
 */
export function TrustIndicator() {
  return (
    <div className="flex items-center justify-center gap-1.5 text-xs text-foreground/60 mt-3.5 select-none">
      <Lock className="w-3.5 h-3.5 text-foreground/45" />
      <span>Your information is safe with us.</span>
    </div>
  );
}
