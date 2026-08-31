import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/Button';
import { FadeIn, FadeInStagger, FadeInStaggerItem, ClosingCTABand } from '@/components/ui-patterns';
import meenakshiPhoto from '@assets/WhatsApp_Image_2026-08-06_at_12.17.56-removebg-preview_1786000177260.png';
import heroTexture from '@assets/generated_images/hero-texture-math.png';
import heroIllustration from '@assets/generated_images/hero-warm-math-illustration.png';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Subtle SVG texture in background */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" 
             style={{ backgroundImage: `url(${heroTexture})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
          {/* Fallback pattern if image is missing */}
          <div className="absolute inset-0 flex items-center justify-center gap-12 flex-wrap opacity-10">
             {Array.from({ length: 20 }).map((_, i) => (
               <span key={i} className="text-4xl text-primary font-serif">+</span>
             ))}
          </div>
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            
            {/* Left Content */}
            <FadeIn className="max-w-2xl">
              <span className="sage-eyebrow">CALM · CAPABLE · CONFIDENT</span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-foreground leading-[1.1] tracking-tight mb-6">
                Where calculation stops feeling like <span className="text-primary italic">guesswork</span>
              </h1>
              <p className="text-lg md:text-xl text-foreground/80 leading-relaxed mb-8 max-w-xl">
                I teach Vedic Maths to build real calculation confidence, and curriculum-aligned classes, across CBSE, ICSE, IB and beyond, to turn that confidence into a capable student, at homework and in exams.
              </p>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Button size="lg" className="w-full sm:w-auto">Book a free demo class</Button>
                <p className="text-xs text-foreground/60 max-w-[200px] leading-tight">
                  One hour, in person in Gurugram or online. You'll meet me directly, not a salesperson.
                </p>
              </div>
            </FadeIn>

            {/* Right Visual */}
            <FadeIn delay={0.2} className="relative h-[400px] lg:h-[500px] flex items-center justify-center">
              {/* Soft blob background */}
              <div className="absolute inset-0 bg-primary/5 rounded-[40%_60%_70%_30%/40%_50%_60%_50%] blur-3xl animate-[spin_20s_linear_infinite]" />
              <div className="absolute inset-8 bg-secondary/10 rounded-[60%_40%_30%_70%/50%_40%_60%_50%] blur-2xl animate-[spin_25s_linear_infinite_reverse]" />
              
              {/* Generated Illustration - assuming it will be ready */}
              <img 
                src={heroIllustration} 
                alt="Abstract mathematical concepts" 
                className="relative z-10 w-full max-w-md h-auto object-contain drop-shadow-2xl"
                onError={(e) => {
                  // Fallback if image not generated yet
                  e.currentTarget.style.display = 'none';
                }}
              />
              
            </FadeIn>
          </div>
        </div>
      </section>

      {/* WHAT I HEAR MOST */}
      <section className="py-24 bg-[#F0EBE1] border-y border-border/30">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <FadeIn>
            <p className="text-xl md:text-2xl font-serif text-center mb-16 text-foreground/90 max-w-2xl mx-auto leading-relaxed">
              Before I teach a single technique, I listen. Here's what almost every child tells me, one way or another:
            </p>
          </FadeIn>

          <FadeInStagger className="space-y-4 mb-16">
            {[
              "I always get the answer wrong, even when I know how to do it",
              "I freeze the moment a word problem looks unfamiliar",
              "I double-check things I already got right, because I don't trust myself",
              "I think I'm just bad at maths"
            ].map((quote, i) => (
              <FadeInStaggerItem key={i}>
                <div className="bg-white/80 backdrop-blur-sm rounded-full py-4 px-8 text-center shadow-sm card-lift border border-white">
                  <span className="font-serif text-lg md:text-xl text-foreground">"{quote}"</span>
                </div>
              </FadeInStaggerItem>
            ))}
          </FadeInStagger>

          <FadeIn delay={0.4}>
            <p className="text-2xl md:text-3xl font-serif text-primary text-center italic">
              That hesitation, not the marks, is what I actually teach against.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* THE SHIFT */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <FadeIn className="text-center mb-16">
            <span className="sage-eyebrow">THE SHIFT</span>
            <h2 className="text-3xl md:text-5xl font-serif mb-6 text-foreground">What actually changes</h2>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              Parents notice the shift in confidence before they notice it in the marks.
            </p>
          </FadeIn>

          <div className="grid gap-6">
            <FadeInStagger>
              {[
                { old: "Freezes on a word problem", new: "Works through it calmly" },
                { old: "Counts on fingers", new: "Calculates mentally, in seconds" },
                { old: "Double-checks answers already right", new: "Trusts their own working" },
                { old: "\"I'm just bad at maths\"", new: "\"Give me a harder one.\"" }
              ].map((shift, i) => (
                <FadeInStaggerItem key={i} className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 bg-white p-6 rounded-2xl shadow-xs border border-border/40 hover:shadow-md transition-shadow">
                  <div className="flex-1 text-center md:text-right">
                    <span className="text-foreground/50 line-through font-serif text-lg md:text-xl">{shift.old}</span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center shrink-0 text-primary">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14m-7-7 7 7-7 7"/>
                    </svg>
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <span className="text-foreground font-serif text-xl md:text-2xl font-medium">{shift.new}</span>
                  </div>
                </FadeInStaggerItem>
              ))}
            </FadeInStagger>
          </div>
        </div>
      </section>

      {/* HOW I HELP (Two Cards) */}
      <section className="py-24 bg-accent/50 border-y border-border/30">
        <div className="container mx-auto px-4 md:px-6">
          <FadeIn className="text-center mb-16">
            <span className="sage-eyebrow">PROGRAMS</span>
            <h2 className="text-3xl md:text-4xl font-serif text-foreground">How I help</h2>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
            <FadeIn delay={0.1}>
              <Link href="/vedic-maths" className="block h-full group">
                <div className="bg-white p-10 md:p-12 rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-500 border border-border/50 h-full flex flex-col -translate-y-0 group-hover:-translate-y-2">
                  <div className="w-14 h-14 rounded-full bg-secondary/10 flex items-center justify-center mb-8 text-secondary group-hover:scale-110 transition-transform duration-500">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 10h12"/><path d="M4 14h9"/><path d="M19 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"/><path d="M19 22v-3"/><path d="M19 13v-3"/><path d="M19 16v3"/><path d="M19 19v3"/></svg>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-serif text-foreground mb-4 group-hover:text-primary transition-colors">Vedic Maths</h3>
                  <p className="text-foreground/70 leading-relaxed mb-8 flex-1">
                    Fast, logical ways to work through calculations, so a number stops feeling like a guess. This is where the fear leaves the room first.
                  </p>
                  <span className="text-primary font-medium inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                    Explore Vedic Maths classes <span>→</span>
                  </span>
                </div>
              </Link>
            </FadeIn>

            <FadeIn delay={0.2}>
              <Link href="/curriculum-aligned" className="block h-full group">
                <div className="bg-white p-10 md:p-12 rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-500 border border-border/50 h-full flex flex-col -translate-y-0 group-hover:-translate-y-2">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-8 text-primary group-hover:scale-110 transition-transform duration-500">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-serif text-foreground mb-4 group-hover:text-primary transition-colors">Curriculum-Aligned Classes</h3>
                  <p className="text-foreground/70 leading-relaxed mb-8 flex-1">
                    Classes built around your child's own school syllabus, CBSE, ICSE, IB or otherwise, so that confidence turns into marks a teacher can see.
                  </p>
                  <span className="text-primary font-medium inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                    Explore curriculum-aligned classes <span>→</span>
                  </span>
                </div>
              </Link>
            </FadeIn>
          </div>
          
          <FadeIn delay={0.3} className="text-center">
            <Button size="lg">Book a free demo class</Button>
          </FadeIn>
        </div>
      </section>

      {/* WHY PARENTS CHOOSE US */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <FadeIn className="text-center mb-16">
            <span className="sage-eyebrow">WHY PARENTS CHOOSE US</span>
            <h2 className="text-3xl md:text-5xl font-serif text-foreground">One mentor, six things I don't compromise on</h2>
          </FadeIn>

          <FadeInStagger className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              { title: "Confidence before speed", body: "The mindset shift comes first. The technique is how we get there." },
              { title: "Small batches, by design", body: "Every child's thinking gets tracked, not just their attendance." },
              { title: "Founder-led, not a franchise", body: "One mentor, one standard, taught and tracked by me directly." },
              { title: "Outcome honesty", body: "Every result I share is real and specific, never inflated." },
              { title: "Every student matters equally", body: "Online or in person, the same standard of attention." },
              { title: "Full transparency, always", body: "Progress updates throughout — not just a report card at term's end." }
            ].map((feature, i) => (
              <FadeInStaggerItem key={i}>
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-border/40 flex flex-col card-lift" style={{ minHeight: '140px' }}>
                  <h4 className="font-serif text-xl text-foreground mb-3 whitespace-nowrap overflow-hidden text-ellipsis">{feature.title}</h4>
                  <p className="text-foreground/70 text-sm leading-relaxed line-clamp-2">{feature.body}</p>
                </div>
              </FadeInStaggerItem>
            ))}
          </FadeInStagger>
        </div>
      </section>

      {/* ABOUT MEENAKSHI TEASER */}
      <section className="py-24 bg-[#EAE1D3] overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            <FadeIn className="relative flex justify-center">
              {/* Soft terracotta blob behind photo */}
              <div className="absolute w-[80%] h-[90%] bg-primary/20 rounded-[40%_60%_70%_30%/40%_50%_60%_50%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-12 blur-lg" />
              <div className="absolute w-[70%] h-[100%] bg-secondary/20 rounded-[60%_40%_30%_70%/50%_40%_60%_50%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-12 blur-md" />
              
              <img 
                src={meenakshiPhoto} 
                alt="Meenakshi Koul" 
                className="relative z-10 w-[85%] max-w-sm h-auto drop-shadow-2xl scale-105"
              />
            </FadeIn>
            
            <FadeIn delay={0.2}>
              <span className="sage-eyebrow">ABOUT THE MENTOR</span>
              <h2 className="text-3xl md:text-5xl font-serif mb-6 text-foreground">Meet Meenakshi</h2>
              <p className="text-lg text-foreground/80 leading-relaxed mb-8">
                Hello, I'm Meenakshi Koul. I've been teaching maths for 15+ years, in Mumbai &amp; Gurugram and, more recently, online with families across India and abroad. What I've learned isn't just method, it's pattern: I can usually tell within minutes whether a child is stuck on the maths or stuck on believing they can't do it. Once a child's fear of maths is revealed, it becomes easier to deal with it. Every student is taught and tracked by me directly, not handed off to someone else.
              </p>
              <Link href="/about" className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all hover:text-primary/80 text-lg">
                Read my full story <span>→</span>
              </Link>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <FadeIn className="text-center mb-16">
            <span className="sage-eyebrow">WHAT PARENTS SAY</span>
            <h2 className="text-3xl md:text-4xl font-serif text-foreground">Stories of confidence</h2>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-12">
            <FadeIn delay={0.1}>
              <div className="bg-white p-10 rounded-[2rem] shadow-sm border border-border/50 relative h-full">
                <div className="absolute top-8 left-8 text-secondary/20 text-6xl font-serif leading-none">"</div>
                <p className="font-serif text-lg md:text-xl text-foreground/90 leading-relaxed relative z-10 mb-8 pt-4">
                  I've watched a child go from freezing up at multiplication to solving it calmly in seconds. That's what I teach, and I'd like to show you how it works for your child.
                </p>
                <div className="border-t border-border/50 pt-4 mt-auto">
                  <span className="font-sans font-medium text-foreground block">— Meenakshi Koul</span>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="bg-white p-10 rounded-[2rem] shadow-sm border border-border/50 relative h-full">
                <div className="absolute top-8 left-8 text-secondary/20 text-6xl font-serif leading-none">"</div>
                <p className="font-serif text-lg md:text-xl text-foreground/90 leading-relaxed relative z-10 mb-8 pt-4">
                  Their foundational understanding of mathematical concepts has become much stronger, and they are more confident in their approach to problem-solving.
                </p>
                <div className="border-t border-border/50 pt-4 mt-auto">
                  <span className="font-sans font-medium text-foreground block">— Priyanka Bankeraika, parent</span>
                </div>
              </div>
            </FadeIn>
          </div>

          <FadeIn delay={0.3} className="text-center">
            <Link href="#" className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all">
              Read more stories <span>→</span>
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* FROM THE BLOG */}
      <section className="py-16 bg-white border-y border-border/30">
        <div className="container mx-auto px-4 md:px-6">
          <FadeIn className="text-center mb-10">
            <span className="sage-eyebrow">FROM THE BLOG</span>
          </FadeIn>
          <FadeInStagger className="grid sm:grid-cols-3 gap-4 max-w-5xl mx-auto mb-10">
            {[
              "What is Vedic Maths?",
              "Three multiplication tricks any child can learn this week",
              "What good curriculum tuition should actually look like"
            ].map((title, i) => (
              <FadeInStaggerItem key={i}>
                <a href="#" className="block bg-background border border-border/40 rounded-2xl px-6 py-5 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 h-full">
                  <span className="font-serif text-base text-foreground/80 hover:text-primary transition-colors leading-snug">{title}</span>
                </a>
              </FadeInStaggerItem>
            ))}
          </FadeInStagger>
          <FadeIn className="text-center">
            <Link href="#" className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all text-sm">
              Visit the blog <span>→</span>
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* CLOSING CTA BAND */}
      <ClosingCTABand 
        title="The next hour could be the one that changes how your child feels about maths"
        subtitle="No pressure, no scripts, just a real class with me."
      />
    </div>
  );
}
