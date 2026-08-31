import React from 'react';
import { FadeIn, ClosingCTABand } from '@/components/ui-patterns';
import { Button } from '@/components/Button';

export default function CurriculumAligned() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      
      {/* HERO / PLACEHOLDER */}
      <section className="pt-32 pb-24 lg:pt-48 lg:pb-32 border-b border-border/30">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl text-center">
          <FadeIn>
            <span className="sage-eyebrow mb-6">CURRICULUM-ALIGNED CLASSES</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-foreground/40 leading-tight mb-8">
              Curriculum content coming soon
            </h1>
            <p className="text-lg md:text-xl text-foreground/60 leading-relaxed mb-10 max-w-2xl mx-auto">
              This page is in progress. Check back soon — or book a free demo class to learn more directly.
            </p>
            <Button size="lg">Book a free demo class</Button>
          </FadeIn>
        </div>
      </section>

      {/* PLACEHOLDER BLOCKS */}
      <section className="py-24 opacity-40 grayscale pointer-events-none user-select-none">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-16">
            
            <FadeIn>
              <h2 className="text-2xl font-serif mb-6 text-foreground/50 border-b border-border/50 pb-4">What to expect</h2>
              <div className="space-y-4">
                <div className="h-4 bg-border/40 rounded w-3/4"></div>
                <div className="h-4 bg-border/40 rounded w-full"></div>
                <div className="h-4 bg-border/40 rounded w-5/6"></div>
                <div className="h-4 bg-border/40 rounded w-2/3 mt-6"></div>
                <div className="h-4 bg-border/40 rounded w-full"></div>
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <h2 className="text-2xl font-serif mb-6 text-foreground/50 border-b border-border/50 pb-4">Who this is for</h2>
              <div className="space-y-4">
                <div className="h-4 bg-border/40 rounded w-full"></div>
                <div className="h-4 bg-border/40 rounded w-4/5"></div>
                <div className="h-4 bg-border/40 rounded w-full"></div>
                <div className="h-4 bg-border/40 rounded w-1/2 mt-6"></div>
                <div className="h-4 bg-border/40 rounded w-3/4"></div>
              </div>
            </FadeIn>

          </div>
        </div>
      </section>

      {/* CLOSING CTA BAND */}
      <div className="mt-auto">
        <ClosingCTABand 
          title="The next hour could be the one that changes how your child feels about maths"
        />
      </div>

    </div>
  );
}
