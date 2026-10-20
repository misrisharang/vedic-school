import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Plays a Vedic Maths shortcut (multiplying numbers near 100) step by step
 * when scrolled into view: 98 × 97 -> gaps from 100 -> 95 | 06 -> 9506.
 * Every row is always rendered (only opacity/transform animate), so there is no layout shift.
 * Reduced motion: shows the finished working immediately.
 */
const STEP_MS = 1400;
const LAST_STEP = 3;

function Reveal({
  show,
  className,
  children,
}: {
  show: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      className={className}
      initial={false}
      animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function VedicTrickDemo({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);
  const [run, setRun] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setStep(LAST_STEP);
      return;
    }
    setStep(0);
    const timers = [1, 2, 3].map((n) => window.setTimeout(() => setStep(n), n * STEP_MS));
    return () => timers.forEach(window.clearTimeout);
  }, [inView, reduce, run]);

  return (
    <div
      ref={ref}
      className={cn(
        'bg-white rounded-2xl border border-[#DCE6D8] shadow-[0_10px_30px_-12px_rgba(63,94,60,0.25)] p-5 sm:p-6',
        className
      )}
    >
      <div className="flex items-center justify-between gap-3 mb-4">
        <h3 className="font-serif text-lg sm:text-xl font-semibold text-[#1E2B3C]">
          Try a Vedic Maths shortcut
        </h3>
        <button
          type="button"
          onClick={() => setRun((r) => r + 1)}
          className={cn(
            'shrink-0 whitespace-nowrap inline-flex items-center gap-1.5 text-xs font-medium text-[#A84824] hover:text-[#7F361B] rounded-full px-2.5 py-1 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
            step === LAST_STEP && !reduce ? 'opacity-100' : 'opacity-0 pointer-events-none'
          )}
          tabIndex={step === LAST_STEP && !reduce ? 0 : -1}
        >
          <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
          Play again
        </button>
      </div>

      {/* Screen readers get the whole working at once */}
      <p className="sr-only">
        Multiply 98 by 97. 98 is 2 below 100 and 97 is 3 below 100. Subtract across: 98 minus 3 is 95.
        Multiply the gaps: 2 times 3 is 06. Put them together: 98 times 97 is 9506.
      </p>

      <div aria-hidden="true">
        {/* Step 0 and 1: the sum, with each number's gap from 100 */}
        <div className="flex items-start justify-center gap-4 sm:gap-6 font-serif text-[#1E2B3C]">
          <div className="text-center">
            <div className="text-4xl sm:text-5xl font-semibold leading-none">98</div>
            <Reveal show={step >= 1} className="mt-2 text-sm font-sans font-semibold text-[#B04C27]">
              −2
            </Reveal>
          </div>
          <div className="text-3xl sm:text-4xl text-foreground/50 leading-none pt-1">×</div>
          <div className="text-center">
            <div className="text-4xl sm:text-5xl font-semibold leading-none">97</div>
            <Reveal show={step >= 1} className="mt-2 text-sm font-sans font-semibold text-[#B04C27]">
              −3
            </Reveal>
          </div>
        </div>
        <Reveal show={step >= 1} className="text-center text-xs text-foreground/75 mt-1">
          How far is each number below 100?
        </Reveal>

        {/* Step 2: the two halves of the answer */}
        <div className="grid grid-cols-2 gap-3 mt-5">
          <Reveal show={step >= 2} className="rounded-xl bg-[#FBECE3] px-3 py-3 text-center">
            <div className="text-[11px] sm:text-xs text-foreground/75 mb-1">Subtract across</div>
            <div className="font-serif text-lg sm:text-xl font-semibold text-[#1E2B3C]">
              98 − 3 = <span className="text-[#B04C27]">95</span>
            </div>
          </Reveal>
          <Reveal show={step >= 2} className="rounded-xl bg-[#EEF3EC] px-3 py-3 text-center">
            <div className="text-[11px] sm:text-xs text-foreground/75 mb-1">Multiply the gaps</div>
            <div className="font-serif text-lg sm:text-xl font-semibold text-[#1E2B3C]">
              2 × 3 = <span className="text-[#3F5E3C]">06</span>
            </div>
          </Reveal>
        </div>

        {/* Step 3: the answer */}
        <Reveal show={step >= 3} className="mt-5 text-center">
          <div className="font-serif text-4xl sm:text-5xl font-semibold leading-none">
            <span className="text-[#B04C27]">95</span>
            <span className="text-[#3F5E3C]">06</span>
          </div>
          <div className="mt-2 text-sm text-foreground/80">98 × 97 = 9506, worked out in seconds.</div>
        </Reveal>
      </div>
    </div>
  );
}
