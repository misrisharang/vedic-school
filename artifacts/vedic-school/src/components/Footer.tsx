import React from 'react';
import { Link } from 'wouter';
import { Instagram, Facebook, Youtube, Linkedin } from 'lucide-react';
import logoImg from '@assets/ChatGPT_Image_Jul_22,_2026,_06_12_07_PM_(1)_1786009245523.png';

export function Footer() {
  return (
    <footer id="contact" className="bg-foreground text-background py-16 border-t border-foreground/10">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          
          <div className="col-span-1 lg:col-span-1">
            <div className="mb-6">
              <Link href="/" className="inline-block">
                <img src={logoImg} alt="The Vedic School" className="h-10 w-auto brightness-[2] contrast-75" />
              </Link>
            </div>
            <p className="text-background/70 text-sm leading-relaxed max-w-xs">
              Personalised mathematics teaching built around the child, developing understanding, fluency, and lasting confidence.
            </p>
            <div className="mt-6 flex gap-4">
              <a
                href="https://www.instagram.com/thevedicschool/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center text-background/80 hover:bg-primary hover:text-white transition-all"
                aria-label="The Vedic School on Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <div
                className="relative group w-10 h-10 rounded-full bg-background/10 flex items-center justify-center text-background/80 hover:bg-primary hover:text-white transition-all cursor-default select-none focus:outline-hidden focus-visible:ring-2 focus-visible:ring-primary"
                role="img"
                tabIndex={0}
                aria-label="Facebook — Coming soon"
              >
                <Facebook className="w-4 h-4" />
                <span
                  role="tooltip"
                  className="absolute -top-9 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-[#1a1c1e] text-white text-[11px] font-medium rounded-md whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200 shadow-md border border-white/10 z-50 after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-4 after:border-transparent after:border-t-[#1a1c1e]"
                >
                  Coming soon
                </span>
              </div>
              <div
                className="relative group w-10 h-10 rounded-full bg-background/10 flex items-center justify-center text-background/80 hover:bg-primary hover:text-white transition-all cursor-default select-none focus:outline-hidden focus-visible:ring-2 focus-visible:ring-primary"
                role="img"
                tabIndex={0}
                aria-label="YouTube — Coming soon"
              >
                <Youtube className="w-4 h-4" />
                <span
                  role="tooltip"
                  className="absolute -top-9 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-[#1a1c1e] text-white text-[11px] font-medium rounded-md whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200 shadow-md border border-white/10 z-50 after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-4 after:border-transparent after:border-t-[#1a1c1e]"
                >
                  Coming soon
                </span>
              </div>
              <a
                href="https://www.linkedin.com/in/meenakshi-koul-14b101135/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center text-background/80 hover:bg-primary hover:text-white transition-all"
                aria-label="Meenakshi Koul on LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-sans font-semibold tracking-wider text-xs uppercase text-background/50 mb-6">Programs</h4>
            <ul className="space-y-4">
              <li><Link href="/vedic-maths" className="text-background/80 hover:text-white transition-colors text-sm">Vedic Maths</Link></li>
              <li><Link href="/curriculum-aligned" className="text-background/80 hover:text-white transition-colors text-sm">Curriculum-Aligned Classes</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-sans font-semibold tracking-wider text-xs uppercase text-background/50 mb-6">Company</h4>
            <ul className="space-y-4">
              <li><Link href="/about" className="text-background/80 hover:text-white transition-colors text-sm">About Meenakshi Koul</Link></li>
              <li><Link href="/#testimonials" className="text-background/80 hover:text-white transition-colors text-sm">Testimonials</Link></li>
              <li><Link href="/blog" className="text-background/80 hover:text-white transition-colors text-sm">Blog</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-sans font-semibold tracking-wider text-xs uppercase text-background/50 mb-6">Contact</h4>
            <ul className="space-y-4">
              <li>
                <a href="mailto:meenakshi@thevedicschool.com" className="text-background/80 hover:text-white transition-colors text-sm">
                  Email me directly
                </a>
              </li>
              <li>
                <Link href="/contact" className="text-background/80 hover:text-white transition-colors text-sm">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-background/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-background/50">
          <p>© {new Date().getFullYear()} The Vedic School. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-6">
            <Link href="/privacy-policy" className="hover:text-background transition-colors">Privacy Policy</Link>
            <Link href="/terms-of-service" className="hover:text-background transition-colors">Terms of Service</Link>
            <Link href="/cookie-policy" className="hover:text-background transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
