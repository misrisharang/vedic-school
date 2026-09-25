import React from 'react';
import { Link } from 'wouter';
import { Leaf } from 'lucide-react';
import { FadeIn, SectionHeader } from '@/components/ui-patterns';
import { Button } from '@/components/Button';
import { useDemoModal } from '@/context/DemoModalContext';
import { trackCtaClick } from '@/lib/analytics';
import meenakshiPhoto from '@assets/meenakshi-founder-landscape.jpg';
import heroTexture from '@assets/generated_images/hero-texture-math.png';
import { Seo } from '@/seo/Seo';
import { getAboutSchema } from '@/seo/schema';

export default function About() {
  const { openDemoModal, openAssessmentModal } = useDemoModal();
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Seo
        title="About Meenakshi Koul | The Vedic School"
        description="Learn about Meenakshi Koul, founder and educator at The Vedic School, and her approach to teaching mathematics."
        path="/about"
        schema={getAboutSchema()}
      />

      {/* 1. HERO — THE VEDIC SCHOOL AS A CONCEPT */}
      <section className="relative pt-24 pb-12 sm:pt-28 sm:pb-14 lg:pt-36 lg:pb-20 border-b border-border/30 overflow-hidden bg-background">
        <div
          className="absolute inset-0 z-0 opacity-20 pointer-events-none"
          style={{ backgroundImage: `url(${heroTexture})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        />
        <div className="container mx-auto px-4 md:px-6 max-w-4xl text-center relative z-10">
          <FadeIn>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif mb-5 sm:mb-6 text-foreground leading-[1.15]">
              Maths teaching built around the child, not just the syllabus.
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-foreground/80 leading-relaxed max-w-2xl mx-auto">
              The Vedic School exists to help children become calmer, more confident and more capable with Maths, through a method that starts with understanding where they are and builds from there.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* 2. THE OBSERVATION */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white border-b border-border/30">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <FadeIn className="text-center mb-8 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif text-foreground leading-tight">
              It Started With A Simple Observation
            </h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="space-y-6 text-base sm:text-lg text-foreground/80 leading-relaxed">
              <p className="font-serif text-xl sm:text-2xl md:text-[1.65rem] text-foreground italic leading-snug border-l-2 border-primary/40 pl-4 sm:pl-5 py-1">
                A child struggling with Maths isn't always struggling with the Maths.
              </p>
              <p>
                Sometimes, they are struggling with confidence. Sometimes, there is a gap in the foundation. Sometimes, they simply haven't been taught in a way that makes sense to them.
              </p>
              <p className="font-medium text-foreground">
                The Vedic School was built around understanding that difference.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 2B. THE METHOD & THE PRINCIPLE */}
      <section className="py-12 sm:py-16 lg:py-20 bg-[#F0EBE1] border-b border-border/30">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <FadeIn>
            <div className="space-y-6 text-base sm:text-lg text-foreground/80 leading-relaxed">
              <p className="font-serif text-lg sm:text-xl md:text-2xl text-foreground leading-relaxed">
                Vedic Maths is one part of that method. It gives children a different way to work with numbers, building fluency and confidence. Curriculum-aligned Maths takes that foundation into the Maths they encounter at school.
              </p>
              <p>
                As the school grows, the aim is to make this method available to more families through live online classes, while keeping the part that matters most: personal teaching, close observation and teaching that responds to the child in front of us.
              </p>
              <div className="pt-2 sm:pt-4">
                <p className="font-serif text-lg sm:text-xl text-foreground font-medium border-l-2 border-primary/40 pl-4 sm:pl-5 py-1.5">
                  The method grows. The principle stays the same.
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 3. MEET MEENAKSHI */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white border-b border-border/30 overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">

          {/* Wide Landscape Founder Image */}
          <FadeIn className="mb-8 sm:mb-10">
            <div className="relative w-full aspect-[3/2] rounded-2xl md:rounded-3xl overflow-hidden shadow-md shadow-stone-900/5 border border-stone-200/60 bg-stone-100/50">
              <img
                src={meenakshiPhoto}
                alt="Meenakshi Koul, founder and mentor of The Vedic School, teaching at her desk"
                className="w-full h-full object-cover object-center"
                loading="lazy"
                decoding="async"
              />
            </div>
          </FadeIn>

          {/* Founder Content Beneath */}
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-start">

            {/* Left: Section Header & Pull Quote */}
            <FadeIn delay={0.1} className="lg:col-span-5 lg:sticky lg:top-28">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif text-foreground mb-3 sm:mb-4 leading-tight">
                Meet Meenakshi Koul
              </h2>
              <p className="text-base sm:text-lg text-foreground/80 leading-relaxed mb-6">
                Meenakshi Koul founded The Vedic School and teaches every class herself.
              </p>
              <div className="pt-5 border-t border-border/60">
                <div className="flex items-start gap-3">
                  <Leaf className="w-5 h-5 text-secondary/70 shrink-0 mt-1" strokeWidth={1.5} />
                  <div>
                    <blockquote className="font-serif text-lg md:text-xl italic text-foreground/90 leading-snug">
                      "Maths is not just a subject. It defines how you solve problems in the real world."
                    </blockquote>
                    <p className="text-xs font-sans font-semibold uppercase tracking-[0.15em] text-foreground/50 mt-3">
                      — Meenakshi Koul
                    </p>
                  </div>
                </div>
              </div>
            </FadeIn>

            {/* Right: Bio */}
            <FadeIn delay={0.2} className="lg:col-span-7">
              <div className="space-y-4 sm:space-y-5 text-base sm:text-lg text-foreground/80 leading-relaxed">
                <p>
                  She has taught Mathematics for <strong className="font-semibold text-foreground">over 20 years</strong>, first in India and more recently to students across different time zones.
                </p>
                <p>
                  Over the years, we've come to realise that teaching Maths is rarely just about explaining the question in front of a child. It's about finding the pattern behind the problem.
                </p>
                <p>
                  A background in <strong className="font-semibold text-foreground">UX and Algorithms from IISc, Bangalore</strong> shapes how we think about problem-solving and learning.
                </p>
                <p>
                  Within the first few minutes with a child, Meenakshi can often tell whether they're genuinely stuck on the Maths, or whether they've started believing they simply aren't good at it. That distinction matters.
                </p>
                <p className="font-serif text-lg sm:text-xl text-foreground font-medium">That's how we teach.</p>
                <p>
                  We want to change how your child approaches Maths. To make them more willing to attempt a difficult question. More comfortable making mistakes. More capable of finding their own way through a problem. And to replace "I'm not good at Maths" with something much more important:
                </p>
                <h3 className="font-serif text-2xl md:text-3xl text-primary italic">"Let me try."</h3>
              </div>
            </FadeIn>

          </div>
        </div>
      </section>

      {/* 4. FINAL CTA: CHOOSE YOUR PATH */}
      <section className="py-12 sm:py-16 lg:py-20 bg-[#F0EBE1] border-b border-border/30">
        <div className="container mx-auto px-4 md:px-6">
          <SectionHeader
            title="Want To Experience The Way We Teach?"
            subtitle="Choose the path that makes sense for your child."
          />

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <FadeIn delay={0.1}>
              <div className="bg-[hsl(var(--block-sage-light))] hover:bg-[hsl(var(--block-sage-light-hover))] p-6 sm:p-8 md:p-10 rounded-2xl sm:rounded-[2rem] shadow-sm border border-[hsl(var(--block-sage-light-border))] h-full flex flex-col transition-all duration-300">
                <p className="font-serif text-2xl text-foreground mb-2 font-medium">Vedic Maths</p>
                <p className="text-foreground/80 leading-relaxed mb-6 sm:mb-8 flex-1">
                  Build fluency. Build confidence. Join a free Sunday group demo class and experience the method in a real class.
                </p>
                <Button
                  onClick={() => {
                    trackCtaClick('book_free_demo', 'two_ways_section', 'vedic_maths');
                    openDemoModal();
                  }}
                  className="w-full max-w-full whitespace-normal h-auto min-h-[52px] py-3.5 px-6 text-center"
                >
                  Join Sunday's free demo class
                </Button>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="bg-[hsl(var(--block-terracotta-light))] hover:bg-[hsl(var(--block-terracotta-light-hover))] p-6 sm:p-8 md:p-10 rounded-2xl sm:rounded-[2rem] shadow-sm border border-[hsl(var(--block-terracotta-light-border))] h-full flex flex-col transition-all duration-300">
                <p className="font-serif text-2xl text-foreground mb-2 font-medium">Curriculum-Aligned Maths</p>
                <p className="text-foreground/80 leading-relaxed mb-6 sm:mb-8 flex-1">
                  Bring that confidence into school Maths. Book a Personal Assessment Session to understand where your child is and what they need.
                </p>
                <Button
                  onClick={() => {
                    trackCtaClick('book_personal_assessment', 'two_ways_section', 'curriculum_aligned');
                    openAssessmentModal();
                  }}
                  className="w-full max-w-full whitespace-normal h-auto min-h-[52px] py-3.5 px-6 text-center"
                >
                  Book your child's personal assessment session
                </Button>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
    </div>
  );
}
