import React from 'react';
import { Lightbulb, Search, Hammer, PenLine, Target } from 'lucide-react';
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
import { testimonials } from '@/data/testimonials';
import { CURRICULUM_ALIGNED_FAQS } from '@/data/faqs';
import { Button } from '@/components/Button';
import { useAssessmentModal } from '@/context/DemoModalContext';
import heroTexture from '@assets/generated_images/hero-texture-math.png';
import tutoringPhoto from '@assets/curriculum-aligned-girl-studying.jpg';
import { Seo } from '@/seo/Seo';
import { getCurriculumAlignedSchema } from '@/seo/schema';

const shifts = [
  {
    from: '"I know this"',
    to: '"I can solve this"',
    description: 'Apply concepts independently, even when the question looks unfamiliar.',
  },
  {
    from: 'Copying steps',
    to: 'Understanding why',
    description: 'Know what to do, and why the method works.',
  },
  {
    from: 'Repeated mistakes',
    to: 'Spotting what went wrong',
    description: 'Learn to look at their own working and understand where they went off track.',
  },
  {
    from: 'Waiting for help',
    to: 'Working independently',
    description: 'Build the confidence to start, think through a problem and keep going.',
  },
];

const grades = [
  {
    range: 'Grades 1–2',
    focus: 'BUILDING THE FOUNDATIONS',
    bullets: [
      'Numbers and place value',
      'Addition and subtraction',
      'Early multiplication concepts',
      'Shapes and patterns',
      'Measurement and time',
      'Basic data handling',
      'Word problems',
    ],
    aim: 'Building confidence around numbers with basic operations.',
  },
  {
    range: 'Grades 3–5',
    focus: 'BUILDING NUMBER FLUENCY',
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
    aim: 'Making core operations reliable across different problem types.',
  },
  {
    range: 'Grades 6–8',
    focus: 'BUILDING ALGEBRAIC THINKING',
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
    aim: 'Developing mathematical reasoning as concepts become more abstract.',
  },
  {
    range: 'Grades 9–10',
    focus: 'BUILDING EXAM-READY SKILLS',
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
    aim: 'Connecting concepts and applying them confidently in exams.',
  },
];

const methodSteps = [
  {
    number: '01',
    title: 'Diagnose',
    description: (
      <>
        <span className="block text-foreground font-medium mb-1">Find where they are.</span>
        We look at how your child approaches questions, and whether an earlier gap is making it harder.
      </>
    ),
  },
  {
    number: '02',
    title: 'Rebuild',
    description: (
      <>
        <span className="block text-foreground font-medium mb-1">Strengthen what's missing.</span>
        If an earlier foundation isn't secure, we go back, rebuild it properly, and only then move ahead with confidence.
      </>
    ),
  },
  {
    number: '03',
    title: 'Accelerate',
    description: (
      <>
        <span className="block text-foreground font-medium mb-1">Build independent problem-solving.</span>
        We apply the concept to new questions until your child works through it with more confidence and less help.
      </>
    ),
  },
];

const journey = [
  { icon: Lightbulb, label: 'Understand', description: 'Break the current concept down until it makes sense.' },
  { icon: Search, label: 'Identify', description: 'Find the specific point where your child is getting stuck.' },
  { icon: Hammer, label: 'Rebuild', description: "Strengthen the earlier foundation, if that's responsible." },
  { icon: PenLine, label: 'Practise', description: 'Work through questions with guidance, then independently.' },
  { icon: Target, label: 'Apply', description: 'Use it in schoolwork, unfamiliar and exam-style problems.' },
];

const gradeThemes = [
  {
    // 01: Light Sage
    bg: 'bg-[hsl(var(--block-sage-light))] hover:bg-[hsl(var(--block-sage-light-hover))]',
    border: 'border-[hsl(var(--block-sage-light-border))]',
    pill: 'bg-[#446342]/15 text-[#3D5E3B]',
    dot: 'bg-[#446342]/70',
    aimLabel: 'text-[#3D5E3B]/70',
  },
  {
    // 02: Light Terracotta
    bg: 'bg-[hsl(var(--block-terracotta-light))] hover:bg-[hsl(var(--block-terracotta-light-hover))]',
    border: 'border-[hsl(var(--block-terracotta-light-border))]',
    pill: 'bg-primary/15 text-primary',
    dot: 'bg-primary/70',
    aimLabel: 'text-primary/70',
  },
  {
    // 03: Light Sage
    bg: 'bg-[hsl(var(--block-sage-light))] hover:bg-[hsl(var(--block-sage-light-hover))]',
    border: 'border-[hsl(var(--block-sage-light-border))]',
    pill: 'bg-[#446342]/15 text-[#3D5E3B]',
    dot: 'bg-[#446342]/70',
    aimLabel: 'text-[#3D5E3B]/70',
  },
  {
    // 04: Light Terracotta
    bg: 'bg-[hsl(var(--block-terracotta-light))] hover:bg-[hsl(var(--block-terracotta-light-hover))]',
    border: 'border-[hsl(var(--block-terracotta-light-border))]',
    pill: 'bg-primary/15 text-primary',
    dot: 'bg-primary/70',
    aimLabel: 'text-primary/70',
  },
];

export default function CurriculumAligned() {
  const { openAssessmentModal } = useAssessmentModal();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Seo
        title="Curriculum-Aligned Maths | The Vedic School"
        description="Focused Maths teaching aligned with school curriculum (CBSE, ICSE, IB), addressing conceptual gaps and building lasting confidence."
        path="/curriculum-aligned"
        schema={getCurriculumAlignedSchema()}
      />

      {/* 1. HERO */}
      <section className="relative pt-24 pb-12 sm:pt-28 sm:pb-14 lg:pt-36 lg:pb-20 border-b border-border/30 overflow-hidden">
        <div
          className="absolute inset-0 z-0 opacity-20 pointer-events-none"
          style={{ backgroundImage: `url(${heroTexture})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">
            <FadeIn className="max-w-2xl">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-foreground leading-[1.15] mb-5 sm:mb-6">
                Knowing it isn't the same as solving it.
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-foreground/80 leading-relaxed mb-6 sm:mb-8 max-w-xl">
                We teach your child through their school curriculum, closing the specific gaps that stop understanding from turning into marks.
              </p>
              <Button
                size="lg"
                onClick={openAssessmentModal}
                className="max-w-full whitespace-normal sm:whitespace-nowrap h-auto py-3.5 sm:py-0 sm:h-14 px-6 sm:px-8 text-base sm:text-lg text-center"
              >
                Book your child's personal assessment
              </Button>
            </FadeIn>

            <FadeIn delay={0.2} className="relative flex items-center justify-center">
              <div className="w-full max-w-md lg:max-w-lg aspect-square rounded-2xl sm:rounded-3xl overflow-hidden shadow-md shadow-stone-900/5 border border-stone-200/50 bg-[#E5DCCE]/30">
                <img
                  src={tutoringPhoto}
                  alt="Mentor helping a student work through a Maths problem"
                  className="w-full h-full object-cover object-[50%_35%]"
                  loading="eager"
                  decoding="async"
                />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* 2. THE SHIFT FROM KNOWING TO SOLVING */}
      <section className="py-12 sm:py-14 md:py-16 bg-white border-b border-border/30">
        <div className="container mx-auto px-4 md:px-6">
          <FadeIn className="text-center mb-8 sm:mb-10 max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif text-foreground mb-2 sm:mb-3 leading-tight">
              The Shift From Knowing To Solving
            </h2>
            <p className="text-base sm:text-lg text-foreground/75 max-w-2xl mx-auto leading-relaxed">
              What matters is what your child can do with it.
            </p>
          </FadeIn>
          <ShiftList items={shifts} variant="cards" />
        </div>
      </section>

      {/* 3. GRADE-BY-GRADE */}
      <section className="py-12 sm:py-14 md:py-16 bg-[#F0EBE1] border-b border-border/30">
        <div className="container mx-auto px-4 md:px-6">
          <FadeIn className="text-center mb-8 sm:mb-10 max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif text-foreground mb-2 sm:mb-3 leading-tight">
              <span className="sm:block">Grade-By-Grade,</span>{' '}
              <span>Built Around Your Child</span>
            </h2>
            <p className="text-base sm:text-lg text-foreground/75 max-w-2xl mx-auto leading-relaxed">
              Classes follow your child's school curriculum, with teaching adapted to their current level and learning gaps.
            </p>
          </FadeIn>

          <FadeInStagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6 max-w-7xl mx-auto items-stretch">
            {grades.map((grade, i) => {
              const theme = gradeThemes[i % gradeThemes.length];
              return (
                <FadeInStaggerItem key={i} className="h-full flex flex-col">
                  <div className={`${theme.bg} ${theme.border} border p-5 sm:p-6 rounded-2xl shadow-sm h-full flex flex-col justify-between card-lift transition-all duration-300`}>
                    <div>
                      <h3 className="font-serif text-xl sm:text-2xl text-foreground mb-3 font-medium">{grade.range}</h3>
                      <span className={`self-start inline-block text-xs font-sans font-semibold tracking-wider uppercase rounded-full px-3 py-1 mb-4 ${theme.pill}`}>
                        {grade.focus}
                      </span>
                      <ul className="space-y-1.5 mb-6">
                        {grade.bullets.map((bullet, bIdx) => (
                          <li key={bIdx} className="flex items-start text-xs sm:text-[13px] text-foreground/80 leading-snug">
                            <span className={`w-1.5 h-1.5 rounded-full mt-1.5 mr-2 shrink-0 ${theme.dot}`} />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="border-t border-border/60 pt-4 mt-auto min-h-[4.75rem] sm:min-h-[5rem] flex flex-col justify-start">
                      <span className={`text-xs font-sans font-semibold tracking-wider uppercase block mb-1 ${theme.aimLabel}`}>Primary Aim</span>
                      <span className="font-serif text-foreground font-medium text-xs sm:text-sm leading-snug block">{grade.aim}</span>
                    </div>
                  </div>
                </FadeInStaggerItem>
              );
            })}
          </FadeInStagger>
        </div>
      </section>

      {/* 4. TEACHING METHOD */}
      <section className="py-12 sm:py-14 md:py-16 bg-white border-b border-border/30">
        <div className="container mx-auto px-4 md:px-6">
          <FadeIn className="text-center mb-8 sm:mb-10 max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif text-foreground mb-2 sm:mb-3 leading-tight">
              <span className="sm:block">We Teach Your Child First,</span>{' '}
              <span>The Syllabus Second</span>
            </h2>
            <p className="text-base sm:text-lg text-foreground/75 max-w-2xl mx-auto leading-relaxed">
              The curriculum tells us what needs to be covered. Our teaching method determines how we get your child there.
            </p>
          </FadeIn>
          <MethodSteps steps={methodSteps} variant="cards" />
        </div>
      </section>

      {/* 5. HOW CLASSES WORK — THE JOURNEY & CTA */}
      <section className="py-12 sm:py-14 md:py-16 bg-[#F0EBE1] border-b border-border/30">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <FadeIn className="text-center mb-8 sm:mb-10 max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif text-foreground mb-2 sm:mb-3 leading-tight">
              From Understanding To Independent Problem-Solving
            </h2>
            <p className="text-base sm:text-lg text-foreground/75 max-w-2xl mx-auto leading-relaxed">
              We make sure your child can use what they're learning.
            </p>
          </FadeIn>

          <div className="relative">
            <div className="hidden md:block absolute top-8 left-[10%] right-[10%] border-t-2 border-dashed border-border/60" />
            <FadeInStagger className="grid grid-cols-2 md:grid-cols-5 gap-y-8 md:gap-y-10 gap-x-4 relative">
              {journey.map((step, i) => {
                const Icon = step.icon;
                const isLast = i === journey.length - 1;
                return (
                  <FadeInStaggerItem key={step.label} className={`flex flex-col items-center text-center ${i === 4 ? 'col-span-2 md:col-span-1' : ''}`}>
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

          <FadeIn delay={0.2}>
            <p className="text-center font-serif text-lg sm:text-xl md:text-2xl text-foreground/90 italic mt-8 sm:mt-10 max-w-3xl mx-auto">
              The goal isn't to finish more chapters. It's to make sure your child can actually work with what they've learned.
            </p>
          </FadeIn>

          <FadeIn delay={0.3} className="text-center mt-6 sm:mt-8">
            <Button
              size="lg"
              onClick={openAssessmentModal}
              className="max-w-full whitespace-normal sm:whitespace-nowrap h-auto py-3.5 sm:py-0 sm:h-14 px-6 sm:px-8 text-base sm:text-lg text-center"
            >
              Book your child's personal assessment session
            </Button>
          </FadeIn>
        </div>
      </section>

      {/* 6. TESTIMONIALS & REVIEWS */}
      <section className="py-12 sm:py-14 md:py-16 bg-white border-b border-border/30">
        <div className="container mx-auto px-4 md:px-6">
          <FadeIn className="text-center mb-8 sm:mb-10 max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif text-foreground mb-3 sm:mb-4 leading-tight">
              Where The Change Actually Shows Up
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mt-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FAF6F0] border border-stone-200/80 text-xs sm:text-sm font-medium text-foreground shadow-2xs">
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

          <div className="grid md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto items-stretch">
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

      {/* 7. FAQ */}
      <section className="py-12 sm:py-14 md:py-16 bg-[#F0EBE1] border-b border-border/30">
        <div className="container mx-auto px-4 md:px-6">
          <FadeIn className="text-center mb-8 sm:mb-10 max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif text-foreground mb-3 sm:mb-4 leading-tight">
              A Few Things Parents Want To Know
            </h2>
          </FadeIn>
          <FAQAccordion items={CURRICULUM_ALIGNED_FAQS} />
        </div>
      </section>

      {/* 8. CLOSING CTA BAND */}
      <ClosingCTABand
        title="Help Your Child Understand The Maths Behind The Marks"
        subtitle="When the foundation is stronger, schoolwork becomes easier to approach, and your child becomes more confident working through it."
      >
        <Button
          variant="white"
          size="lg"
          onClick={openAssessmentModal}
          className="text-primary font-semibold hover:bg-white/90 max-w-full whitespace-normal sm:whitespace-nowrap h-auto py-3.5 sm:py-0 sm:h-14 px-6 sm:px-8 text-base sm:text-lg text-center"
        >
          Book your child's personal assessment session
        </Button>
      </ClosingCTABand>
    </div>
  );
}
