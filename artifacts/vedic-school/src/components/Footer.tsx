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
              106 – The Cedar Estate, <br />
              Golf Course Road, Sector 54, <br />
              Gurugram, Haryana
            </p>
            <div className="mt-6 flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center text-background/80 hover:bg-primary hover:text-white transition-all">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center text-background/80 hover:bg-primary hover:text-white transition-all">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center text-background/80 hover:bg-primary hover:text-white transition-all">
                <Youtube className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center text-background/80 hover:bg-primary hover:text-white transition-all">
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
              <li><Link href="/about" className="text-background/80 hover:text-white transition-colors text-sm">About Meenakshi</Link></li>
              <li><Link href="/#testimonials" className="text-background/80 hover:text-white transition-colors text-sm">Testimonials</Link></li>
              <li><Link href="#" className="text-background/80 hover:text-white transition-colors text-sm">Blog</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-sans font-semibold tracking-wider text-xs uppercase text-background/50 mb-6">Contact</h4>
            <ul className="space-y-4">
              <li>
                <a href="#" className="text-background/80 hover:text-white transition-colors text-sm flex items-center gap-2">
                  Message on WhatsApp
                </a>
              </li>
              <li>
                <a href="#" className="text-background/80 hover:text-white transition-colors text-sm flex items-center gap-2">
                  Email me directly
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-background/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-background/50">
          <p>© {new Date().getFullYear()} The Vedic School. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-background transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-background transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
