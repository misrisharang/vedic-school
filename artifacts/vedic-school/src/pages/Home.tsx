import React from 'react';
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
import meenakshiPhoto from '@assets/WhatsApp_Image_2026-08-06_at_12.17.56-removebg-preview_1786000177260.png';
import heroTexture from '@assets/generated_images/hero-texture-math.png';
import heroIllustration from '@assets/generated_images/hero-warm-math-illustration.png';
import { Seo } from '@/seo/Seo';
import { getHomeSchema } from '@/seo/schema';

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
    body: "A faster answer matters only when a child understands what they're doing. Vedic Maths builds fluency on a foundation of understanding.",
  },
  {
    title: 'Personal teaching',
    body: 'I teach every class personally, paying attention to how your child thinks, where they hesitate and what they need next.',
  },
  {
    title: 'Progress you can see',
    body: 'I look for observable changes — greater confidence, more willingness to attempt and increasing independence.',
  },
  {
    title: 'A clear method',
    body: "Every class follows a clear approach: diagnose where the child is, rebuild what's missing and accelerate from a stronger foundation.",
  },
  {
    title: 'Two ways to learn',
    body: 'Vedic Maths builds calculation fluency and confidence. Curriculum-aligned classes help children apply that understanding to schoolwork.',
  },
  {
    title: 'Calm, honest learning',
    body: 'No inflated promises or pressure for the sake of speed. Just thoughtful teaching, honest outcomes and steady progress.',
  },
];

const countries = [
  { name: 'United Kingdom', flag: '🇬🇧' },
  { name: 'India', flag: '🇮🇳' },
  { name: 'Malaysia', flag: '🇲🇾' },
  { name: 'Singapore', flag: '🇸🇬' },
  { name: 'Australia', flag: '🇦🇺' },
  { name: 'UAE', flag: '🇦🇪' },
];

export default function Home() {
  const { openDemoModal, openAssessmentModal } = useDemoModal();

  return (
    <div className="flex flex-col min-h-screen">
      <Seo
        title="The Vedic School — Vedic Maths & Curriculum-Aligned Classes"
        description="Meenakshi Koul teaches Vedic Maths and curriculum-aligned classes across CBSE, ICSE, IB and beyond, in Gurugram and online. Book a free demo class."
        path="/"
        ogImage="/og/home.jpg"
        ogImageWidth={1200}
        ogImageHeight={630}
        schema={getHomeSchema()}
      />
      {/* HERO SECTION */}
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
              <span className="sage-eyebrow">CALM · CAPABLE · CONFIDENT</span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-foreground leading-[1.15] sm:leading-[1.1] tracking-tight mb-6">
                Where Maths stops feeling like <span className="text-primary italic">guesswork</span>.
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-foreground/80 leading-relaxed mb-4 max-w-xl">
                I help children build the understanding, fluency and confidence to approach Maths without second-guessing every step.
              </p>
              <p className="text-base sm:text-lg md:text-xl text-foreground/80 leading-relaxed mb-8 max-w-xl">
                Vedic Maths builds fluency with numbers. Curriculum-aligned classes help that confidence show up in schoolwork.
              </p>
              <a href="#how-we-do-it" className={buttonVariants({ size: 'lg', className: 'w-full sm:w-auto text-center justify-center' })}>
                Choose the right starting point <span className="ml-1">→</span>
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

      {/* LEARNING WITH ME, WORLDWIDE */}
      <section className="py-6 md:py-8 bg-[#F0EBE1]/70 border-y border-border/40 overflow-hidden relative" aria-label="Learning with me, Worldwide">
        <div className="container mx-auto px-4 mb-3 text-center">
          <h2 className="sage-eyebrow mb-0">LEARNING WITH ME, WORLDWIDE.</h2>
        </div>
        <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
          <div className="animate-ticker flex items-center gap-3 sm:gap-4 md:gap-6 py-2">
            {[...countries, ...countries, ...countries, ...countries].map((country, idx) => (
              <div
                key={`${country.name}-${idx}`}
                className="inline-flex items-center gap-2.5 sm:gap-3 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-white/80 border border-border/40 shadow-2xs backdrop-blur-xs shrink-0 select-none hover:border-primary/40 hover:bg-white hover:shadow-xs transition-all"
              >
                <span className="text-xl sm:text-2xl md:text-3xl leading-none filter drop-shadow-2xs" aria-hidden="true">
                  {country.flag}
                </span>
                <span className="font-serif text-xs sm:text-sm md:text-base font-medium text-foreground whitespace-nowrap">
                  {country.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* THE SHIFT */}
      <section className="py-16 md:py-20 bg-[#FAF6F0] border-y border-border/30">
        <div className="container mx-auto px-4 md:px-6">
          <SectionHeader
            eyebrow="THE SHIFT"
            title="Maths doesn't have to feel like something your child is simply trying to get through."
            subtitle="The change I look for is simple: a child who understands what they're doing, trusts their own thinking, and becomes more willing to work through a problem."
          />
          <ShiftList items={shifts} variant="cards" />
        </div>
      </section>

      {/* MY TEACHING METHOD */}
      <section className="py-16 md:py-20 bg-[#F0EBE1] border-y border-border/30">
        <div className="container mx-auto px-4 md:px-6">
          <SectionHeader
            eyebrow="MY TEACHING METHOD"
            title="The method I built."
            subtitle="One approach, adapted to where your child is today."
          />
          <FadeIn className="max-w-2xl mx-auto text-center mb-12 -mt-8">
            <p className="text-foreground/70 leading-relaxed">
              I built my teaching method around something I kept seeing in the classroom: a child can look "weak" in Maths when the real problem is a foundation that quietly broke somewhere along the way. So I don't rush straight to techniques.
            </p>
          </FadeIn>
          <MethodSteps steps={methodSteps} variant="cards" />
        </div>
      </section>

      {/* HOW WE DO IT */}
      <section id="how-we-do-it" className="py-16 md:py-20 bg-white border-y border-border/30">
        <div className="container mx-auto px-4 md:px-6">
          <FadeIn className="text-center mb-16">
            <h2 className="sage-eyebrow">TWO WAYS TO BUILD STRONGER MATHS</h2>
            <p className="text-3xl md:text-4xl font-serif text-foreground">How we do it?</p>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <FadeIn delay={0.1}>
              <div className="bg-[hsl(var(--block-sage-light))] hover:bg-[hsl(var(--block-sage-light-hover))] p-6 sm:p-8 md:p-12 rounded-2xl sm:rounded-[2rem] shadow-sm border border-[hsl(var(--block-sage-light-border))] h-full flex flex-col transition-all duration-300">
                <div className="w-14 h-14 rounded-full bg-[#446342]/15 flex items-center justify-center mb-8 text-[#3D5E3B]">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 10h12"/><path d="M4 14h9"/><path d="M19 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"/><path d="M19 22v-3"/><path d="M19 13v-3"/><path d="M19 16v3"/><path d="M19 19v3"/></svg>
                </div>
                <h3 className="text-2xl md:text-3xl font-serif text-foreground mb-2 font-medium">Vedic Maths</h3>
                <p className="text-[#3D5E3B] font-medium mb-4">Build fluency and confidence with numbers.</p>
                <p className="text-foreground/80 leading-relaxed mb-8 flex-1">
                  Develop number sense, calculation fluency and confidence through Vedic and mental Maths techniques.
                </p>
                <Button className="w-full sm:w-auto self-start" onClick={openDemoModal}>Join Sunday's free demo</Button>
                <Link href="/vedic-maths" className="text-[#3D5E3B] font-medium inline-flex items-center gap-2 hover:gap-3 transition-all mt-4 text-sm hover:underline">
                  Explore Vedic Maths classes <span>→</span>
                </Link>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="bg-[hsl(var(--block-terracotta-light))] hover:bg-[hsl(var(--block-terracotta-light-hover))] p-6 sm:p-8 md:p-12 rounded-2xl sm:rounded-[2rem] shadow-sm border border-[hsl(var(--block-terracotta-light-border))] h-full flex flex-col transition-all duration-300">
                <div className="w-14 h-14 rounded-full bg-primary/15 flex items-center justify-center mb-8 text-primary">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
                </div>
                <h3 className="text-2xl md:text-3xl font-serif text-foreground mb-2 font-medium">Curriculum-Aligned Classes</h3>
                <p className="text-primary font-medium mb-4">Make that confidence show up in schoolwork.</p>
                <p className="text-foreground/80 leading-relaxed mb-8 flex-1">
                  Work through your child's school curriculum while addressing the gaps getting in the way.
                </p>
                <Button className="w-full sm:w-auto self-start" onClick={openAssessmentModal}>Book a personal assessment</Button>
                <Link href="/curriculum-aligned" className="text-primary font-medium inline-flex items-center gap-2 hover:gap-3 transition-all mt-4 text-sm hover:underline">
                  Explore curriculum-aligned classes <span>→</span>
                </Link>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* WHY THE VEDIC SCHOOL */}
      <section className="py-16 md:py-20 bg-[#F0EBE1] border-y border-border/30">
        <div className="container mx-auto px-4 md:px-6">
          <SectionHeader
            eyebrow="WHY THE VEDIC SCHOOL"
            title="Why The Vedic School?"
            subtitle="The principles behind how we teach."
          />
          <FeatureGrid items={standards} />
        </div>
      </section>

      {/* ABOUT MEENAKSHI TEASER */}
      <section className="py-16 md:py-20 bg-[#EAE1D3] overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            <FadeIn className="relative flex justify-center">
              <div className="absolute w-[80%] h-[90%] bg-primary/20 rounded-[40%_60%_70%_30%/40%_50%_60%_50%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-12 blur-lg" />
              <div className="absolute w-[70%] h-[100%] bg-secondary/20 rounded-[60%_40%_30%_70%/50%_40%_60%_50%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-12 blur-md" />

              <img
                src={meenakshiPhoto}
                alt="Meenakshi Koul"
                className="relative z-10 w-[85%] max-w-sm h-auto drop-shadow-2xl scale-105"
              />
            </FadeIn>

            <FadeIn delay={0.2}>
              <h2 className="sage-eyebrow">ABOUT THE MENTOR</h2>
              <p className="text-3xl md:text-5xl font-serif mb-6 text-foreground">The teacher behind the method.</p>
              <div className="space-y-4 text-lg text-foreground/80 leading-relaxed mb-8">
                <p>
                  Hi, I'm Meenakshi Koul. I've spent 15+ years teaching Maths, and over that time I've learnt that the problem isn't always the problem on the page.
                </p>
                <p>
                  Sometimes a child has missed a foundation. Sometimes they understand the Maths but don't trust themselves enough to use it. And sometimes they simply need to be taught in a way that makes the concept click.
                </p>
                <p className="font-serif text-xl text-foreground font-medium italic border-l-2 border-primary/30 pl-4 py-1">
                  My role is to understand which one it is.
                </p>
                <p>
                  I built The Vedic School around that approach — personal, structured and focused on progress that shows up in the way a child actually works.
                </p>
              </div>
              <Link href="/about" className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all hover:text-primary/80 text-lg">
                Read more about my approach <span>→</span>
              </Link>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="py-16 md:py-20 bg-[#FAF6F0] border-y border-border/30">
        <div className="container mx-auto px-4 md:px-6">
          <SectionHeader eyebrow="WHAT PARENTS SAY" title="The best proof is what changes for the child." />

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((item, index) => (
              <TestimonialCard
                key={item.name}
                delay={0.1 * (index + 1)}
                quote={item.quote}
                author={item.name}
                relation={item.relation}
                location={item.location}
              />
            ))}
          </div>
        </div>
      </section>

      {/* RESOURCES */}
      <section className="py-16 bg-white border-y border-border/30">
        <div className="container mx-auto px-4 md:px-6">
          <FadeIn className="text-center mb-10 max-w-2xl mx-auto">
            <h2 className="sage-eyebrow">RESOURCES</h2>
            <p className="text-2xl md:text-3xl font-serif text-foreground mb-3">Useful Maths, explained simply.</p>
            <p className="text-foreground/70">
              Teacher-authored articles and practical guidance for parents who want to understand how their child learns Maths — without jargon or generic advice.
            </p>
          </FadeIn>
          <FadeInStagger className="grid sm:grid-cols-3 gap-4 max-w-5xl mx-auto mb-10">
            {[
              {
                title: "Vedic Maths vs Abacus: Which Is Better?",
                href: "/blog/vedic-maths-vs-abacus",
              },
              {
                title: "Three multiplication tricks any child can learn this week",
                href: "/blog",
              },
              {
                title: "What good curriculum tuition should actually look like",
                href: "/blog",
              },
            ].map((item, i) => (
              <FadeInStaggerItem key={i}>
                <Link href={item.href} className="block bg-background border border-border/40 rounded-2xl px-6 py-5 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 h-full">
                  <span className="font-serif text-base text-foreground/80 hover:text-primary transition-colors leading-snug">{item.title}</span>
                </Link>
              </FadeInStaggerItem>
            ))}
          </FadeInStagger>
          <FadeIn className="text-center">
            <Link href="/blog" className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all text-sm">
              Visit the blog <span>→</span>
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* CLOSING CTA BAND */}
      <ClosingCTABand
        title="Your child doesn't need more pressure. They need the right way forward."
        subtitle="Let's start by understanding where they are today."
      >
        <div className="max-w-2xl mx-auto text-left">
          <TwoPathCTA
            eyebrow="CHOOSE HOW YOU'D LIKE TO BEGIN"
            onDark
            paths={[
              { label: 'Vedic Maths', description: 'Experience the teaching method in a real class.', cta: "Join Sunday's free demo", onClick: openDemoModal },
              { label: 'Curriculum-Aligned Classes', description: 'Understand what your child needs to move forward.', cta: 'Book a personal assessment', onClick: openAssessmentModal },
            ]}
          />
        </div>
      </ClosingCTABand>
    </div>
  );
}
