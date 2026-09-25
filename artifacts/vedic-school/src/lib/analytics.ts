/**
 * GA4 Analytics Utility — The Vedic School
 * Measurement ID: G-DHQSJ2N5WB
 *
 * Lightweight type-safe helper functions for conversion and CTA event tracking.
 * Strictly enforces zero PII: no names, emails, phone numbers, or free-text messages.
 */

export type CtaName =
  | 'book_free_demo'
  | 'book_personal_assessment'
  | 'explore_vedic_maths'
  | 'explore_curriculum_classes'
  | 'contact_us';

export type CtaLocation =
  | 'header'
  | 'hero'
  | 'two_ways_section'
  | 'contact_section'
  | 'contact_quick_link'
  | 'blog_body';

export type OfferingType = 'vedic_maths' | 'curriculum_aligned' | 'general';

export type FormId = 'contact_form' | 'sunday_demo_modal' | 'personal_assessment_modal';

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

/**
 * Tracks a high-intent CTA button click in GA4.
 */
export function trackCtaClick(
  name: CtaName,
  location: CtaLocation,
  offering: OfferingType
): void {
  if (typeof window === 'undefined') return;

  const params: Record<string, any> = {
    cta_name: name,
    cta_location: location,
    offering_type: offering,
  };

  // Enable debug_mode in development or when ?debug_mode=true is in URL for GA4 DebugView testing
  if (import.meta.env.DEV || window.location.search.includes('debug_mode=true')) {
    params.debug_mode = true;
  }

  if (typeof window.gtag === 'function') {
    window.gtag('event', 'cta_click', params);
  } else {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(['event', 'cta_click', params]);
  }
}

/**
 * Tracks a verified student lead in GA4.
 * CRITICAL: This must fire ONLY after Supabase successfully confirms database persistence.
 * Never passes PII (names, emails, phones, free-text) to GA4.
 */
export function trackLeadSubmission(
  formId: FormId,
  offering: OfferingType,
  inquiryType?: string
): void {
  if (typeof window === 'undefined') return;

  const params: Record<string, any> = {
    form_id: formId,
    offering_type: offering,
  };

  if (inquiryType) {
    params.inquiry_type = inquiryType;
  }

  // Enable debug_mode in development or when ?debug_mode=true is in URL for GA4 DebugView testing
  if (import.meta.env.DEV || window.location.search.includes('debug_mode=true')) {
    params.debug_mode = true;
  }

  if (typeof window.gtag === 'function') {
    window.gtag('event', 'generate_lead', params);
  } else {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(['event', 'generate_lead', params]);
  }
}
