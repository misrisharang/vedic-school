import React, { useState, useCallback } from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const STORAGE_KEY = 'tvs_announcement_bar_dismissed';

export function Layout({ children }: LayoutProps) {
  const [isBarDismissed, setIsBarDismissed] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      try {
        return sessionStorage.getItem(STORAGE_KEY) === 'true';
      } catch (e) {
        return false;
      }
    }
    return false;
  });

  const handleDismissBar = useCallback(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, 'true');
    } catch (e) {}
    setIsBarDismissed(true);
  }, []);

  return (
    <div className="flex flex-col min-h-[100dvh] w-full min-w-0">
      <Navbar isBarDismissed={isBarDismissed} onDismissBar={handleDismissBar} />
      <main 
        className="flex-1 w-full min-w-0 transition-[padding-top] duration-200"
        style={{ paddingTop: isBarDismissed ? '0px' : 'var(--announcement-bar-height, 0px)' }}
      >
        {children}
      </main>
      <Footer />
    </div>
  );
}
