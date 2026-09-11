import React, { createContext, useContext, useState, useCallback } from 'react';

interface RegistrationModalContextType {
  // Sunday Demo Modal
  isOpen: boolean; // Alias to isDemoOpen for backwards compatibility
  isDemoOpen: boolean;
  openDemoModal: () => void;
  closeDemoModal: () => void;

  // Personal Assessment Modal
  isAssessmentOpen: boolean;
  openAssessmentModal: () => void;
  closeAssessmentModal: () => void;
}

const RegistrationModalContext = createContext<RegistrationModalContextType | undefined>(undefined);

export function DemoModalProvider({ children }: { children: React.ReactNode }) {
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [isAssessmentOpen, setIsAssessmentOpen] = useState(false);

  const openDemoModal = useCallback(() => {
    setIsDemoOpen(true);
  }, []);

  const closeDemoModal = useCallback(() => {
    setIsDemoOpen(false);
  }, []);

  const openAssessmentModal = useCallback(() => {
    setIsAssessmentOpen(true);
  }, []);

  const closeAssessmentModal = useCallback(() => {
    setIsAssessmentOpen(false);
  }, []);

  return (
    <RegistrationModalContext.Provider
      value={{
        isOpen: isDemoOpen,
        isDemoOpen,
        openDemoModal,
        closeDemoModal,
        isAssessmentOpen,
        openAssessmentModal,
        closeAssessmentModal,
      }}
    >
      {children}
    </RegistrationModalContext.Provider>
  );
}

// Backwards-compatible hook for existing Sunday Demo callers
export function useDemoModal() {
  const context = useContext(RegistrationModalContext);
  if (!context) {
    throw new Error('useDemoModal must be used within a DemoModalProvider');
  }
  return context;
}

// Hook alias for components invoking both or assessment modal
export function useAssessmentModal() {
  const context = useContext(RegistrationModalContext);
  if (!context) {
    throw new Error('useAssessmentModal must be used within a DemoModalProvider');
  }
  return context;
}

export function useRegistrationModal() {
  const context = useContext(RegistrationModalContext);
  if (!context) {
    throw new Error('useRegistrationModal must be used within a DemoModalProvider');
  }
  return context;
}
