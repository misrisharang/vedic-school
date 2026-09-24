import React from 'react';
import { Link } from 'wouter';
import { FadeIn } from '@/components/ui-patterns';
import heroTexture from '@assets/generated_images/hero-texture-math.png';
import { Seo } from '@/seo/Seo';
import { getLegalPageSchema } from '@/seo/schema';

export default function CookiePolicy() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Seo
        title="Cookie Policy | The Vedic School"
        description="Learn about the essential cookies and analytics used on The Vedic School website."
        path="/cookie-policy"
        schema={getLegalPageSchema(
          '/cookie-policy',
          'Cookie Policy',
          'Learn about the essential cookies and analytics used on The Vedic School website.'
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
              Cookies Policy
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
                  This Cookies Policy explains what Cookies are and how We use them. You should read this policy so You can understand what type of cookies We use, or the information We collect using Cookies and how that information is used. This Cookies Policy has been created with the help of the{' '}
                  <a
                    href="https://www.termsfeed.com/cookies-policy-generator/"
                    target="_blank"
                    rel="external nofollow noopener noreferrer"
                    className="text-primary underline hover:text-[#A84824] transition-colors"
                  >
                    TermsFeed Cookies Policy Generator
                  </a>
                  .
                </p>
                <p>
                  Cookies do not typically contain any information that personally identifies a user, but personal information that We store about You may be linked to the information stored in and obtained from Cookies. For further information on how We use, store and keep your personal data secure, see our{' '}
                  <Link
                    href="/privacy-policy"
                    className="text-primary underline hover:text-[#A84824] transition-colors"
                  >
                    Privacy Policy
                  </Link>
                  , if and when We make it available within the Website or on our website.
                </p>
                <p>
                  We do not store sensitive personal information, such as mailing addresses, account passwords, etc. in the Cookies We use.
                </p>
              </div>

              {/* Interpretation and Definitions */}
              <div className="pt-8 border-t border-border/40">
                <h2 className="font-serif text-2xl sm:text-[26px] font-semibold text-foreground mb-4 tracking-tight">
                  Interpretation and Definitions
                </h2>
                <h3 className="font-serif text-lg sm:text-xl font-medium text-foreground mt-6 mb-3">
                  Interpretation
                </h3>
                <p className="mb-6">
                  The words whose initial letters are capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.
                </p>

                <h3 className="font-serif text-lg sm:text-xl font-medium text-foreground mt-6 mb-3">
                  Definitions
                </h3>
                <p className="mb-3">
                  For the purposes of this Cookies Policy:
                </p>
                <ul className="list-disc pl-6 space-y-3 mb-6">
                  <li>
                    <strong className="text-foreground">Company</strong> (referred to as either &quot;the Company&quot;, &quot;We&quot;, &quot;Us&quot; or &quot;Our&quot; in this Cookies Policy) refers to The Vedic School, The Cedar Estate, Golf Course Road, Sector 54, Gurugram, Haryana.
                  </li>
                  <li>
                    <strong className="text-foreground">Cookies</strong> means small files that are placed on Your computer, mobile device or any other device by a website, containing details of your browsing history on that website among its many uses.
                  </li>
                  <li>
                    <strong className="text-foreground">Website</strong> refers to The Vedic School, accessible from{' '}
                    <a
                      href="https://www.thevedicschool.com"
                      target="_blank"
                      rel="external nofollow noopener noreferrer"
                      className="text-primary underline hover:text-[#A84824] transition-colors"
                    >
                      https://www.thevedicschool.com
                    </a>
                    .
                  </li>
                  <li>
                    <strong className="text-foreground">You</strong> means the individual accessing or using the Website, or a company, or any legal entity on behalf of which such individual is accessing or using the Website, as applicable.
                  </li>
                </ul>
              </div>

              {/* The use of the Cookies */}
              <div className="pt-8 border-t border-border/40 mt-8">
                <h2 className="font-serif text-2xl sm:text-[26px] font-semibold text-foreground mb-4 tracking-tight">
                  The use of the Cookies
                </h2>
                <h3 className="font-serif text-lg sm:text-xl font-medium text-foreground mt-6 mb-3">
                  Type of Cookies We Use
                </h3>
                <p className="mb-4">
                  Cookies can be &quot;Persistent&quot; or &quot;Session&quot; Cookies. Persistent Cookies remain on your personal computer or mobile device when You go offline, while Session Cookies are deleted as soon as You close your web browser.
                </p>
                <p className="mb-4">
                  Where required by law, We will request your consent before using Cookies that are not strictly necessary. Strictly necessary Cookies are used to provide the Website and cannot be switched off in our systems.
                </p>
                <p className="mb-4">
                  We use both session and persistent Cookies for the purposes set out below:
                </p>
                <ul className="list-disc pl-6 space-y-4 mb-6">
                  <li>
                    <p className="font-semibold text-foreground mb-1">Necessary / Essential Cookies</p>
                    <p className="mb-1">Type: Session Cookies</p>
                    <p className="mb-1">Administered by: Us</p>
                    <p>
                      Purpose: These Cookies are essential to provide You with services available through the Website and to enable You to use some of its features. They help to authenticate users and prevent fraudulent use of user accounts. Without these Cookies, the services that You have asked for cannot be provided, and We only use these Cookies to provide You with those services.
                    </p>
                  </li>
                  <li>
                    <p className="font-semibold text-foreground mb-1">Functionality Cookies</p>
                    <p className="mb-1">Type: Persistent Cookies</p>
                    <p className="mb-1">Administered by: Us</p>
                    <p>
                      Purpose: These Cookies allow Us to remember choices You make when You use the Website, such as remembering your login details or language preference. The purpose of these Cookies is to provide You with a more personal experience and to avoid You having to re-enter your preferences every time You use the Website.
                    </p>
                  </li>
                </ul>

                <h3 className="font-serif text-lg sm:text-xl font-medium text-foreground mt-6 mb-3">
                  Your Choices Regarding Cookies
                </h3>
                <p className="mb-4">
                  If You prefer to avoid the use of Cookies on the Website, first You must disable the use of Cookies in your browser and then delete the Cookies saved in your browser associated with the Website. You may use this option for preventing the use of Cookies at any time.
                </p>
                <p className="mb-4">
                  If You do not accept Our Cookies, You may experience some inconvenience in your use of the Website and some features may not function properly.
                </p>
                <p className="mb-4">
                  If You&apos;d like to delete Cookies or instruct your web browser to delete or refuse Cookies, please visit the help pages of your web browser.
                </p>
                <ul className="list-disc pl-6 space-y-2 mb-6">
                  <li>
                    <p>
                      For the Chrome web browser, please visit this page from Google:{' '}
                      <a
                        href="https://support.google.com/accounts/answer/32050"
                        target="_blank"
                        rel="external nofollow noopener noreferrer"
                        className="text-primary underline hover:text-[#A84824] transition-colors break-all"
                      >
                        https://support.google.com/accounts/answer/32050
                      </a>
                    </p>
                  </li>
                  <li>
                    <p>
                      For the Microsoft Edge browser, please visit this page from Microsoft:{' '}
                      <a
                        href="https://support.microsoft.com/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09"
                        target="_blank"
                        rel="external nofollow noopener noreferrer"
                        className="text-primary underline hover:text-[#A84824] transition-colors break-all"
                      >
                        https://support.microsoft.com/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09
                      </a>
                    </p>
                  </li>
                  <li>
                    <p>
                      For the Firefox web browser, please visit this page from Mozilla:{' '}
                      <a
                        href="https://support.mozilla.org/en-US/kb/delete-cookies-remove-info-websites-stored"
                        target="_blank"
                        rel="external nofollow noopener noreferrer"
                        className="text-primary underline hover:text-[#A84824] transition-colors break-all"
                      >
                        https://support.mozilla.org/en-US/kb/delete-cookies-remove-info-websites-stored
                      </a>
                    </p>
                  </li>
                  <li>
                    <p>
                      For the Safari web browser, please visit this page from Apple:{' '}
                      <a
                        href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac"
                        target="_blank"
                        rel="external nofollow noopener noreferrer"
                        className="text-primary underline hover:text-[#A84824] transition-colors break-all"
                      >
                        https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac
                      </a>
                    </p>
                  </li>
                </ul>
                <p className="mb-6">
                  For any other web browser, please visit your web browser&apos;s official web pages.
                </p>

                <h3 className="font-serif text-lg sm:text-xl font-medium text-foreground mt-6 mb-3">
                  Changes to this Cookies Policy
                </h3>
                <p className="mb-6">
                  We may update this Cookies Policy from time to time. The &quot;Last updated&quot; date at the top indicates when it was last revised.
                </p>

                <h3 className="font-serif text-lg sm:text-xl font-medium text-foreground mt-6 mb-3">
                  Contact Us
                </h3>
                <p className="mb-3">
                  If you have any questions about this Cookies Policy, You can contact us:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <p>
                      By email:{' '}
                      <a
                        href="mailto:sharang.fleetforum@gmail.com"
                        className="text-primary underline hover:text-[#A84824] transition-colors"
                      >
                        sharang.fleetforum@gmail.com
                      </a>
                    </p>
                  </li>
                  <li>
                    <p>
                      By visiting this page on our website:{' '}
                      <Link
                        href="/contact"
                        className="text-primary underline hover:text-[#A84824] transition-colors font-medium"
                      >
                        /contact
                      </Link>
                    </p>
                  </li>
                </ul>
              </div>

            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
