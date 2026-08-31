import React from 'react';
import { Button } from '@/components/Button';
import { FadeIn, FadeInStagger, FadeInStaggerItem, ClosingCTABand } from '@/components/ui-patterns';

export default function VedicMaths() {
  return (
    <div className="flex flex-col min-h-screen">
      
      {/* HERO SECTION */}
      <section className="pt-32 pb-24 lg:pt-48 lg:pb-32 bg-background border-b border-border/30">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl text-center">
          <FadeIn>
            <span className="sage-eyebrow mb-6">VEDIC MATHS CLASSES</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-foreground leading-tight mb-8">
              Vedic Maths, taught the way it <span className="text-primary italic">should</span> be
            </h1>
            <p className="text-lg md:text-xl text-foreground/80 leading-relaxed mb-10 max-w-3xl mx-auto">
              A set of calculation methods, drawn from ancient Indian mathematics, for working through maths faster and more logically than the way most of us were taught. I teach it because of what it does to a child's confidence, not just their speed.
            </p>
            <Button size="lg">Book a free demo class</Button>
          </FadeIn>
        </div>
      </section>

      {/* WHAT CHANGES FOR A CHILD */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <FadeIn className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif text-foreground">What changes for a child</h2>
          </FadeIn>

          <FadeInStagger className="space-y-6">
            {[
              "Multiplication, division and fractions stop being memorised steps and start being something they understand",
              "They catch their own mistakes instead of needing someone else to catch them",
              "Timed tests and exams feel less like a race against the clock"
            ].map((point, i) => (
              <FadeInStaggerItem key={i}>
                <div className="flex items-start gap-6 bg-background/50 p-6 rounded-2xl border border-border/30">
                  <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center shrink-0 mt-1">
                    <div className="w-2 h-2 rounded-full bg-secondary" />
                  </div>
                  <p className="font-serif text-xl md:text-2xl text-foreground/90 leading-relaxed pt-1">
                    {point}
                  </p>
                </div>
              </FadeInStaggerItem>
            ))}
          </FadeInStagger>
        </div>
      </section>

      {/* WHO THIS IS FOR */}
      <section className="py-24 bg-[#F0EBE1] border-y border-border/30">
        <div className="container mx-auto px-4 md:px-6">
          <FadeIn className="text-center mb-16">
            <span className="sage-eyebrow">THE PATH</span>
            <h2 className="text-3xl md:text-4xl font-serif text-foreground">Who this is for</h2>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-16">
            <FadeIn delay={0.1}>
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-border/40 h-full flex flex-col card-lift">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-6 font-serif text-xl font-medium">1</div>
                <h3 className="font-serif text-2xl text-foreground mb-4">Starting Out</h3>
                <p className="text-foreground/70 leading-relaxed text-lg flex-1">
                  Building the basic toolkit and number confidence
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-border/40 h-full flex flex-col card-lift">
                <div className="w-12 h-12 rounded-full bg-primary/20 text-primary flex items-center justify-center mb-6 font-serif text-xl font-medium">2</div>
                <h3 className="font-serif text-2xl text-foreground mb-4">Building Speed</h3>
                <p className="text-foreground/70 leading-relaxed text-lg flex-1">
                  Faster calculation across multiplication, division, fractions
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={0.3}>
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-border/40 h-full flex flex-col card-lift">
                <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center mb-6 font-serif text-xl font-medium">3</div>
                <h3 className="font-serif text-2xl text-foreground mb-4">Exam-Ready</h3>
                <p className="text-foreground/70 leading-relaxed text-lg flex-1">
                  Applying the method under exam conditions, including CBSE, ICSE and IB assessments
                </p>
              </div>
            </FadeIn>
          </div>

          <FadeIn delay={0.4}>
            <p className="text-center font-sans text-foreground/60 max-w-lg mx-auto italic bg-white/50 py-4 px-6 rounded-full border border-border/30 backdrop-blur-sm shadow-sm">
              I also teach adults who want to learn the method for themselves.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* WHAT A CLASS LOOKS LIKE */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <FadeIn>
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-border/50 p-8 md:p-16">
              <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-12 text-center">What a class actually looks like</h2>
              
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-start gap-2 md:gap-8 pb-6 border-b border-border/40">
                  <div className="w-48 font-sans font-semibold text-xs tracking-wider uppercase text-secondary">Format</div>
                  <div className="flex-1 font-serif text-xl text-foreground/90">In person in Gurugram, or online, same standard of attention either way</div>
                </div>
                
                <div className="flex flex-col md:flex-row md:items-start gap-2 md:gap-8 pb-6 border-b border-border/40">
                  <div className="w-48 font-sans font-semibold text-xs tracking-wider uppercase text-secondary">Class Length</div>
                  <div className="flex-1 font-serif text-xl text-foreground/90">One hour per session, in concentrated batches</div>
                </div>
                
                <div className="flex flex-col md:flex-row md:items-start gap-2 md:gap-8 pb-6 border-b border-border/40">
                  <div className="w-48 font-sans font-semibold text-xs tracking-wider uppercase text-secondary">Boards Supported</div>
                  <div className="flex-1 font-serif text-xl text-foreground/90">CBSE, ICSE, IB, and more as I build out each board's classes</div>
                </div>
                
                <div className="flex flex-col md:flex-row md:items-start gap-2 md:gap-8 pt-4">
                  <div className="w-48 font-sans font-semibold text-xs tracking-wider uppercase text-primary">Next Step</div>
                  <div className="flex-1 font-serif text-xl text-primary italic">A free demo class, no obligation</div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* A REAL EXAMPLE (PULL QUOTE) */}
      <section className="py-24 bg-secondary/5 border-t border-border/30">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl text-center">
          <FadeIn>
            <div className="relative mb-8 inline-block">
              <div className="absolute -top-10 -left-10 text-secondary/20 text-8xl font-serif leading-none select-none">"</div>
              <p className="font-serif text-2xl md:text-3xl text-foreground/90 leading-relaxed relative z-10">
                I've watched a child go from freezing up at multiplication to solving it calmly in seconds. That's what I teach, and I'd like to show you how it works for your child.
              </p>
            </div>
            <div className="font-sans font-medium text-foreground tracking-wide">— Meenakshi Koul</div>
          </FadeIn>
        </div>
      </section>

      {/* CLOSING CTA BAND */}
      <ClosingCTABand 
        title="The next hour could be the one that changes how your child feels about maths"
        subtitle="See it for yourself before you decide anything."
      />

    </div>
  );
}
