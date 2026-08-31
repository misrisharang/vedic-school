import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Menu, X } from 'lucide-react';
import { Button } from './Button';
import { cn } from '@/lib/utils';
import logoImg from '@assets/ChatGPT_Image_Jul_22,_2026,_06_12_07_PM_(1)_1786009245523.png';

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-3 group">
      <img src={logoImg} alt="The Vedic School" className="h-10 w-auto" />
    </Link>
  );
}

export function Navbar() {
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

  const navLinks = [
    { label: 'Vedic Maths', href: '/vedic-maths' },
    { label: 'Curriculum-Aligned Classes', href: '/curriculum-aligned' },
    { label: 'About', href: '/about' },
    { label: 'Blog', href: '#' },
    { label: 'Contact', href: '#contact' },
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
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.label} 
                href={link.href}
                className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:block">
            <Button size="sm">Book a free demo class</Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="lg:hidden p-2 text-foreground"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open Menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div 
        className={cn(
          'fixed inset-0 z-[60] bg-background/95 backdrop-blur-sm transition-opacity duration-300 lg:hidden',
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
      >
        <div 
          className={cn(
            'absolute top-0 right-0 bottom-0 w-[85%] max-w-sm bg-background border-l border-border p-6 shadow-2xl transition-transform duration-300 ease-out flex flex-col',
            mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          )}
        >
          <div className="flex justify-between items-center mb-8">
            <Logo />
            <button 
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 text-foreground/70 hover:text-foreground"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <nav className="flex flex-col gap-6 flex-1">
            {navLinks.map((link) => (
              <Link 
                key={link.label} 
                href={link.href}
                className="text-lg font-medium text-foreground hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          
          <div className="pt-6 border-t border-border mt-auto">
            <Button className="w-full">Book a free demo class</Button>
          </div>
        </div>
      </div>
    </>
  );
}
