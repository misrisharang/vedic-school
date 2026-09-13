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
import meenakshiPhoto from '@assets/WhatsApp_Image_2026-08-06_at_12.17.56-removebg-preview_1786000177260.png';
import heroTexture from '@assets/generated_images/hero-texture-math.png';
import heroIllustration from '@assets/generated_images/hero-warm-math-illustration.png';
import { Seo } from '@/seo/Seo';
import { getHomeSchema } from '@/seo/schema';
import { fetchPublishedBlogPosts, getBlogImageUrl } from '@/lib/blog';
import { PUBLISHED_ARTICLES } from '@/data/published-articles';
import { BLOG_CATEGORY_META } from '@/types/blog';
import type { BlogPost } from '@/types/blog';
import { ArrowRight, BookOpen, User } from 'lucide-react';

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
              <span className="sage-eyebrow">CALM · CAPABLE · CONFIDENT</span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-foreground leading-[1.15] sm:leading-[1.1] tracking-tight mb-4">
                Where Maths stops feeling like <span className="text-primary italic">guesswork</span>.
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl font-serif text-foreground/90 font-medium mb-4 max-w-xl">
                Watch 'I can't do Maths' become 'I can.'
              </p>
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
      <section className="py-6 md:py-8 bg-[#F0EBE1]/70 border-y border-border/40 overflow-hidden relative" aria-label="Learning with us, Worldwide">
        <div className="container mx-auto px-4 mb-3 text-center">
          <p className="sage-eyebrow mb-0">LEARNING WITH US, WORLDWIDE.</p>
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

      {/* 3. HOW LEARNING CHANGES */}
      <section className="py-16 md:py-20 bg-[#FAF6F0] border-y border-border/30">
        <div className="container mx-auto px-4 md:px-6">
          <SectionHeader
            eyebrow="HOW LEARNING CHANGES"
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
            eyebrow="THE SCHOOL METHOD"
            title="Built on 15+ years."
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
          <FadeIn className="text-center mb-16">
            <h2 className="sage-eyebrow">TWO APPROACHES, ONE STRONGER FOUNDATION</h2>
            <p className="text-3xl md:text-4xl font-serif text-foreground">How we teach.</p>
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
            eyebrow="WHY THE VEDIC SCHOOL?"
            title="Why The Vedic School?"
            subtitle="The principles behind how we teach."
          />
          <FeatureGrid items={standards} />
        </div>
      </section>

      {/* 7. ABOUT THE FOUNDER AND MENTOR */}
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
              <h2 className="sage-eyebrow">ABOUT THE FOUNDER AND MENTOR</h2>
              <p className="text-3xl md:text-5xl font-serif mb-6 text-foreground">The teacher behind the method.</p>
              <div className="space-y-4 text-lg text-foreground/80 leading-relaxed mb-8">
                <p>
                  Meenakshi Koul has spent 15+ years teaching Maths — and has learnt that the problem is rarely the problem on the page.
                </p>
                <p>
                  Sometimes a child has missed a foundation. Sometimes they understand the Maths but don't trust themselves to use it. And sometimes the concept simply hasn't been taught in a way that clicks.
                </p>
                <p className="font-serif text-xl text-foreground font-medium italic border-l-2 border-primary/30 pl-4 py-1">
                  Knowing which one it is — that's the job.
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

      {/* 8. WHAT PARENTS SAY */}
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

      {/* 9 & 10. THE BLOG SECTION */}
      <section className="py-16 md:py-20 bg-white border-y border-border/30">
        <div className="container mx-auto px-4 md:px-6">
          <FadeIn className="text-center mb-12 max-w-2xl mx-auto">
            <h2 className="sage-eyebrow">THE BLOG SECTION</h2>
            <p className="text-2xl md:text-3xl font-serif text-foreground mb-3">Useful Maths, explained simply.</p>
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
            eyebrow="CHOOSE HOW YOU'D LIKE TO BEGIN"
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
