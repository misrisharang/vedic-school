import React, { useState } from 'react';
import { User, Mail, GraduationCap, HelpCircle, MessageSquare, CheckCircle2, MapPin, ChevronDown, ArrowRight } from 'lucide-react';
import { FadeIn } from '@/components/ui-patterns';
import { Button } from '@/components/Button';
import { useDemoModal } from '@/context/DemoModalContext';
import { WhatsAppPhoneInput } from '@/components/WhatsAppPhoneInput';
import {
  Country,
  DEFAULT_COUNTRY,
  validatePhoneNumber,
  normalizeWhatsAppNumber,
} from '@/data/countries';
import { submitInquiry } from '@/lib/supabase';
import { CustomSelect } from '@/components/CustomSelect';
import heroTexture from '@assets/generated_images/hero-texture-math.png';
import { cn } from '@/lib/utils';
import { Seo } from '@/seo/Seo';
import { getContactSchema } from '@/seo/schema';

const INQUIRY_TYPES = [
  'Vedic Maths',
  'Curriculum-Aligned Maths',
  'Personal Assessment',
  'General enquiry',
  'Something else',
];

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
  'Grade 11',
  'Grade 12',
];

interface FormData {
  name: string;
  email: string;
  whatsappNumber: string;
  grade: string;
  inquiryType: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  whatsappNumber?: string;
  inquiryType?: string;
  message?: string;
}

export default function Contact() {
  const { openDemoModal, openAssessmentModal } = useDemoModal();

  const [selectedCountry, setSelectedCountry] = useState<Country>(DEFAULT_COUNTRY);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    whatsappNumber: '',
    grade: '',
    inquiryType: '',
    message: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    if (submitError) {
      setSubmitError(null);
    }
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Please enter your name.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    // WhatsApp is optional, but if entered, validate it properly
    if (formData.whatsappNumber.trim()) {
      const phoneValidation = validatePhoneNumber(formData.whatsappNumber, selectedCountry.code);
      if (!phoneValidation.isValid) {
        newErrors.whatsappNumber = phoneValidation.error || 'Please enter a valid phone number.';
      }
    }

    if (!formData.inquiryType) {
      newErrors.inquiryType = 'Please select an option.';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Please enter your message.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;
    setSubmitError(null);

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    const hasWhatsApp = Boolean(formData.whatsappNumber.trim());
    const normalizedWhatsApp = hasWhatsApp
      ? normalizeWhatsAppNumber(formData.whatsappNumber, selectedCountry.dialCode)
      : null;

    const result = await submitInquiry({
      name: formData.name.trim(),
      email: formData.email.trim(),
      whatsapp: normalizedWhatsApp,
      whatsapp_country: hasWhatsApp ? selectedCountry.name : null,
      whatsapp_country_code: hasWhatsApp ? selectedCountry.dialCode : null,
      grade: formData.grade || null,
      inquiry_type: formData.inquiryType,
      message: formData.message.trim(),
    });

    setIsSubmitting(false);

    if (result.success) {
      setIsSubmitted(true);
    } else {
      setSubmitError(result.error || 'Failed to send inquiry. Please try again.');
    }
  };

  const handleResetForm = () => {
    setIsSubmitted(false);
    setSelectedCountry(DEFAULT_COUNTRY);
    setFormData({
      name: '',
      email: '',
      whatsappNumber: '',
      grade: '',
      inquiryType: '',
      message: '',
    });
    setErrors({});
    setSubmitError(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Seo
        title="Contact The Vedic School"
        description="Get in touch with Meenakshi Koul at The Vedic School in Gurugram or online for Vedic Maths and curriculum-aligned classes."
        path="/contact"
        schema={getContactSchema()}
      />
      {/* 1. HERO SECTION */}
      <section className="relative pt-32 pb-12 lg:pt-40 lg:pb-16 border-b border-border/30 overflow-hidden">
        <div
          className="absolute inset-0 z-0 opacity-20 pointer-events-none"
          style={{ backgroundImage: `url(${heroTexture})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        />
        <div className="container mx-auto px-4 md:px-6 max-w-3xl text-center relative z-10">
          <FadeIn>
            <span className="sage-eyebrow mb-3">CONTACT THE VEDIC SCHOOL</span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-serif mb-4 text-foreground leading-[1.2] tracking-tight">
              Let's talk about your child's Maths.
            </h1>
            <p className="text-base sm:text-lg text-foreground/80 leading-relaxed max-w-2xl mx-auto">
              Have a question about our programmes, your child's learning needs, or where to begin? Send us a message and we'll get back to you.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* 2. MAIN TWO-COLUMN SECTION: INQUIRY FORM (LEFT ~55%) + LOCATION & MAP (RIGHT ~45%) */}
      <section className="py-12 sm:py-16 md:py-20 bg-[#FAF6F0] relative">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
          <FadeIn>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-12 items-stretch">
              
              {/* LEFT COLUMN: INQUIRY FORM (~55% split) */}
              <div className="lg:col-span-7 flex flex-col">
                <div className="bg-white/90 backdrop-blur-xs border border-[#E8DFCFA0] shadow-[0_12px_40px_-10px_rgba(59,66,76,0.08)] rounded-[2rem] p-6 sm:p-7 md:p-8 flex flex-col justify-between h-full">
                  {isSubmitted ? (
                    /* Success State */
                    <div className="text-center py-10 sm:py-14 my-auto animate-in fade-in zoom-in-95 duration-300">
                      <div className="w-16 h-16 rounded-full bg-secondary/15 text-secondary flex items-center justify-center mx-auto mb-5 shadow-xs">
                        <CheckCircle2 className="w-9 h-9" strokeWidth={2.2} />
                      </div>

                      <h2 className="font-serif text-2xl sm:text-3xl text-foreground font-medium mb-3">
                        Inquiry Sent!
                      </h2>

                      <div className="bg-[#FAF6F0] border border-[#E6DDCF] rounded-2xl p-5 mb-8 text-foreground/80 leading-relaxed text-[15px] sm:text-base space-y-2 max-w-md mx-auto">
                        <p className="font-medium text-foreground">
                          Thank you for reaching out to The Vedic School.
                        </p>
                        <p className="text-foreground/75 text-sm">
                          We have received your message and will review it thoughtfully. You will hear back from us soon.
                        </p>
                      </div>

                      <Button onClick={handleResetForm} variant="outline" className="px-8 py-3 rounded-xl bg-white shadow-xs">
                        Send another message
                      </Button>
                    </div>
                  ) : (
                    /* Compact Inquiry Form */
                    <div>
                      <div className="mb-6">
                        <h2 className="font-serif text-2xl sm:text-3xl lg:text-[32px] text-foreground font-normal leading-tight mb-2">
                          Tell us a little about what you need
                        </h2>
                        <p className="text-[15px] text-foreground/70 leading-relaxed">
                          Fill out the details below and we will get back to you personally.
                        </p>
                      </div>

                      <form onSubmit={handleSubmit} noValidate className="space-y-3.5 sm:space-y-4">
                        {/* Name * */}
                        <div>
                          <label htmlFor="inquiry-name" className="block text-[14px] font-medium text-foreground/90 mb-1.5">
                            Name <span className="text-primary">*</span>
                          </label>
                          <div className="relative flex items-center">
                            <User className="w-4 h-4 text-foreground/45 pointer-events-none absolute left-3.5" />
                            <input
                              id="inquiry-name"
                              type="text"
                              value={formData.name}
                              onChange={(e) => handleInputChange('name', e.target.value)}
                              placeholder="Enter your name"
                              className={cn(
                                'w-full h-[52px] pl-10 pr-4 rounded-xl bg-white border border-[#E5DCD1] text-foreground placeholder:text-foreground/40 text-[15px] sm:text-base focus:outline-none focus:border-primary/70 focus:ring-2 focus:ring-primary/15 transition-all shadow-2xs',
                                errors.name && 'border-primary/60 bg-primary/5 focus:border-primary'
                              )}
                              required
                            />
                          </div>
                          {errors.name && (
                            <p className="text-primary text-xs mt-1.5 flex items-center gap-1 font-medium">
                              <span>•</span> {errors.name}
                            </p>
                          )}
                        </div>

                        {/* Email * */}
                        <div>
                          <label htmlFor="inquiry-email" className="block text-[14px] font-medium text-foreground/90 mb-1.5">
                            Email <span className="text-primary">*</span>
                          </label>
                          <div className="relative flex items-center">
                            <Mail className="w-4 h-4 text-foreground/45 pointer-events-none absolute left-3.5" />
                            <input
                              id="inquiry-email"
                              type="email"
                              value={formData.email}
                              onChange={(e) => handleInputChange('email', e.target.value)}
                              placeholder="Enter your email address"
                              className={cn(
                                'w-full h-[52px] pl-10 pr-4 rounded-xl bg-white border border-[#E5DCD1] text-foreground placeholder:text-foreground/40 text-[15px] sm:text-base focus:outline-none focus:border-primary/70 focus:ring-2 focus:ring-primary/15 transition-all shadow-2xs',
                                errors.email && 'border-primary/60 bg-primary/5 focus:border-primary'
                              )}
                              required
                            />
                          </div>
                          {errors.email && (
                            <p className="text-primary text-xs mt-1.5 flex items-center gap-1 font-medium">
                              <span>•</span> {errors.email}
                            </p>
                          )}
                        </div>

                        {/* WhatsApp number — optional */}
                        <div>
                          <label htmlFor="inquiry-whatsapp" className="block text-[14px] font-medium text-foreground/90 mb-1.5">
                            WhatsApp number <span className="text-foreground/50 text-xs font-normal">(optional)</span>
                          </label>
                          <WhatsAppPhoneInput
                            id="inquiry-whatsapp"
                            country={selectedCountry}
                            onCountryChange={(c) => {
                              setSelectedCountry(c);
                              if (errors.whatsappNumber) {
                                setErrors((prev) => ({ ...prev, whatsappNumber: undefined }));
                              }
                            }}
                            phoneNumber={formData.whatsappNumber}
                            onPhoneNumberChange={(val) => handleInputChange('whatsappNumber', val)}
                            error={errors.whatsappNumber}
                            themeColor="terracotta"
                            disabled={isSubmitting}
                            required={false}
                          />
                        </div>

                        {/* Child's Grade & Inquiry Type (2 columns on sm+ viewports for compact balance) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                          {/* Child's Grade */}
                          <div>
                            <label htmlFor="inquiry-grade" className="block text-[14px] font-medium text-foreground/90 mb-1.5">
                              Child's Grade <span className="text-foreground/50 text-xs font-normal">(optional)</span>
                            </label>
                            <CustomSelect
                              id="inquiry-grade"
                              value={formData.grade}
                              onChange={(val) => handleInputChange('grade', val)}
                              options={GRADES}
                              placeholder="Select grade (optional)"
                              icon={<GraduationCap className="w-4 h-4" />}
                              clearable
                              clearLabel="Select grade (optional)"
                              disabled={isSubmitting}
                            />
                          </div>

                          {/* What can we help you with? * */}
                          <div>
                            <label htmlFor="inquiry-type" className="block text-[14px] font-medium text-foreground/90 mb-1.5">
                              What can we help you with? <span className="text-primary">*</span>
                            </label>
                            <CustomSelect
                              id="inquiry-type"
                              value={formData.inquiryType}
                              onChange={(val) => handleInputChange('inquiryType', val)}
                              options={INQUIRY_TYPES}
                              placeholder="Select an option"
                              icon={<HelpCircle className="w-4 h-4" />}
                              hasError={Boolean(errors.inquiryType)}
                              disabled={isSubmitting}
                            />
                            {errors.inquiryType && (
                              <p className="text-primary text-xs mt-1.5 flex items-center gap-1 font-medium">
                                <span>•</span> {errors.inquiryType}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Your message * (110–130px height target) */}
                        <div>
                          <label htmlFor="inquiry-message" className="block text-[14px] font-medium text-foreground/90 mb-1.5">
                            Your message <span className="text-primary">*</span>
                          </label>
                          <div className="relative flex items-start">
                            <MessageSquare className="w-4 h-4 text-foreground/45 pointer-events-none absolute left-3.5 top-3.5" />
                            <textarea
                              id="inquiry-message"
                              value={formData.message}
                              onChange={(e) => handleInputChange('message', e.target.value)}
                              placeholder="Tell us a little about your child's current relationship with Maths, any specific areas of struggle, or any questions you have."
                              className={cn(
                                'w-full h-[115px] sm:h-[120px] pl-10 pr-4 py-3 rounded-xl bg-white border border-[#E5DCD1] text-foreground placeholder:text-foreground/40 text-[15px] sm:text-base focus:outline-none focus:border-primary/70 focus:ring-2 focus:ring-primary/15 transition-all shadow-2xs resize-none leading-relaxed',
                                errors.message && 'border-primary/60 bg-primary/5 focus:border-primary'
                              )}
                              required
                            />
                          </div>
                          {errors.message && (
                            <p className="text-primary text-xs mt-1.5 flex items-center gap-1 font-medium">
                              <span>•</span> {errors.message}
                            </p>
                          )}
                        </div>

                        {/* Submit Error Banner */}
                        {submitError && (
                          <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs sm:text-sm font-medium leading-relaxed">
                            {submitError}
                          </div>
                        )}

                        {/* Submit Button (52px height) */}
                        <div className="pt-1">
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full h-[52px] px-6 rounded-xl bg-primary hover:bg-[#A84824] active:scale-[0.99] text-white font-medium text-[15px] sm:text-[16px] shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                          >
                            {isSubmitting ? (
                              <span>Sending inquiry...</span>
                            ) : (
                              <>
                                <span>Send inquiry</span>
                                <ArrowRight className="w-4 h-4" />
                              </>
                            )}
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT COLUMN: LOCATION & MAP (~45% split) */}
              <div className="lg:col-span-5 flex flex-col">
                <div className="bg-white/90 backdrop-blur-xs border border-[#E8DFCFA0] shadow-[0_12px_40px_-10px_rgba(59,66,76,0.08)] rounded-[2rem] p-6 sm:p-7 md:p-8 flex flex-col justify-between h-full">
                  <div>
                    {/* Eyebrow & Heading */}
                    <span className="sage-eyebrow mb-2 block">LOCATION</span>
                    <h2 className="font-serif text-2xl sm:text-3xl lg:text-[32px] text-foreground font-normal leading-tight mb-4">
                      Find The Vedic School
                    </h2>

                    {/* Location Information Card */}
                    <div className="bg-[#FAF6F0] border border-[#E6DDCF] rounded-2xl p-4 sm:p-5 mb-5">
                      <span className="text-xs uppercase tracking-wider font-semibold text-foreground/55 block mb-1.5">
                        The Vedic School is based at:
                      </span>
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="w-5 h-5 text-primary shrink-0" />
                        <h3 className="font-serif text-xl sm:text-2xl text-foreground font-medium">
                          Emerald Estate, Gurugram
                        </h3>
                      </div>
                      <p className="text-[14px] sm:text-[15px] text-foreground/75 leading-relaxed">
                        Based in Gurugram, teaching children wherever they are.
                      </p>
                    </div>
                  </div>

                  {/* Interactive Map */}
                  <div className="w-full flex-1 min-h-[300px] sm:min-h-[340px] lg:min-h-[360px] rounded-2xl overflow-hidden border border-border/60 shadow-xs relative bg-[#FAF6F0]">
                    <iframe
                      title="The Vedic School Location Map - Emerald Estate, Gurugram"
                      src="https://maps.google.com/maps?q=Emerald+Estate,+Gurugram&t=&z=15&ie=UTF8&iwloc=&output=embed"
                      width="100%"
                      height="100%"
                      className="w-full h-full min-h-[300px] sm:min-h-[340px] lg:min-h-[360px] border-0"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      aria-label="Map showing Emerald Estate, Gurugram"
                    />
                  </div>
                </div>
              </div>

            </div>
          </FadeIn>
        </div>
      </section>

      {/* 3. BOTTOM CTA SECTION */}
      <section className="py-16 md:py-20 bg-[#F0EBE1] border-t border-border/30">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl text-center">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-4">
              Not sure where to start?
            </h2>
            <p className="text-base md:text-lg text-foreground/75 leading-relaxed mb-8 max-w-xl mx-auto">
              If you're wondering whether your child would benefit more from Vedic Maths or curriculum-aligned support, we can help you find the right starting point.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" onClick={openDemoModal} className="w-full sm:w-auto">
                Join Sunday's free demo →
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={openAssessmentModal}
                className="w-full sm:w-auto bg-white/80 hover:bg-white"
              >
                Book a personal assessment →
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
