import React from 'react';
import { cn } from '@/lib/utils';

/**
 * Faint maths numbers and signs that drift slowly behind the hero content.
 * Pure CSS (transform-only keyframes in index.css); disabled under prefers-reduced-motion.
 */
type Glyph = {
  char: string;
  left: string;
  top: string;
  size: number;
  tone: 'terracotta' | 'sage';
  duration: number;
  delay: number;
  dx: number;
  dy: number;
  rotate: number;
  /** Shown from sm up only, to keep phones calmer */
  wideOnly?: boolean;
};

const GLYPHS: Glyph[] = [
  { char: '7', left: '3%', top: '10%', size: 56, tone: 'terracotta', duration: 11, delay: 0, dx: 14, dy: -26, rotate: -8 },
  { char: '×', left: '31%', top: '7%', size: 40, tone: 'sage', duration: 13, delay: -4, dx: -12, dy: 22, rotate: 10 },
  { char: '9', left: '37%', top: '74%', size: 64, tone: 'sage', duration: 15, delay: -7, dx: 18, dy: -30, rotate: 6 },
  { char: '+', left: '6%', top: '88%', size: 38, tone: 'terracotta', duration: 12, delay: -2, dx: -10, dy: -24, rotate: -12 },
  { char: '√', left: '45%', top: '12%', size: 52, tone: 'terracotta', duration: 14, delay: -6, dx: 12, dy: 26, rotate: 8, wideOnly: true },
  { char: '=', left: '58%', top: '90%', size: 44, tone: 'sage', duration: 12, delay: -3, dx: -16, dy: -20, rotate: -6, wideOnly: true },
  { char: '108', left: '20%', top: '94%', size: 32, tone: 'terracotta', duration: 16, delay: -9, dx: 20, dy: -18, rotate: 4, wideOnly: true },
  { char: '3', left: '61%', top: '5%', size: 38, tone: 'sage', duration: 10, delay: -5, dx: 10, dy: 24, rotate: -10, wideOnly: true },
  { char: '÷', left: '43%', top: '46%', size: 34, tone: 'sage', duration: 13, delay: -1, dx: -14, dy: -22, rotate: 12, wideOnly: true },
  { char: '2', left: '0.5%', top: '52%', size: 44, tone: 'sage', duration: 14, delay: -8, dx: 16, dy: 20, rotate: 8 },
  { char: '5', left: '95%', top: '92%', size: 48, tone: 'terracotta', duration: 12, delay: -4, dx: -14, dy: -26, rotate: -8, wideOnly: true },
];

export function FloatingNumbers({ className }: { className?: string }) {
  return (
    <div className={cn('absolute inset-0 pointer-events-none select-none', className)} aria-hidden="true">
      {GLYPHS.map((g, i) => (
        <span
          key={i}
          className={cn(
            'vs-drift absolute font-serif font-semibold leading-none',
            g.tone === 'terracotta' ? 'text-[#B04C27]/[0.13]' : 'text-[#3F5E3C]/[0.15]',
            g.wideOnly && 'hidden sm:block'
          )}
          style={
            {
              left: g.left,
              top: g.top,
              fontSize: g.size,
              '--vs-dx': `${g.dx}px`,
              '--vs-dy': `${g.dy}px`,
              '--vs-rot': `${g.rotate}deg`,
              animationDuration: `${g.duration}s`,
              animationDelay: `${g.delay}s`,
            } as React.CSSProperties
          }
        >
          {g.char}
        </span>
      ))}
    </div>
  );
}
