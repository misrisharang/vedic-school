import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Menu, X } from 'lucide-react';
import { Button } from './Button';
import { cn } from '@/lib/utils';
import wordmarkLogo from '@assets/the-vedic-school-logo.png';
import v25Logo from '@assets/the-vedic-school-logo-v25.png';
import { useDemoModal } from '@/context/DemoModalContext';
import { trackCtaClick } from '@/lib/analytics';

export function Logo({ className }: { className?: string }) {
  return (
    <Link 
      href="/" 
      className={cn(
        'inline-flex items-center gap-2 lg:gap-2.5 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-md transition-opacity hover:opacity-95',
        className
      )}
      aria-label="The Vedic School Homepage"
    >
      <img 
        src={v25Logo} 
        alt="" 
        className="h-7 sm:h-8 md:h-9 lg:h-[39px] w-auto object-contain shrink-0" 
        width={41}
        height={39}
      />
      <img 
        src={wordmarkLogo} 
        alt="The Vedic School" 
        className="h-11 sm:h-12 md:h-14 lg:h-15 w-auto object-contain shrink-0" 
        width={180}
        height={60}
      />
    </Link>
  );
}

export function Navbar() {
  const { openDemoModal } = useDemoModal();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  // Lock body scroll and listen for Escape key when mobile menu is open
  useEffect(() => {
    if (!mobileMenuOpen) {
      document.body.style.overflow = '';
      return () => {};
    }

    document.body.style.overflow = 'hidden';
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Vedic Maths', href: '/vedic-maths' },
    { label: 'Curriculum-Aligned Maths', href: '/curriculum-aligned' },
    { label: 'About', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 bg-white border-b transition-all duration-200',
          isScrolled ? 'border-stone-200/90 shadow-2xs py-3' : 'border-stone-200/70 py-3.5 sm:py-4'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 xl:px-8 flex items-center justify-between">
          {/* Left: Brand Area */}
          <div className="flex items-center shrink-0 min-w-0 xl:min-w-[240px]">
            <Logo />
          </div>

          {/* Center: Main Navigation (Desktop) */}
          <nav 
            className="hidden lg:flex items-center justify-center gap-3.5 xl:gap-7 2xl:gap-8 mx-4 xl:mx-8" 
            aria-label="Main Navigation"
          >
            {navLinks.map((link) => {
              const isActive = link.href === '/' 
                ? location === '/' || location === '' 
                : location === link.href || location.startsWith(link.href + '/');
              return (
                <Link 
                  key={link.label} 
                  href={link.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={cn(
                    'text-[14px] xl:text-[14.5px] font-medium transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-xs',
                    isActive 
                      ? 'text-primary font-semibold' 
                      : 'text-stone-700 hover:text-primary'
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right: Primary CTA & Mobile/Tablet Menu Button */}
          <div className="flex items-center justify-end shrink-0 xl:min-w-[240px] gap-3 sm:gap-4">
            <div className="hidden md:block">
              <Button 
                size="sm" 
                onClick={() => {
                  trackCtaClick('book_free_demo', 'header', 'vedic_maths');
                  openDemoModal();
                }}
                className="bg-primary hover:bg-primary/90 text-white font-medium px-5 py-2.5 rounded-full text-sm shadow-xs hover:shadow-sm transition-all focus-visible:ring-primary"
                aria-label="Book a free demo class"
              >
                Book a free demo class
              </Button>
            </div>

            {/* Mobile / Tablet Menu Toggle */}
            <button 
              type="button"
              className="lg:hidden p-2 -mr-2 text-stone-700 hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg cursor-pointer"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open Navigation Menu"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation-drawer"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile & Tablet Drawer */}
      <div 
        className={cn(
          'fixed inset-0 z-[60] bg-stone-900/40 backdrop-blur-xs transition-opacity duration-300 lg:hidden',
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden={!mobileMenuOpen}
      >
        <div 
          id="mobile-navigation-drawer"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation Menu"
          className={cn(
            'absolute top-0 right-0 bottom-0 w-[85%] max-w-sm bg-white border-l border-stone-200 p-6 shadow-2xl transition-transform duration-300 ease-out flex flex-col',
            mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center pb-5 border-b border-stone-100 mb-6">
            <Logo />
            <button 
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 -mr-2 text-stone-500 hover:text-stone-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg transition-colors cursor-pointer"
              aria-label="Close Navigation Menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <nav className="flex flex-col gap-4 flex-1 overflow-y-auto" aria-label="Mobile Navigation">
            {navLinks.map((link) => {
              const isActive = link.href === '/' 
                ? location === '/' || location === '' 
                : location === link.href || location.startsWith(link.href + '/');
              return (
                <Link 
                  key={link.label} 
                  href={link.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={cn(
                    'text-base font-medium py-2 px-1 transition-colors rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                    isActive 
                      ? 'text-primary font-semibold' 
                      : 'text-stone-700 hover:text-primary'
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
          
          <div className="pt-6 border-t border-stone-100 mt-auto">
            <Button 
              className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 rounded-full text-base shadow-xs"
              onClick={() => {
                trackCtaClick('book_free_demo', 'header', 'vedic_maths');
                setMobileMenuOpen(false);
                openDemoModal();
              }}
            >
              Book a free demo class
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
