import React from 'react';
import { FadeIn, ClosingCTABand } from '@/components/ui-patterns';
import { Button } from '@/components/Button';
import meenakshiPhoto from '@assets/WhatsApp_Image_2026-08-06_at_12.17.56-removebg-preview_1786000177260.png';

export default function About() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      
      {/* HERO / MEET MEENAKSHI */}
      <section className="pt-32 pb-24 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-12 items-center max-w-6xl mx-auto">
            
            {/* Left: Photo */}
            <FadeIn className="relative flex justify-center order-2 lg:order-1 mt-10 lg:mt-0">
              {/* Soft sage/terracotta mixed blob shape */}
              <div className="absolute w-[80%] h-[90%] bg-secondary/20 rounded-[40%_60%_70%_30%/50%_40%_60%_50%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-6 blur-md" />
              <div className="absolute w-[85%] h-[85%] bg-primary/10 rounded-[60%_40%_30%_70%/40%_50%_60%_50%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-12 blur-lg" />
              
              <img 
                src={meenakshiPhoto} 
                alt="Meenakshi Koul" 
                className="relative z-10 w-full max-w-md h-auto drop-shadow-[0_20px_40px_rgba(59,66,76,0.15)] scale-110 object-contain origin-bottom"
              />
              
              {/* Floating Badge */}
              <div className="absolute top-10 -right-4 lg:-right-12 z-20 bg-white shadow-xl rounded-full px-5 py-3 flex items-center gap-3 border border-border/50 animate-[bounce_5s_ease-in-out_infinite]">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span className="font-sans font-medium text-sm text-foreground">15+ Years Teaching</span>
              </div>
            </FadeIn>
            
            {/* Right: Content */}
            <FadeIn delay={0.2} className="order-1 lg:order-2">
              <span className="sage-eyebrow mb-6">THE MENTOR</span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif mb-8 text-foreground">
                Meet Meenakshi
              </h1>
              
              <div className="space-y-6 text-lg text-foreground/80 leading-relaxed mb-10">
                <p>
                  I'm Meenakshi Koul. I've been teaching for 15+ years, in Gurugram and, more recently, online with families across India and abroad.
                </p>
                <p>
                  What I've learned isn't just method, it's pattern: I can usually tell within minutes whether a child is stuck on the maths or stuck on believing they can't do it, and I teach accordingly.
                </p>
                <p className="font-serif text-xl text-foreground font-medium italic border-l-2 border-primary/30 pl-4 py-1">
                  Every student is taught and tracked by me directly, not handed off.
                </p>
              </div>

              <Button variant="ghost" size="lg" className="pl-0 hover:bg-transparent hover:text-primary/80 group">
                Book a free demo class 
                <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </Button>
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
