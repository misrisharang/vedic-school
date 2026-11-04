import React from 'react';
import { ArrowRight } from 'lucide-react';
import { FadeIn } from '@/components/ui-patterns';
import { Button } from '@/components/Button';
import { useDemoModal } from '@/context/DemoModalContext';
import { trackCtaClick, type CtaLocation } from '@/lib/analytics';
import meenakshiPortrait from '@assets/meenakshi-founder-portrait.jpg';
// Still from a recording of Meenakshi teaching a live online class (Oct 2026).
import teachingAnswer from '@assets/meenakshi-teaching-online-answer.jpg';
import { Seo } from '@/seo/Seo';
import { getAboutSchema } from '@/seo/schema';

// Skimmable background points (same pattern as the key points on Curriculum-Aligned).
const background = [
  {
    title: '20+ years teaching Maths',
    body: 'Began in Mumbai. Today she teaches in Gurugram, and online for children in India, the UAE, Canada, the USA, Australia and Singapore.',
  },
  {
    title: 'UX and Algorithms, IISc Bangalore',
    body: 'Studying how people solve problems shapes how she breaks a topic down for a child, one step at a time.',
  },
  {
    title: 'A method built to grow',
    body: 'Every class follows the same approach of diagnose, rebuild and accelerate, so the teaching stays consistent as the school grows.',
  },
];

export default function About() {
  const { openDemoModal, openAssessmentModal } = useDemoModal();

  const bookDemo = (location: CtaLocation) => {
    trackCtaClick('book_free_demo', location, 'vedic_maths');
    openDemoModal();
  };
  const bookAssessment = (location: CtaLocation) => {
    trackCtaClick('book_personal_assessment', location, 'curriculum_aligned');
    openAssessmentModal();
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Seo
        title="About Meenakshi Koul | The Vedic School"
        description="Meenakshi Koul has taught Maths for over 20 years, beginning in Mumbai. Today she teaches in Gurugram and online. She founded The Vedic School."
        path="/about"
        schema={getAboutSchema()}
      />

      {/* 1. HERO. No fade, so it is visible before JavaScript loads. */}
      <section className="pt-32 pb-6 lg:pt-36 lg:pb-8">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center max-w-6xl mx-auto">
            <div className="lg:col-span-7">
              <h1 className="font-serif text-[2.15rem] sm:text-5xl xl:text-[3.5rem] text-foreground leading-[1.1] tracking-tight">
                Meet Meenakshi Koul
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-foreground/80 leading-relaxed max-w-xl">
                Meenakshi has taught Maths for over 20 years, beginning in Mumbai. Today she teaches in Gurugram, and online for children in India and other countries. She founded The Vedic School to bring her way of teaching to more children.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5">
                <Button size="lg" onClick={() => bookDemo('hero')}>
                  Book a free demo class
                </Button>
                <a
                  href="#her-story"
                  className="inline-flex items-center gap-2 px-2 py-3 text-lg font-medium text-foreground hover:text-primary transition-colors"
                >
                  Why she started <ArrowRight className="w-5 h-5" />
                </a>
              </div>
            </div>
            <div className="lg:col-span-5">
              <img
                src={meenakshiPortrait}
                alt="Meenakshi Koul, founder of The Vedic School"
                width={768}
                height={1280}
                fetchPriority="high"
                decoding="async"
                className="w-full max-w-md mx-auto lg:max-w-none aspect-square object-cover object-[50%_12%] rounded-[2rem]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. WHY SHE STARTED */}
      <section id="her-story" className="py-10 md:py-12 scroll-mt-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center max-w-6xl mx-auto">
            <div className="lg:col-span-5 order-2 lg:order-1 relative">
              <div aria-hidden="true" className="absolute -left-4 -bottom-4 sm:-left-8 sm:-bottom-8 w-[85%] h-[85%] rounded-[2rem] bg-block-sage-light" />
              <img
                src={teachingAnswer}
                alt="Meenakshi Koul explaining why 436/999 equals 0.436436… during a live online class"
                width={1200}
                height={900}
                loading="lazy"
                decoding="async"
                className="relative w-full aspect-[4/3] object-cover rounded-[2rem]"
              />
            </div>
            <FadeIn className="lg:col-span-7 order-1 lg:order-2">
              <h2 className="font-serif text-3xl lg:text-[2rem] text-foreground leading-tight">Why she started The Vedic School</h2>
              <div className="mt-5 space-y-4 text-lg text-foreground/80 leading-relaxed max-w-[60ch]">
                <p>
                  Over the years, Meenakshi noticed that a child who says they can't do Maths is rarely short of ability. Usually there is a gap further back, or the child has stopped trusting their own working.
                </p>
                <p>
                  The Vedic School is built to find which it is, and fix it. Vedic Maths gives children quicker, more flexible ways to calculate. Curriculum-aligned classes take that confidence into school Maths.
                </p>
                <p>
                  The school is built around her method, so that more families can learn this way as it grows.
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* 3. HER BACKGROUND: key points to skim */}
      <section className="py-10 md:py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 lg:items-center max-w-6xl mx-auto">
            <FadeIn className="lg:col-span-5">
              <h2 className="font-serif text-3xl lg:text-[2rem] text-foreground leading-tight">Her background</h2>
              <p className="mt-5 text-lg text-foreground/80 leading-relaxed">
                What shapes the way she teaches, and the way the school will grow.
              </p>
            </FadeIn>
            <FadeIn delay={0.1} className="lg:col-span-7">
              <dl className="space-y-6">
                {background.map((point) => (
                  <div key={point.title} className="border-l-2 border-secondary pl-5">
                    <dt className="font-serif text-xl text-foreground">{point.title}</dt>
                    <dd className="mt-1 text-foreground/80 leading-relaxed">{point.body}</dd>
                  </div>
                ))}
              </dl>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* 4. IN HER WORDS */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          <FadeIn>
            <figure className="max-w-3xl mx-auto text-center">
              <blockquote className="font-serif text-2xl md:text-[2rem] text-foreground leading-snug">
                “Maths is not just a subject. It defines how you solve problems in the real world.”
              </blockquote>
              <figcaption className="mt-5 text-foreground/70">Meenakshi Koul</figcaption>
            </figure>
          </FadeIn>
        </div>
      </section>

      {/* 5. CLOSING */}
      <section className="py-16 md:py-24 bg-primary">
        <div className="container mx-auto px-4 md:px-6 text-center max-w-3xl">
          <FadeIn>
            <h2 className="font-serif text-3xl md:text-5xl text-white leading-tight">See the method in a real class</h2>
            <p className="mt-5 text-lg md:text-xl text-white/90">
              Join a free demo class, or book an assessment for help with school Maths.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <Button
                variant="white"
                size="lg"
                className="text-primary font-semibold w-full sm:w-auto"
                onClick={() => bookDemo('contact_section')}
              >
                Book a free demo class
              </Button>
              <Button
                variant="ghost"
                size="lg"
                className="text-white border border-white/60 hover:bg-white/10 w-full sm:w-auto"
                onClick={() => bookAssessment('contact_section')}
              >
                Book an assessment
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
