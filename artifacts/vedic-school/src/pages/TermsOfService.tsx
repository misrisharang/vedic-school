import React from 'react';
import { Link } from 'wouter';
import { FadeIn } from '@/components/ui-patterns';
import heroTexture from '@assets/generated_images/hero-texture-math.png';

export default function TermsOfService() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Hero Header */}
      <section className="relative pt-32 pb-12 lg:pt-40 lg:pb-16 border-b border-border/30 overflow-hidden">
        <div
          className="absolute inset-0 z-0 opacity-20 pointer-events-none"
          style={{ backgroundImage: `url(${heroTexture})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        />
        <div className="container mx-auto px-4 md:px-6 max-w-3xl text-center relative z-10">
          <FadeIn>
            <span className="sage-eyebrow mb-3">THE VEDIC SCHOOL</span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif mb-4 text-foreground leading-[1.2] tracking-tight">
              Terms of Service
            </h1>
            <p className="text-sm sm:text-base text-foreground/70 leading-relaxed max-w-2xl mx-auto">
              Last updated: September 11, 2026
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-12 sm:py-16 md:py-20 bg-[#FAF6F0] relative">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-4xl">
          <FadeIn>
            <div className="bg-white/90 backdrop-blur-xs border border-[#E8DFCFA0] shadow-[0_12px_40px_-10px_rgba(59,66,76,0.06)] rounded-[2rem] p-6 sm:p-10 md:p-14 text-foreground/85 leading-relaxed text-[15px] sm:text-base">
              
              <div className="space-y-4 mb-8">
                <p>
                  Welcome to The Vedic School. These Terms of Service (&quot;Terms&quot;) govern your access to and use of the The Vedic School website at{' '}
                  <a
                    href="https://thevedicschool.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline hover:text-[#A84824] transition-colors"
                  >
                    https://thevedicschool.com
                  </a>{' '}
                  and your interactions with our educational services.
                </p>
                <p>
                  By accessing or using our website, submitting an enquiry, registering for a programme, or booking an assessment, you agree to these Terms. If you do not agree with these Terms, please do not use the website or our services.
                </p>
              </div>

              {/* 1. ABOUT THE VEDIC SCHOOL */}
              <div className="pt-8 border-t border-border/40">
                <h2 className="font-serif text-2xl sm:text-[26px] font-semibold text-foreground mb-4 tracking-tight">
                  1. ABOUT THE VEDIC SCHOOL
                </h2>
                <p className="mb-3">
                  The Vedic School provides mathematics education and learning support for children, including:
                </p>
                <ul className="list-disc pl-6 space-y-1.5 mb-6">
                  <li>Vedic Maths programmes and demonstrations</li>
                  <li>Curriculum-aligned mathematics classes</li>
                  <li>Personal assessments</li>
                  <li>Educational resources and information</li>
                  <li>Related learning and parent-support services</li>
                </ul>
                <p className="mb-4">
                  The Vedic School is led by Meenakshi Koul, who currently teaches the classes personally.
                </p>
                <p>
                  Information about our programmes and approach is provided for general educational and informational purposes and may be updated from time to time.
                </p>
              </div>

              {/* 2. USE OF OUR WEBSITE */}
              <div className="pt-8 border-t border-border/40 mt-8">
                <h2 className="font-serif text-2xl sm:text-[26px] font-semibold text-foreground mb-4 tracking-tight">
                  2. USE OF OUR WEBSITE
                </h2>
                <p className="mb-3">
                  You may use our website for lawful purposes and in accordance with these Terms.
                </p>
                <p className="mb-3">
                  You agree not to:
                </p>
                <ul className="list-disc pl-6 space-y-1.5 mb-6">
                  <li>Use the website for any unlawful or unauthorised purpose.</li>
                  <li>Attempt to gain unauthorised access to the website, its systems, databases, or infrastructure.</li>
                  <li>Interfere with the security, operation, or availability of the website.</li>
                  <li>Copy, reproduce, distribute, or commercially exploit website content without our permission.</li>
                  <li>Use automated systems to scrape or collect website content in a way that could interfere with the website.</li>
                  <li>Submit information that is knowingly false, misleading, or fraudulent.</li>
                </ul>
                <p>
                  We reserve the right to restrict or terminate access to the website where we reasonably believe these Terms have been violated.
                </p>
              </div>

              {/* 3. PROGRAMMES AND EDUCATIONAL SERVICES */}
              <div className="pt-8 border-t border-border/40 mt-8">
                <h2 className="font-serif text-2xl sm:text-[26px] font-semibold text-foreground mb-4 tracking-tight">
                  3. PROGRAMMES AND EDUCATIONAL SERVICES
                </h2>
                <p className="mb-4">
                  The Vedic School offers educational programmes and services designed to support children&apos;s mathematical understanding, fluency, confidence, and application.
                </p>
                <p className="mb-4">
                  Our programmes may include Vedic Maths and curriculum-aligned classes, depending on the programme selected.
                </p>
                <p className="mb-4">
                  Vedic Maths is intended to build calculation fluency and flexibility. It does not replace mathematical understanding or curriculum learning.
                </p>
                <p className="mb-4">
                  The specific content, format, schedule, availability, and delivery of programmes may change from time to time.
                </p>
                <p>
                  We reserve the right to modify, suspend, or discontinue a programme or class where reasonably necessary.
                </p>
              </div>

              {/* 4. REGISTRATIONS AND ASSESSMENTS */}
              <div className="pt-8 border-t border-border/40 mt-8">
                <h2 className="font-serif text-2xl sm:text-[26px] font-semibold text-foreground mb-4 tracking-tight">
                  4. REGISTRATIONS AND ASSESSMENTS
                </h2>
                <p className="mb-4">
                  When registering for a programme, demonstration, or personal assessment, you agree to provide information that is accurate and complete.
                </p>
                <p className="mb-4">
                  Where a parent or guardian provides information relating to a child, the parent or guardian represents that they are authorised to provide that information.
                </p>
                <p className="mb-4">
                  Submitting a registration or enquiry does not necessarily guarantee acceptance into a programme, availability of a particular class, or continuation of services.
                </p>
                <p className="mb-3">
                  We may contact you using the information you provide in order to:
                </p>
                <ul className="list-disc pl-6 space-y-1.5 mb-6">
                  <li>Confirm a registration</li>
                  <li>Provide class or assessment details</li>
                  <li>Respond to an enquiry</li>
                  <li>Communicate necessary programme information</li>
                  <li>Provide agreed service-related communications</li>
                </ul>
              </div>

              {/* 5. WHATSAPP COMMUNICATIONS */}
              <div className="pt-8 border-t border-border/40 mt-8">
                <h2 className="font-serif text-2xl sm:text-[26px] font-semibold text-foreground mb-4 tracking-tight">
                  5. WHATSAPP COMMUNICATIONS
                </h2>
                <p className="mb-4">
                  Where you provide a WhatsApp/mobile number and consent to receive communications through WhatsApp, we may use that number to send relevant information relating to registrations, classes, assessments, reminders, and other service-related communications.
                </p>
                <p className="mb-4">
                  You may withdraw your consent to such communications by contacting us.
                </p>
                <p>
                  WhatsApp is a third-party communication platform and its use is also subject to WhatsApp&apos;s own terms and privacy practices.
                </p>
              </div>

              {/* 6. EDUCATIONAL INFORMATION AND OUTCOMES */}
              <div className="pt-8 border-t border-border/40 mt-8">
                <h2 className="font-serif text-2xl sm:text-[26px] font-semibold text-foreground mb-4 tracking-tight">
                  6. EDUCATIONAL INFORMATION AND OUTCOMES
                </h2>
                <p className="mb-4">
                  Our educational programmes are designed to support learning and development.
                </p>
                <p className="mb-4">
                  However, we do not guarantee specific academic results, examination scores, grades, rankings, or other educational outcomes.
                </p>
                <p className="mb-4">
                  A child&apos;s progress may depend on many factors, including their existing understanding, consistency, engagement, practice, school environment, and individual learning needs.
                </p>
                <p>
                  Testimonials and examples published on our website represent the experiences of the individuals who provided them and should not be interpreted as a guarantee of a particular result.
                </p>
              </div>

              {/* 7. INTELLECTUAL PROPERTY */}
              <div className="pt-8 border-t border-border/40 mt-8">
                <h2 className="font-serif text-2xl sm:text-[26px] font-semibold text-foreground mb-4 tracking-tight">
                  7. INTELLECTUAL PROPERTY
                </h2>
                <p className="mb-3">
                  Unless otherwise stated, the content available on the website is owned by or licensed to The Vedic School.
                </p>
                <p className="mb-3">
                  This may include:
                </p>
                <ul className="list-disc pl-6 space-y-1.5 mb-6">
                  <li>Website text</li>
                  <li>Programme descriptions</li>
                  <li>Educational materials</li>
                  <li>Worksheets</li>
                  <li>Graphics</li>
                  <li>Logos</li>
                  <li>Photographs</li>
                  <li>Videos</li>
                  <li>Branding</li>
                  <li>Original teaching frameworks and methodologies</li>
                  <li>Other educational resources</li>
                </ul>
                <p className="mb-4">
                  You may view and use website content for your personal, non-commercial purposes.
                </p>
                <p>
                  You may not reproduce, republish, distribute, modify, sell, publicly display, or commercially exploit our content without our prior written permission.
                </p>
              </div>

              {/* 8. EDUCATIONAL MATERIALS */}
              <div className="pt-8 border-t border-border/40 mt-8">
                <h2 className="font-serif text-2xl sm:text-[26px] font-semibold text-foreground mb-4 tracking-tight">
                  8. EDUCATIONAL MATERIALS
                </h2>
                <p className="mb-4">
                  Any worksheets, exercises, resources, examples, or other educational materials provided by The Vedic School are intended for the individual learner or family for whom they are provided, unless we expressly state otherwise.
                </p>
                <p>
                  You may not commercially reproduce, resell, distribute, upload, or make such materials publicly available without our written permission.
                </p>
              </div>

              {/* 9. THIRD-PARTY SERVICES AND LINKS */}
              <div className="pt-8 border-t border-border/40 mt-8">
                <h2 className="font-serif text-2xl sm:text-[26px] font-semibold text-foreground mb-4 tracking-tight">
                  9. THIRD-PARTY SERVICES AND LINKS
                </h2>
                <p className="mb-4">
                  Our website may contain links to or use services provided by third parties, including services used for maps, communications, hosting, database infrastructure, or other website functionality.
                </p>
                <p className="mb-4">
                  We do not control third-party websites or services and are not responsible for their content, availability, security, privacy practices, or terms.
                </p>
                <p>
                  Your use of a third-party service may be subject to that provider&apos;s separate terms and policies.
                </p>
              </div>

              {/* 10. WEBSITE AVAILABILITY */}
              <div className="pt-8 border-t border-border/40 mt-8">
                <h2 className="font-serif text-2xl sm:text-[26px] font-semibold text-foreground mb-4 tracking-tight">
                  10. WEBSITE AVAILABILITY
                </h2>
                <p className="mb-3">
                  We aim to keep the website available and functioning properly, but we do not guarantee that:
                </p>
                <ul className="list-disc pl-6 space-y-1.5 mb-6">
                  <li>The website will always be available or uninterrupted.</li>
                  <li>The website will be free from errors or technical issues.</li>
                  <li>All website content will always be current or complete.</li>
                  <li>The website will be compatible with every device or browser.</li>
                </ul>
                <p>
                  We may temporarily suspend or modify the website for maintenance, updates, security, or other operational reasons.
                </p>
              </div>

              {/* 11. DISCLAIMER */}
              <div className="pt-8 border-t border-border/40 mt-8">
                <h2 className="font-serif text-2xl sm:text-[26px] font-semibold text-foreground mb-4 tracking-tight">
                  11. DISCLAIMER
                </h2>
                <p className="mb-4">
                  The information provided on the website is intended to provide information about The Vedic School and its educational services.
                </p>
                <p className="mb-4">
                  While we make reasonable efforts to ensure that information on the website is accurate and useful, we do not warrant that every piece of information is complete, current, or error-free.
                </p>
                <p>
                  Educational information provided through the website should not be understood as a guarantee of any particular academic outcome.
                </p>
              </div>

              {/* 12. LIMITATION OF LIABILITY */}
              <div className="pt-8 border-t border-border/40 mt-8">
                <h2 className="font-serif text-2xl sm:text-[26px] font-semibold text-foreground mb-4 tracking-tight">
                  12. LIMITATION OF LIABILITY
                </h2>
                <p className="mb-4">
                  To the fullest extent permitted by applicable law, The Vedic School will not be liable for indirect, incidental, consequential, or special losses arising from or related to your use of the website or our services.
                </p>
                <p className="mb-4">
                  Nothing in these Terms is intended to exclude or limit liability that cannot legally be excluded or limited under applicable law.
                </p>
                <p>
                  Where liability cannot legally be excluded, it will be limited to the maximum extent permitted by law.
                </p>
              </div>

              {/* 13. INDEMNIFICATION */}
              <div className="pt-8 border-t border-border/40 mt-8">
                <h2 className="font-serif text-2xl sm:text-[26px] font-semibold text-foreground mb-4 tracking-tight">
                  13. INDEMNIFICATION
                </h2>
                <p className="mb-4">
                  To the extent permitted by applicable law, you agree to indemnify and hold harmless The Vedic School and its representatives from claims, liabilities, damages, losses, and reasonable expenses arising from your unlawful use of the website, violation of these Terms, or infringement of another person&apos;s rights.
                </p>
                <p>
                  This provision does not apply to the extent that the relevant claim or loss results from our own unlawful conduct or liability that cannot legally be excluded.
                </p>
              </div>

              {/* 14. PRIVACY */}
              <div className="pt-8 border-t border-border/40 mt-8">
                <h2 className="font-serif text-2xl sm:text-[26px] font-semibold text-foreground mb-4 tracking-tight">
                  14. PRIVACY
                </h2>
                <p className="mb-4">
                  Your use of the website is also subject to our Privacy Policy.
                </p>
                <p className="mb-4">
                  Our Privacy Policy explains what personal information we collect, how we use it, how it is stored, and your applicable privacy rights.
                </p>
                <p className="mb-2">
                  You can read the Privacy Policy here:
                </p>
                <p className="mb-4">
                  <Link
                    href="/privacy-policy"
                    className="text-primary underline hover:text-[#A84824] transition-colors font-medium"
                  >
                    Privacy Policy
                  </Link>
                </p>
                <p className="mb-2">
                  Our use of cookies and similar technologies is described in our Cookie Policy:
                </p>
                <p>
                  <a
                    href="https://www.freeprivacypolicy.com/live/1b29211f-ac01-402c-a850-936719ba4a06"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline hover:text-[#A84824] transition-colors font-medium"
                  >
                    Cookie Policy
                  </a>
                </p>
              </div>

              {/* 15. CHANGES TO THESE TERMS */}
              <div className="pt-8 border-t border-border/40 mt-8">
                <h2 className="font-serif text-2xl sm:text-[26px] font-semibold text-foreground mb-4 tracking-tight">
                  15. CHANGES TO THESE TERMS
                </h2>
                <p className="mb-4">
                  We may update these Terms from time to time to reflect changes to our website, programmes, services, or applicable legal requirements.
                </p>
                <p className="mb-4">
                  When we update these Terms, we will revise the Last updated date at the beginning of the document.
                </p>
                <p>
                  Your continued use of the website after updated Terms are published constitutes acceptance of the revised Terms to the extent permitted by applicable law.
                </p>
              </div>

              {/* 16. GOVERNING LAW */}
              <div className="pt-8 border-t border-border/40 mt-8">
                <h2 className="font-serif text-2xl sm:text-[26px] font-semibold text-foreground mb-4 tracking-tight">
                  16. GOVERNING LAW
                </h2>
                <p className="mb-4">
                  These Terms shall be governed by and interpreted in accordance with the laws applicable in India, without regard to conflict-of-law principles.
                </p>
                <p>
                  Any disputes arising in connection with these Terms or the use of our website or services shall be subject to the jurisdiction of the courts having appropriate jurisdiction in Gurugram, Haryana, India, subject to applicable law.
                </p>
              </div>

              {/* 17. SEVERABILITY */}
              <div className="pt-8 border-t border-border/40 mt-8">
                <h2 className="font-serif text-2xl sm:text-[26px] font-semibold text-foreground mb-4 tracking-tight">
                  17. SEVERABILITY
                </h2>
                <p className="mb-4">
                  If any provision of these Terms is found to be invalid, unlawful, or unenforceable, that provision shall be interpreted or modified to the extent necessary to make it enforceable, where legally permitted.
                </p>
                <p>
                  The remaining provisions will continue to apply.
                </p>
              </div>

              {/* 18. ENTIRE AGREEMENT */}
              <div className="pt-8 border-t border-border/40 mt-8">
                <h2 className="font-serif text-2xl sm:text-[26px] font-semibold text-foreground mb-4 tracking-tight">
                  18. ENTIRE AGREEMENT
                </h2>
                <p>
                  These Terms, together with our Privacy Policy and Cookie Policy, constitute the terms governing your use of the website, except where additional written terms apply to a particular programme or service.
                </p>
              </div>

              {/* 19. CONTACT US */}
              <div className="pt-8 border-t border-border/40 mt-8">
                <h2 className="font-serif text-2xl sm:text-[26px] font-semibold text-foreground mb-4 tracking-tight">
                  19. CONTACT US
                </h2>
                <p className="mb-3">
                  If you have questions about these Terms of Service, you can contact us:
                </p>
                <div className="bg-[#FAF6F0] border border-[#E6DDCF] rounded-2xl p-5 mb-4 text-foreground/85">
                  <p className="font-medium text-foreground mb-1">The Vedic School</p>
                  <p>Emaar Emerald Estate</p>
                  <p>Maidawas Road, Sector 65, Gurugram</p>
                  <p>Gurugram, Haryana 122101</p>
                  <p>India</p>
                </div>
                <p className="mb-3">
                  Email:{' '}
                  <a
                    href="mailto:sharang.fleetforum@gmail.com"
                    className="text-primary underline hover:text-[#A84824] transition-colors"
                  >
                    sharang.fleetforum@gmail.com
                  </a>
                </p>
                <p className="mb-2">
                  You can also contact us through our Contact page:
                </p>
                <p>
                  <Link
                    href="/contact"
                    className="text-primary underline hover:text-[#A84824] transition-colors font-medium"
                  >
                    Contact The Vedic School
                  </Link>
                </p>
              </div>

            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
