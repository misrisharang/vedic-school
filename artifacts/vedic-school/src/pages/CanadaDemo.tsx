import React, { useState, useEffect, useCallback } from 'react';
import {
  Calendar,
  Clock,
  Video,
  Users,
  CheckCircle2,
  User,
  Mail,
  GraduationCap,
  ChevronDown,
  Globe,
  Lightbulb,
  Workflow,
  BarChart3,
  Plus,
} from 'lucide-react';
import { Logo } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { WhatsAppPhoneInput } from '@/components/WhatsAppPhoneInput';
import { FloatingNumbers } from '@/components/FloatingNumbers';
import { VedicTrickDemo } from '@/components/VedicTrickDemo';
import { LeafSprig } from '@/components/LeafSprig';
import {
  COUNTRIES,
  Country,
  getCountryByCode,
  validatePhoneNumber,
  normalizeWhatsAppNumber,
} from '@/data/countries';
import { submitRegistration } from '@/lib/supabase';
import { CANADA_CAMPAIGN_ID, markCampaignRegistered } from '@/config/canadaCampaign';
import {
  trackCtaClick,
  trackLeadSubmission,
  trackCampaignPageView,
  trackCampaignFormSubmit,
} from '@/lib/analytics';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { FAQItem } from '@/components/ui-patterns';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from '@/components/ui/accordion';
import { Seo } from '@/seo/Seo';
import { getCanadaDemoSchema } from '@/seo/schema';
import meenakshiPhoto from '@assets/meenakshi-founder-landscape.jpg';
import meenakshiPortrait from '@assets/meenakshi-founder-portrait.jpg';
import { cn } from '@/lib/utils';

const CAMPAIGN_ID = CANADA_CAMPAIGN_ID;

const GRADES = [
  'Grade 1',
  'Grade 2',
  'Grade 3',
  'Grade 4',
  'Grade 5',
  'Grade 6',
  'Grade 7',
  'Grade 8',
  'Grade 9',
  'Grade 10',
];

const CANADA_DEMO_FAQS: FAQItem[] = [
  {
    question: 'Who can attend?',
    answer: 'The demo is intended for children aged 9 and above.',
  },
  {
    question: 'Does my child need prior knowledge of Vedic Maths?',
    answer: 'No prior knowledge of Vedic Maths is required for this introductory demo.',
  },
  {
    question: 'How will the class take place?',
    answer: 'The session will take place online. Registered participants will receive the joining details.',
  },
  {
    question: 'What should we expect in the class?',
    answer:
      "It's a live, interactive class on Google Meet. The class link is emailed to you before the session. Please have a working camera and microphone, a quiet spot, and a notebook and pencil nearby, and join 5 minutes early so we can start on time.",
  },
  {
    question: 'What happens after the demo?',
    answer:
      "You'll have an opportunity to understand The Vedic School's approach and decide whether the programme is suitable for your child. There is no obligation to enrol.",
  },
];

// Real parent quotes from src/data/testimonials.ts (the first is a shortened excerpt).
const CANADA_DEMO_TESTIMONIALS = [
  {
    name: 'Neha Bhandari',
    relation: 'Parent',
    quote:
      '“Not only that fear was gone but she started enjoying numbers. Her concepts became more strong. She gained confidence.”',
  },
  {
    name: 'Snehal Sachin Harane',
    relation: 'Mother of Anivesh',
    quote:
      '“…he was least interested in maths… But within 2 months, owing to Meenakshi mam’s teaching techniques and her efforts, my son started to like maths.”',
  },
  {
    name: 'Mansha Bankeraika',
    relation: 'Parent',
    quote:
      '“My daughter had an amazing learning experience of Vedic Maths from you. Thanks for making complex calculations so easy and fast for my kids.”',
  },
];

/**
 * Hand-drawn 3-ray radiant tick accent (matches mockup)
 */
function DoodleRays({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn('w-4 h-4 text-primary select-none pointer-events-none', className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <line x1="6" y1="18" x2="11" y2="7" />
      <line x1="12" y1="20" x2="17" y2="9" />
      <line x1="18" y1="22" x2="22" y2="13" />
    </svg>
  );
}

/**
 * Small 2-ray tick marks at the bottom-left of icon badges (matches mockup)
 */
function SmallTicks({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      className={cn('w-4 h-4 select-none pointer-events-none', className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <line x1="4" y1="16" x2="10" y2="6" />
      <line x1="10" y1="17" x2="15" y2="8" />
    </svg>
  );
}

interface FormData {
  parentName: string;
  email: string;
  whatsappNumber: string;
  childName: string;
  grade: string;
  whatsappConsent: boolean;
}

interface FormErrors {
  parentName?: string;
  email?: string;
  whatsappNumber?: string;
  childName?: string;
  grade?: string;
  whatsappConsent?: string;
}

export default function CanadaDemo() {
  // Default country to Canada (CA, +1)
  const [selectedCountry, setSelectedCountry] = useState<Country>(() =>
    getCountryByCode('CA')
  );

  const [formData, setFormData] = useState<FormData>({
    parentName: '',
    email: '',
    whatsappNumber: '',
    childName: '',
    grade: '',
    whatsappConsent: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Track landing page view once on mount
  useEffect(() => {
    trackCampaignPageView(CAMPAIGN_ID, '/canada-demo');
  }, []);

  const scrollToRegistration = useCallback(() => {
    const el = document.getElementById('registration-card');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    if (submitError) {
      setSubmitError(null);
    }
  };

  const handleCountryChange = (newCountry: Country) => {
    setSelectedCountry(newCountry);
    if (errors.whatsappNumber) {
      setErrors((prev) => ({ ...prev, whatsappNumber: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.parentName.trim()) {
      newErrors.parentName = 'Please enter your name.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    const phoneValidation = validatePhoneNumber(formData.whatsappNumber, selectedCountry.code);
    if (!phoneValidation.isValid) {
      newErrors.whatsappNumber = phoneValidation.error || 'Please enter a valid WhatsApp number.';
    }

    if (!formData.childName.trim()) {
      newErrors.childName = "Please enter your child's name.";
    }

    if (!formData.grade) {
      newErrors.grade = "Please select your child's grade.";
    }

    if (!formData.whatsappConsent) {
      newErrors.whatsappConsent = 'Please agree to receive class details on WhatsApp.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;
    setSubmitError(null);

    trackCampaignFormSubmit('canada_demo_form', CAMPAIGN_ID);

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    const normalizedWhatsApp = normalizeWhatsAppNumber(
      formData.whatsappNumber,
      selectedCountry.dialCode
    );

    const result = await submitRegistration({
      registration_type: 'demo',
      parent_name: formData.parentName.trim(),
      child_name: formData.childName.trim(),
      whatsapp: normalizedWhatsApp,
      whatsapp_country: selectedCountry.name,
      whatsapp_country_code: selectedCountry.dialCode,
      grade: formData.grade,
      email: formData.email.trim(),
      whatsapp_consent: true,
      demo_date: '2026-10-25',
    });

    setIsSubmitting(false);

    if (result.success) {
      setIsSubmitted(true);
      markCampaignRegistered();
      trackLeadSubmission('canada_demo_form', 'vedic_maths', undefined, CAMPAIGN_ID);
    } else {
      setSubmitError(result.error || "We couldn't save your child's place. Please try again.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF6F0] selection:bg-primary/20 selection:text-foreground">
      <Seo
        title="Free Online Vedic Maths Demo Class | The Vedic School"
        description="Join Meenakshi Koul for a free online Vedic Maths demo class on Sunday, October 25, 2026 at 8:30 PM Eastern Time. Help your child build calculation fluency and confidence."
        path="/canada-demo"
        schema={getCanadaDemoSchema(CANADA_DEMO_FAQS)}
      />

      {/* ==============================================================================
          1. HEADER (ONLY LOGO & TERRACOTTA CTA - NO SITE NAV LINKS)
          ============================================================================== */}
      <header className="sticky top-0 left-0 right-0 z-40 bg-[#FAF6F0] h-16 sm:h-18 lg:h-20 flex items-center transition-all duration-200">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* Left: Vedic School Logo & Mascot */}
          <div className="flex items-center shrink-0">
            <Logo className="[&_img]:mix-blend-multiply max-[359px]:[&_img:last-child]:hidden [&_img:first-child]:h-6 [&_img:last-child]:h-9 sm:[&_img:first-child]:h-8 sm:[&_img:last-child]:h-12 lg:[&_img:first-child]:h-[39px] lg:[&_img:last-child]:h-15" />
          </div>

          {/* Right: Terracotta rounded CTA */}
          <button
            type="button"
            onClick={() => {
              trackCtaClick('reserve_spot', 'canada_demo_header', 'vedic_maths', CAMPAIGN_ID);
              scrollToRegistration();
            }}
            className="inline-flex items-center gap-1.5 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full bg-[#B04C27] hover:bg-[#9A4122] active:scale-[0.98] text-white font-serif font-medium text-xs sm:text-[15px] shadow-xs hover:shadow-sm transition-all cursor-pointer whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <span>Save My Child's Place</span>
            <span className="font-sans leading-none text-xs sm:text-sm">→</span>
          </button>
        </div>
      </header>

      <main className="flex-1 w-full">
        {/* ==============================================================================
            2. HERO SECTION: RECREATE THE APPROVED COMPOSITION (WARM CREAM)
            ============================================================================== */}
        <section className="relative overflow-hidden bg-[#FAF6F0] pt-6 pb-10 sm:pt-8 sm:pb-14 lg:pt-4 lg:pb-6 lg:min-h-[calc(100svh-5rem)] flex items-center">
          {/* Organic background shapes */}
          <div className="absolute top-10 -left-24 w-[420px] h-[420px] bg-[#FBECE3]/70 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 left-1/3 w-[560px] h-[260px] bg-[#F6E6DA]/60 rounded-[50%] blur-3xl pointer-events-none" />
          <FloatingNumbers />

          <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-6 xl:gap-8 items-center">

              {/* LEFT: HERO COPY + EVENT DETAILS */}
              <div className="lg:col-span-5 flex flex-col relative z-10">
                {/* Eyebrow Badge with Canadian Flag */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FCE6DC] text-[#A84824] text-[11px] sm:text-xs font-semibold tracking-wide uppercase mb-5 lg:mb-6 w-fit">
                  <span>🇨🇦</span>
                  <span>FREE ONLINE VEDIC MATHS DEMO CLASS</span>
                </div>

                <h1 className="font-serif text-[36px] sm:text-5xl lg:text-[52px] xl:text-[60px] text-[#1E2B3C] font-semibold leading-[1.08] tracking-tight mb-5 lg:mb-6">
                  What if Maths felt{' '}
                  <span className="relative inline-block text-primary">
                    easier
                    <svg
                      viewBox="0 0 200 12"
                      preserveAspectRatio="none"
                      className="absolute left-0 -bottom-1.5 w-full h-2.5 text-primary"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      aria-hidden="true"
                    >
                      <path d="M3 8 C 50 3, 120 2, 197 6" />
                    </svg>
                  </span>{' '}
                  for your child?
                </h1>

                <p className="text-[17px] sm:text-lg xl:text-xl text-foreground/80 leading-relaxed mb-8 lg:mb-10 max-w-md xl:max-w-lg">
                  Children learn to spot patterns, calculate with confidence and understand why each method works. Free, live and online.
                </p>

                {/* Event Details: four equal blocks (2x2, single row on tablet); gap-px over a tinted background draws the dividers */}
                <dl className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-px bg-[#E8DDD0] border border-[#E8DDD0] rounded-2xl overflow-hidden lg:max-w-xl">
                  {[
                    { Icon: Calendar, label: 'Sunday', value: 'Oct 25, 2026' },
                    { Icon: Clock, label: 'Starts at', value: '8:30 PM ET' },
                    { Icon: Video, label: 'Format', value: 'Live online' },
                    { Icon: Users, label: 'Open to', value: 'Ages 9+' },
                  ].map(({ Icon, label, value }) => (
                    <div key={label} className="flex items-center gap-2.5 sm:gap-3 bg-[#FCF9F5] px-3 sm:px-4 py-3">
                      <Icon className="w-5 h-5 text-[#B04C27] shrink-0" strokeWidth={1.8} aria-hidden="true" />
                      <div className="min-w-0 leading-snug">
                        <dt className="text-[11px] sm:text-xs text-foreground/75">{label}</dt>
                        <dd className="text-[13px] sm:text-sm font-semibold text-foreground whitespace-nowrap">{value}</dd>
                      </div>
                    </div>
                  ))}
                </dl>
                <p className="mt-3 text-xs text-foreground/75 leading-relaxed">
                  Also 5:30 PM Pacific, 6:30 PM Mountain, 7:30 PM Central and 9:30 PM Atlantic.
                </p>

              </div>

              {/* CENTRE: TEACHER PORTRAIT ON ORGANIC ARCH BACKDROP */}
              <div className="lg:col-span-3 relative self-stretch flex items-end justify-center order-last lg:order-none">
                <div className="relative w-full max-w-[300px] lg:max-w-none mx-auto aspect-[3/4] lg:aspect-auto lg:h-full lg:min-h-[480px]">
                  {/* Peach arch backdrop */}
                  <div className="absolute inset-x-[-8%] bottom-0 top-[6%] bg-[#F3D9C8] rounded-t-full" />
                  {/* Terracotta arc at the base */}
                  <div className="absolute -left-[12%] -bottom-6 w-[44%] aspect-square bg-[#D9784F]/85 rounded-full" />

                  <div className="absolute inset-x-[3%] top-[9%] bottom-0 rounded-t-full overflow-hidden ring-4 ring-[#FAF6F0]/60">
                    <img
                      src={meenakshiPortrait}
                      alt="Meenakshi Koul, founder and educator at The Vedic School"
                      className="w-full h-full object-cover object-[50%_12%]"
                      width={768}
                      height={1280}
                      loading="eager"
                      fetchPriority="high"
                      decoding="async"
                    />
                  </div>
                </div>
              </div>

              {/* RIGHT: REGISTRATION CARD (contained within the hero, never sticky) */}
              <div className="lg:col-span-4 w-full relative z-10">
                <div
                  id="registration-card"
                  className="relative bg-white rounded-2xl border border-[#EFE8DE] shadow-xl shadow-stone-900/[0.06] p-5 sm:p-6 scroll-mt-24"
                >
                  {/* Corner Doodle Rays (matches mockup) */}
                  <div className="absolute -top-6 -right-4 sm:-top-7 sm:-right-5 pointer-events-none">
                    <DoodleRays className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
                  </div>

                  {isSubmitted ? (
                    /* SUCCESS STATE */
                    <div className="text-center py-6 sm:py-8 animate-in fade-in zoom-in-95 duration-300">
                      <div className="w-16 h-16 rounded-full bg-secondary/15 text-secondary flex items-center justify-center mx-auto mb-5 shadow-xs">
                        <CheckCircle2 className="w-9 h-9" strokeWidth={2.2} />
                      </div>

                      <h3 className="font-serif text-2xl sm:text-3xl text-foreground font-medium mb-3">
                        Your Child's Place Is Saved!
                      </h3>

                      <div className="bg-[#FAF6F0] border border-[#E6DDCF] rounded-2xl p-5 mb-6 text-foreground/85 leading-relaxed text-sm sm:text-base space-y-3 text-left shadow-2xs">
                        <p className="font-medium text-foreground">
                          Thank you for registering with The Vedic School.
                        </p>
                        <p className="text-foreground/75 text-sm">
                          A confirmation email is on its way, and the class link will be emailed to you before the session.
                        </p>
                        <div className="pt-2 border-t border-[#E6DDCF]/70 text-xs text-foreground/75 space-y-1">
                          <p className="font-semibold text-foreground">Event details:</p>
                          <p className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5 text-[#B04C27]" aria-hidden="true" /> Sunday, October 25, 2026</p>
                          <p className="flex items-center gap-2"><Clock className="w-3.5 h-3.5 text-[#B04C27]" aria-hidden="true" /> 8:30 PM ET (5:30 PM PT)</p>
                          <p className="flex items-center gap-2"><Video className="w-3.5 h-3.5 text-[#B04C27]" aria-hidden="true" /> Live online session</p>
                        </div>
                      </div>

                      <div className="text-xs text-foreground/60 text-center">
                        Need to make changes? Email <a href="mailto:meenakshikhar@gmail.com" className="underline underline-offset-2 hover:text-foreground">meenakshikhar@gmail.com</a>
                      </div>
                    </div>
                  ) : (
                    /* REGISTRATION FORM */
                    <div>
                      <h2 className="font-serif text-2xl sm:text-[27px] text-[#1E2B3C] font-semibold mb-1 leading-snug">
                        Join the Demo Class
                      </h2>
                      <p className="text-xs sm:text-[13px] text-foreground/70 mb-4 leading-relaxed">
                        Free to attend. Places are limited, so register now.
                      </p>

                      <form onSubmit={handleSubmit} noValidate className="space-y-2">
                        {/* 1. Parent's Name */}
                        <div>
                          <label
                            htmlFor="canada-parent-name"
                            className="block text-xs font-medium text-foreground/90 mb-0.5"
                          >
                            Parent's name <span className="text-primary">*</span>
                          </label>
                          <div className="relative flex items-center">
                            <User className="w-4 h-4 text-foreground/45 pointer-events-none absolute left-3.5" />
                            <input
                              id="canada-parent-name"
                              type="text"
                              value={formData.parentName}
                              onChange={(e) => handleInputChange('parentName', e.target.value)}
                              placeholder="Enter your name"
                              className={cn(
                                'w-full pl-10 pr-4 h-[38px] rounded-lg border border-[#E5DCD1] bg-white text-foreground placeholder:text-foreground/70 text-base sm:text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all shadow-2xs',
                                errors.parentName && 'border-[#B04C27]/70 bg-primary/5 focus:border-primary'
                              )}
                              required
                            />
                          </div>
                          {errors.parentName && (
                            <p className="text-[#A84824] text-xs mt-1 flex items-center gap-1 font-medium">
                              <span>•</span> {errors.parentName}
                            </p>
                          )}
                        </div>

                        {/* 2. Parent's Email */}
                        <div>
                          <label
                            htmlFor="canada-parent-email"
                            className="block text-xs font-medium text-foreground/90 mb-0.5"
                          >
                            Parent's email <span className="text-primary">*</span>
                          </label>
                          <div className="relative flex items-center">
                            <Mail className="w-4 h-4 text-foreground/45 pointer-events-none absolute left-3.5" />
                            <input
                              id="canada-parent-email"
                              type="email"
                              value={formData.email}
                              onChange={(e) => handleInputChange('email', e.target.value)}
                              placeholder="Enter your email"
                              className={cn(
                                'w-full pl-10 pr-4 h-[38px] rounded-lg border border-[#E5DCD1] bg-white text-foreground placeholder:text-foreground/70 text-base sm:text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all shadow-2xs',
                                errors.email && 'border-[#B04C27]/70 bg-primary/5 focus:border-primary'
                              )}
                              required
                            />
                          </div>
                          {errors.email && (
                            <p className="text-[#A84824] text-xs mt-1 flex items-center gap-1 font-medium">
                              <span>•</span> {errors.email}
                            </p>
                          )}
                        </div>

                        {/* 3. WhatsApp Number with Pre-selected Canada (+1) */}
                        <div>
                          <label
                            htmlFor="canada-whatsapp-number"
                            className="block text-xs font-medium text-foreground/90 mb-0.5"
                          >
                            WhatsApp number <span className="text-primary">*</span>
                          </label>
                          <WhatsAppPhoneInput
                            id="canada-whatsapp-number"
                            country={selectedCountry}
                            onCountryChange={handleCountryChange}
                            phoneNumber={formData.whatsappNumber}
                            onPhoneNumberChange={(val) => handleInputChange('whatsappNumber', val)}
                            error={errors.whatsappNumber}
                            themeColor="terracotta"
                            size="compact"
                            disabled={isSubmitting}
                          />
                        </div>

                        {/* 4. Child's Name */}
                        <div>
                          <label
                            htmlFor="canada-child-name"
                            className="block text-xs font-medium text-foreground/90 mb-0.5"
                          >
                            Child's name <span className="text-primary">*</span>
                          </label>
                          <div className="relative flex items-center">
                            <User className="w-4 h-4 text-foreground/45 pointer-events-none absolute left-3.5" />
                            <input
                              id="canada-child-name"
                              type="text"
                              value={formData.childName}
                              onChange={(e) => handleInputChange('childName', e.target.value)}
                              placeholder="Enter your child's name"
                              className={cn(
                                'w-full pl-10 pr-4 h-[38px] rounded-lg border border-[#E5DCD1] bg-white text-foreground placeholder:text-foreground/70 text-base sm:text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all shadow-2xs',
                                errors.childName && 'border-[#B04C27]/70 bg-primary/5 focus:border-primary'
                              )}
                              required
                            />
                          </div>
                          {errors.childName && (
                            <p className="text-[#A84824] text-xs mt-1 flex items-center gap-1 font-medium">
                              <span>•</span> {errors.childName}
                            </p>
                          )}
                        </div>

                        {/* 5. Child's Class/Grade */}
                        <div>
                          <label
                            htmlFor="canada-child-grade"
                            className="block text-xs font-medium text-foreground/90 mb-0.5"
                          >
                            Child's class / grade <span className="text-primary">*</span>
                          </label>
                          <div className="relative flex items-center">
                            <GraduationCap className="w-4 h-4 text-foreground/45 pointer-events-none absolute left-3.5" />
                            <select
                              id="canada-child-grade"
                              value={formData.grade}
                              onChange={(e) => handleInputChange('grade', e.target.value)}
                              className={cn(
                                'w-full pl-10 pr-10 h-[38px] rounded-lg border border-[#E5DCD1] bg-white text-foreground text-base sm:text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all shadow-2xs appearance-none cursor-pointer',
                                !formData.grade && 'text-foreground/40',
                                errors.grade && 'border-[#B04C27]/70 bg-primary/5 focus:border-primary'
                              )}
                              required
                            >
                              <option value="" disabled>
                                Select class / grade
                              </option>
                              {GRADES.map((grade) => (
                                <option key={grade} value={grade} className="text-foreground">
                                  {grade}
                                </option>
                              ))}
                            </select>
                            <ChevronDown className="w-4 h-4 text-foreground/45 pointer-events-none absolute right-3.5" />
                          </div>
                          {errors.grade && (
                            <p className="text-[#A84824] text-xs mt-1 flex items-center gap-1 font-medium">
                              <span>•</span> {errors.grade}
                            </p>
                          )}
                        </div>

                        {/* 6. Country (Defaulted to Canada, synced with phone selector) */}
                        <div>
                          <label
                            htmlFor="canada-country"
                            className="block text-xs font-medium text-foreground/90 mb-0.5"
                          >
                            Country <span className="text-primary">*</span>
                          </label>
                          <div className="relative flex items-center">
                            <Globe className="w-4 h-4 text-foreground/45 pointer-events-none absolute left-3.5" />
                            <select
                              id="canada-country"
                              value={selectedCountry.code}
                              onChange={(e) => {
                                const country = getCountryByCode(e.target.value);
                                handleCountryChange(country);
                              }}
                              className="w-full pl-10 pr-10 h-[38px] rounded-lg border border-[#E5DCD1] bg-white text-foreground text-base sm:text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all shadow-2xs appearance-none cursor-pointer"
                              required
                            >
                              {COUNTRIES.map((c) => (
                                <option key={c.code} value={c.code} className="text-foreground">
                                  {c.flag} {c.name} ({c.dialCode})
                                </option>
                              ))}
                            </select>
                            <ChevronDown className="w-4 h-4 text-foreground/45 pointer-events-none absolute right-3.5" />
                          </div>
                        </div>

                        {/* WhatsApp Consent Checkbox */}
                        <div>
                          <label className="flex items-start gap-2.5 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={formData.whatsappConsent}
                              onChange={(e) => handleInputChange('whatsappConsent', e.target.checked)}
                              className="mt-0.5 h-4 w-4 rounded border-border/80 text-primary accent-primary focus:ring-primary/30 cursor-pointer"
                              required
                            />
                            <span className="text-xs text-foreground/80 leading-snug">
                              I agree to receive details about the class on WhatsApp. <span className="text-primary">*</span>
                            </span>
                          </label>
                          {errors.whatsappConsent && (
                            <p className="text-[#A84824] text-xs mt-1 flex items-center gap-1 font-medium">
                              <span>•</span> {errors.whatsappConsent}
                            </p>
                          )}
                        </div>

                        {/* Submission Error Banner */}
                        {submitError && (
                          <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium leading-relaxed">
                            {submitError}
                          </div>
                        )}

                        {/* Terracotta Rounded Submit Button */}
                        <div className="pt-1">
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-2.5 px-6 rounded-full bg-[#B04C27] hover:bg-[#9A4122] active:scale-[0.99] text-white font-serif font-medium text-[15px] xl:text-[17px] whitespace-nowrap shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                          >
                            {isSubmitting ? (
                              <span>Saving your child's place...</span>
                            ) : (
                              <>
                                <span>Save My Child's Place</span>
                                <span className="text-base leading-none">→</span>
                              </>
                            )}
                          </button>

                          {/* Supporting Note */}
                          <p className="text-[11px] text-foreground/75 mt-2 leading-snug">
                            Your details will be used to manage your demo registration and send relevant class information.
                          </p>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ==============================================================================
            6. "WHAT YOUR CHILD WILL EXPERIENCE" (PALE SAGE-GREEN BACKGROUND)
            ============================================================================== */}
        <section className="py-14 sm:py-16 lg:py-20 bg-[#EEF3EC] relative overflow-hidden">
          {/* Organic sage shapes */}
          <div className="absolute -right-24 top-6 w-72 h-96 bg-[#E1EBDE] rounded-[45%_55%_40%_60%] pointer-events-none" />
          <div className="absolute -left-20 -bottom-24 w-64 h-64 bg-[#E6EEE3] rounded-full pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-10 sm:mb-12">
              <div className="lg:col-span-7">
                <h2 className="font-serif text-3xl sm:text-4xl lg:text-[44px] text-[#1E2B3C] font-semibold leading-tight mb-4">
                  What your child will try in the class.
                </h2>
                <p className="text-base sm:text-[17px] text-foreground/80 leading-relaxed max-w-2xl">
                  Vedic Maths introduces structured ways to work with numbers. The demo gives your child an opportunity to see how these methods work and experience them in practice.
                </p>
              </div>
              <VedicTrickDemo className="lg:col-span-5 w-full max-w-md lg:max-w-none" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
              {[
                {
                  Icon: Lightbulb,
                  title: 'Recognise number patterns',
                  body: 'Explore relationships between numbers and discover how patterns can make calculations more intuitive.',
                  tone: 'peach',
                },
                {
                  Icon: Workflow,
                  title: 'Build calculation fluency',
                  body: 'See how structured methods can help children approach calculations more efficiently with practice.',
                  tone: 'sage',
                },
                {
                  Icon: BarChart3,
                  title: 'Learn with understanding',
                  body: 'Explore not just how a method works, but why it works, keeping understanding at the centre of learning.',
                  tone: 'peach',
                },
              ].map(({ Icon, title, body, tone }) => (
                <div key={title} className="flex items-start gap-5">
                  <div className="relative shrink-0">
                    <div
                      className={cn(
                        'w-20 h-20 lg:w-[88px] lg:h-[88px] rounded-full flex items-center justify-center',
                        tone === 'peach' ? 'bg-[#F8DCCB] text-primary' : 'bg-[#D3E2CF] text-[#3F5E3C]'
                      )}
                    >
                      <Icon className="w-9 h-9" strokeWidth={1.7} />
                    </div>
                    <SmallTicks
                      className={cn(
                        'absolute -bottom-3 -left-3',
                        tone === 'peach' ? 'text-primary' : 'text-[#3F5E3C]'
                      )}
                    />
                  </div>
                  <div className="pt-1">
                    <div className="flex items-start gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-[#2F4A2D] leading-snug">{title}</h3>
                      <DoodleRays className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                    </div>
                    <p className="text-[15px] text-foreground/75 leading-relaxed">{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ==============================================================================
            6b. PARENT TESTIMONIALS (WHITE, COMPACT 3-UP ROW)
            ============================================================================== */}
        <section className="py-10 sm:py-12 lg:py-14 bg-white relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-serif text-2xl sm:text-3xl text-[#1E2B3C] font-semibold leading-tight mb-6 sm:mb-8">
              What parents say
            </h2>

            {/* Swipeable row on phones, 3-up grid from md */}
            <div className="flex md:grid md:grid-cols-3 gap-4 lg:gap-5 overflow-x-auto md:overflow-visible snap-x snap-mandatory scroll-pl-4 sm:scroll-pl-6 md:scroll-pl-0 -mx-4 px-4 sm:-mx-6 sm:px-6 md:mx-0 md:px-0 pb-2 md:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {CANADA_DEMO_TESTIMONIALS.map((t, i) => (
                <figure
                  key={t.name}
                  className={cn(
                    'rounded-2xl p-5 sm:p-6 flex flex-col justify-between shrink-0 w-[82%] sm:w-[60%] md:w-auto snap-start',
                    i === 0 ? 'bg-[#FBECE3]' : 'bg-[#FAF6F0] border border-[#EFE8DE]'
                  )}
                >
                  <blockquote className="text-[15px] text-foreground/85 leading-relaxed">
                    {t.quote}
                  </blockquote>
                  <figcaption className="mt-3 text-[13px]">
                    <span className="font-semibold text-foreground">{t.name}</span>
                    <span className="text-foreground/75">, {t.relation}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* ==============================================================================
            7. "MEET THE TEACHER" (WARM CREAM BACKGROUND, IMAGE BLEEDS RIGHT)
            ============================================================================== */}
        <section className="bg-[#FAF6F0] relative overflow-hidden">
          <div className="grid lg:grid-cols-2 items-center">
            {/* Copy & CTA */}
            <div className="px-4 sm:px-6 lg:px-8 py-14 sm:py-16 lg:py-20 lg:pl-[max(2rem,calc((100vw-80rem)/2+2rem))]">
              <div className="max-w-xl">
                <div className="flex items-start gap-3 mb-5">
                  <h2 className="font-serif text-3xl sm:text-4xl lg:text-[44px] text-[#1E2B3C] font-semibold leading-tight">
                    Learn with Meenakshi Koul
                  </h2>
                  <DoodleRays className="w-6 h-6 mt-1 shrink-0 text-primary" />
                </div>
                <div className="space-y-3 text-base sm:text-[17px] text-foreground/80 leading-relaxed mb-7">
                  <p>
                    Meenakshi Koul leads The Vedic School's teaching approach, helping children develop a stronger relationship with numbers through structured methods and clear explanations.
                  </p>
                  <p>
                    Her approach brings together mathematical understanding, calculation fluency and confidence, giving children space to explore, practise and learn.
                  </p>
                  <p>
                    In this live demo, your child can experience the approach firsthand.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    trackCtaClick('reserve_spot', 'canada_demo_teacher', 'vedic_maths', CAMPAIGN_ID);
                    scrollToRegistration();
                  }}
                  className="inline-flex items-center gap-1.5 px-8 py-3.5 rounded-full bg-[#B04C27] hover:bg-[#9A4122] active:scale-[0.98] text-white font-serif font-medium text-base sm:text-lg shadow-sm hover:shadow-md transition-all cursor-pointer whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  <span>Save My Child's Place</span>
                  <span className="font-sans leading-none text-base">→</span>
                </button>
              </div>
            </div>

            {/* Image in an organic blob, bleeding to the right edge */}
            <div className="relative h-[320px] sm:h-[420px] lg:h-full lg:min-h-[520px] ml-4 sm:ml-10 lg:ml-0">
              <div className="absolute inset-y-4 -right-10 left-6 bg-[#DCE6D8] rounded-l-[48%_56%]" />
              <div className="absolute inset-y-10 left-0 right-0 overflow-hidden rounded-l-[46%_52%] rounded-tr-none shadow-lg">
                <img
                  src={meenakshiPhoto}
                  alt="Meenakshi Koul teaching mathematics at The Vedic School"
                  className="w-full h-full object-cover object-[35%_center]"
                  width={1024}
                  height={682}
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <DoodleRays className="absolute top-6 left-4 w-7 h-7 text-primary" />
            </div>
          </div>
        </section>

        {/* ==============================================================================
            8. "FREQUENTLY ASKED QUESTIONS" (2-COLUMN DESKTOP)
            ============================================================================== */}
        <section className="pt-14 pb-28 sm:pt-16 sm:pb-40 lg:py-24 bg-white relative overflow-hidden">
          {/* Corner organic shapes & leaf sprig */}
          <div className="absolute -bottom-24 -left-16 w-72 h-72 bg-[#F4D8C6] rounded-full pointer-events-none" />
          <div className="absolute top-8 -left-20 w-48 h-56 bg-[#DCE6D8]/80 rounded-[50%] pointer-events-none" />
          <div className="absolute -bottom-2 right-2 sm:right-6 lg:right-8 pointer-events-none">
            <LeafSprig className="w-16 sm:w-24 lg:w-28 h-auto" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start max-w-6xl mx-auto lg:pr-36 xl:pr-40">
              <div className="lg:col-span-5">
                <h2 className="font-serif text-3xl sm:text-4xl lg:text-[46px] text-[#1E2B3C] font-semibold leading-[1.1]">
                  Quick answers for parents
                </h2>
              </div>

              {/* Right Column: Clean Pill Accordion Items */}
              <div className="lg:col-span-7 w-full">
                <Accordion type="single" collapsible className="space-y-3 w-full">
                  {CANADA_DEMO_FAQS.map((item, i) => (
                    <AccordionItem
                      key={i}
                      value={`item-${i}`}
                      className="bg-white rounded-lg border border-[#E6DDCF] px-5 sm:px-6 shadow-[0_1px_2px_rgba(30,43,60,0.04)] transition-colors overflow-hidden border-b-0"
                    >
                      <AccordionPrimitive.Header className="flex">
                        <AccordionPrimitive.Trigger className="w-full flex items-center justify-between py-4 font-serif text-base sm:text-[17px] text-[#1E2B3C] text-left cursor-pointer group focus-visible:outline-none">
                          <span className="font-medium pr-4">{item.question}</span>
                          <span className="w-7 h-7 flex items-center justify-center shrink-0 text-[#1E2B3C] transition-transform duration-200 group-data-[state=open]:rotate-45">
                            <Plus className="w-4 h-4 stroke-[2.2]" />
                          </span>
                        </AccordionPrimitive.Trigger>
                      </AccordionPrimitive.Header>
                      <AccordionContent forceMount className="text-foreground/75 leading-relaxed text-sm sm:text-base pb-4 sm:pb-5 pt-1">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>

            </div>
          </div>
        </section>

        {/* ==============================================================================
            9. CLOSING CTA BAND
            ============================================================================== */}
        <section className="bg-[#B04C27] relative overflow-hidden">
          <div className="absolute -right-16 -top-20 w-64 h-64 rounded-full bg-white/[0.06] pointer-events-none" />
          <div className="absolute -left-10 -bottom-24 w-56 h-56 rounded-full bg-white/[0.05] pointer-events-none" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-14 flex flex-col md:flex-row md:items-center md:justify-between gap-6 md:gap-10">
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-white font-semibold leading-tight mb-2">
                Join the free Vedic Maths class
              </h2>
              <p className="text-white/90 text-[15px] sm:text-base">
                Sunday, October 25 at 8:30 PM ET. Free, live and online.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                trackCtaClick('reserve_spot', 'canada_demo_closing_band', 'vedic_maths', CAMPAIGN_ID);
                scrollToRegistration();
              }}
              className="shrink-0 inline-flex items-center justify-center gap-1.5 px-8 py-3.5 rounded-full bg-[#FAF6F0] hover:bg-white active:scale-[0.98] text-[#A84824] font-serif font-semibold text-base sm:text-lg shadow-sm transition-all cursor-pointer whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#B04C27]"
            >
              <span>Save My Child's Place</span>
              <span className="font-sans leading-none text-base">→</span>
            </button>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <Footer compact />
    </div>
  );
}
