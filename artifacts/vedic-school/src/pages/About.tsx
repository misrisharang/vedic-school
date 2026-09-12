import React from 'react';
import { Link } from 'wouter';
import { FadeIn, SectionHeader, ClosingCTABand } from '@/components/ui-patterns';
import { Button, buttonVariants } from '@/components/Button';
import { useDemoModal } from '@/context/DemoModalContext';
import meenakshiPhoto from '@assets/WhatsApp_Image_2026-08-06_at_12.17.56-removebg-preview_1786000177260.png';
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

      {/* HERO — THE VEDIC SCHOOL AS A CONCEPT */}
      <section className="relative pt-32 pb-16 lg:pt-48 lg:pb-20 border-b border-border/30 overflow-hidden">
        <div
          className="absolute inset-0 z-0 opacity-20 pointer-events-none"
          style={{ backgroundImage: `url(${heroTexture})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        />
        <div className="container mx-auto px-4 md:px-6 max-w-3xl text-center relative z-10">
          <FadeIn>
            <span className="sage-eyebrow mb-6">ABOUT THE VEDIC SCHOOL</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif mb-8 text-foreground leading-tight">
              Maths teaching built around the child, not just the syllabus.
            </h1>
            <p className="text-lg md:text-xl text-foreground/80 leading-relaxed mb-10 max-w-2xl mx-auto">
              The Vedic School exists to help children become calmer, more confident and more capable with Maths — through a method that starts with understanding where they are and builds from there.
            </p>
            <Button size="lg" onClick={openDemoModal}>Book a free demo class</Button>
          </FadeIn>
        </div>
      </section>

      {/* WHY THE VEDIC SCHOOL */}
      <section className="py-16 md:py-20 bg-[#F0EBE1] border-y border-border/30">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <FadeIn className="text-center mb-10">
            <span className="sage-eyebrow">WHY THE VEDIC SCHOOL</span>
            <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-2">It started with a simple observation.</h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="space-y-6 text-lg text-foreground/80 leading-relaxed">
              <p className="font-serif text-xl md:text-2xl text-foreground italic">
                A child struggling with Maths isn't always struggling with the Maths.
              </p>
              <p>
                Sometimes, they are struggling with confidence. Sometimes, there is a gap in the foundation. Sometimes, they simply haven't been taught in a way that makes sense to them.
              </p>
              <p>The Vedic School was built around understanding that difference.</p>
              <p>
                Vedic Maths is one part of that method. It gives children a different way to work with numbers, building fluency and confidence. Curriculum-aligned Maths takes that foundation into the Maths they encounter at school.
              </p>
              <p>
                As the school grows, the aim is to make this method available to more families through live online classes, while keeping the part that matters most: personal teaching, close observation and teaching that responds to the child in front of me.
              </p>
              <p className="font-serif text-xl text-foreground font-medium border-l-2 border-primary/30 pl-4 py-1">
                The method grows. The principle stays the same.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* MEET MEENAKSHI */}
      <section className="py-16 md:py-20 bg-background overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-12 items-center max-w-6xl mx-auto">

            {/* Left: Photo */}
            <FadeIn className="relative flex justify-center order-2 lg:order-1 mt-10 lg:mt-0">
              <div className="absolute w-[80%] h-[90%] bg-secondary/20 rounded-[40%_60%_70%_30%/50%_40%_60%_50%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-6 blur-md" />
              <div className="absolute w-[85%] h-[85%] bg-primary/10 rounded-[60%_40%_30%_70%/40%_50%_60%_50%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-12 blur-lg" />

              <img
                src={meenakshiPhoto}
                alt="Meenakshi Koul"
                className="relative z-10 w-full max-w-md h-auto drop-shadow-[0_20px_40px_rgba(59,66,76,0.15)] scale-110 object-contain origin-bottom"
              />

              <div className="absolute top-10 right-0 sm:-right-4 lg:-right-12 z-20 bg-white shadow-xl rounded-full px-4 sm:px-5 py-2.5 sm:py-3 flex items-center gap-2.5 sm:gap-3 border border-border/50 animate-[bounce_5s_ease-in-out_infinite]">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span className="font-sans font-medium text-xs sm:text-sm text-foreground">15+ Years Teaching</span>
              </div>
            </FadeIn>

            {/* Right: Bio */}
            <FadeIn delay={0.2} className="order-1 lg:order-2">
              <h2 className="sage-eyebrow mb-6">MEET MEENAKSHI KOUL</h2>
              <p className="text-3xl md:text-4xl font-serif text-foreground mb-6">Hello, I'm Meenakshi Koul.</p>
              <div className="space-y-5 text-lg text-foreground/80 leading-relaxed">
                <p>
                  I've been teaching Maths for 15+ years first in India, and more recently, to students across different time zones.
                </p>
                <p>
                  Over the years, I've realised that teaching Maths is rarely just about explaining the question in front of you. I've learnt to look for the pattern behind the problem.
                </p>
                <p>
                  Within the first few minutes of sitting with a child, I can often tell whether they are genuinely stuck on the Maths, or whether they have started believing that they simply aren't good at it.
                </p>
                <p className="font-medium text-foreground">And that distinction matters.</p>
                <p>If a child has missed a foundation, we need to go back and rebuild it.</p>
                <p>If they understand the concept but don't trust themselves, we need to give them opportunities to experience that they can solve it.</p>
                <p>And if they are ready for more, we need to help them move forward without making speed the goal in itself.</p>
                <p className="font-serif text-xl text-foreground font-medium">That's how I teach.</p>
                <p className="text-xl font-serif text-foreground">It's time to change how your kids approach Maths.</p>
                <p>
                  To make them more willing to attempt a difficult question. More comfortable making mistakes. More capable of finding their own way through a problem. And, to replace "I'm not good at Maths" with something much more important:
                </p>
                <p className="font-serif text-2xl md:text-3xl text-primary italic py-2">"Let me try."</p>
              </div>
            </FadeIn>

          </div>
        </div>
      </section>

      {/* FINAL CTA: CHOOSE YOUR PATH */}
      <section className="py-16 md:py-20 bg-[#EAE1D3]">
        <div className="container mx-auto px-4 md:px-6">
          <SectionHeader eyebrow="CHOOSE YOUR PATH" title="Want to experience the way I teach?" subtitle="Choose the path that makes sense for your child." />

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <FadeIn delay={0.1}>
              <div className="bg-[hsl(var(--block-sage-light))] hover:bg-[hsl(var(--block-sage-light-hover))] p-8 sm:p-10 rounded-[2rem] shadow-sm border border-[hsl(var(--block-sage-light-border))] h-full flex flex-col transition-all duration-300">
                <h3 className="font-serif text-2xl text-foreground mb-2 font-medium">Vedic Maths</h3>
                <p className="text-foreground/80 leading-relaxed mb-8 flex-1">
                  Build fluency. Build confidence. Join a free Sunday group demo class and experience the method in a real class.
                </p>
                <Button className="w-full" onClick={openDemoModal}>
                  Join Sunday's free demo
                </Button>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="bg-[hsl(var(--block-terracotta-light))] hover:bg-[hsl(var(--block-terracotta-light-hover))] p-8 sm:p-10 rounded-[2rem] shadow-sm border border-[hsl(var(--block-terracotta-light-border))] h-full flex flex-col transition-all duration-300">
                <h3 className="font-serif text-2xl text-foreground mb-2 font-medium">Curriculum-Aligned Maths</h3>
                <p className="text-foreground/80 leading-relaxed mb-8 flex-1">
                  Bring that confidence into school Maths. Book a Personal Assessment Session to understand where your child is and what they need.
                </p>
                <Button className="w-full" onClick={openAssessmentModal}>
                  Book a personal assessment
                </Button>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* CLOSING CTA BAND */}
      <ClosingCTABand
        title="The next hour could be the one that changes how your child feels about maths"
        onCtaClick={openDemoModal}
      />

    </div>
  );
}
