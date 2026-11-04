import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/Button';
import { useDemoModal } from '@/context/DemoModalContext';
import { trackCtaClick, type CtaLocation } from '@/lib/analytics';
import { FadeIn, FadeInStagger, FadeInStaggerItem } from '@/components/ui-patterns';
import { testimonials } from '@/data/testimonials';
import { TestimonialCarousel } from '@/components/TestimonialCarousel';
import meenakshiPhoto from '@assets/meenakshi-founder-portrait.jpg';
// Stills from recordings of Meenakshi teaching live online classes (Oct 2026).
import teachingPortrait from '@assets/meenakshi-teaching-online-portrait.jpg';
import teachingBoard from '@assets/meenakshi-teaching-online-board.jpg';
import { Seo } from '@/seo/Seo';
import { getHomeSchema } from '@/seo/schema';
import { fetchPublishedBlogPosts, getBlogImageUrl } from '@/lib/blog';
import { PUBLISHED_ARTICLES } from '@/data/published-articles';
import { BLOG_CATEGORY_META } from '@/types/blog';
import type { BlogPost } from '@/types/blog';
import { ArrowRight, BookOpen } from 'lucide-react';

const GOOGLE_REVIEWS_URL =
  'https://www.google.com/maps/place/The+Vedic+School/@28.4317134,77.1086168,17z/data=!4m8!3m7!1s0x390d1da42d384595:0x51719d674bb453e1!8m2!3d28.4317134!4d77.1086168!9m1!1b1!16s%2Fg%2F11q2y0y7n6';

// Countries where Meenakshi has taught children. Flag emoji render through the
// 'Twemoji Country Flags' polyfill font where the OS has no native flags.
const countries = [
  { name: 'India', flag: '🇮🇳' },
  { name: 'UAE', flag: '🇦🇪' },
  { name: 'Canada', flag: '🇨🇦' },
  { name: 'USA', flag: '🇺🇸' },
  { name: 'Australia', flag: '🇦🇺' },
  { name: 'Singapore', flag: '🇸🇬' },
];

const methodSteps = [
  { title: 'Diagnose', body: "Find what's solid, what's missing and where your child gets stuck." },
  { title: 'Rebuild', body: 'Strengthen that foundation before moving ahead.' },
  { title: 'Accelerate', body: 'Build fluency and independence on top of it.' },
];

const featuredParent = testimonials.find((t) => t.name === 'Miti Jindal');

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

  const bookDemo = (location: CtaLocation) => {
    trackCtaClick('book_free_demo', location, 'vedic_maths');
    openDemoModal();
  };
  const bookAssessment = (location: CtaLocation) => {
    trackCtaClick('book_personal_assessment', location, 'curriculum_aligned');
    openAssessmentModal();
  };

  const heroCopy = (
    <>
      <h1 className="font-serif text-[2.15rem] sm:text-5xl xl:text-[3.5rem] text-foreground leading-[1.1] tracking-tight text-balance">
        From <span className="whitespace-nowrap">‘I can’t do Maths’</span> to{' '}
        <span className="whitespace-nowrap">‘I can’</span>
      </h1>
      <p className="mt-6 text-lg sm:text-xl text-foreground/80 leading-relaxed max-w-xl">
        Live Vedic Maths and school-curriculum Maths classes for children. In Gurugram and online, wherever you live.
      </p>
    </>
  );

  const heroActions = (
    <>
      <Button size="lg" onClick={() => bookDemo('hero')}>
        Book a free demo class
      </Button>
      <a
        href="#courses"
        className="inline-flex items-center gap-2 px-2 py-3 text-lg font-medium text-foreground hover:text-primary transition-colors"
      >
        See the courses <ArrowRight className="w-5 h-5" />
      </a>
    </>
  );

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

      {/* 1. HERO. Rendered without a fade so it is visible before JavaScript loads. */}
      <section className="pt-32 pb-8 lg:pt-36 lg:pb-10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            <div className="lg:col-span-7">
              {heroCopy}
              <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5">{heroActions}</div>
            </div>
            <img
              src={teachingPortrait}
              alt="Meenakshi Koul smiling at the start of a live online class, with her laptop and whiteboard"
              width={1080}
              height={1350}
              fetchPriority="high"
              decoding="async"
              className="lg:col-span-5 aspect-[4/3] lg:aspect-[4/5] lg:max-h-[520px] w-full rounded-[2rem] object-cover object-[50%_18%]"
            />
          </div>
        </div>
      </section>

      {/* 2. WHERE MEENAKSHI HAS TAUGHT: runs edge to edge, no band */}
      <section className="pb-2" aria-labelledby="countries-heading">
        <h2 id="countries-heading" className="text-center text-sm sm:text-base text-foreground/60">
          Meenakshi has taught children in
        </h2>
        <div className="mt-5 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
          <ul className="animate-ticker gap-12 sm:gap-16 md:gap-20 py-2">
            {[...countries, ...countries, ...countries, ...countries].map((country, idx) => (
              <li
                key={`${country.name}-${idx}`}
                aria-hidden={idx >= countries.length ? true : undefined}
                className="flex items-center gap-3 shrink-0 select-none"
              >
                <span className="font-sans text-4xl sm:text-5xl leading-none" aria-hidden="true">
                  {country.flag}
                </span>
                <span className="font-serif text-lg sm:text-xl text-foreground/85 whitespace-nowrap">{country.name}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 3. TWO COURSES: open columns with a coloured rule, not filled boxes */}
      <section id="courses" className="py-10 md:py-12 scroll-mt-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            <FadeIn>
              <h2 className="font-serif text-3xl md:text-4xl text-foreground">Two ways to learn</h2>
            </FadeIn>

            <div className="mt-12 grid md:grid-cols-2 gap-14 md:gap-16">
              <FadeIn className="h-full">
                <div className="h-full flex flex-col border-t-4 border-secondary pt-8">
                  <p className="font-medium text-[#3D5E3B]">For ages 9 to 15</p>
                  <h3 className="mt-2 font-serif text-3xl md:text-4xl text-foreground">Vedic Maths</h3>
                  <p className="mt-4 text-lg text-foreground/80 leading-relaxed flex-1 max-w-[42ch]">
                    Faster, more confident calculation, with every method explained, never memorised.
                  </p>
                  <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                    <Button onClick={() => bookDemo('two_ways_section')}>Book a free demo class</Button>
                    <Link
                      href="/vedic-maths"
                      onClick={() => trackCtaClick('explore_vedic_maths', 'two_ways_section', 'vedic_maths')}
                      className="inline-flex items-center gap-2 font-medium text-[#3D5E3B] hover:underline"
                    >
                      About the course <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </FadeIn>

              <FadeIn delay={0.1} className="h-full">
                <div className="h-full flex flex-col border-t-4 border-primary pt-8">
                  <p className="font-medium text-primary">For CBSE, ICSE, IB and more</p>
                  <h3 className="mt-2 font-serif text-3xl md:text-4xl text-foreground">Curriculum-Aligned Maths</h3>
                  <p className="mt-4 text-lg text-foreground/80 leading-relaxed flex-1 max-w-[42ch]">
                    We work through your child's school syllabus and fix the gaps underneath it.
                  </p>
                  <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                    <Button onClick={() => bookAssessment('two_ways_section')}>Book an assessment</Button>
                    <Link
                      href="/curriculum-aligned"
                      onClick={() => trackCtaClick('explore_curriculum_classes', 'two_ways_section', 'curriculum_aligned')}
                      className="inline-flex items-center gap-2 font-medium text-primary hover:underline"
                    >
                      About the course <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* 4. LEARNING ONLINE: sage appears as a shape behind the photo */}
      <section className="py-10 md:py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center max-w-6xl mx-auto">
            <div className="lg:col-span-5 order-2 lg:order-1 relative">
              <div aria-hidden="true" className="absolute -left-4 -bottom-4 sm:-left-8 sm:-bottom-8 w-[85%] h-[85%] rounded-[2rem] bg-block-sage-light" />
              <img
                src={teachingBoard}
                alt="Meenakshi Koul writing the answer to 436/999 on the whiteboard during a live online class"
                width={1200}
                height={900}
                loading="lazy"
                decoding="async"
                className="relative aspect-[4/3] w-full rounded-[2rem] object-cover"
              />
            </div>
            <FadeIn className="lg:col-span-7 order-1 lg:order-2">
              <h2 className="font-serif text-3xl lg:text-[2rem] text-foreground leading-tight">
                Online classes that still feel personal
              </h2>
              <p className="mt-5 text-lg text-foreground/80 leading-relaxed">
                Classes are live, with a teacher who gets to know your child. Every class follows Meenakshi Koul's method, so families in India and abroad get the same teaching.
              </p>
              {featuredParent && (
                <figure className="mt-8 border-l-2 border-secondary pl-5">
                  <blockquote className="font-serif text-lg md:text-xl italic text-foreground leading-relaxed">
                    “{featuredParent.excerpt ?? featuredParent.quote}”
                  </blockquote>
                  <figcaption className="mt-3 text-sm text-foreground/70">
                    {featuredParent.name}, {featuredParent.relation}, {featuredParent.location}
                  </figcaption>
                </figure>
              )}
            </FadeIn>
          </div>
        </div>
      </section>

      {/* 5. THE METHOD: terracotta shape behind the portrait mirrors section 4 */}
      <section className="py-10 md:py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center max-w-6xl mx-auto">
            <FadeIn className="lg:col-span-8">
              <h2 className="font-serif text-3xl lg:text-[2rem] text-foreground leading-tight">
                One method, guided by Meenakshi Koul
              </h2>
              <p className="mt-5 text-lg text-foreground/80 leading-relaxed max-w-[60ch]">
                Meenakshi has taught Maths for over 20 years. When a child says they can't do Maths, there is usually a gap further back, or they have stopped trusting their own working. Every class starts by finding out which.
              </p>
              <dl className="mt-8 grid sm:grid-cols-3 gap-6 sm:gap-8">
                {methodSteps.map((step) => (
                  <div key={step.title} className="border-t border-foreground/15 pt-4">
                    <dt className="font-serif text-xl text-primary">{step.title}</dt>
                    <dd className="mt-1 text-foreground/75 leading-relaxed">{step.body}</dd>
                  </div>
                ))}
              </dl>
              <Link
                href="/about"
                className="mt-8 inline-flex items-center gap-2 font-medium text-primary hover:underline"
              >
                Read about our approach <ArrowRight className="w-4 h-4" />
              </Link>
            </FadeIn>
            <FadeIn delay={0.1} className="lg:col-span-4">
              <div className="relative max-w-sm mx-auto lg:max-w-none">
                <div aria-hidden="true" className="absolute -right-4 -bottom-4 sm:-right-8 sm:-bottom-8 w-[85%] h-[85%] rounded-[2rem] bg-block-terracotta-light" />
                <img
                  src={meenakshiPhoto}
                  alt="Meenakshi Koul, founder of The Vedic School"
                  className="relative w-full aspect-[4/5] object-cover object-top rounded-[2rem]"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* 6. WHAT PARENTS SAY */}
      <section id="testimonials" className="py-10 md:py-12 overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <FadeIn className="max-w-6xl mx-auto">
            <h2 className="font-serif text-3xl md:text-4xl text-foreground">What parents say</h2>
          </FadeIn>
          <FadeIn delay={0.1} className="mt-12 max-w-6xl mx-auto">
            <TestimonialCarousel
              testimonials={testimonials.filter((t) => t !== featuredParent)}
              preferExcerpt
              variant="plain"
            />
          </FadeIn>
          <div className="mt-8 text-center">
            <a
              href={GOOGLE_REVIEWS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-medium text-primary hover:underline"
            >
              Read more reviews on Google <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* 7. BLOG */}
      <section className="pt-2 pb-14 md:pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <h2 className="font-serif text-3xl md:text-4xl text-foreground">Guides for parents</h2>
            <Link href="/blog" className="inline-flex items-center gap-2 font-medium text-primary hover:underline">
              All articles <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <FadeInStagger className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
            {blogPosts.map((post) => {
              const catMeta = BLOG_CATEGORY_META[post.category] || BLOG_CATEGORY_META['vedic-maths'];
              const imageUrl = getBlogImageUrl(post.featured_image) || post.featured_image;
              const author = post.author || 'Meenakshi Koul';

              return (
                <FadeInStaggerItem key={post.id}>
                  <Link href={`/blog/${post.slug}`} className="group flex flex-col h-full">
                    <div className="aspect-16/10 overflow-hidden rounded-2xl bg-stone-100">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt=""
                          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-block-sage-light text-[#2E4A2C]/60">
                          <BookOpen className="w-8 h-8 stroke-1" />
                        </div>
                      )}
                    </div>
                    <span className="mt-5 text-sm font-medium text-foreground/60">{catMeta.label}</span>
                    <h3 className="mt-1 font-serif text-xl text-foreground group-hover:text-primary transition-colors leading-snug line-clamp-2">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="mt-2 text-foreground/70 leading-relaxed line-clamp-2">{post.excerpt}</p>
                    )}
                    <span className="mt-4 flex items-center gap-2 text-sm text-foreground/70">
                      {author === 'Meenakshi Koul' && (
                        <img src={meenakshiPhoto} alt="" className="w-7 h-7 rounded-full object-cover object-top" />
                      )}
                      {author}
                    </span>
                  </Link>
                </FadeInStaggerItem>
              );
            })}
          </FadeInStagger>
        </div>
      </section>

      {/* 8. CLOSING */}
      <section className="py-16 md:py-24 bg-primary">
        <div className="container mx-auto px-4 md:px-6 text-center max-w-3xl">
          <FadeIn>
            <h2 className="font-serif text-3xl md:text-5xl text-white leading-tight">Start with a free demo class</h2>
            <p className="mt-5 text-lg md:text-xl text-white/90">
              See Meenakshi's method at work in a real class before you decide.
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
