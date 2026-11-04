import React from 'react';
import { ArrowRight, BookOpen, PenLine, Target, Flag, Clock, CalendarDays, Users, MessageCircleQuestion } from 'lucide-react';
import { Button } from '@/components/Button';
import { useDemoModal } from '@/context/DemoModalContext';
import { trackCtaClick, type CtaLocation } from '@/lib/analytics';
import { FadeIn, FadeInStagger, FadeInStaggerItem, FAQAccordion } from '@/components/ui-patterns';
import { VedicTrickDemo } from '@/components/VedicTrickDemo';
import { Roadmap, type RoadmapStep } from '@/components/Roadmap';
import { VEDIC_MATHS_FAQS } from '@/data/faqs';
import { testimonials } from '@/data/testimonials';
// Both photos are AI-generated placeholders until real class photos arrive.
import boyStudyingPhoto from '@assets/vedic-maths-boy-studying.jpg';
import workbookPhoto from '@assets/vedic-maths-workbook.jpg';
import { Seo } from '@/seo/Seo';
import { getVedicMathsSchema } from '@/seo/schema';

const GOOGLE_REVIEWS_URL =
  'https://www.google.com/maps/place/The+Vedic+School/@28.4317134,77.1086168,17z/data=!4m8!3m7!1s0x390d1da42d384595:0x51719d674bb453e1!8m2!3d28.4317134!4d77.1086168!9m1!1b1!16s%2Fg%2F11q2y0y7n6';

// Why Vedic methods suit mental Maths (shown under "What is Vedic Maths?").
const mentalMathsPoints = [
  {
    title: 'Less to hold in your head',
    body: 'School methods are built for paper: they work right to left and keep every carried digit on the page. Many Vedic methods work left to right, the way we read and say numbers, so the answer builds as you go and there is less to remember at once.',
  },
  {
    title: 'Hard sums become easy ones',
    body: '98 × 97 turns into a question about 2 and 3, how far each number sits from 100. Children learn to look at a sum before starting it and pick the shortest route, a habit that makes mental Maths quicker and more reliable.',
  },
  {
    title: 'A second way to check',
    body: 'With more than one route to an answer, children can check their working another way. Knowing an answer is right is what builds real confidence with numbers.',
  },
];

// Alternating colours keep the three stages clearly apart.
const stageThemes = [
  {
    card: 'bg-block-terracotta-light border-block-terracotta-light-border',
    marker: 'marker:text-primary',
  },
  {
    card: 'bg-block-sage-light border-block-sage-light-border',
    marker: 'marker:text-[#3D5E3B]',
  },
  {
    card: 'bg-block-terracotta-light border-block-terracotta-light-border',
    marker: 'marker:text-primary',
  },
];

const progressionStages = [
  {
    title: 'Starting Out',
    bullets: [
      'Tables',
      'Quick multiplication and division',
      'Addition and subtraction',
      'Square roots of perfect squares',
      'Cube roots of perfect cubes',
      'Early algebra',
      'Squares, cubes and base multiplication',
    ],
    aim: 'Building the number fluency every skill depends on',
  },
  {
    title: 'Building Speed',
    bullets: [
      'Square roots of imperfect numbers',
      'Fourth powers and roots',
      'Factorisation of quadratics and cubics',
      'First-principle equations',
      'Simultaneous linear equations',
      'Dates and calendars',
      'Fractions and recurring decimals',
    ],
    aim: 'Turning early fluency into faster, flexible calculation',
  },
  {
    title: 'Exam-Ready',
    bullets: [
      'Coordinate geometry',
      'Quadratic and simultaneous quadratic equations',
      'Trigonometry',
      'Complex numbers',
      'Highest common factor',
      'Factorisation and an introduction to differential calculus',
      'Determinants',
    ],
    aim: 'Applying those skills to advanced, exam-level maths',
  },
];

const classFacts = [
  { Icon: Clock, label: '1-hour live classes' },
  { Icon: CalendarDays, label: '4 to 5 classes a month' },
  { Icon: Users, label: 'Up to 10 children a batch' },
  { Icon: MessageCircleQuestion, label: 'A doubt class every week' },
];

const classSteps: RoadmapStep[] = [
  { icon: BookOpen, title: 'Learn', body: 'Understand the idea behind the method.' },
  { icon: PenLine, title: 'Practise', body: 'Work with it until the thinking feels familiar.' },
  { icon: Target, title: 'Apply', body: 'Use it independently across different calculations.' },
  { icon: Flag, title: 'Build fluency', body: 'Calculation becomes faster and more natural.' },
];

// Quotes use each person's exact words (old site and public Google reviews).
const miti = testimonials.find((t) => t.name === 'Miti Jindal');
const vedicMathsTestimonials = [
  ...(miti ? [{ name: miti.name, detail: `${miti.relation}, ${miti.location}`, quote: miti.excerpt ?? miti.quote }] : []),
  {
    name: 'Kanupriya Gupta',
    detail: 'Google review',
    quote:
      'She puts lot of efforts to bring up the best in the learner and gives her time going out of the limits so that a learner brings good results.',
  },
  {
    name: 'Krishang K Sharma',
    detail: 'Student',
    quote:
      'You have taught me never to give up. You always say that there is more than one way to solve everything; it just depends on perspective.',
  },
];

const faqs = VEDIC_MATHS_FAQS;

export default function VedicMaths() {
  const { openDemoModal } = useDemoModal();

  const bookDemo = (location: CtaLocation) => {
    trackCtaClick('book_free_demo', location, 'vedic_maths');
    openDemoModal();
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Seo
        title="Vedic Maths Classes | The Vedic School"
        description="Vedic Maths classes that give children flexible ways to work with numbers, making calculation faster, clearer and more confident."
        path="/vedic-maths"
        schema={getVedicMathsSchema()}
      />

      {/* 1. HERO. No fade, so it is visible before JavaScript loads. */}
      <section className="pt-32 pb-6 lg:pt-36 lg:pb-8">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center max-w-6xl mx-auto">
            <div className="lg:col-span-7">
              <h1 className="font-serif text-[2.15rem] sm:text-5xl xl:text-[3.5rem] text-foreground leading-[1.1] tracking-tight">
                Maths that clicks, <span className="whitespace-nowrap">not confuses</span>
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-foreground/80 leading-relaxed max-w-xl">
                Vedic Maths for ages 9 to 15. Live online classes where children learn why each method works, then practise until it's quick.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5">
                <Button size="lg" onClick={() => bookDemo('hero')}>
                  Book a free demo class
                </Button>
                <a
                  href="#what-your-child-learns"
                  className="inline-flex items-center gap-2 px-2 py-3 text-lg font-medium text-foreground hover:text-primary transition-colors"
                >
                  What your child learns <ArrowRight className="w-5 h-5" />
                </a>
              </div>
            </div>
            <div className="lg:col-span-5">
              <img
                src={boyStudyingPhoto}
                alt="Child working on Maths at home"
                className="w-full max-w-md mx-auto lg:max-w-none aspect-square object-cover rounded-[2rem]"
                loading="eager"
                decoding="async"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. WHAT IS VEDIC MATHS? */}
      <section className="py-10 md:py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center max-w-6xl mx-auto">
            <div className="lg:col-span-5 order-2 lg:order-1 relative">
              <div aria-hidden="true" className="absolute -left-4 -bottom-4 sm:-left-8 sm:-bottom-8 w-[85%] h-[85%] rounded-[2rem] bg-block-sage-light" />
              <img
                src={workbookPhoto}
                alt="Child working through Maths problems in a workbook"
                className="relative w-full aspect-[4/3] object-cover rounded-[2rem]"
                loading="lazy"
                decoding="async"
              />
            </div>
            <FadeIn className="lg:col-span-7 order-1 lg:order-2">
              <h2 className="font-serif text-3xl lg:text-[2rem] text-foreground leading-tight">What is Vedic Maths?</h2>
              <p className="mt-5 text-lg text-foreground/80 leading-relaxed max-w-[60ch]">
                Vedic Maths is a set of calculation methods that work with the patterns in numbers. Instead of one long method for every sum, children learn a few quicker routes, and why each one works. That is what makes it so useful for mental Maths.
              </p>
              <dl className="mt-6 space-y-5 max-w-[60ch]">
                {mentalMathsPoints.map((point) => (
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

      {/* 3. ONE METHOD IN ACTION */}
      <section className="py-10 md:py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center max-w-6xl mx-auto">
            <FadeIn className="lg:col-span-7">
              <h2 className="font-serif text-3xl lg:text-[2rem] text-foreground leading-tight">
                98 × 97 in your head, in three steps
              </h2>
              <p className="mt-5 text-lg text-foreground/80 leading-relaxed max-w-[60ch]">
                This is the “near a base” method. It works whenever two numbers sit close to 10, 100 or 1000. Watch it play out on the card.
              </p>
              <p className="mt-8 text-lg text-foreground/80 leading-relaxed max-w-[60ch]">
                <span className="font-medium text-foreground">Where it helps:</span> mental sums, checking an answer worked out the long way, and timed exams and olympiads where every second counts.
              </p>
            </FadeIn>
            <div className="lg:col-span-5">
              <VedicTrickDemo loop className="w-full max-w-md mx-auto lg:max-w-none" />
            </div>
          </div>
        </div>
      </section>

      {/* 4. WHAT YOUR CHILD LEARNS: closed columns, alternating colours */}
      <section id="what-your-child-learns" className="py-10 md:py-12 scroll-mt-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            <FadeIn>
              <h2 className="font-serif text-3xl lg:text-[2rem] text-foreground leading-tight">What your child learns</h2>
              <p className="mt-3 text-lg text-foreground/75">The topics build as your child's fluency grows.</p>
            </FadeIn>
            <FadeInStagger className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
              {progressionStages.map((stage, i) => {
                const theme = stageThemes[i % stageThemes.length];
                return (
                  <FadeInStaggerItem key={stage.title} className="h-full">
                    <div className={`h-full flex flex-col rounded-[2rem] border p-7 lg:p-8 ${theme.card}`}>
                      <h3 className="font-serif text-2xl lg:text-[1.75rem] text-foreground">{stage.title}</h3>
                      <ul className={`mt-5 list-disc pl-5 space-y-2 text-base text-foreground/85 leading-snug flex-1 ${theme.marker}`}>
                        {stage.bullets.map((bullet) => (
                          <li key={bullet}>{bullet}</li>
                        ))}
                      </ul>
                      <p className="mt-6 pt-5 border-t border-foreground/10 font-serif italic text-lg text-foreground leading-snug">
                        {stage.aim}
                      </p>
                    </div>
                  </FadeInStaggerItem>
                );
              })}
            </FadeInStagger>
          </div>
        </div>
      </section>

      {/* 5. HOW A CLASS WORKS */}
      <section className="py-10 md:py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            <FadeIn>
              <h2 className="font-serif text-3xl lg:text-[2rem] text-foreground leading-tight">How a class works</h2>
              <ul className="mt-5 grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-4">
                {classFacts.map(({ Icon, label }) => (
                  <li key={label} className="flex items-center gap-3 text-foreground">
                    <span className="shrink-0 w-10 h-10 rounded-full bg-block-terracotta-light flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary" strokeWidth={1.75} aria-hidden="true" />
                    </span>
                    <span className="font-medium leading-snug">{label}</span>
                  </li>
                ))}
              </ul>
            </FadeIn>
            <Roadmap steps={classSteps} />
          </div>
        </div>
      </section>

      {/* 6. WHAT PARENTS SAY */}
      <section className="py-10 md:py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            <FadeIn>
              <h2 className="font-serif text-3xl lg:text-[2rem] text-foreground leading-tight">What families say</h2>
            </FadeIn>
            <div className="mt-10 grid md:grid-cols-3 gap-10">
              {vedicMathsTestimonials.map((item) => (
                <figure key={item.name} className="flex flex-col border-l-2 border-primary/40 pl-6">
                  <blockquote className="font-serif text-lg md:text-xl text-foreground/90 leading-relaxed flex-1">
                    “{item.quote}”
                  </blockquote>
                  <figcaption className="mt-6">
                    <span className="block font-medium text-foreground">{item.name}</span>
                    <span className="block mt-0.5 text-sm text-foreground/60">{item.detail}</span>
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
              <FAQAccordion items={faqs} />
            </div>
          </div>
        </div>
      </section>

      {/* 8. CLOSING */}
      <section className="py-16 md:py-24 bg-primary">
        <div className="container mx-auto px-4 md:px-6 text-center max-w-3xl">
          <FadeIn>
            <h2 className="font-serif text-3xl md:text-5xl text-white leading-tight">Free demo class every Sunday</h2>
            <p className="mt-5 text-lg md:text-xl text-white/90">
              Your child joins a live group session and tries the method before you decide.
            </p>
            <Button
              variant="white"
              size="lg"
              className="mt-8 text-primary font-semibold w-full sm:w-auto"
              onClick={() => bookDemo('contact_section')}
            >
              Book a free demo class
            </Button>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
