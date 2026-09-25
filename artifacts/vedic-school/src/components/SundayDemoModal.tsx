import React, { useState } from 'react';
import { User, Phone, GraduationCap, Mail, CheckCircle2, ChevronDown } from 'lucide-react';
import { useDemoModal } from '@/context/DemoModalContext';
import { cn } from '@/lib/utils';
import { Button } from './Button';
import { RegistrationModalBase, TrustIndicator } from './modals/RegistrationModalBase';
import { submitRegistration } from '@/lib/supabase';
import { trackLeadSubmission } from '@/lib/analytics';
import { WhatsAppPhoneInput } from './WhatsAppPhoneInput';
import {
  Country,
  DEFAULT_COUNTRY,
  validatePhoneNumber,
  normalizeWhatsAppNumber,
} from '@/data/countries';

interface FormData {
  parentName: string;
  childName: string;
  whatsappNumber: string;
  grade: string;
  email: string;
  whatsappConsent: boolean;
}

interface FormErrors {
  parentName?: string;
  childName?: string;
  whatsappNumber?: string;
  grade?: string;
  email?: string;
  whatsappConsent?: string;
}

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

export function SundayDemoModal() {
  const { isDemoOpen, closeDemoModal } = useDemoModal();

  const [selectedCountry, setSelectedCountry] = useState<Country>(DEFAULT_COUNTRY);
  const [formData, setFormData] = useState<FormData>({
    parentName: '',
    childName: '',
    whatsappNumber: '',
    grade: '',
    email: '',
    whatsappConsent: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when modal closes
  const handleClose = () => {
    closeDemoModal();
    setTimeout(() => {
      setSubmitError(null);
      if (isSubmitted) {
        setIsSubmitted(false);
        setSelectedCountry(DEFAULT_COUNTRY);
        setFormData({
          parentName: '',
          childName: '',
          whatsappNumber: '',
          grade: '',
          email: '',
          whatsappConsent: false,
        });
        setErrors({});
      }
    }, 300);
  };

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
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

    if (!formData.parentName.trim()) {
      newErrors.parentName = 'Please enter your name.';
    }

    if (!formData.childName.trim()) {
      newErrors.childName = "Please enter your child's name.";
    }

    const phoneValidation = validatePhoneNumber(formData.whatsappNumber, selectedCountry.code);
    if (!phoneValidation.isValid) {
      newErrors.whatsappNumber = phoneValidation.error || 'Please enter a valid WhatsApp number.';
    }

    if (!formData.grade) {
      newErrors.grade = "Please select your child's grade.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
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
    });

    setIsSubmitting(false);

    if (result.success) {
      setIsSubmitted(true);
      trackLeadSubmission('sunday_demo_modal', 'vedic_maths');
    } else {
      setSubmitError(result.error || 'Failed to reserve spot. Please try again.');
    }
  };

  const successContent = (
    <div className="text-center py-4 sm:py-6 animate-in fade-in zoom-in-95 duration-300">
      <div className="w-16 h-16 rounded-full bg-secondary/15 text-secondary flex items-center justify-center mx-auto mb-5 shadow-xs">
        <CheckCircle2 className="w-9 h-9" strokeWidth={2.2} />
      </div>

      <h3 className="font-serif text-2xl sm:text-3xl text-foreground font-medium mb-4">
        Spot Reserved!
      </h3>

      <div className="bg-white/75 border border-[#E6DDCF] rounded-2xl p-5 mb-6 text-foreground/80 leading-relaxed text-sm sm:text-base space-y-3 shadow-2xs text-left sm:text-center">
        <p className="font-medium text-foreground">
          Thank you for registering with The Vedic School.
        </p>
        <p className="text-foreground/75 text-sm">
          You'll soon receive the confirmation, and the class link to your WhatsApp before the session.
        </p>
      </div>

      <Button onClick={handleClose} className="w-full sm:w-auto px-8 py-3 rounded-xl shadow-xs">
        Done
      </Button>
    </div>
  );

  return (
    <RegistrationModalBase
      isOpen={isDemoOpen}
      onClose={handleClose}
      isSubmitted={isSubmitted}
      successContent={successContent}
      title={
        <h2 className="font-serif text-2xl sm:text-[28px] md:text-3xl text-foreground font-normal leading-[1.2] tracking-tight mb-2 text-center">
          Join Sunday’s Free Vedic Maths Demo
        </h2>
      }
      subtitle="Experience the method and see how Maths can feel more natural, clear and confident."
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-3.5 sm:space-y-4 pt-1 sm:pt-2">
        {/* Parent Name */}
        <div>
          <label htmlFor="demo-parent-name" className="block text-xs sm:text-sm font-medium text-foreground/90 mb-1.5">
            Parent name <span className="text-primary">*</span>
          </label>
          <div className="relative flex items-center">
            <User className="w-4 h-4 text-foreground/45 pointer-events-none absolute left-3.5" />
            <input
              id="demo-parent-name"
              type="text"
              value={formData.parentName}
              onChange={(e) => handleInputChange('parentName', e.target.value)}
              placeholder="Enter your name"
              className={cn(
                'w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl bg-white/70 border border-[#E5DCD1] text-foreground placeholder:text-foreground/40 text-sm sm:text-base focus:bg-white focus:outline-none focus:border-primary/70 focus:ring-2 focus:ring-primary/15 transition-all shadow-2xs',
                errors.parentName && 'border-primary/60 bg-primary/5 focus:border-primary'
              )}
              required
            />
          </div>
          {errors.parentName && (
            <p className="text-primary text-xs mt-1.5 flex items-center gap-1 font-medium">
              <span>•</span> {errors.parentName}
            </p>
          )}
        </div>

        {/* Child Name */}
        <div>
          <label htmlFor="demo-child-name" className="block text-xs sm:text-sm font-medium text-foreground/90 mb-1.5">
            Child name <span className="text-primary">*</span>
          </label>
          <div className="relative flex items-center">
            <User className="w-4 h-4 text-foreground/45 pointer-events-none absolute left-3.5" />
            <input
              id="demo-child-name"
              type="text"
              value={formData.childName}
              onChange={(e) => handleInputChange('childName', e.target.value)}
              placeholder="Enter your child's name"
              className={cn(
                'w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl bg-white/70 border border-[#E5DCD1] text-foreground placeholder:text-foreground/40 text-sm sm:text-base focus:bg-white focus:outline-none focus:border-primary/70 focus:ring-2 focus:ring-primary/15 transition-all shadow-2xs',
                errors.childName && 'border-primary/60 bg-primary/5 focus:border-primary'
              )}
              required
            />
          </div>
          {errors.childName && (
            <p className="text-primary text-xs mt-1.5 flex items-center gap-1 font-medium">
              <span>•</span> {errors.childName}
            </p>
          )}
        </div>

        {/* WhatsApp Number with International Country Selector */}
        <div>
          <label htmlFor="demo-whatsapp-number" className="block text-xs sm:text-sm font-medium text-foreground/90 mb-1.5">
            WhatsApp number <span className="text-primary">*</span>
          </label>
          <WhatsAppPhoneInput
            id="demo-whatsapp-number"
            country={selectedCountry}
            onCountryChange={(newCountry) => {
              setSelectedCountry(newCountry);
              if (errors.whatsappNumber) {
                setErrors((prev) => ({ ...prev, whatsappNumber: undefined }));
              }
            }}
            phoneNumber={formData.whatsappNumber}
            onPhoneNumberChange={(val) => handleInputChange('whatsappNumber', val)}
            error={errors.whatsappNumber}
            themeColor="terracotta"
            disabled={isSubmitting}
          />
        </div>

        {/* Child's Grade (Grades 1-10 only) */}
        <div>
          <label htmlFor="demo-child-grade" className="block text-xs sm:text-sm font-medium text-foreground/90 mb-1.5">
            Child's grade <span className="text-primary">*</span>
          </label>
          <div className="relative flex items-center">
            <GraduationCap className="w-4 h-4 text-foreground/45 pointer-events-none absolute left-3.5" />
            <select
              id="demo-child-grade"
              value={formData.grade}
              onChange={(e) => handleInputChange('grade', e.target.value)}
              className={cn(
                'w-full pl-10 pr-10 py-2.5 sm:py-3 rounded-xl bg-white/70 border border-[#E5DCD1] text-foreground text-sm sm:text-base focus:bg-white focus:outline-none focus:border-primary/70 focus:ring-2 focus:ring-primary/15 transition-all shadow-2xs appearance-none cursor-pointer',
                !formData.grade && 'text-foreground/40',
                errors.grade && 'border-primary/60 bg-primary/5 focus:border-primary'
              )}
              required
            >
              <option value="" disabled>
                Select grade
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
            <p className="text-primary text-xs mt-1.5 flex items-center gap-1 font-medium">
              <span>•</span> {errors.grade}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="demo-email" className="block text-xs sm:text-sm font-medium text-foreground/90 mb-1.5">
            Email <span className="text-primary">*</span>
          </label>
          <div className="relative flex items-center">
            <Mail className="w-4 h-4 text-foreground/45 pointer-events-none absolute left-3.5" />
            <input
              id="demo-email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="Enter your email address"
              className={cn(
                'w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl bg-white/70 border border-[#E5DCD1] text-foreground placeholder:text-foreground/40 text-sm sm:text-base focus:bg-white focus:outline-none focus:border-primary/70 focus:ring-2 focus:ring-primary/15 transition-all shadow-2xs',
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

        {/* WhatsApp Consent Checkbox */}
        <div className="pt-1">
          <label className="flex items-start gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={formData.whatsappConsent}
              onChange={(e) => handleInputChange('whatsappConsent', e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-border/80 text-primary accent-primary focus:ring-primary/30 cursor-pointer"
              required
            />
            <span className="text-xs sm:text-sm text-foreground/80 leading-snug">
              I agree to receive details about the class on WhatsApp. <span className="text-primary">*</span>
            </span>
          </label>
          {errors.whatsappConsent && (
            <p className="text-primary text-xs mt-1.5 flex items-center gap-1 font-medium">
              <span>•</span> {errors.whatsappConsent}
            </p>
          )}
        </div>

        {/* Submission Error Banner */}
        {submitError && (
          <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs sm:text-sm font-medium leading-relaxed">
            {submitError}
          </div>
        )}

        {/* CTA Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 sm:py-3.5 px-6 rounded-xl bg-primary hover:bg-[#A84824] active:scale-[0.99] text-white font-medium text-base shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
          >
            {isSubmitting ? (
              <span>Reserving...</span>
            ) : (
              <>
                <span>Reserve my spot</span>
                <span className="text-lg leading-none">→</span>
              </>
            )}
          </button>

          {/* Trust Indicator */}
          <TrustIndicator />
        </div>
      </form>
    </RegistrationModalBase>
  );
}
