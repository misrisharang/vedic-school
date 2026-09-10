import React from 'react';
import { BookOpen, PenLine, Target, Sparkles, Sigma } from 'lucide-react';
import { Button } from '@/components/Button';
import {
  FadeIn,
  FadeInStagger,
  FadeInStaggerItem,
  SectionHeader,
  ShiftList,
  MethodSteps,
  FeatureGrid,
  TestimonialPlaceholder,
  FAQAccordion,
  ClosingCTABand,
} from '@/components/ui-patterns';
import heroTexture from '@assets/generated_images/hero-texture-math.png';
import heroIllustration from '@assets/generated_images/hero-warm-math-illustration.png';

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
        <span className="block text-foreground font-medium mb-1">Find what's solid. Find what's missing.</span>
        I look at how your child currently thinks and works with numbers.
      </>
    ),
  },
  {
    number: '02',
    title: 'Rebuild',
    description: (
      <>
        <span className="block text-foreground font-medium mb-1">Strengthen the foundation.</span>
        We work on anything that needs to become secure before moving ahead.
      </>
    ),
  },
  {
    number: '03',
    title: 'Accelerate',
    description: (
      <>
        <span className="block text-foreground font-medium mb-1">Layer on Vedic and mental Maths techniques.</span>
        Once the foundation is ready, calculation becomes faster, more flexible and more reliable.
      </>
    ),
  },
];

const skills = [
  { title: 'Number Sense', body: 'Patterns, relationships and the behaviour of numbers.' },
  { title: 'Addition & Subtraction', body: 'More flexible ways to approach everyday calculations.' },
  { title: 'Multiplication', body: 'Moving beyond memorised facts to seeing patterns and relationships.' },
  { title: 'Division', body: 'Building confidence with calculations that often feel more complicated.' },
  { title: 'Mental Calculation', body: 'Working through more calculations mentally, with fewer unnecessary steps.' },
  { title: 'Advanced Techniques', body: 'For children ready to extend their fluency and explore more sophisticated calculations.' },
];

const journey = [
  { icon: BookOpen, label: 'Learn', description: 'Understand the idea.' },
  { icon: PenLine, label: 'Practise', description: 'Work with it until the thinking becomes familiar.' },
  { icon: Target, label: 'Apply', description: 'Use it independently across different calculations.' },
  { icon: Sparkles, label: 'Build Fluency', description: 'Calculation becomes faster and more natural.' },
];

const faqs = [
  {
    question: 'Who is Vedic Maths for?',
    answer: 'Vedic Maths is for children at different starting points. Whether your child is still building their number foundations, understands the basics but calculates slowly, or already enjoys Maths and wants more challenge, I start with where their thinking is today.',
  },
  {
    question: 'Where does my child start?',
    answer: 'At the level that\'s right for them. Some children begin by strengthening foundations. Others are ready to build fluency or move into more advanced work. The starting point is based on how your child currently thinks with numbers — not simply their age or grade.',
  },
  {
    question: 'Does my child need to be good at Maths to start?',
    answer: "No. Your child doesn't need to be naturally quick at Maths or already confident with numbers. The important thing is starting from what they understand today and building from there.",
  },
  {
    question: 'Is Vedic Maths just a collection of shortcuts?',
    answer: 'No. I teach techniques as tools for working with numbers more efficiently, but they are built on understanding rather than replacing it. Understanding comes first. Speed follows.',
  },
  {
    question: 'Will Vedic Maths replace school Maths?',
    answer: 'No. Vedic Maths builds calculation fluency and confidence. It complements, rather than replaces, the Maths children learn at school. Where your child needs direct help with their school curriculum, I also offer separate curriculum-aligned classes.',
  },
];

export default function VedicMaths() {
  return (
    <div className="flex flex-col min-h-screen">

      {/* HERO SECTION */}
      <section className="relative pt-32 pb-16 lg:pt-48 lg:pb-20 bg-background border-b border-border/30 overflow-hidden">
        <div
          className="absolute inset-0 z-0 opacity-20 pointer-events-none"
          style={{ backgroundImage: `url(${heroTexture})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            <FadeIn className="max-w-2xl">
              <span className="sage-eyebrow mb-6">VEDIC MATHS CLASSES</span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-foreground leading-tight mb-6">
                An ancient approach to numbers. A <span className="text-primary italic">different</span> experience for your child.
              </h1>
              <p className="text-lg md:text-xl text-foreground/80 leading-relaxed mb-8 max-w-xl">
                Vedic Maths is a collection of techniques from ancient Indian mathematics that gives children more flexible ways to work with numbers — making calculation faster, clearer and more confident.
              </p>
              <Button size="lg">Join Sunday's free demo class</Button>
              <p className="text-xs text-foreground/60 mt-4">See the method in a real class. No pressure, no commitment.</p>
            </FadeIn>

            <FadeIn delay={0.2} className="relative h-[340px] lg:h-[440px] flex items-center justify-center">
              <div className="absolute inset-0 bg-secondary/10 rounded-[40%_60%_70%_30%/40%_50%_60%_50%] blur-3xl animate-[spin_20s_linear_infinite]" />
              <div className="absolute inset-8 bg-primary/5 rounded-[60%_40%_30%_70%/50%_40%_60%_50%] blur-2xl animate-[spin_25s_linear_infinite_reverse]" />
              <img
                src={heroIllustration}
                alt="Abstract mathematical concepts"
                className="relative z-10 w-full max-w-sm h-auto object-contain drop-shadow-2xl"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </FadeIn>
          </div>
        </div>
      </section>

      {/* WHAT CHANGES FOR A CHILD */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <SectionHeader
            eyebrow="THE SHIFT"
            title="What if numbers stopped feeling like something to remember?"
            subtitle="This is where the shift begins."
          />
          <ShiftList items={shifts} variant="cards" />
        </div>
      </section>

      {/* WHAT IS VEDIC MATHS */}
      <section className="py-16 md:py-20 bg-[#F0EBE1] border-y border-border/30">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <FadeIn className="relative flex justify-center order-2 md:order-1">
              <div className="absolute w-[80%] h-[85%] bg-secondary/15 rounded-[40%_60%_70%_30%/40%_50%_60%_50%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-6 blur-lg" />
              <div className="absolute w-[70%] h-[75%] bg-primary/10 rounded-[60%_40%_30%_70%/50%_40%_60%_50%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-6 blur-md" />
              <div className="relative z-10 w-full aspect-square max-w-sm rounded-[2rem] bg-white/70 border border-border/40 shadow-sm flex flex-col items-center justify-center gap-3">
                <Sigma className="w-14 h-14 text-primary/50" strokeWidth={1.5} />
                <span className="text-xs font-sans uppercase tracking-wider text-foreground/40">Image placeholder</span>
              </div>
            </FadeIn>

            <FadeIn delay={0.1} className="order-1 md:order-2">
              <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-6">So, what exactly is Vedic Maths?</h2>
              <p className="text-lg text-foreground/80 leading-relaxed">
                Vedic Maths is a collection of mathematical techniques rooted in ancient Indian mathematical traditions that can make many calculations shorter, more flexible and easier to work through mentally. Children learn to recognise patterns and choose efficient ways to work with numbers, rather than relying only on one fixed procedure.{' '}
                <span className="font-medium text-foreground">It doesn't replace understanding — it builds on it.</span>
              </p>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* THE VEDIC SCHOOL METHOD */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <SectionHeader
            eyebrow="THE VEDIC SCHOOL METHOD"
            title="The right technique only works when it's built on the right foundation."
            subtitle="I first understand where your child is. Then we build from there."
          />
          <MethodSteps steps={methodSteps} variant="cards" />
          <FadeIn delay={0.3} className="text-center mt-16">
            <Button size="lg">Join Sunday's free demo class</Button>
            <p className="text-xs text-foreground/60 mt-4">Come experience the method in a real class.</p>
          </FadeIn>
        </div>
      </section>

      {/* WHAT YOUR CHILD LEARNS */}
      <section className="py-16 md:py-20 bg-[#F0EBE1] border-y border-border/30">
        <div className="container mx-auto px-4 md:px-6">
          <SectionHeader
            eyebrow="WHAT YOUR CHILD LEARNS"
            title="There's more to Vedic Maths than multiplication."
            subtitle="The skills build as your child's fluency grows."
          />
          <FeatureGrid items={skills} />
        </div>
      </section>

      {/* HOW CLASSES WORK — THE JOURNEY */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <FadeIn className="text-center mb-16">
            <h2 className="sage-eyebrow">HOW CLASSES WORK</h2>
            <p className="text-3xl md:text-4xl font-serif text-foreground mb-4">We don't rush to speed.</p>
            <p className="text-lg text-foreground/70">We build it, one step at a time.</p>
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

          <FadeIn delay={0.2} className="text-center mt-16">
            <h3 className="text-2xl md:text-3xl font-serif text-foreground mb-4">Now, experience it for yourself.</h3>
            <p className="text-foreground/70 max-w-xl mx-auto mb-8 leading-relaxed">
              Every Sunday, I run a free Vedic Maths group demo where your child can experience the way I teach before you decide what comes next.
            </p>
            <Button size="lg">Join Sunday's free demo class</Button>
            <p className="text-xs text-foreground/60 mt-4">No pressure. No commitment. Just a real class.</p>
          </FadeIn>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-16 md:py-20 bg-secondary/5 border-t border-border/30">
        <div className="container mx-auto px-4 md:px-6">
          <SectionHeader eyebrow="WHAT PARENTS SAY" title="Don't take my word for it." subtitle="What parents have noticed" />

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <TestimonialPlaceholder />
            <TestimonialPlaceholder delay={0.1} />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <SectionHeader eyebrow="FREQUENTLY ASKED QUESTIONS" title="A few things parents want to know." />
          <FAQAccordion items={faqs} />
        </div>
      </section>

      {/* CLOSING CTA BAND */}
      <ClosingCTABand
        title="What if your child could stop second-guessing every calculation?"
        subtitle="Let them experience a different way of working with numbers."
        cta="Join Sunday's free Vedic Maths demo class"
        ctaSupport="See how your child responds to the method before you decide what comes next."
      />

    </div>
  );
}
