import React from 'react';
import { Lightbulb, Search, Hammer, PenLine, Target } from 'lucide-react';
import {
  FadeIn,
  FadeInStagger,
  FadeInStaggerItem,
  SectionHeader,
  ShiftList,
  MethodSteps,
  TestimonialCard,
  TestimonialPlaceholder,
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
    focus: 'Building the foundations',
    bullets: [
      'Numbers and place value',
      'Addition and subtraction',
      'Early multiplication concepts',
      'Shapes and patterns',
      'Measurement and time',
      'Basic data handling',
      'Word problems',
    ],
    aim: 'Understanding numbers and developing confidence with basic operations.',
  },
  {
    range: 'Grades 3–5',
    focus: 'Building fluency and applying concepts',
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
    aim: 'Making core operations reliable and applying them across different types of problems.',
  },
  {
    range: 'Grades 6–8',
    focus: 'Moving from arithmetic to algebra',
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
    focus: 'Building higher-level understanding',
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
    aim: 'Connecting concepts, solving multi-step problems and applying understanding in exam situations.',
  },
];

const methodSteps = [
  {
    number: '01',
    title: 'Diagnose',
    description: (
      <>
        <span className="block text-foreground font-medium mb-1">Understand where they are.</span>
        I look at the current topic, how your child approaches questions and whether an earlier gap is making the work difficult.
      </>
    ),
  },
  {
    number: '02',
    title: 'Rebuild',
    description: (
      <>
        <span className="block text-foreground font-medium mb-1">Strengthen what's missing.</span>
        If a foundation isn't secure, we go back and work on it before moving ahead.
      </>
    ),
  },
  {
    number: '03',
    title: 'Accelerate',
    description: (
      <>
        <span className="block text-foreground font-medium mb-1">Turn understanding into independent problem-solving.</span>
        We practise applying the concept to different questions until your child can work through it with greater confidence and less dependence on help.
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

const faqs = CURRICULUM_ALIGNED_FAQS;

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

      {/* HERO */}
      <section className="relative pt-32 pb-16 lg:pt-48 lg:pb-20 border-b border-border/30 overflow-hidden">
        <div
          className="absolute inset-0 z-0 opacity-20 pointer-events-none"
          style={{ backgroundImage: `url(${heroTexture})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            <FadeIn className="max-w-2xl">
              <span className="sage-eyebrow mb-6">CURRICULUM-ALIGNED MATHS</span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-foreground leading-tight mb-6">
                Understand the Maths. Use it with <span className="text-primary italic">confidence</span>.
              </h1>
              <p className="text-lg md:text-xl text-foreground/80 leading-relaxed mb-8 max-w-xl">
                I teach your child through their school curriculum, while addressing the gaps that may be getting in the way.
              </p>
              <Button size="lg" onClick={openAssessmentModal}>Book your child's personal assessment</Button>
              <p className="text-xs text-foreground/60 mt-4">Find out where they are and what they need.</p>
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

      {/* THE SHIFT */}
      <section className="py-16 md:py-20 bg-white border-y border-border/30">
        <div className="container mx-auto px-4 md:px-6">
          <SectionHeader
            eyebrow="THE SHIFT"
            title="Knowing the concept is only the beginning."
            subtitle="What matters is what your child can do with it."
          />
          <ShiftList items={shifts} variant="cards" />
        </div>
      </section>

      {/* GRADE BY GRADE */}
      <section className="py-12 md:py-16 bg-[#F0EBE1] border-y border-border/30">
        <div className="container mx-auto px-4 md:px-6">
          <FadeIn className="text-center mb-12 md:mb-16 max-w-2xl mx-auto">
            <h2 className="sage-eyebrow">GRADE BY GRADE</h2>
            <p className="text-2xl md:text-3xl font-serif text-foreground mb-4">
              What your child learns changes with every grade.
            </p>
            <p className="text-foreground/70">
              Classes follow your child's school curriculum, with teaching adapted to their current level and learning gaps.
            </p>
          </FadeIn>

          <FadeInStagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6 max-w-7xl mx-auto">
            {grades.map((grade, i) => {
              const theme = gradeThemes[i % gradeThemes.length];
              return (
                <FadeInStaggerItem key={i}>
                  <div className={`${theme.bg} ${theme.border} border p-5 sm:p-6 rounded-2xl shadow-sm h-full flex flex-col card-lift transition-all duration-300`}>
                    <h3 className="font-serif text-xl sm:text-2xl text-foreground mb-3 font-medium">{grade.range}</h3>
                    <span className={`self-start text-xs font-sans font-semibold tracking-wider uppercase rounded-full px-3 py-1 mb-4 ${theme.pill}`}>
                      {grade.focus}
                    </span>
                    <ul className="space-y-1.5 mb-6 flex-1">
                      {grade.bullets.map((bullet, bIdx) => (
                        <li key={bIdx} className="flex items-start text-xs sm:text-[13px] text-foreground/80 leading-snug">
                          <span className={`w-1.5 h-1.5 rounded-full mt-1.5 mr-2 shrink-0 ${theme.dot}`} />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="border-t border-border/60 pt-4 mt-auto">
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

      {/* MY TEACHING METHOD */}
      <section className="py-16 md:py-20 bg-white border-y border-border/30">
        <div className="container mx-auto px-4 md:px-6">
          <SectionHeader
            eyebrow="MY TEACHING METHOD"
            title="I don't teach the syllabus first. I teach the child learning it."
            subtitle="The curriculum tells us what needs to be covered. My teaching method determines how we get your child there."
          />
          <MethodSteps steps={methodSteps} variant="cards" />
        </div>
      </section>

      {/* HOW CLASSES WORK — THE JOURNEY */}
      <section className="py-16 md:py-20 bg-[#F0EBE1] border-y border-border/30">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <FadeIn className="text-center mb-16">
            <h2 className="sage-eyebrow">HOW CLASSES WORK</h2>
            <p className="text-3xl md:text-4xl font-serif text-foreground mb-4">
              We don't just move through the syllabus.
            </p>
            <p className="text-lg text-foreground/70">We make sure your child can use what they're learning.</p>
          </FadeIn>

          <div className="relative">
            <div className="hidden md:block absolute top-8 left-[10%] right-[10%] border-t-2 border-dashed border-border/60" />
            <FadeInStagger className="grid grid-cols-2 md:grid-cols-5 gap-y-10 gap-x-4 relative">
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
            <p className="text-center font-serif text-xl md:text-2xl text-foreground/90 italic mt-16">
              The goal isn't to finish more chapters. It's to make sure your child can actually work with what they've learned.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ASSESSMENT CTA */}
      <section className="py-16 md:py-20 bg-[#FAF6F0] border-y border-border/30">
        <div className="container mx-auto px-4 md:px-6 max-w-2xl text-center">
          <FadeIn>
            <h2 className="text-2xl md:text-3xl font-serif text-foreground mb-4">Ready to understand where your child is?</h2>
            <Button size="lg" onClick={openAssessmentModal}>Book your child's personal assessment session</Button>
            <p className="text-xs text-foreground/60 mt-4">Tell me your child's grade, board and the Maths topic or difficulty you're concerned about.</p>
          </FadeIn>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-16 md:py-20 bg-white border-y border-border/30">
        <div className="container mx-auto px-4 md:px-6">
          <SectionHeader eyebrow="WHAT PARENTS SAY" title="The change has to show up where it matters." />
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

      {/* FAQ */}
      <section className="py-16 md:py-20 bg-[#F0EBE1] border-y border-border/30">
        <div className="container mx-auto px-4 md:px-6">
          <SectionHeader eyebrow="FREQUENTLY ASKED QUESTIONS" title="A few things parents want to know." />
          <FAQAccordion items={faqs} />
        </div>
      </section>

      {/* CLOSING CTA BAND */}
      <ClosingCTABand
        title="Help your child understand the Maths behind the marks."
        subtitle="When the foundation is stronger, schoolwork becomes easier to approach — and your child becomes more confident working through it."
        cta="Book your child's personal assessment session"
        ctaSupport="A private session to understand where your child is and what they need."
        onCtaClick={openAssessmentModal}
      />

    </div>
  );
}
