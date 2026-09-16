import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Button } from '@/components/Button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export function FadeIn({ children, delay = 0, className = "" }: FadeInProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function FadeInStagger({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.15,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function FadeInStaggerItem({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  className = "",
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  className?: string;
}) {
  return (
    <FadeIn className={`text-center mb-10 sm:mb-16 ${className}`}>
      {eyebrow && <span className="sage-eyebrow">{eyebrow}</span>}
      <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif text-foreground mb-4 sm:mb-6 leading-tight max-w-4xl mx-auto">
        {title}
      </h2>
      {subtitle && <p className="text-base sm:text-lg text-foreground/70 max-w-2xl mx-auto leading-relaxed">{subtitle}</p>}
    </FadeIn>
  );
}

export interface ShiftItem {
  from: string;
  to: string;
  description: string;
}

export interface ShiftCardTheme {
  bg: string;
  border?: string;
  fromText: string;
  arrowBg: string;
  toText: string;
  descText: string;
}

const defaultShiftThemes: ShiftCardTheme[] = [
  {
    // 01: Light Terracotta
    bg: 'bg-[hsl(var(--block-terracotta-light))] hover:bg-[hsl(var(--block-terracotta-light-hover))]',
    border: 'border-[hsl(var(--block-terracotta-light-border))]',
    fromText: 'text-foreground/50',
    arrowBg: 'bg-primary/15 text-primary',
    toText: 'text-foreground',
    descText: 'text-foreground/80',
  },
  {
    // 02: Light Sage
    bg: 'bg-[hsl(var(--block-sage-light))] hover:bg-[hsl(var(--block-sage-light-hover))]',
    border: 'border-[hsl(var(--block-sage-light-border))]',
    fromText: 'text-foreground/50',
    arrowBg: 'bg-[#446342]/15 text-[#3D5E3B]',
    toText: 'text-foreground',
    descText: 'text-foreground/80',
  },
  {
    // 03: Light Terracotta
    bg: 'bg-[hsl(var(--block-terracotta-light))] hover:bg-[hsl(var(--block-terracotta-light-hover))]',
    border: 'border-[hsl(var(--block-terracotta-light-border))]',
    fromText: 'text-foreground/50',
    arrowBg: 'bg-primary/15 text-primary',
    toText: 'text-foreground',
    descText: 'text-foreground/80',
  },
  {
    // 04: Light Sage
    bg: 'bg-[hsl(var(--block-sage-light))] hover:bg-[hsl(var(--block-sage-light-hover))]',
    border: 'border-[hsl(var(--block-sage-light-border))]',
    fromText: 'text-foreground/50',
    arrowBg: 'bg-[#446342]/15 text-[#3D5E3B]',
    toText: 'text-foreground',
    descText: 'text-foreground/80',
  },
  {
    // 05: Light Terracotta
    bg: 'bg-[hsl(var(--block-terracotta-light))] hover:bg-[hsl(var(--block-terracotta-light-hover))]',
    border: 'border-[hsl(var(--block-terracotta-light-border))]',
    fromText: 'text-foreground/50',
    arrowBg: 'bg-primary/15 text-primary',
    toText: 'text-foreground',
    descText: 'text-foreground/80',
  },
];

export function ShiftList({
  items,
  variant = 'stacked',
  cardThemes,
}: {
  items: ShiftItem[];
  variant?: 'stacked' | 'cards';
  cardThemes?: ShiftCardTheme[];
}) {
  const themes = cardThemes || defaultShiftThemes;

  if (variant === 'cards') {
    return (
      <FadeInStagger className="grid gap-4 max-w-3xl mx-auto">
        {items.map((item, i) => {
          const theme = themes[i % themes.length];
          return (
            <FadeInStaggerItem key={i}>
              <div
                className={`text-center ${theme.bg} p-5 sm:p-6 md:p-8 rounded-2xl shadow-sm border ${
                  theme.border || 'border-transparent'
                } hover:shadow-md transition-all duration-300`}
              >
                <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 md:gap-5 mb-3">
                  <span className={`${theme.fromText} line-through font-serif text-base sm:text-lg md:text-xl`}>
                    {item.from}
                  </span>
                  <div className={`w-7 h-7 rounded-full ${theme.arrowBg} flex items-center justify-center shrink-0`}>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14m-7-7 7 7-7 7" />
                    </svg>
                  </div>
                  <span className={`${theme.toText} font-serif text-xl sm:text-2xl md:text-3xl font-medium`}>
                    {item.to}
                  </span>
                </div>
                <p className={`${theme.descText} leading-relaxed text-sm sm:text-base max-w-md mx-auto`}>
                  {item.description}
                </p>
              </div>
            </FadeInStaggerItem>
          );
        })}
      </FadeInStagger>
    );
  }

  return (
    <FadeInStagger className="max-w-2xl mx-auto divide-y divide-border/40">
      {items.map((item, i) => (
        <FadeInStaggerItem key={i}>
          <div className="text-center py-8 first:pt-0 last:pb-0">
            <div className="flex flex-wrap items-center justify-center gap-3 md:gap-5 mb-3">
              <span className="text-foreground/40 line-through font-serif text-lg md:text-xl">{item.from}</span>
              <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center shrink-0 text-primary">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14m-7-7 7 7-7 7" />
                </svg>
              </div>
              <span className="text-foreground font-serif text-2xl md:text-3xl font-medium">{item.to}</span>
            </div>
            <p className="text-foreground/70 leading-relaxed max-w-md mx-auto">{item.description}</p>
          </div>
        </FadeInStaggerItem>
      ))}
    </FadeInStagger>
  );
}

export interface MethodStep {
  number: string;
  title: string;
  description: React.ReactNode;
}

export function MethodSteps({ steps, variant = 'timeline' }: { steps: MethodStep[]; variant?: 'timeline' | 'cards' }) {
  if (variant === 'cards') {
    return (
      <FadeInStagger className="grid gap-6 md:grid-cols-3 max-w-6xl mx-auto">
        {steps.map((step) => (
          <FadeInStaggerItem key={step.number}>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-border/40 h-full flex flex-col card-lift">
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-6 font-serif text-xl font-medium shrink-0">
                {step.number}
              </div>
              <h3 className="font-serif text-2xl text-foreground mb-3">{step.title}</h3>
              <div className="text-foreground/70 leading-relaxed text-base flex-1">{step.description}</div>
            </div>
          </FadeInStaggerItem>
        ))}
      </FadeInStagger>
    );
  }

  return (
    <FadeInStagger className="max-w-2xl mx-auto">
      {steps.map((step, i) => (
        <FadeInStaggerItem key={step.number}>
          <div className="flex gap-6">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-serif text-xl font-medium shrink-0">
                {step.number}
              </div>
              {i < steps.length - 1 && <div className="w-px flex-1 bg-border/60 my-2" />}
            </div>
            <div className={`flex-1 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-border/40 card-lift ${i < steps.length - 1 ? 'mb-6' : ''}`}>
              <h3 className="font-serif text-2xl text-foreground mb-3">{step.title}</h3>
              <div className="text-foreground/70 leading-relaxed text-base">{step.description}</div>
            </div>
          </div>
        </FadeInStaggerItem>
      ))}
    </FadeInStagger>
  );
}

export interface FeatureItem {
  title: string;
  body: string;
}

export interface FeatureCardTheme {
  bg: string;
  border?: string;
  title: string;
  body: string;
  badge: string;
}

const defaultFeatureThemes: FeatureCardTheme[] = [
  {
    // 01: Light Terracotta
    bg: 'bg-[hsl(var(--block-terracotta-light))] hover:bg-[hsl(var(--block-terracotta-light-hover))]',
    border: 'border-[hsl(var(--block-terracotta-light-border))]',
    title: 'text-foreground',
    body: 'text-foreground/80',
    badge: 'text-primary/70',
  },
  {
    // 02: Light Sage
    bg: 'bg-[hsl(var(--block-sage-light))] hover:bg-[hsl(var(--block-sage-light-hover))]',
    border: 'border-[hsl(var(--block-sage-light-border))]',
    title: 'text-foreground',
    body: 'text-foreground/80',
    badge: 'text-[#3D5E3B]/70',
  },
  {
    // 03: Light Terracotta
    bg: 'bg-[hsl(var(--block-terracotta-light))] hover:bg-[hsl(var(--block-terracotta-light-hover))]',
    border: 'border-[hsl(var(--block-terracotta-light-border))]',
    title: 'text-foreground',
    body: 'text-foreground/80',
    badge: 'text-primary/70',
  },
  {
    // 04: Light Sage
    bg: 'bg-[hsl(var(--block-sage-light))] hover:bg-[hsl(var(--block-sage-light-hover))]',
    border: 'border-[hsl(var(--block-sage-light-border))]',
    title: 'text-foreground',
    body: 'text-foreground/80',
    badge: 'text-[#3D5E3B]/70',
  },
  {
    // 05: Light Terracotta
    bg: 'bg-[hsl(var(--block-terracotta-light))] hover:bg-[hsl(var(--block-terracotta-light-hover))]',
    border: 'border-[hsl(var(--block-terracotta-light-border))]',
    title: 'text-foreground',
    body: 'text-foreground/80',
    badge: 'text-primary/70',
  },
  {
    // 06: Light Sage
    bg: 'bg-[hsl(var(--block-sage-light))] hover:bg-[hsl(var(--block-sage-light-hover))]',
    border: 'border-[hsl(var(--block-sage-light-border))]',
    title: 'text-foreground',
    body: 'text-foreground/80',
    badge: 'text-[#3D5E3B]/70',
  },
];

export function FeatureGrid({
  items,
  columns = 3,
  variant = 'brand',
  cardThemes,
}: {
  items: FeatureItem[];
  columns?: 2 | 3;
  variant?: 'brand' | 'neutral';
  cardThemes?: FeatureCardTheme[];
}) {
  const colClass = columns === 2 ? 'sm:grid-cols-2 max-w-3xl' : 'sm:grid-cols-2 lg:grid-cols-3 max-w-6xl';
  const themes = cardThemes || defaultFeatureThemes;

  return (
    <FadeInStagger className={`grid ${colClass} gap-6 mx-auto`}>
      {items.map((item, i) => {
        if (variant === 'neutral') {
          return (
            <FadeInStaggerItem key={i}>
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-border/40 flex flex-col card-lift h-full">
                <div className="font-serif text-xl text-foreground mb-3 font-medium">{item.title}</div>
                <p className="text-foreground/70 text-sm leading-relaxed">{item.body}</p>
              </div>
            </FadeInStaggerItem>
          );
        }

        const theme = themes[i % themes.length];
        const num = String(i + 1).padStart(2, '0');
        return (
          <FadeInStaggerItem key={i}>
            <div
              className={`${theme.bg} ${
                theme.border || 'border-transparent'
              } border p-8 rounded-2xl shadow-sm flex flex-col card-lift h-full transition-all duration-300`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className={`font-serif text-sm font-medium ${theme.badge} tracking-wider`}>
                  {num}
                </span>
              </div>
              <div className={`font-serif text-xl sm:text-2xl ${theme.title} mb-3 font-medium`}>
                {item.title}
              </div>
              <p className={`${theme.body} text-sm sm:text-[15px] leading-relaxed flex-1`}>
                {item.body}
              </p>
            </div>
          </FadeInStaggerItem>
        );
      })}
    </FadeInStagger>
  );
}

export interface DefinitionRow {
  label: string;
  value: React.ReactNode;
  highlight?: boolean;
}

export function DefinitionCard({ title, rows }: { title?: string; rows: DefinitionRow[] }) {
  return (
    <FadeIn>
      <div className="bg-white rounded-2xl sm:rounded-3xl md:rounded-[2.5rem] shadow-sm border border-border/50 p-6 sm:p-8 md:p-16">
        {title && <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-foreground mb-8 md:mb-12 text-center">{title}</h2>}
        <div className="space-y-6">
          {rows.map((row, i) => (
            <div
              key={i}
              className={`flex flex-col md:flex-row md:items-start gap-2 md:gap-8 ${i < rows.length - 1 ? 'pb-6 border-b border-border/40' : 'pt-0'}`}
            >
              <div className={`w-48 font-sans font-semibold text-xs tracking-wider uppercase shrink-0 ${row.highlight ? 'text-primary' : 'text-secondary'}`}>
                {row.label}
              </div>
              <div className={`flex-1 font-serif text-lg sm:text-xl ${row.highlight ? 'text-primary italic' : 'text-foreground/90'}`}>
                {row.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </FadeIn>
  );
}

export function Checklist({ items }: { items: string[] }) {
  return (
    <FadeInStagger className="space-y-4 max-w-2xl mx-auto">
      {items.map((item, i) => (
        <FadeInStaggerItem key={i}>
          <div className="flex items-start gap-4 bg-white/70 p-4 sm:p-5 rounded-2xl border border-border/30">
            <div className="w-6 h-6 rounded-full bg-secondary/15 text-secondary flex items-center justify-center shrink-0 mt-0.5">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </div>
            <p className="text-foreground/85 font-serif text-base sm:text-lg leading-snug pt-0.5">{item}</p>
          </div>
        </FadeInStaggerItem>
      ))}
    </FadeInStagger>
  );
}

export function TestimonialCard({
  quote,
  author,
  relation,
  location,
  delay = 0,
}: {
  quote: string;
  author: string;
  relation?: string;
  location?: string;
  delay?: number;
}) {
  return (
    <FadeIn delay={delay} className="h-full">
      <div className="bg-white p-6 sm:p-8 md:p-10 rounded-2xl md:rounded-[2rem] shadow-sm border border-border/50 relative h-full flex flex-col justify-between">
        <div className="absolute top-6 left-6 sm:top-8 sm:left-8 text-secondary/20 text-5xl sm:text-6xl font-serif leading-none select-none">"</div>
        <p className="font-serif text-base sm:text-lg md:text-xl text-foreground/90 leading-relaxed relative z-10 mb-6 sm:mb-8 pt-3 sm:pt-4 flex-1">
          {quote}
        </p>
        <div className="border-t border-border/50 pt-4 mt-auto min-h-[4.25rem] sm:min-h-[4.5rem] flex flex-col justify-start">
          <span className="font-sans font-medium text-sm sm:text-base text-foreground block leading-snug">— {author}</span>
          {(relation || location) && (
            <span className="font-sans text-xs sm:text-sm text-foreground/60 block mt-0.5 leading-snug">
              {[relation, location].filter(Boolean).join(" · ")}
            </span>
          )}
        </div>
      </div>
    </FadeIn>
  );
}

export function TestimonialPlaceholder({ delay = 0 }: { delay?: number }) {
  return (
    <FadeIn delay={delay} className="h-full">
      <div className="p-10 rounded-[2rem] border-2 border-dashed border-border/60 h-full min-h-[220px] flex items-center justify-center text-center">
        <span className="text-foreground/40 font-serif text-lg italic">More parent stories coming soon</span>
      </div>
    </FadeIn>
  );
}

export interface FAQItem {
  question: string;
  answer: string;
}

export function FAQAccordion({ items }: { items: FAQItem[] }) {
  return (
    <FadeIn>
      <Accordion type="single" collapsible className="max-w-3xl mx-auto">
        {items.map((item, i) => (
          <AccordionItem key={i} value={`item-${i}`} className="border-border/40">
            <AccordionTrigger className="font-serif text-lg md:text-xl text-foreground py-6 hover:no-underline">
              {item.question}
            </AccordionTrigger>
            <AccordionContent forceMount className="text-foreground/70 leading-relaxed text-base pb-6">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </FadeIn>
  );
}

export interface TwoPathItem {
  label: string;
  description?: string;
  cta: string;
  onClick?: () => void;
}

export function TwoPathCTA({
  eyebrow,
  paths,
  onDark = false,
}: {
  eyebrow?: string;
  paths: [TwoPathItem, TwoPathItem];
  onDark?: boolean;
}) {
  return (
    <div>
      {eyebrow && (
        <p className={`text-xs font-sans font-bold tracking-[0.15em] uppercase mb-4 ${onDark ? 'text-white/70' : 'text-secondary'}`}>
          {eyebrow}
        </p>
      )}
      <div className="grid sm:grid-cols-2 gap-4">
        {paths.map((path, i) => (
          <div
            key={i}
            className={`rounded-2xl p-6 flex flex-col gap-3 text-left ${onDark ? 'bg-white/10 border border-white/20 backdrop-blur-sm' : 'bg-white border border-border/40 shadow-sm'}`}
          >
            <span className={`font-serif text-lg font-medium ${onDark ? 'text-white' : 'text-foreground'}`}>{path.label}</span>
            {path.description && (
              <span className={`text-sm leading-snug ${onDark ? 'text-white/80' : 'text-foreground/70'}`}>{path.description}</span>
            )}
            <Button
              variant={onDark ? 'white' : 'default'}
              size="sm"
              onClick={path.onClick}
              className={onDark ? 'text-primary font-semibold hover:bg-white/90 mt-1 w-full' : 'mt-1 w-full'}
            >
              {path.cta}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ClosingCTABand({
  title,
  subtitle,
  cta = "Book a free demo class",
  onCtaClick,
  children,
}: {
  title: string;
  subtitle?: string;
  cta?: string;
  ctaSupport?: string;
  onCtaClick?: () => void;
  children?: React.ReactNode;
}) {
  return (
    <section className="py-18 sm:py-20 bg-primary text-primary-foreground relative overflow-hidden">
      {/* Decorative subtle background rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-10 pointer-events-none">
        <svg viewBox="0 0 100 100" className="w-full h-full text-white animate-[spin_60s_linear_infinite]">
          <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" />
          <circle cx="50" cy="50" r="38" fill="none" stroke="currentColor" strokeWidth="0.5" />
        </svg>
      </div>

      <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl">
        <FadeIn>
          <h2 className="text-3xl md:text-5xl font-serif leading-tight mb-6 text-white">
            {title}
          </h2>
          {subtitle && (
            <p className="text-lg md:text-xl text-white/90 mb-8 sm:mb-10 font-serif italic">
              {subtitle}
            </p>
          )}
          {children ? (
            children
          ) : (
            <Button variant="white" size="lg" onClick={onCtaClick} className="text-primary font-semibold hover:bg-white/90">
              {cta}
            </Button>
          )}
        </FadeIn>
      </div>
    </section>
  );
}
