import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Button, buttonVariants } from '@/components/Button';
import { useDemoModal } from '@/context/DemoModalContext';
import {
  FadeIn,
  FadeInStagger,
  FadeInStaggerItem,
  SectionHeader,
  ShiftList,
  MethodSteps,
  FeatureGrid,
  TestimonialCard,
  TestimonialPlaceholder,
  TwoPathCTA,
  ClosingCTABand,
} from '@/components/ui-patterns';
import { testimonials } from '@/data/testimonials';
import { TestimonialCarousel } from '@/components/TestimonialCarousel';
import meenakshiPhoto from '@assets/meenakshi-founder-portrait.jpg';
import heroTexture from '@assets/generated_images/hero-texture-math.png';
import heroIllustration from '@assets/generated_images/hero-warm-math-illustration.png';
import { Seo } from '@/seo/Seo';
import { getHomeSchema } from '@/seo/schema';
import { fetchPublishedBlogPosts, getBlogImageUrl } from '@/lib/blog';
import { PUBLISHED_ARTICLES } from '@/data/published-articles';
import { BLOG_CATEGORY_META } from '@/types/blog';
import type { BlogPost } from '@/types/blog';
import { ArrowRight, BookOpen, User, Leaf } from 'lucide-react';

const shifts = [
  {
    from: 'Guessing',
    to: 'Understanding',
    description: 'They stop relying on a remembered step and start seeing why an answer works.',
  },
  {
    from: 'Second-guessing',
    to: 'Trusting',
    description: 'They begin to recognise when their own answer makes sense.',
  },
  {
    from: 'Avoiding',
    to: 'Attempting',
    description: "A difficult problem becomes something they're willing to start.",
  },
  {
    from: 'Slow and laboured',
    to: 'Fluent',
    description: 'With the foundations in place, familiar calculations become more natural and efficient.',
  },
  {
    from: '"I\'m bad at maths"',
    to: '"I can do this"',
    description: 'Confidence grows when a child experiences themselves getting better.',
  },
];

const methodSteps = [
  {
    number: '01',
    title: 'Diagnose',
    description: "Understand what's solid, what's missing and where your child is getting stuck.",
  },
  {
    number: '02',
    title: 'Rebuild',
    description: 'Strengthen the foundation before moving ahead.',
  },
  {
    number: '03',
    title: 'Accelerate',
    description: 'Build fluency, apply understanding and help your child become more independent.',
  },
];

const standards = [
  {
    title: 'Understanding before speed',
    body: "Vedic maths tricks only matter when a child understands what they're doing — fluency built on a foundation of understanding.",
  },
  {
    title: 'Personal teaching',
    body: 'Classes are taught personally, with attention to how your child thinks, where they hesitate and what they need next.',
  },
  {
    title: 'Progress you can see',
    body: 'We look for observable changes — greater confidence, more willingness to attempt, growing independence.',
  },
  {
    title: 'A clear method',
    body: "Every class follows a clear approach: diagnose where the child is, rebuild what's missing and accelerate from a stronger foundation.",
  },
  {
    title: 'Two ways to learn',
    body: 'Vedic Maths builds calculation fluency and confidence. Curriculum-aligned Maths helps children apply that understanding to schoolwork.',
  },
  {
    title: 'Calm, honest learning',
    body: 'No inflated promises or pressure for the sake of speed. Just thoughtful teaching, honest outcomes and steady progress.',
  },
];

// Shared 5-point star polygon (unit size, centered at origin) reused across flags
const STAR_PATH =
  'M 0,-1 L 0.2245,-0.309 L 0.9511,-0.309 L 0.3633,0.118 L 0.5878,0.809 L 0,0.382 L -0.5878,0.809 L -0.3633,0.118 L -0.9511,-0.309 L -0.2245,-0.309 Z';

function Star({ cx, cy, r, fill = '#fff' }: { cx: number; cy: number; r: number; fill?: string }) {
  return <path d={STAR_PATH} fill={fill} transform={`translate(${cx} ${cy}) scale(${r})`} />;
}

function UaeFlag({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 4 2" className={className}>
      <rect x="1" width="3" height="0.667" fill="#00732F" />
      <rect x="1" y="0.667" width="3" height="0.667" fill="#fff" />
      <rect x="1" y="1.333" width="3" height="0.667" fill="#000" />
      <rect width="1" height="2" fill="#FF0000" />
    </svg>
  );
}

function UsaFlag({ className }: { className?: string }) {
  const stripeH = 2 / 13;
  const cantonH = stripeH * 7;
  const cantonW = 1.52;
  return (
    <svg viewBox="0 0 3.8 2" className={className}>
      {Array.from({ length: 13 }).map((_, i) => (
        <rect key={i} y={i * stripeH} width="3.8" height={stripeH} fill={i % 2 === 0 ? '#B22234' : '#fff'} />
      ))}
      <rect width={cantonW} height={cantonH} fill="#3C3B6E" />
      {Array.from({ length: 9 }).map((_, row) =>
        Array.from({ length: row % 2 === 0 ? 6 : 5 }).map((_, col) => (
          <circle
            key={`${row}-${col}`}
            cx={0.15 + col * 0.24 + (row % 2 !== 0 ? 0.12 : 0)}
            cy={0.09 + (row * (cantonH - 0.18)) / 8}
            r="0.028"
            fill="#fff"
          />
        )),
      )}
    </svg>
  );
}

function IndiaFlag({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 3 2" className={className}>
      <rect width="3" height="0.667" fill="#FF9933" />
      <rect y="0.667" width="3" height="0.667" fill="#fff" />
      <rect y="1.333" width="3" height="0.667" fill="#138808" />
      <circle cx="1.5" cy="1" r="0.22" fill="none" stroke="#000080" strokeWidth="0.03" />
      {Array.from({ length: 24 }).map((_, i) => {
        const angle = (i * 15 * Math.PI) / 180;
        return (
          <line
            key={i}
            x1="1.5"
            y1="1"
            x2={1.5 + 0.2 * Math.cos(angle)}
            y2={1 + 0.2 * Math.sin(angle)}
            stroke="#000080"
            strokeWidth="0.012"
          />
        );
      })}
      <circle cx="1.5" cy="1" r="0.03" fill="#000080" />
    </svg>
  );
}

function CanadaFlag({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 4 2" className={className}>
      <rect width="4" height="2" fill="#fff" />
      <rect width="1" height="2" fill="#D80621" />
      <rect x="3" width="1" height="2" fill="#D80621" />
      <path
        d="M2.0 0.35 L2.08 0.62 L2.35 0.55 L2.22 0.78 L2.45 0.85 L2.18 0.95 L2.28 1.15 L2.05 1.05 L2.0 1.3 L1.95 1.05 L1.72 1.15 L1.82 0.95 L1.55 0.85 L1.78 0.78 L1.65 0.55 L1.92 0.62 Z"
        fill="#D80621"
      />
    </svg>
  );
}

function AustraliaFlag({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 4 2" className={className}>
      <defs>
        <clipPath id="au-canton">
          <rect width="2" height="1" />
        </clipPath>
      </defs>
      <rect width="4" height="2" fill="#00247D" />
      <g clipPath="url(#au-canton)">
        <rect width="2" height="1" fill="#00247D" />
        <path d="M0 0 L2 1 M2 0 L0 1" stroke="#fff" strokeWidth="0.2" />
        <path d="M0 0 L2 1 M2 0 L0 1" stroke="#CF142B" strokeWidth="0.08" />
        <rect x="0.833" width="0.333" height="1" fill="#fff" />
        <rect y="0.375" width="2" height="0.25" fill="#fff" />
        <rect x="0.9" width="0.2" height="1" fill="#CF142B" />
        <rect y="0.425" width="2" height="0.15" fill="#CF142B" />
      </g>
      <Star cx={1} cy={1.55} r={0.1} />
      <Star cx={2.85} cy={0.4} r={0.07} />
      <Star cx={3.1} cy={0.85} r={0.085} />
      <Star cx={2.85} cy={1.3} r={0.07} />
      <Star cx={2.5} cy={1.05} r={0.06} />
      <Star cx={3.3} cy={1.35} r={0.05} />
    </svg>
  );
}

function SingaporeFlag({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 4 2" className={className}>
      <defs>
        <mask id="sg-crescent">
          <rect width="4" height="2" fill="#fff" />
          <circle cx="0.98" cy="0.5" r="0.32" fill="#000" />
        </mask>
      </defs>
      <rect width="4" height="1" fill="#EF3340" />
      <rect y="1" width="4" height="1" fill="#fff" />
      <g mask="url(#sg-crescent)">
        <circle cx="0.85" cy="0.5" r="0.32" fill="#fff" />
      </g>
      <Star cx={1.25} cy={0.28} r={0.075} />
      <Star cx={1.48} cy={0.42} r={0.075} />
      <Star cx={1.4} cy={0.68} r={0.075} />
      <Star cx={1.12} cy={0.68} r={0.075} />
      <Star cx={1.04} cy={0.42} r={0.075} />
    </svg>
  );
}

const countries = [
  { name: 'UAE', Flag: UaeFlag, aspect: '2 / 1' },
  { name: 'USA', Flag: UsaFlag, aspect: '1.9 / 1' },
  { name: 'India', Flag: IndiaFlag, aspect: '3 / 2' },
  { name: 'Canada', Flag: CanadaFlag, aspect: '2 / 1' },
  { name: 'Australia', Flag: AustraliaFlag, aspect: '2 / 1' },
  { name: 'Singapore', Flag: SingaporeFlag, aspect: '2 / 1' },
];

export default function Home() {
  const { openDemoModal, openAssessmentModal } = useDemoModal();
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(PUBLISHED_ARTICLES.slice(0, 3));

  useEffect(() => {
    fetchPublishedBlogPosts({ limit: 3 })
      .then(({ posts }) => {
        if (posts && posts.length >= 3) {
          setBlogPosts(posts.slice(0, 3));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Seo
        title="The Vedic School | Vedic Maths & Curriculum-Aligned Classes"
        description="Meenakshi Koul teaches Vedic Maths and curriculum-aligned classes across CBSE, ICSE, IB and beyond, in Gurugram and online. Book a free demo class."
        path="/"
        ogImage="/og/home.jpg"
        ogImageWidth={1200}
        ogImageHeight={630}
        schema={getHomeSchema()}
      />
      {/* 1. HERO SECTION */}
      <section className="relative pt-32 pb-16 lg:pt-48 lg:pb-20 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none"
             style={{ backgroundImage: `url(${heroTexture})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
          <div className="absolute inset-0 flex items-center justify-center gap-12 flex-wrap opacity-10">
             {Array.from({ length: 20 }).map((_, i) => (
               <span key={i} className="text-4xl text-primary font-serif">+</span>
             ))}
          </div>
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">

            <FadeIn className="max-w-2xl">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-serif text-foreground leading-[1.15] sm:leading-[1.1] tracking-tight mb-6">
                Watch 'I can't do Maths' become 'I can.'
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-foreground/80 leading-relaxed mb-4 max-w-xl">
                At The Vedic School, children build understanding, fluency and confidence — so they stop second-guessing every step.
              </p>
              <p className="text-base sm:text-lg md:text-xl text-foreground/80 leading-relaxed mb-8 max-w-xl">
                Vedic Maths classes build fluency with numbers. Curriculum-Aligned Maths brings it into schoolwork.
              </p>
              <a href="#two-approaches" className={buttonVariants({ size: 'lg', className: 'w-full sm:w-auto text-center justify-center' })}>
                Start where your child is today <span className="ml-1">→</span>
              </a>
            </FadeIn>

            <FadeIn delay={0.2} className="relative h-[320px] sm:h-[400px] lg:h-[500px] flex items-center justify-center">
              <div className="absolute inset-0 bg-primary/5 rounded-[40%_60%_70%_30%/40%_50%_60%_50%] blur-3xl animate-[spin_20s_linear_infinite]" />
              <div className="absolute inset-8 bg-secondary/10 rounded-[60%_40%_30%_70%/50%_40%_60%_50%] blur-2xl animate-[spin_25s_linear_infinite_reverse]" />

              <img
                src={heroIllustration}
                alt="Abstract mathematical concepts"
                className="relative z-10 w-full max-w-md h-auto object-contain drop-shadow-2xl"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </FadeIn>
          </div>
        </div>
      </section>

      {/* 2. TICKER */}
      <section className="py-6 sm:py-8 md:py-10 bg-[#F0EBE1]/70 border-y border-border/40 overflow-hidden relative" aria-label="Learning with us, Worldwide">
        <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="animate-ticker flex items-start gap-[35px] sm:gap-[49px] md:gap-[70px]">
            {[...countries, ...countries, ...countries, ...countries].map((country, idx) => (
              <React.Fragment key={`${country.name}-${idx}`}>
                <div className="flex flex-col items-center gap-3 sm:gap-4 shrink-0 select-none">
                  <div className="h-12 sm:h-14 md:h-16" style={{ aspectRatio: country.aspect }}>
                    <country.Flag className="w-full h-full" />
                  </div>
                  <span className="font-serif text-sm sm:text-base md:text-lg font-medium tracking-[0.08em] uppercase text-foreground/85 whitespace-nowrap">
                    {country.name}
                  </span>
                </div>
                <span className="hidden sm:block w-6 md:w-8 h-px bg-border/60 shrink-0 mt-6 sm:mt-7 md:mt-8" />
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* 3. HOW LEARNING CHANGES */}
      <section className="py-16 md:py-20 bg-[#FAF6F0] border-y border-border/30">
        <div className="container mx-auto px-4 md:px-6">
          <SectionHeader
            title="Maths doesn't have to feel like something your child is simply trying to get through."
            subtitle="The change we look for is simple: a child who understands what they're doing, trusts their own thinking, and is more willing to work through a problem."
          />
          <ShiftList items={shifts} variant="cards" />
        </div>
      </section>

      {/* 4. THE SCHOOL METHOD */}
      <section className="py-16 md:py-20 bg-[#F0EBE1] border-y border-border/30">
        <div className="container mx-auto px-4 md:px-6">
          <SectionHeader
            title="Built on 20+ years."
            subtitle="One approach, adapted to where your child is today."
          />
          <FadeIn className="max-w-2xl mx-auto text-center mb-12 -mt-8">
            <p className="text-foreground/70 leading-relaxed">
              The method comes from something we've seen time and again in the classroom: a child can look “weak” at Maths when the real problem is a foundation that quietly cracked somewhere along the way. So we never rush to techniques.
            </p>
          </FadeIn>
          <MethodSteps steps={methodSteps} variant="cards" />
        </div>
      </section>

      {/* 5. TWO APPROACHES, ONE STRONGER FOUNDATION */}
      <section id="two-approaches" className="py-16 md:py-20 bg-white border-y border-border/30">
        <div className="container mx-auto px-4 md:px-6">
          <FadeIn className="text-center mb-10 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-foreground leading-tight">How we teach.</h2>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <FadeIn delay={0.1}>
              <div className="bg-[hsl(var(--block-sage-light))] hover:bg-[hsl(var(--block-sage-light-hover))] p-6 sm:p-8 md:p-12 rounded-2xl sm:rounded-[2rem] shadow-sm border border-[hsl(var(--block-sage-light-border))] h-full flex flex-col transition-all duration-300">
                <div className="w-14 h-14 rounded-full bg-[#446342]/15 flex items-center justify-center mb-8 text-[#3D5E3B]">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 10h12"/><path d="M4 14h9"/><path d="M19 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"/><path d="M19 22v-3"/><path d="M19 13v-3"/><path d="M19 16v3"/><path d="M19 19v3"/></svg>
                </div>
                <div className="text-2xl md:text-3xl font-serif text-foreground mb-2 font-medium">Vedic Maths</div>
                <p className="text-[#3D5E3B] font-medium mb-4">Build fluency and confidence with numbers.</p>
                <p className="text-foreground/80 leading-relaxed mb-8 flex-1">
                  Vedic Maths for kids aged 6–16 — number sense, speed and confidence: tricks understood, never memorised
                </p>
                <Button className="w-full sm:w-auto self-start" onClick={openDemoModal}>Join Sunday's free demo</Button>
                <Link href="/vedic-maths" className="text-[#3D5E3B] font-medium inline-flex items-center gap-2 hover:gap-3 transition-all mt-4 text-sm hover:underline">
                  See the Vedic Maths course <span>→</span>
                </Link>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="bg-[hsl(var(--block-terracotta-light))] hover:bg-[hsl(var(--block-terracotta-light-hover))] p-6 sm:p-8 md:p-12 rounded-2xl sm:rounded-[2rem] shadow-sm border border-[hsl(var(--block-terracotta-light-border))] h-full flex flex-col transition-all duration-300">
                <div className="w-14 h-14 rounded-full bg-primary/15 flex items-center justify-center mb-8 text-primary">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
                </div>
                <div className="text-2xl md:text-3xl font-serif text-foreground mb-2 font-medium">Curriculum-Aligned Maths</div>
                <p className="text-primary font-medium mb-4">Make that confidence show up in schoolwork.</p>
                <p className="text-foreground/80 leading-relaxed mb-8 flex-1">
                  Work through your child's school curriculum while addressing the gaps getting in the way.
                </p>
                <Button className="w-full sm:w-auto self-start" onClick={openAssessmentModal}>Book a personal assessment</Button>
                <Link href="/curriculum-aligned" className="text-primary font-medium inline-flex items-center gap-2 hover:gap-3 transition-all mt-4 text-sm hover:underline">
                  Explore curriculum-aligned Maths <span>→</span>
                </Link>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* 6. WHY THE VEDIC SCHOOL? */}
      <section className="py-16 md:py-20 bg-[#F0EBE1] border-y border-border/30">
        <div className="container mx-auto px-4 md:px-6">
          <SectionHeader
            title="Why The Vedic School?"
            subtitle="The principles behind how we teach."
          />
          <FeatureGrid items={standards} />
        </div>
      </section>

      {/* 7. ABOUT THE FOUNDER AND MENTOR */}
      <section className="py-16 md:py-20 bg-[#EAE1D3] overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-12 items-center max-w-6xl mx-auto">
            <FadeIn>
              <div className="relative mb-16 sm:mb-20">
                <div className="relative w-full aspect-[4/5] rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg shadow-stone-900/10 bg-[#E5DCCE]/30">
                  <img
                    src={meenakshiPhoto}
                    alt="Meenakshi Koul, founder and mentor of The Vedic School"
                    className="w-full h-full object-cover object-top"
                    loading="lazy"
                    decoding="async"
                  />
                  {/* Subtle warm gradient in the lower portion of the portrait for soft editorial integration */}
                  <div className="absolute inset-x-0 bottom-0 h-[45%] bg-gradient-to-t from-[#EAE1D3]/85 via-[#EAE1D3]/35 to-transparent pointer-events-none" />
                  {/* Subtle editorial fade dissolving the right edge into the warm cream canvas */}
                  <div className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-[#EAE1D3]/50 via-[#EAE1D3]/15 to-transparent pointer-events-none" />
                  {/* Enhanced soft dissolve at the right/lower transition area */}
                  <div className="absolute right-0 bottom-0 w-1/2 h-3/5 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-[#EAE1D3]/60 via-[#EAE1D3]/20 to-transparent pointer-events-none" />
                </div>
                {/* Editorial pull quote overlapping the lower edge of the portrait */}
                <div className="absolute left-4 sm:left-6 md:left-8 bottom-0 translate-y-[55%] sm:translate-y-[58%] max-w-[290px] sm:max-w-[325px] z-10 flex items-start gap-2.5 sm:gap-3">
                  <Leaf className="w-4 h-4 sm:w-5 sm:h-5 text-secondary/60 shrink-0 mt-1" strokeWidth={1.5} />
                  <div>
                    <p className="font-serif text-lg sm:text-xl md:text-[21px] italic text-[#1c1917] leading-[1.32] tracking-tight">
                      “Maths is just not a subject, but it defines how you solve problems in real world”
                    </p>
                    <p className="text-[11px] sm:text-xs font-sans font-semibold uppercase tracking-[0.2em] text-[#786C5E] mt-2.5">
                      MEENAKSHI
                    </p>
                  </div>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.1} className="lg:order-2 flex flex-col justify-center">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-foreground mb-6">
                The teacher behind the method.
              </h2>
              <div className="space-y-5 text-lg text-foreground/80 leading-relaxed mb-8">
                <p>
                  Meenakshi Koul has spent <strong className="font-semibold text-foreground">20+ years</strong> teaching Mathematics and has learnt that the problem is rarely the problem on the page.
                </p>
                <p>
                  Sometimes a child has missed a foundation. Sometimes they understand the Maths but don't trust themselves to use it. And sometimes the concept simply hasn't been taught in a way that clicks.
                </p>
                <p className="font-serif text-xl text-foreground font-medium italic border-l-2 border-primary/30 pl-4 py-1">
                  Knowing which one it is: that's the job.
                </p>
                <p>
                  Her approach draws on years of teaching Mathematics, an understanding of child development and learning, and a continued interest in how people approach problems and find solutions.
                </p>
                <p>
                  That approach is The Vedic School: personal, structured, focused on progress that shows up in how a child actually works.
                </p>
              </div>
              <Link href="/about" className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all hover:text-primary/80 text-lg">
                Read about our approach <span>→</span>
              </Link>
            </FadeIn>
          </div>
        </div>
      </section>

      <section id="testimonials" className="py-16 md:py-20 bg-[#FAF6F0] border-y border-border/30 overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <SectionHeader title="The best proof is what changes for the child." />

          <FadeIn delay={0.1} className="max-w-6xl mx-auto">
            <TestimonialCarousel testimonials={testimonials} />
          </FadeIn>
        </div>
      </section>

      {/* 8B. GOOGLE REVIEWS CREDIBILITY */}
      <section id="google-reviews" className="py-8 sm:py-10 bg-[#F0EBE1]/40 border-b border-border/30">
        <div className="container mx-auto px-4 md:px-6">
          <FadeIn className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-serif text-foreground mb-2 leading-tight">
              Trusted by families. Reviewed on Google.
            </h2>
            <p className="text-sm sm:text-base text-foreground/75 leading-relaxed max-w-xl mx-auto mb-3.5 sm:mb-4">
              See what families have shared about learning with The Vedic School.
            </p>

            {/* Clickable Google Rating Card */}
            <div>
              <a
                href="https://www.google.com/maps/place/The+Vedic+School/@28.4317134,77.1086168,17z/data=!4m8!3m7!1s0x390d1da42d384595:0x51719d674bb453e1!8m2!3d28.4317134!4d77.1086168!9m1!1b1!16s%2Fg%2F11q2y0y7n6?entry=ttu&g_ep=EgoyMDI2MDkxMy4wIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 sm:gap-3.5 bg-white/95 rounded-2xl border border-stone-200/90 px-5 py-3 sm:px-6 sm:py-3.5 shadow-2xs hover:border-stone-400 hover:bg-white hover:shadow-xs transition-all cursor-pointer group mx-auto mb-3.5"
                aria-label="5.0 out of 5 stars on Google — view Google reviews"
              >
                {/* Google G Logo */}
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z" />
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z" />
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z" />
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
                </svg>

                <span className="text-xl sm:text-2xl font-serif font-bold text-foreground">5.0</span>

                <div className="flex items-center gap-0.5" aria-label="5 out of 5 stars">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 sm:w-4.5 sm:h-4.5 fill-amber-400 text-amber-400" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>

                <span className="text-stone-300">•</span>

                <span className="text-sm sm:text-base font-medium text-foreground/80 group-hover:text-foreground transition-colors">
                  Google
                </span>
              </a>
            </div>

            {/* CTA */}
            <div>
              <a
                href="https://www.google.com/maps/place/The+Vedic+School/@28.4317134,77.1086168,17z/data=!4m8!3m7!1s0x390d1da42d384595:0x51719d674bb453e1!8m2!3d28.4317134!4d77.1086168!9m1!1b1!16s%2Fg%2F11q2y0y7n6?entry=ttu&g_ep=EgoyMDI2MDkxMy4wIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full text-sm sm:text-base font-medium border border-stone-300 text-foreground hover:bg-white hover:border-stone-400 shadow-2xs transition-all group"
              >
                <span>Read our Google reviews</span>
                <span className="transition-transform group-hover:translate-x-0.5">→</span>
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 9 & 10. THE BLOG SECTION */}
      <section className="py-16 md:py-20 bg-white border-y border-border/30">
        <div className="container mx-auto px-4 md:px-6">
          <FadeIn className="text-center mb-10 sm:mb-12 max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-serif text-foreground mb-3">Useful Maths, explained simply.</h2>
            <p className="text-foreground/70 leading-relaxed">
              Practical guidance for parents — what a vedic maths syllabus covers, how to learn vedic maths, and choosing online vedic maths classes. No jargon.
            </p>
          </FadeIn>

          <FadeInStagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto mb-12">
            {blogPosts.map((post) => {
              const catMeta = BLOG_CATEGORY_META[post.category] || BLOG_CATEGORY_META['vedic-maths'];
              const imageUrl = getBlogImageUrl(post.featured_image) || post.featured_image;

              return (
                <FadeInStaggerItem key={post.id}>
                  <article className="group bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md hover:border-stone-300 transition-all flex flex-col justify-between h-full">
                    <div>
                      {/* Cover Photo */}
                      <Link href={`/blog/${post.slug}`} className="block relative aspect-16/10 overflow-hidden bg-stone-100">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-[hsl(var(--block-sage-light))]/50 text-[#2E4A2C]/60">
                            <BookOpen className="w-8 h-8 stroke-1" />
                          </div>
                        )}
                      </Link>

                      {/* Content Details */}
                      <div className="p-5 sm:p-6 space-y-3">
                        {/* Category Badge */}
                        <div>
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${catMeta.badgeClass}`}
                          >
                            {catMeta.label}
                          </span>
                        </div>

                        {/* Title - H3 semantic heading */}
                        <Link href={`/blog/${post.slug}`}>
                          <h3 className="text-lg sm:text-xl font-serif font-bold text-stone-900 group-hover:text-primary transition-colors tracking-tight leading-snug line-clamp-2">
                            {post.title}
                          </h3>
                        </Link>

                        {/* Excerpt */}
                        {post.excerpt && (
                          <p className="text-xs sm:text-sm text-stone-600 font-sans leading-relaxed line-clamp-3">
                            {post.excerpt}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Card Footer: Author & Read Link */}
                    <div className="px-5 sm:px-6 pb-5 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 text-[10px] font-semibold">
                          <User className="w-3 h-3" />
                        </div>
                        <span className="font-semibold text-stone-800">{post.author || 'Meenakshi Koul'}</span>
                      </div>

                      <Link
                        href={`/blog/${post.slug}`}
                        className="inline-flex items-center text-xs font-semibold text-primary group-hover:translate-x-0.5 transition-transform"
                      >
                        <span>Read article</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </Link>
                    </div>
                  </article>
                </FadeInStaggerItem>
              );
            })}
          </FadeInStagger>

          <FadeIn className="text-center">
            <Link href="/blog" className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all text-sm hover:underline">
              Visit the blog <span>→</span>
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* 11. CLOSING CTA BAND */}
      <ClosingCTABand
        title="Your child doesn't need more pressure. They need the right way forward."
        subtitle="Let's start by understanding where they are today."
      >
        <div className="max-w-2xl mx-auto text-left">
          <TwoPathCTA
            onDark
            paths={[
              { label: 'Vedic Maths', description: 'Experience Vedic Maths online classes, live.', cta: "Join Sunday's free demo", onClick: openDemoModal },
              { label: 'Curriculum-Aligned Maths', description: 'Understand what your child needs to move forward.', cta: 'Book a personal assessment', onClick: openAssessmentModal },
            ]}
          />
        </div>
      </ClosingCTABand>
    </div>
  );
}
