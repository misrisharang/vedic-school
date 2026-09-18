import React from 'react';
import { BookOpen, PenLine, Target, Sparkles } from 'lucide-react';
import { Button } from '@/components/Button';
import { useDemoModal } from '@/context/DemoModalContext';
import {
  FadeIn,
  FadeInStagger,
  FadeInStaggerItem,
  ShiftList,
  MethodSteps,
  TestimonialCard,
  FAQAccordion,
  ClosingCTABand,
} from '@/components/ui-patterns';
import { VEDIC_MATHS_FAQS } from '@/data/faqs';
import heroTexture from '@assets/generated_images/hero-texture-math.png';
import boyStudyingPhoto from '@assets/vedic-maths-boy-studying.jpg';
import workbookPhoto from '@assets/vedic-maths-workbook.jpg';
import { Seo } from '@/seo/Seo';
import { getVedicMathsSchema } from '@/seo/schema';

const shifts = [
  {
    from: 'Memorising',
    to: 'Seeing',
    description: 'Multiplication and other calculations start making more sense as children recognise patterns instead of relying only on memory.',
  },
  {
    from: 'Second-guessing',
    to: 'Trusting',
    description: "Children begin checking their own thinking and noticing when an answer doesn't look right.",
  },
  {
    from: 'Slow and laboured',
    to: 'Fluent',
    description: 'With the right foundations in place, calculation becomes more natural and efficient.',
  },
  {
    from: 'Waiting for help',
    to: 'Working independently',
    description: 'The aim is for children to approach a calculation, think it through and keep going.',
  },
  {
    from: '"I\'m bad at maths"',
    to: '"I can do this"',
    description: "The biggest shift is often not the calculation itself. It's the confidence that comes from experiencing themselves getting better.",
  },
];

const methodSteps = [
  {
    number: '01',
    title: 'Diagnose',
    description: (
      <>
        <span className="block text-foreground font-medium mb-1">Map the current thinking.</span>
        We look at how your child currently thinks and works with numbers.
      </>
    ),
  },
  {
    number: '02',
    title: 'Rebuild',
    description: (
      <>
        <span className="block text-foreground font-medium mb-1">Strengthen the shaky parts.</span>
        We work on anything that needs to become secure before moving ahead.
      </>
    ),
  },
  {
    number: '03',
    title: 'Accelerate',
    description: (
      <>
        <span className="block text-foreground font-medium mb-1">Layer on faster methods.</span>
        Once the foundation is ready, calculation becomes faster, more flexible and reliable.
      </>
    ),
  },
];

const progressionStages = [
  {
    number: '01',
    title: 'Starting Out',
    focus: 'BUILDING THE FOUNDATIONS',
    bullets: [
      'Tables',
      'Quick multiplication and division',
      'Addition and subtraction',
      'Square roots of perfect squares',
      'Cube roots of perfect cubes',
      'Early algebra',
      'Squares, cubes and base multiplication',
    ],
    aim: 'Building the number fluency every skill depends on.',
  },
  {
    number: '02',
    title: 'Building Speed',
    focus: 'BUILDING SPEED AND FLEXIBILITY',
    bullets: [
      'Square roots of imperfect numbers',
      'Fourth powers and roots',
      'Factorisation of quadratics and cubics',
      'First-principle equations',
      'Simultaneous linear equations',
      'Dates and calendars',
      'Fractions and recurring decimals',
    ],
    aim: 'Turning early fluency into faster, flexible calculation.',
  },
  {
    number: '03',
    title: 'Exam-Ready',
    focus: 'APPLYING TO EXAM-LEVEL MATHS',
    bullets: [
      'Coordinate geometry',
      'Quadratic and simultaneous quadratic equations',
      'Trigonometry',
      'Complex numbers',
      'Highest common factor',
      'Factorisation and an introduction to differential calculus',
      'Determinants',
    ],
    aim: 'Applying those skills to advanced, exam-level maths.',
  },
];

const stageThemes = [
  {
    // 01: Light Terracotta
    bg: 'bg-[hsl(var(--block-terracotta-light))] hover:bg-[hsl(var(--block-terracotta-light-hover))]',
    border: 'border-[hsl(var(--block-terracotta-light-border))]',
    pill: 'bg-primary/15 text-primary',
    dot: 'bg-primary/70',
    aimLabel: 'text-primary/70',
  },
  {
    // 02: Light Sage
    bg: 'bg-[hsl(var(--block-sage-light))] hover:bg-[hsl(var(--block-sage-light-hover))]',
    border: 'border-[hsl(var(--block-sage-light-border))]',
    pill: 'bg-[#446342]/15 text-[#3D5E3B]',
    dot: 'bg-[#446342]/70',
    aimLabel: 'text-[#3D5E3B]/70',
  },
  {
    // 03: Light Terracotta
    bg: 'bg-[hsl(var(--block-terracotta-light))] hover:bg-[hsl(var(--block-terracotta-light-hover))]',
    border: 'border-[hsl(var(--block-terracotta-light-border))]',
    pill: 'bg-primary/15 text-primary',
    dot: 'bg-primary/70',
    aimLabel: 'text-primary/70',
  },
];

const journey = [
  { icon: BookOpen, label: 'Learn', description: 'Understand the idea.' },
  { icon: PenLine, label: 'Practise', description: 'Work with it until the thinking becomes familiar.' },
  { icon: Target, label: 'Apply', description: 'Use it independently across different calculations.' },
  { icon: Sparkles, label: 'Build Fluency', description: 'Calculation becomes faster and more natural.' },
];

const vedicMathsTestimonials = [
  {
    name: 'Krishang K Sharma',
    quote:
      'Maths develops our reasoning, analytical thinking and practical understanding, and its use can be applied in everyday life. Meenakshi Mam has been one of my most amazing Maths teachers. Through Vedic Maths, she has helped me develop an interest in Maths and supported me morally and academically. You taught me never to give up and that there is more than one way to solve everything.',
  },
  {
    name: 'Miti Jindal',
    relation: '(Mother of Marc Veer Jindal)',
    location: 'Australia',
    quote:
      "We were given Meenakshi's reference by a family member whose two children were being taught by her. We were impressed by their knowledge and understanding, so we decided to try her for our six-year-old son Marc. Her way of handling his questions and her teaching style were very impressive. My son has come a long way with her. Thank you for your continuous support.",
  },
  {
    name: 'Kanupriya Gupta',
    location: 'Google review',
    quote:
      'Meenakshi, founder of The Vedic School, is a very good Maths teacher. She puts in a lot of effort to bring out the best in the learner and gives her time generously so that every child sees real results. Highly recommended for Maths and Vedic Maths teaching for your kids.',
  },
];

const faqs = VEDIC_MATHS_FAQS;

export default function VedicMaths() {
  const { openDemoModal } = useDemoModal();

  return (
    <div className="flex flex-col min-h-screen">
      <Seo
        title="Vedic Maths Classes | The Vedic School"
        description="Vedic Maths classes that give children flexible ways to work with numbers, making calculation faster, clearer and more confident."
        path="/vedic-maths"
        schema={getVedicMathsSchema()}
      />

      {/* 1. HERO SECTION */}
      <section className="relative pt-24 pb-12 sm:pt-28 sm:pb-14 lg:pt-36 lg:pb-20 border-b border-border/30 overflow-hidden">
        <div
          className="absolute inset-0 z-0 opacity-20 pointer-events-none"
          style={{ backgroundImage: `url(${heroTexture})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] xl:grid-cols-2 gap-10 lg:gap-12 items-center">
            <FadeIn className="max-w-2xl">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[2.85rem] xl:text-6xl font-serif text-foreground leading-[1.12] mb-5 sm:mb-6 tracking-tight">
                <span className="block lg:whitespace-nowrap">Maths that clicks, not</span>{' '}
                <span className="block">confuses.</span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-foreground/80 leading-relaxed mb-6 sm:mb-8 max-w-xl">
                We teach your child to understand numbers, not just memorise steps, so maths stops feeling confusing and starts feeling like something they actually enjoy.
              </p>
              <Button
                size="lg"
                onClick={openDemoModal}
                className="max-w-full whitespace-normal sm:whitespace-nowrap h-auto py-3.5 sm:py-0 sm:h-14 px-6 sm:px-8 text-base sm:text-lg text-center"
              >
                Join Sunday's free demo class
              </Button>
            </FadeIn>

            <FadeIn delay={0.2} className="relative flex items-center justify-center">
              <div className="w-full max-w-md lg:max-w-lg aspect-square rounded-2xl sm:rounded-3xl overflow-hidden shadow-md shadow-stone-900/5 border border-stone-200/50 bg-[#E5DCCE]/30">
                <img
                  src={boyStudyingPhoto}
                  alt="Child working on Maths at home"
                  className="w-full h-full object-cover object-center"
                  loading="eager"
                  decoding="async"
                />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* 2. THE VEDIC MATHS TRICKS BEHIND THE SHIFT */}
      <section className="py-12 sm:py-14 md:py-16 bg-white border-b border-border/30">
        <div className="container mx-auto px-4 md:px-6">
          <FadeIn className="text-center mb-8 sm:mb-10 max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif text-foreground mb-2 sm:mb-3 leading-tight">
              The Vedic Maths Tricks Behind The Shift
            </h2>
            <h3 className="text-lg sm:text-xl md:text-2xl font-serif text-foreground/80 font-normal leading-relaxed">
              What if numbers stopped feeling like something to remember?
            </h3>
          </FadeIn>

          <ShiftList items={shifts} variant="cards" />
        </div>
      </section>

      {/* 2B. WHAT IS VEDIC MATHS? */}
      <section className="py-12 sm:py-14 md:py-16 bg-[#F0EBE1] border-b border-border/30">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <FadeIn className="text-center mb-8 sm:mb-10 max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif text-foreground leading-tight">
              What is Vedic Maths?
            </h2>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <FadeIn className="relative flex justify-center order-2 md:order-1">
              <div className="w-full max-w-md lg:max-w-lg aspect-[4/3] rounded-2xl sm:rounded-3xl overflow-hidden shadow-md shadow-stone-900/5 border border-stone-200/50 bg-[#E5DCCE]/30">
                <img
                  src={workbookPhoto}
                  alt="Child working through Maths problems in a workbook"
                  className="w-full h-full object-cover object-center"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </FadeIn>

            <FadeIn delay={0.1} className="order-1 md:order-2 space-y-4 text-base sm:text-lg text-foreground/85 leading-relaxed">
              <p>
                The biggest shift is often not the calculation itself. It's the confidence that comes from experiencing themselves getting better.
              </p>
              <p>
                Vedic Maths gives your child faster, more flexible ways to calculate. Instead of grinding through one long method for every problem, they learn to spot the pattern and see why it works. That's when maths stops feeling like a wall of rules to memorise, and starts feeling like something they can actually enjoy.
              </p>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* 3. THE RIGHT FOUNDATION COMES FIRST */}
      <section className="py-12 sm:py-14 md:py-16 bg-white border-b border-border/30">
        <div className="container mx-auto px-4 md:px-6">
          <FadeIn className="text-center mb-8 sm:mb-10 max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif text-foreground mb-2 sm:mb-3 leading-tight">
              The Right Foundation Comes First
            </h2>
            <p className="text-base sm:text-lg text-foreground/75 max-w-2xl mx-auto leading-relaxed">
              We first understand where your child is. Then we build from there.
            </p>
          </FadeIn>

          <MethodSteps steps={methodSteps} variant="cards" />
        </div>
      </section>

      {/* 4. WHAT YOUR CHILD ACTUALLY LEARNS */}
      <section className="py-12 sm:py-14 md:py-16 bg-[#F0EBE1] border-b border-border/30">
        <div className="container mx-auto px-4 md:px-6">
          <FadeIn className="text-center mb-8 sm:mb-10 max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif text-foreground mb-2 sm:mb-3 leading-tight">
              What Your Child Actually Learns
            </h2>
            <p className="text-base sm:text-lg text-foreground/75 max-w-2xl mx-auto leading-relaxed">
              The skills build as your child's fluency grows.
            </p>
          </FadeIn>

          <FadeInStagger className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto items-stretch">
            {progressionStages.map((stage, i) => {
              const theme = stageThemes[i % stageThemes.length];
              return (
                <FadeInStaggerItem key={i} className="h-full flex flex-col">
                  <div className={`${theme.bg} ${theme.border} border p-5 sm:p-6 lg:p-8 rounded-2xl shadow-sm h-full flex flex-col justify-between card-lift transition-all duration-300`}>
                    <div>
                      <h3 className="font-serif text-xl sm:text-2xl text-foreground mb-3 font-medium flex items-baseline">
                        <span className="font-mono text-base sm:text-lg text-foreground/50 mr-2 shrink-0">{stage.number}</span>
                        <span>{stage.title}</span>
                      </h3>
                      <span className={`self-start inline-block text-xs font-sans font-semibold tracking-wider uppercase rounded-full px-3 py-1 mb-4 ${theme.pill}`}>
                        {stage.focus}
                      </span>
                      <ul className="space-y-2 mb-6">
                        {stage.bullets.map((bullet, bIdx) => (
                          <li key={bIdx} className="flex items-start text-xs sm:text-[13px] text-foreground/80 leading-snug">
                            <span className={`w-1.5 h-1.5 rounded-full mt-1.5 mr-2.5 shrink-0 ${theme.dot}`} />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="border-t border-border/60 pt-4 mt-auto">
                      <span className={`text-xs font-sans font-semibold tracking-wider uppercase block mb-1 ${theme.aimLabel}`}>
                        Primary Aim
                      </span>
                      <span className="font-serif text-foreground font-medium text-sm sm:text-base leading-snug block">
                        {stage.aim}
                      </span>
                    </div>
                  </div>
                </FadeInStaggerItem>
              );
            })}
          </FadeInStagger>
        </div>
      </section>

      {/* 5. HOW OUR VEDIC MATHS CLASSES WORK? */}
      <section className="py-12 sm:py-14 md:py-16 bg-white border-b border-border/30">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <FadeIn className="text-center mb-10 sm:mb-12 max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif text-foreground mb-2 sm:mb-3 leading-tight">
              How Our Vedic Maths Classes Work?
            </h2>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-serif text-foreground/85 font-medium mb-2 sm:mb-3">
              We don't rush to speed.
            </h3>
            <p className="text-base sm:text-lg text-foreground/70 max-w-xl mx-auto leading-relaxed">
              We build it, one step at a time.
            </p>
          </FadeIn>

          <div className="relative">
            <div className="hidden md:block absolute top-8 left-[12.5%] right-[12.5%] border-t-2 border-dashed border-border/60" />
            <FadeInStagger className="grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-4 relative">
              {journey.map((step, i) => {
                const Icon = step.icon;
                const isLast = i === journey.length - 1;
                return (
                  <FadeInStaggerItem key={step.label} className="flex flex-col items-center text-center">
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center shadow-md mb-4 relative z-10 ${
                        isLast ? 'bg-secondary text-white' : 'bg-primary text-white'
                      }`}
                    >
                      <Icon className="w-6 h-6" strokeWidth={1.75} />
                    </div>
                    <span className="text-xs font-sans font-bold tracking-wider uppercase text-secondary mb-1">
                      Step {i + 1}
                    </span>
                    <h4 className="font-serif text-xl text-foreground mb-2">{step.label}</h4>
                    <p className="text-foreground/70 text-sm leading-relaxed max-w-[160px]">{step.description}</p>
                  </FadeInStaggerItem>
                );
              })}
            </FadeInStagger>
          </div>

          <FadeIn delay={0.2} className="text-center mt-10 sm:mt-12 max-w-2xl mx-auto">
            <p className="text-base sm:text-lg text-foreground/80 leading-relaxed mb-6 sm:mb-7">
              Every Sunday, we run a free Vedic Maths group demo where your child can experience the way we teach before you decide what comes next.
            </p>
            <Button size="lg" onClick={openDemoModal}>Join Sunday's free demo class</Button>
          </FadeIn>
        </div>
      </section>

      {/* 6. TESTIMONIALS & REVIEWS */}
      <section className="py-12 sm:py-14 md:py-16 bg-[#FAF6F0] border-b border-border/30">
        <div className="container mx-auto px-4 md:px-6">
          <FadeIn className="text-center mb-10 sm:mb-12 max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif text-foreground mb-3 sm:mb-4 leading-tight">
              Don't Take Our Word For It
            </h2>
            <p className="text-base sm:text-lg text-foreground/75 max-w-2xl mx-auto leading-relaxed mb-5 sm:mb-6">
              What parents have noticed.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-stone-200/80 text-xs sm:text-sm font-medium text-foreground shadow-2xs">
                <span>5.0 ⭐ rating on Google</span>
              </div>
              <a
                href="https://www.google.com/maps/place/The+Vedic+School/@28.4317134,77.1086168,17z/data=!4m8!3m7!1s0x390d1da42d384595:0x51719d674bb453e1!8m2!3d28.4317134!4d77.1086168!9m1!1b1!16s%2Fg%2F11q2y0y7n6?entry=ttu&g_ep=EgoyMDI2MDkxMy4wIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs sm:text-sm font-medium border border-stone-300 bg-white text-foreground hover:border-stone-400 hover:bg-stone-50 shadow-2xs transition-all group"
              >
                <span>Read our Google reviews</span>
                <span className="transition-transform group-hover:translate-x-0.5">→</span>
              </a>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
            {vedicMathsTestimonials.map((item, index) => (
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

      {/* 7. FAQ */}
      <section className="py-12 sm:py-14 md:py-16 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <FadeIn className="text-center mb-8 sm:mb-10 max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif text-foreground mb-3 sm:mb-4 leading-tight">
              A Few Things Parents Want To Know
            </h2>
          </FadeIn>
          <FAQAccordion items={faqs} />
        </div>
      </section>

      {/* 8. CLOSING CTA BAND */}
      <ClosingCTABand title="See Your Child Enjoy Maths Again">
        <p className="text-lg md:text-xl text-white/90 mb-3 font-serif italic">
          Let them experience a different way of working with numbers, this Sunday.
        </p>
        <p className="text-base md:text-lg text-white/80 mb-8 sm:mb-10">
          Now teaching Vedic Maths classes near you in Gurugram, live and online.
        </p>
        <Button variant="white" size="lg" onClick={openDemoModal} className="text-primary font-semibold hover:bg-white/90">
          Join Sunday's free demo class
        </Button>
      </ClosingCTABand>

    </div>
  );
}
