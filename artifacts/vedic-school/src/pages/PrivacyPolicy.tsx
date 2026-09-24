import React from 'react';
import { Link } from 'wouter';
import { FadeIn } from '@/components/ui-patterns';
import heroTexture from '@assets/generated_images/hero-texture-math.png';
import { Seo } from '@/seo/Seo';
import { getLegalPageSchema } from '@/seo/schema';

export default function PrivacyPolicy() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Seo
        title="Privacy Policy | The Vedic School"
        description="Learn how The Vedic School collects, uses, and protects your personal information."
        path="/privacy-policy"
        schema={getLegalPageSchema(
          '/privacy-policy',
          'Privacy Policy',
          'Learn how The Vedic School collects, uses, and protects your personal information.'
        )}
      />
      {/* Hero Header */}
      <section className="relative pt-32 pb-12 lg:pt-40 lg:pb-16 border-b border-border/30 overflow-hidden">
        <div
          className="absolute inset-0 z-0 opacity-20 pointer-events-none"
          style={{ backgroundImage: `url(${heroTexture})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        />
        <div className="container mx-auto px-4 md:px-6 max-w-3xl text-center relative z-10">
          <FadeIn>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif mb-4 text-foreground leading-[1.2] tracking-tight">
              Privacy Policy
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
                  This Privacy Policy describes how The Vedic School (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) collects, uses, stores, and protects personal information when you visit our website, register for our programmes, submit an enquiry, or otherwise interact with us through our website.
                </p>
                <p>
                  Our website is available at{' '}
                  <a
                    href="https://www.thevedicschool.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline hover:text-[#A84824] transition-colors"
                  >
                    www.thevedicschool.com
                  </a>
                  .
                </p>
                <p>
                  If you have questions about this Privacy Policy or how we handle personal information, you can contact us at{' '}
                  <a
                    href="mailto:sharang.fleetforum@gmail.com"
                    className="text-primary underline hover:text-[#A84824] transition-colors"
                  >
                    sharang.fleetforum@gmail.com
                  </a>
                  .
                </p>
              </div>

              {/* 1. WHAT INFORMATION DO WE COLLECT? */}
              <div className="pt-8 border-t border-border/40">
                <h2 className="font-serif text-2xl sm:text-[26px] font-semibold text-foreground mb-4 tracking-tight">
                  1. WHAT INFORMATION DO WE COLLECT?
                </h2>
                <h3 className="font-serif text-lg sm:text-xl font-medium text-foreground mt-6 mb-3">
                  Personal information you provide to us
                </h3>
                <p className="mb-3">
                  We collect personal information that you voluntarily provide when you register for a programme, request an assessment, submit an enquiry, or otherwise contact us.
                </p>
                <p className="mb-3">
                  Depending on how you interact with us, this may include:
                </p>
                <ul className="list-disc pl-6 space-y-1.5 mb-6">
                  <li>Parent or guardian name</li>
                  <li>Child&apos;s name</li>
                  <li>Child&apos;s grade</li>
                  <li>School board, where provided</li>
                  <li>Information about the academic support your child may need</li>
                  <li>Email address</li>
                  <li>WhatsApp/mobile phone number</li>
                  <li>Country and international calling code associated with the WhatsApp number</li>
                  <li>Your enquiry or message</li>
                  <li>Your preferences and consent regarding WhatsApp communications</li>
                </ul>
                <p className="mb-6">
                  We collect only the information reasonably necessary to respond to your enquiry, arrange or administer a programme or assessment, communicate with you, and provide our services.
                </p>

                <h3 className="font-serif text-lg sm:text-xl font-medium text-foreground mt-6 mb-3">
                  Information automatically collected
                </h3>
                <p className="mb-3">
                  When you visit our website, certain technical information may be automatically collected by our hosting and website infrastructure. This may include information such as:
                </p>
                <ul className="list-disc pl-6 space-y-1.5 mb-6">
                  <li>IP address</li>
                  <li>Browser type and version</li>
                  <li>Device type</li>
                  <li>Operating system</li>
                  <li>Pages visited</li>
                  <li>Date and time of access</li>
                  <li>Referring website or URL</li>
                  <li>Basic website usage and diagnostic information</li>
                </ul>
                <p className="mb-6">
                  This information may be used to maintain website security, troubleshoot technical issues, and ensure the website functions properly.
                </p>

                <h3 className="font-serif text-lg sm:text-xl font-medium text-foreground mt-6 mb-3">
                  Sensitive personal information
                </h3>
                <p className="mb-3">
                  We do not intentionally request or collect sensitive personal information through our website.
                </p>
                <p>
                  Please do not submit sensitive personal information through our forms unless it is specifically necessary and requested by us.
                </p>
              </div>

              {/* 2. HOW DO WE USE YOUR INFORMATION? */}
              <div className="pt-8 border-t border-border/40 mt-8">
                <h2 className="font-serif text-2xl sm:text-[26px] font-semibold text-foreground mb-4 tracking-tight">
                  2. HOW DO WE USE YOUR INFORMATION?
                </h2>
                <p className="mb-3">
                  We may use personal information for the following purposes:
                </p>
                <ul className="list-disc pl-6 space-y-1.5 mb-6">
                  <li>To process registrations for our Vedic Maths demonstrations and programmes</li>
                  <li>To arrange personal assessments</li>
                  <li>To respond to enquiries submitted through our Contact page</li>
                  <li>To communicate with parents or guardians about registrations, assessments, classes, and related services</li>
                  <li>To send class or assessment information through WhatsApp where you have provided your number and consented to receive such communications</li>
                  <li>To understand and respond to your child&apos;s learning needs</li>
                  <li>To provide, administer, and improve our services</li>
                  <li>To maintain the security and proper functioning of our website</li>
                  <li>To prevent fraud, misuse, or security incidents</li>
                  <li>To maintain appropriate records</li>
                  <li>To comply with applicable legal obligations</li>
                  <li>To respond to lawful requests from authorities where required</li>
                </ul>
                <p>
                  We do not currently use the personal information collected through this website for behavioural advertising or retargeting.
                </p>
              </div>

              {/* 3. WHAT LEGAL BASES DO WE RELY ON TO PROCESS YOUR PERSONAL INFORMATION? */}
              <div className="pt-8 border-t border-border/40 mt-8">
                <h2 className="font-serif text-2xl sm:text-[26px] font-semibold text-foreground mb-4 tracking-tight">
                  3. WHAT LEGAL BASES DO WE RELY ON TO PROCESS YOUR PERSONAL INFORMATION?
                </h2>
                <p className="mb-3">
                  Where applicable law requires a legal basis for processing personal information, we may rely on:
                </p>
                <ul className="list-disc pl-6 space-y-1.5 mb-6">
                  <li>Consent — where you have given us permission to use your information for a specific purpose.</li>
                  <li>Performance of a service or arrangement — where processing is necessary to provide a programme, assessment, respond to a request, or otherwise provide a service you have requested.</li>
                  <li>Legitimate interests — where processing is reasonably necessary for operating, securing, and improving our services and those interests are not overridden by your rights.</li>
                  <li>Legal obligations — where processing is necessary to comply with applicable laws or legal requirements.</li>
                </ul>
                <p>
                  Where we rely on consent, you may withdraw that consent by contacting us using the details provided in this Privacy Policy. Withdrawal of consent does not affect processing that took place before consent was withdrawn.
                </p>
              </div>

              {/* 4. WHEN AND WITH WHOM DO WE SHARE PERSONAL INFORMATION? */}
              <div className="pt-8 border-t border-border/40 mt-8">
                <h2 className="font-serif text-2xl sm:text-[26px] font-semibold text-foreground mb-4 tracking-tight">
                  4. WHEN AND WITH WHOM DO WE SHARE PERSONAL INFORMATION?
                </h2>
                <p className="mb-3">
                  We do not sell your personal information.
                </p>
                <p className="mb-3">
                  We may share personal information with service providers that help us operate the website and provide our services. These providers may process information on our behalf and only to the extent necessary for the services they provide.
                </p>
                <p className="mb-3">
                  These may include:
                </p>
                <ul className="list-disc pl-6 space-y-1.5 mb-6">
                  <li>Website and database infrastructure providers, including Supabase, which we use to securely store information submitted through our website forms.</li>
                  <li>Website and hosting infrastructure providers, as necessary to operate and secure the website.</li>
                  <li>Third-party map services, where necessary to display the location map on our Contact page.</li>
                  <li>Other service providers where reasonably necessary to operate our services, communicate with you, maintain security, or comply with legal obligations.</li>
                </ul>
                <p className="mb-4">
                  We do not permit service providers to use personal information provided through our forms for purposes unrelated to the services they provide to us, subject to their own applicable privacy policies and legal obligations.
                </p>
                <p className="mb-6">
                  We may also disclose information where required by law, legal process, or a lawful request from a government authority.
                </p>

                <h3 className="font-serif text-lg sm:text-xl font-medium text-foreground mt-6 mb-3">
                  Business transfers
                </h3>
                <p>
                  If The Vedic School is involved in a merger, acquisition, restructuring, sale of assets, or similar business transaction, personal information may be transferred as part of that transaction, subject to applicable law.
                </p>
              </div>

              {/* 5. DO WE USE COOKIES AND OTHER TRACKING TECHNOLOGIES? */}
              <div className="pt-8 border-t border-border/40 mt-8">
                <h2 className="font-serif text-2xl sm:text-[26px] font-semibold text-foreground mb-4 tracking-tight">
                  5. DO WE USE COOKIES AND OTHER TRACKING TECHNOLOGIES?
                </h2>
                <p className="mb-3">
                  Our website may use cookies and similar technologies that are necessary for the website to function properly.
                </p>
                <p className="mb-3">
                  We do not currently use Google Analytics, advertising cookies, or retargeting technologies on the website.
                </p>
                <p className="mb-3">
                  Our website also uses third-party services, such as the map displayed on our Contact page. These third-party services may use their own technologies when their content is loaded.
                </p>
                <p className="mb-3">
                  For more information about cookies and similar technologies, please see our{' '}
                  <a
                    href="https://www.freeprivacypolicy.com/live/1b29211f-ac01-402c-a850-936719ba4a06"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline hover:text-[#A84824] transition-colors"
                  >
                    Cookie Policy
                  </a>
                  .
                </p>
                <p>
                  If we introduce analytics, advertising, or other non-essential tracking technologies in the future, we may update this Privacy Policy and our Cookie Policy accordingly.
                </p>
              </div>

              {/* 6. HOW LONG DO WE KEEP YOUR INFORMATION? */}
              <div className="pt-8 border-t border-border/40 mt-8">
                <h2 className="font-serif text-2xl sm:text-[26px] font-semibold text-foreground mb-4 tracking-tight">
                  6. HOW LONG DO WE KEEP YOUR INFORMATION?
                </h2>
                <p className="mb-3">
                  We retain personal information only for as long as reasonably necessary for the purposes described in this Privacy Policy, including to provide services, respond to enquiries, maintain appropriate business records, resolve disputes, and comply with applicable legal obligations.
                </p>
                <p className="mb-3">
                  The exact retention period may vary depending on:
                </p>
                <ul className="list-disc pl-6 space-y-1.5 mb-6">
                  <li>The nature of the information</li>
                  <li>Why it was collected</li>
                  <li>Whether we have an ongoing relationship with you</li>
                  <li>Legal or regulatory requirements</li>
                  <li>Legitimate business requirements</li>
                </ul>
                <p>
                  When personal information is no longer required, we will take reasonable steps to delete it or anonymise it, subject to applicable legal and operational requirements.
                </p>
              </div>

              {/* 7. YOUR PRIVACY RIGHTS */}
              <div className="pt-8 border-t border-border/40 mt-8">
                <h2 className="font-serif text-2xl sm:text-[26px] font-semibold text-foreground mb-4 tracking-tight">
                  7. YOUR PRIVACY RIGHTS
                </h2>
                <p className="mb-3">
                  Depending on where you live and which privacy laws apply to you, you may have rights regarding your personal information.
                </p>
                <p className="mb-3">
                  These may include the right to:
                </p>
                <ul className="list-disc pl-6 space-y-1.5 mb-6">
                  <li>Request access to personal information we hold about you</li>
                  <li>Request correction of inaccurate or incomplete information</li>
                  <li>Request deletion of your personal information</li>
                  <li>Request restriction of certain processing</li>
                  <li>Object to certain processing</li>
                  <li>Withdraw consent where processing is based on consent</li>
                  <li>Request a copy of your information where a right to data portability applies</li>
                  <li>Lodge a complaint with an applicable data protection authority</li>
                </ul>
                <p className="mb-3">
                  To exercise an applicable privacy right, contact us at{' '}
                  <a
                    href="mailto:sharang.fleetforum@gmail.com"
                    className="text-primary underline hover:text-[#A84824] transition-colors"
                  >
                    sharang.fleetforum@gmail.com
                  </a>
                  .
                </p>
                <p className="mb-3">
                  We may need to verify your identity before responding to certain requests.
                </p>
                <p>
                  We will consider and respond to requests in accordance with applicable privacy laws.
                </p>
              </div>

              {/* 8. CHILDREN'S INFORMATION */}
              <div className="pt-8 border-t border-border/40 mt-8">
                <h2 className="font-serif text-2xl sm:text-[26px] font-semibold text-foreground mb-4 tracking-tight">
                  8. CHILDREN&apos;S INFORMATION
                </h2>
                <p className="mb-3">
                  The Vedic School provides educational services for children, and some of the information submitted through our registration and assessment forms relates to children.
                </p>
                <p className="mb-3">
                  Parents or guardians should provide information about a child only where they are authorised to do so.
                </p>
                <p className="mb-3">
                  We collect children&apos;s information only for legitimate purposes connected with providing or arranging our educational services, responding to enquiries, assessments, registrations, and related communications.
                </p>
                <p className="mb-3">
                  We do not knowingly use children&apos;s information for behavioural advertising or targeted advertising.
                </p>
                <p>
                  If you believe that information relating to a child has been provided to us improperly, please contact us at{' '}
                  <a
                    href="mailto:sharang.fleetforum@gmail.com"
                    className="text-primary underline hover:text-[#A84824] transition-colors"
                  >
                    sharang.fleetforum@gmail.com
                  </a>
                  .
                </p>
              </div>

              {/* 9. DO-NOT-TRACK FEATURES */}
              <div className="pt-8 border-t border-border/40 mt-8">
                <h2 className="font-serif text-2xl sm:text-[26px] font-semibold text-foreground mb-4 tracking-tight">
                  9. DO-NOT-TRACK FEATURES
                </h2>
                <p className="mb-3">
                  Some web browsers provide a &quot;Do Not Track&quot; setting.
                </p>
                <p>
                  There is currently no universally accepted standard for responding to such browser signals. Accordingly, our website may not respond to all Do Not Track signals.
                </p>
              </div>

              {/* 10. DO WE MAKE UPDATES TO THIS PRIVACY POLICY? */}
              <div className="pt-8 border-t border-border/40 mt-8">
                <h2 className="font-serif text-2xl sm:text-[26px] font-semibold text-foreground mb-4 tracking-tight">
                  10. DO WE MAKE UPDATES TO THIS PRIVACY POLICY?
                </h2>
                <p className="mb-3">
                  Yes.
                </p>
                <p className="mb-3">
                  We may update this Privacy Policy from time to time to reflect changes to our services, website, information practices, or applicable legal requirements.
                </p>
                <p className="mb-3">
                  When we make changes, we will update the Last updated date at the beginning of this Privacy Policy.
                </p>
                <p>
                  We encourage you to review this Privacy Policy periodically.
                </p>
              </div>

              {/* 11. HOW CAN YOU CONTACT US ABOUT THIS PRIVACY POLICY? */}
              <div className="pt-8 border-t border-border/40 mt-8">
                <h2 className="font-serif text-2xl sm:text-[26px] font-semibold text-foreground mb-4 tracking-tight">
                  11. HOW CAN YOU CONTACT US ABOUT THIS PRIVACY POLICY?
                </h2>
                <p className="mb-3">
                  If you have questions, concerns, or requests relating to this Privacy Policy or our handling of personal information, please contact us:
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
                <p>
                  You may also use our Contact page:{' '}
                  <Link
                    href="/contact"
                    className="text-primary underline hover:text-[#A84824] transition-colors font-medium"
                  >
                    Contact The Vedic School
                  </Link>
                </p>
              </div>

              {/* 12. HOW CAN YOU REVIEW, UPDATE, OR DELETE YOUR INFORMATION? */}
              <div className="pt-8 border-t border-border/40 mt-8">
                <h2 className="font-serif text-2xl sm:text-[26px] font-semibold text-foreground mb-4 tracking-tight">
                  12. HOW CAN YOU REVIEW, UPDATE, OR DELETE YOUR INFORMATION?
                </h2>
                <p className="mb-3">
                  If you would like to review, correct, update, or request deletion of personal information that you have provided to us, please contact us at{' '}
                  <a
                    href="mailto:sharang.fleetforum@gmail.com"
                    className="text-primary underline hover:text-[#A84824] transition-colors"
                  >
                    sharang.fleetforum@gmail.com
                  </a>
                  .
                </p>
                <p className="mb-3">
                  Please include enough information for us to identify your request and, where necessary, verify your identity.
                </p>
                <p>
                  We will handle your request in accordance with applicable privacy laws.
                </p>
              </div>

            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
