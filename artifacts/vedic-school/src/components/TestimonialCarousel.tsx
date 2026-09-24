import React, { useState, useEffect, useCallback } from 'react';
import useEmblaCarousel, { type UseEmblaCarouselType } from 'embla-carousel-react';
import { useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Testimonial } from '@/data/testimonials';
import { TestimonialCard } from '@/components/ui-patterns';
import { cn } from '@/lib/utils';

type CarouselApi = UseEmblaCarouselType[1];

interface TestimonialCarouselProps {
  testimonials: Testimonial[];
  className?: string;
}

export function TestimonialCarousel({
  testimonials,
  className,
}: TestimonialCarouselProps) {
  const shouldReduceMotion = useReducedMotion();
  const [emblaRef, api] = useEmblaCarousel({
    loop: true,
    align: 'start',
    duration: shouldReduceMotion ? 0 : 25,
  });

  const [current, setCurrent] = useState(0);
  const [timerResetKey, setTimerResetKey] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const onSelect = useCallback((emblaApi: CarouselApi) => {
    if (!emblaApi) return;
    setCurrent(emblaApi.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!api) return;

    onSelect(api);
    api.on('select', onSelect);
    api.on('reInit', onSelect);

    return () => {
      api.off('select', onSelect);
    };
  }, [api, onSelect]);

  // Automatic scrolling every 12 seconds
  useEffect(() => {
    if (!api || isPaused) return;

    const timer = setInterval(() => {
      api.scrollNext();
    }, 12000);

    return () => {
      clearInterval(timer);
    };
  }, [api, isPaused, timerResetKey]);

  const handlePrev = useCallback(() => {
    if (!api) return;
    api.scrollPrev();
    setTimerResetKey((k) => k + 1);
  }, [api]);

  const handleNext = useCallback(() => {
    if (!api) return;
    api.scrollNext();
    setTimerResetKey((k) => k + 1);
  }, [api]);

  const handleDotClick = useCallback(
    (index: number) => {
      if (!api) return;
      api.scrollTo(index);
      setTimerResetKey((k) => k + 1);
    },
    [api]
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        handlePrev();
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        handleNext();
      }
    },
    [handlePrev, handleNext]
  );

  return (
    <div
      className={cn('relative w-full select-none', className)}
      role="region"
      aria-roledescription="carousel"
      aria-label="Parent Testimonials"
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => {
        setIsPaused(false);
        setTimerResetKey((k) => k + 1);
      }}
    >
      {/* Desktop side floating Previous arrow (on wide screens with margin) */}
      <button
        type="button"
        aria-label="Previous testimonial"
        onClick={handlePrev}
        className="hidden xl:flex absolute -left-6 2xl:-left-8 top-[42%] -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/95 hover:bg-[#F0EBE1] border border-border/70 shadow-sm items-center justify-center text-foreground hover:scale-105 active:scale-95 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      >
        <ArrowLeft className="w-5 h-5 text-foreground" />
      </button>

      {/* Desktop side floating Next arrow (on wide screens with margin) */}
      <button
        type="button"
        aria-label="Next testimonial"
        onClick={handleNext}
        className="hidden xl:flex absolute -right-6 2xl:-right-8 top-[42%] -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/95 hover:bg-[#F0EBE1] border border-border/70 shadow-sm items-center justify-center text-foreground hover:scale-105 active:scale-95 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      >
        <ArrowRight className="w-5 h-5 text-foreground" />
      </button>

      {/* Embla Viewport */}
      <div ref={emblaRef} className="overflow-hidden py-3 -my-3 px-1 -mx-1">
        <div className="flex -ml-4 md:-ml-6 items-stretch">
          {testimonials.map((item, index) => (
            <div
              key={`${item.name}-${index}`}
              className="min-w-0 shrink-0 grow-0 basis-full md:basis-1/2 lg:basis-1/3 pl-4 md:pl-6 h-auto flex flex-col"
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${testimonials.length}`}
            >
              <TestimonialCard
                quote={item.quote}
                author={item.name}
                relation={item.relation}
                location={item.location}
                animate={false}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Centered Controls Row (Accessible Previous, Indicator Dots, Next) */}
      <div className="mt-8 sm:mt-10 flex items-center justify-center gap-4 sm:gap-6">
        <button
          type="button"
          aria-label="Previous testimonial"
          onClick={handlePrev}
          className="w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-border/70 bg-white hover:bg-[#F0EBE1] text-foreground flex items-center justify-center shadow-xs hover:shadow-sm active:scale-95 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Carousel slide indicators */}
        <div
          className="flex items-center gap-2 px-1 sm:px-2"
          role="tablist"
          aria-label="Testimonial slide dots"
        >
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              type="button"
              role="tab"
              aria-selected={current === idx}
              aria-label={`Go to testimonial ${idx + 1}`}
              onClick={() => handleDotClick(idx)}
              className={cn(
                'transition-all duration-300 rounded-full cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
                current === idx
                  ? 'w-7 h-2.5 bg-primary shadow-xs'
                  : 'w-2.5 h-2.5 bg-foreground/20 hover:bg-foreground/40'
              )}
            />
          ))}
        </div>

        <button
          type="button"
          aria-label="Next testimonial"
          onClick={handleNext}
          className="w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-border/70 bg-white hover:bg-[#F0EBE1] text-foreground flex items-center justify-center shadow-xs hover:shadow-sm active:scale-95 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
