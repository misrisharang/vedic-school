import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Menu, X } from 'lucide-react';
import { Button } from './Button';
import { cn } from '@/lib/utils';
import logoImg from '@assets/ChatGPT_Image_Jul_22,_2026,_06_12_07_PM_(1)_1786009245523.png';

import { useDemoModal } from '@/context/DemoModalContext';

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-3 group">
      <img src={logoImg} alt="" className="h-10 w-auto" />
      <span className="font-serif text-base sm:text-lg md:text-xl text-foreground leading-none whitespace-nowrap">
        The Vedic School
      </span>
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
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Vedic Maths', href: '/vedic-maths' },
    { label: 'Curriculum-Aligned Classes', href: '/curriculum-aligned' },
    { label: 'About', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent',
          isScrolled ? 'bg-background/95 backdrop-blur-md border-border py-3 shadow-sm' : 'bg-transparent py-5'
        )}
      >
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
          <Logo />

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const isActive = link.href === '/' ? location === '/' || location === '' : location === link.href;
              return (
                <Link 
                  key={link.label} 
                  href={link.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={cn(
                    'text-sm font-medium transition-colors',
                    isActive ? 'text-primary font-semibold' : 'text-foreground/80 hover:text-primary'
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden lg:block">
            <Button size="sm" onClick={openDemoModal}>Book a free demo class</Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="lg:hidden p-2 text-foreground focus:outline-hidden"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open Menu"
            aria-expanded={mobileMenuOpen}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div 
        className={cn(
          'fixed inset-0 z-[60] bg-foreground/30 backdrop-blur-xs transition-opacity duration-300 lg:hidden',
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        onClick={() => setMobileMenuOpen(false)}
      >
        <div 
          className={cn(
            'absolute top-0 right-0 bottom-0 w-[85%] max-w-sm bg-background border-l border-border p-6 shadow-2xl transition-transform duration-300 ease-out flex flex-col',
            mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-8">
            <Logo />
            <button 
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 text-foreground/70 hover:text-foreground"
              aria-label="Close Menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <nav className="flex flex-col gap-6 flex-1" aria-label="Mobile Navigation">
            {navLinks.map((link) => {
              const isActive = link.href === '/' ? location === '/' || location === '' : location === link.href;
              return (
                <Link 
                  key={link.label} 
                  href={link.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={cn(
                    'text-lg font-medium transition-colors',
                    isActive ? 'text-primary font-semibold' : 'text-foreground hover:text-primary'
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
          
          <div className="pt-6 border-t border-border mt-auto">
            <Button 
              className="w-full"
              onClick={() => {
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
