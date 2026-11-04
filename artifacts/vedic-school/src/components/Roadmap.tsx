import React, { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { ChevronRight, type LucideIcon } from 'lucide-react';

export interface RoadmapStep {
  icon: LucideIcon;
  title: string;
  body: string;
}

const STOP_DELAY = 0.35;
/** Time for the travelling marker to go from the first stop to the last. */
const TRAVEL = 2.6;
/** Pause at the destination before the marker sets off again. */
const REST = 1.4;
const PULSE = 0.18; // fraction of TRAVEL a stop spends pulsing

/**
 * A route of stops joined by a track that draws itself on scroll, with stops
 * lighting up in order. The last stop is styled as the destination.
 * Once drawn, a marker travels the route on a loop: each stop pulses as the
 * marker reaches it and the destination ripples on arrival, showing progress
 * from the first step to the last.
 * Horizontal from `md` up, vertical below. Reduced motion shows it fully drawn and still.
 */
export function Roadmap({ steps }: { steps: RoadmapStep[] }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLOListElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const count = steps.length;
  const viewport = { once: true, amount: 0.6 };
  const drawX = reduce ? {} : { initial: { scaleX: 0 }, whileInView: { scaleX: 1 }, viewport };
  const drawY = reduce ? {} : { initial: { scaleY: 0 }, whileInView: { scaleY: 1 }, viewport };
  const trackTransition = { duration: STOP_DELAY * (count - 1), ease: 'easeInOut' as const };
  // The track runs from the centre of the first column to the centre of the last.
  const edge = `${50 / count}%`;

  // The looping layer starts once the track has finished drawing.
  const loopOn = inView && !reduce;
  const introDelay = STOP_DELAY * (count - 1) + 0.5;
  const loop = { duration: TRAVEL, repeat: Infinity, repeatDelay: REST, delay: introDelay, ease: 'linear' as const };

  /** Keyframe timing for a stop: still, then a quick pulse as the marker arrives. */
  const pulseTimes = (i: number) => {
    const at = count > 1 ? i / (count - 1) : 0;
    const start = Math.max(0, at - PULSE / 2);
    const end = Math.min(1, at + PULSE / 2);
    const times = [0, start, at, end, 1];
    // Keyframe times must increase strictly.
    for (let k = 1; k < times.length; k++) if (times[k] <= times[k - 1]) times[k] = times[k - 1] + 0.001;
    return times.map((t) => Math.min(t, 1));
  };

  const marker = (axis: 'x' | 'y') => (
    <motion.span
      aria-hidden="true"
      initial={{ opacity: 0 }}
      animate={
        loopOn
          ? {
              [axis === 'x' ? 'left' : 'top']: ['0%', '100%'],
              opacity: [0, 1, 1, 0],
              // Brand primary to secondary (literal values: CSS variables can't be interpolated).
              backgroundColor: ['#c85a32', '#76ab73'],
            }
          : undefined
      }
      transition={{ ...loop, opacity: { ...loop, times: [0, 0.06, 0.94, 1] } }}
      className={`absolute w-3.5 h-3.5 rounded-full ring-4 ring-background shadow-sm ${
        axis === 'x' ? 'top-1/2 -translate-y-1/2 -translate-x-1/2' : 'left-1/2 -translate-x-1/2 -translate-y-1/2'
      }`}
    />
  );

  return (
    <ol
      ref={ref}
      className="relative mt-10 grid gap-8 md:gap-6 md:[grid-template-columns:repeat(var(--stops),minmax(0,1fr))]"
      style={{ '--stops': count } as React.CSSProperties}
    >
      <motion.div
        aria-hidden="true"
        {...drawX}
        transition={trackTransition}
        style={{ originX: 0, left: edge, right: edge }}
        className="hidden md:block absolute top-7 h-1 rounded-full bg-gradient-to-r from-primary to-secondary"
      />
      {/* Travelling marker (desktop): rides the track from the first stop to the last */}
      <div aria-hidden="true" style={{ left: edge, right: edge }} className="hidden md:block absolute top-7 h-1 z-[5] pointer-events-none">
        {marker('x')}
      </div>
      {/* Direction arrows midway between stops (desktop) */}
      {steps.slice(1).map((step, i) => (
        <motion.span
          key={step.title}
          aria-hidden="true"
          initial={reduce ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={viewport}
          transition={{ duration: 0.3, delay: reduce ? 0 : (i + 0.5) * STOP_DELAY }}
          style={{ left: `${((i + 1) / count) * 100}%` }}
          className={`hidden md:flex absolute top-[18px] -translate-x-1/2 w-6 h-6 rounded-full bg-background items-center justify-center ${
            i < (count - 1) / 2 ? 'text-primary' : 'text-secondary'
          }`}
        >
          <ChevronRight className="w-5 h-5" strokeWidth={2.5} />
        </motion.span>
      ))}
      <motion.div
        aria-hidden="true"
        {...drawY}
        transition={trackTransition}
        style={{ originY: 0 }}
        className="md:hidden absolute left-[26px] top-7 bottom-7 w-1 rounded-full bg-gradient-to-b from-primary to-secondary"
      />
      {/* Travelling marker (mobile): runs down the vertical track */}
      <div aria-hidden="true" className="md:hidden absolute left-[26px] top-7 bottom-7 w-1 z-[5] pointer-events-none">
        {marker('y')}
      </div>

      {steps.map((step, i) => {
        const Icon = step.icon;
        const isDestination = i === count - 1;
        const times = pulseTimes(i);
        return (
          <motion.li
            key={step.title}
            initial={reduce ? false : { opacity: 0.35 }}
            whileInView={{ opacity: 1 }}
            viewport={viewport}
            transition={{ duration: 0.4, delay: reduce ? 0 : i * STOP_DELAY }}
            className="relative flex md:flex-col md:items-center md:text-center gap-5 md:gap-0"
          >
            <span className="relative z-10 shrink-0">
              {/* Arrival ripple on the destination */}
              {isDestination && (
                <motion.span
                  aria-hidden="true"
                  initial={{ opacity: 0, scale: 1 }}
                  animate={loopOn ? { opacity: [0, 0, 0.55, 0], scale: [1, 1, 1, 1.9] } : undefined}
                  transition={{ ...loop, times: [0, 0.9, 0.97, 1] }}
                  className="absolute inset-0 rounded-full bg-secondary"
                />
              )}
              <motion.span
                animate={loopOn ? { scale: [1, 1, 1.14, 1, 1] } : undefined}
                transition={{ ...loop, times }}
                className={`relative w-14 h-14 rounded-full flex items-center justify-center ${
                  isDestination
                    ? 'bg-secondary text-white shadow-[0_0_0_6px_hsl(var(--block-sage-light))]'
                    : 'bg-background border-[3px] border-primary text-primary'
                }`}
              >
                <Icon className="w-6 h-6" strokeWidth={1.75} aria-hidden="true" />
              </motion.span>
            </span>
            <div className="pt-2 md:pt-5">
              <h3 className="font-serif text-xl text-foreground">{step.title}</h3>
              <p className="mt-1 text-foreground/75 leading-relaxed md:max-w-[16rem]">{step.body}</p>
            </div>
          </motion.li>
        );
      })}
    </ol>
  );
}
