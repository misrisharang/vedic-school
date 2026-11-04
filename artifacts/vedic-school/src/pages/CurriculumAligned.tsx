import React from 'react';
import { ArrowRight, Lightbulb, Search, Hammer, PenLine, Target } from 'lucide-react';
import { FadeIn, FadeInStagger, FadeInStaggerItem, FAQAccordion } from '@/components/ui-patterns';
import { Roadmap, type RoadmapStep } from '@/components/Roadmap';
import { testimonials } from '@/data/testimonials';
import { CURRICULUM_ALIGNED_FAQS } from '@/data/faqs';
import { Button } from '@/components/Button';
import { useAssessmentModal } from '@/context/DemoModalContext';
import { trackCtaClick, type CtaLocation } from '@/lib/analytics';
import tutoringPhoto from '@assets/curriculum-aligned-girl-studying.jpg';
import { Seo } from '@/seo/Seo';
import { getCurriculumAlignedSchema } from '@/seo/schema';

// Key points a parent can skim (mirrors "What is Vedic Maths?" on the Vedic Maths page).
const keyPoints = [
  {
    title: 'Their own school syllabus',
    body: "Classes follow your child's own textbook and the topics they are covering in school right now, for CBSE, ICSE, IB and more.",
  },
  {
    title: 'Gaps fixed at the root',
    body: 'If an earlier topic is the reason a chapter feels hard, we go back and fix that first, then return to the chapter.',
  },
  {
    title: 'Solving on their own',
    body: 'Practice moves from guided to independent, until your child can handle unfamiliar and exam-style questions alone.',
  },
];

const grades = [
  {
    range: 'Grades 1 to 2',
    bullets: [
      'Numbers and place value',
      'Addition and subtraction',
      'Early multiplication concepts',
      'Shapes and patterns',
      'Measurement and time',
      'Basic data handling',
      'Word problems',
    ],
    aim: 'Building confidence around numbers with basic operations',
  },
  {
    range: 'Grades 3 to 5',
    bullets: [
      'Multiplication and division',
      'Fractions',
      'Decimals',
      'Factors and multiples',
      'Measurement',
      'Area and perimeter',
      'Geometry',
      'Data handling',
      'Multi-step word problems',
    ],
    aim: 'Making core operations reliable across different problem types',
  },
  {
    range: 'Grades 6 to 8',
    bullets: [
      'Integers and rational numbers',
      'Fractions',
      'Decimals and percentages',
      'Ratios and proportions',
      'Algebraic expressions',
      'Linear equations',
      'Geometry',
      'Mensuration',
      'Coordinate geometry',
      'Data handling',
      'Probability',
    ],
    aim: 'Developing mathematical reasoning as concepts become more abstract',
  },
  {
    range: 'Grades 9 to 10',
    bullets: [
      'Number systems',
      'Polynomials',
      'Linear equations',
      'Quadratic equations',
      'Coordinate geometry',
      'Geometry and proofs',
      'Trigonometry',
      'Mensuration',
      'Statistics',
      'Probability',
    ],
    aim: 'Connecting concepts and applying them confidently in exams',
  },
];

const journey: RoadmapStep[] = [
  { icon: Lightbulb, title: 'Understand', body: 'Break the current concept down until it makes sense.' },
  { icon: Search, title: 'Identify', body: 'Find the specific point where your child is getting stuck.' },
  { icon: Hammer, title: 'Rebuild', body: "Strengthen the earlier foundation, if that's responsible." },
  { icon: PenLine, title: 'Practise', body: 'Work through questions with guidance, then independently.' },
  { icon: Target, title: 'Apply', body: 'Use it in schoolwork, unfamiliar and exam-style problems.' },
];

// Alternating colours keep the grade bands clearly apart.
const gradeThemes = [
  { card: 'bg-block-sage-light border-block-sage-light-border', marker: 'marker:text-[#3D5E3B]' },
  { card: 'bg-block-terracotta-light border-block-terracotta-light-border', marker: 'marker:text-primary' },
];

const GOOGLE_REVIEWS_URL =
  'https://www.google.com/maps/place/The+Vedic+School/@28.4317134,77.1086168,17z/data=!4m8!3m7!1s0x390d1da42d384595:0x51719d674bb453e1!8m2!3d28.4317134!4d77.1086168!9m1!1b1!16s%2Fg%2F11q2y0y7n6';

// Parents whose reviews are about everyday school Maths.
const curriculumTestimonials = ['Radhika Jaykar', 'Snehal Sachin Harane', 'Simmi Gupta']
  .map((name) => testimonials.find((t) => t.name === name))
  .filter((t): t is NonNullable<typeof t> => Boolean(t));

export default function CurriculumAligned() {
  const { openAssessmentModal } = useAssessmentModal();

  const bookAssessment = (location: CtaLocation) => {
    trackCtaClick('book_personal_assessment', location, 'curriculum_aligned');
    openAssessmentModal();
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Seo
        title="Curriculum-Aligned Maths | The Vedic School"
        description="Focused Maths teaching aligned with school curriculum (CBSE, ICSE, IB), addressing conceptual gaps and building lasting confidence."
        path="/curriculum-aligned"
        schema={getCurriculumAlignedSchema()}
      />

      {/* 1. HERO. No fade, so it is visible before JavaScript loads. */}
      <section className="pt-32 pb-6 lg:pt-36 lg:pb-8">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center max-w-6xl mx-auto">
            <div className="lg:col-span-7">
              <h1 className="font-serif text-[2.15rem] sm:text-5xl xl:text-[3.5rem] text-foreground leading-[1.1] tracking-tight">
                Knowing it isn't the same as <span className="whitespace-nowrap">solving it</span>
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-foreground/80 leading-relaxed max-w-xl">
                We teach your child through their school curriculum, closing the specific gaps that stop understanding from turning into marks.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5">
                <Button size="lg" onClick={() => bookAssessment('hero')}>
                  Book an assessment
                </Button>
                <a
                  href="#grade-by-grade"
                  className="inline-flex items-center gap-2 px-2 py-3 text-lg font-medium text-foreground hover:text-primary transition-colors"
                >
                  What we cover <ArrowRight className="w-5 h-5" />
                </a>
              </div>
            </div>
            <div className="lg:col-span-5">
              <img
                src={tutoringPhoto}
                alt="Mentor helping a student work through a Maths problem"
                className="w-full max-w-md mx-auto lg:max-w-none aspect-square object-cover object-[50%_35%] rounded-[2rem]"
                loading="eager"
                decoding="async"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. WHAT CLASSES COVER: key points to skim */}
      <section className="py-10 md:py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 lg:items-center max-w-6xl mx-auto">
            <FadeIn className="lg:col-span-5">
              <h2 className="font-serif text-3xl lg:text-[2rem] text-foreground leading-tight">Maths help built around school</h2>
              <p className="mt-5 text-lg text-foreground/80 leading-relaxed">
                Your child's school decides what they learn. We help them understand it well enough to solve the questions on their own.
              </p>
            </FadeIn>
            <FadeIn delay={0.1} className="lg:col-span-7">
              <dl className="space-y-6">
                {keyPoints.map((point) => (
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

      {/* 3. GRADE BY GRADE: closed columns, alternating colours */}
      <section id="grade-by-grade" className="py-10 md:py-12 scroll-mt-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            <FadeIn>
              <h2 className="font-serif text-3xl lg:text-[2rem] text-foreground leading-tight">Grade by grade, built around your child</h2>
              <p className="mt-3 text-lg text-foreground/75 max-w-[60ch]">
                Classes follow your child's school curriculum, with teaching adapted to their current level and learning gaps.
              </p>
            </FadeIn>
            {/* Phones: a swipeable row (four stacked cards ran over 2,000px). Grid from sm up. */}
            <FadeInStagger className="mt-10 flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 items-stretch overflow-x-auto sm:overflow-visible snap-x snap-mandatory scroll-pl-4 sm:scroll-pl-0 -mx-4 px-4 sm:mx-0 sm:px-0 pb-2 sm:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {grades.map((grade, i) => {
                const theme = gradeThemes[i % gradeThemes.length];
                return (
                  <FadeInStaggerItem key={grade.range} className="h-full shrink-0 w-[82%] sm:w-auto snap-start">
                    <div className={`h-full flex flex-col rounded-[2rem] border p-6 lg:p-7 ${theme.card}`}>
                      <h3 className="font-serif text-2xl text-foreground">{grade.range}</h3>
                      <ul className={`mt-5 list-disc pl-5 space-y-1.5 text-[15px] text-foreground/85 leading-snug flex-1 ${theme.marker}`}>
                        {grade.bullets.map((bullet) => (
                          <li key={bullet}>{bullet}</li>
                        ))}
                      </ul>
                      <p className="mt-6 pt-5 border-t border-foreground/10 font-serif italic text-lg text-foreground leading-snug">
                        {grade.aim}
                      </p>
                    </div>
                  </FadeInStaggerItem>
                );
              })}
            </FadeInStagger>
          </div>
        </div>
      </section>

      {/* 5. HOW CLASSES WORK: roadmap */}
      <section className="py-10 md:py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            <FadeIn>
              <h2 className="font-serif text-3xl lg:text-[2rem] text-foreground leading-tight">How a class works</h2>
              <p className="mt-3 text-lg text-foreground/75 max-w-[65ch]">
                The curriculum tells us what to cover. Our method decides how we get your child there, and we move on when they can solve the questions on their own.
              </p>
            </FadeIn>
            <Roadmap steps={journey} />
          </div>
        </div>
      </section>

      {/* 6. WHAT PARENTS SAY */}
      <section className="py-10 md:py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            <FadeIn>
              <h2 className="font-serif text-3xl lg:text-[2rem] text-foreground leading-tight">Where the change shows up</h2>
            </FadeIn>
            <div className="mt-10 grid md:grid-cols-3 gap-10">
              {curriculumTestimonials.map((item) => (
                <figure key={item.name} className="flex flex-col border-l-2 border-primary/40 pl-6">
                  <blockquote className="font-serif text-lg md:text-xl text-foreground/90 leading-relaxed flex-1">
                    “{item.excerpt ?? item.quote}”
                  </blockquote>
                  <figcaption className="mt-6">
                    <span className="block font-medium text-foreground">{item.name}</span>
                    {(item.relation || item.location) && (
                      <span className="block mt-0.5 text-sm text-foreground/60">
                        {[item.relation, item.location].filter(Boolean).join(', ')}
                      </span>
                    )}
                  </figcaption>
                </figure>
              ))}
            </div>
            <a
              href={GOOGLE_REVIEWS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-10 inline-flex items-center gap-2 font-medium text-primary hover:underline"
            >
              Read more reviews on Google <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* 7. FAQ */}
      <section className="py-10 md:py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 max-w-6xl mx-auto">
            <FadeIn className="lg:col-span-4">
              <h2 className="font-serif text-3xl lg:text-[2rem] text-foreground leading-tight lg:pt-[18px]">Questions parents ask</h2>
            </FadeIn>
            <div className="lg:col-span-8">
              <FAQAccordion items={CURRICULUM_ALIGNED_FAQS} />
            </div>
          </div>
        </div>
      </section>

      {/* 8. CLOSING */}
      <section className="py-16 md:py-24 bg-primary">
        <div className="container mx-auto px-4 md:px-6 text-center max-w-5xl">
          <FadeIn>
            <h2 className="font-serif text-3xl md:text-4xl text-white leading-tight">
              Help your child understand the Maths behind the marks
            </h2>
            <p className="mt-5 text-lg md:text-xl text-white/90 max-w-3xl mx-auto">
              Book an assessment and we'll show you where your child is getting stuck.
            </p>
            <Button
              variant="white"
              size="lg"
              className="mt-8 text-primary font-semibold w-full sm:w-auto"
              onClick={() => bookAssessment('contact_section')}
            >
              Book an assessment
            </Button>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
