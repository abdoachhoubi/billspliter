import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { getCurrentLanguageInfo, isRTL } from '../i18n';

interface LanguageContextType {
  currentLanguage: any;
  isCurrentRTL: boolean;
  refreshLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(getCurrentLanguageInfo());
  const [isCurrentRTL, setIsCurrentRTL] = useState(isRTL(getCurrentLanguageInfo().code));

  const refreshLanguage = () => {
    const newLanguage = getCurrentLanguageInfo();
    setCurrentLanguage(newLanguage);
    setIsCurrentRTL(isRTL(newLanguage.code));
  };

  useEffect(() => {
    // Listen for language changes
    const handleLanguageChange = () => {
      refreshLanguage();
    };

    i18n.on('languageChanged', handleLanguageChange);

    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);

  return (
    <LanguageContext.Provider value={{ currentLanguage, isCurrentRTL, refreshLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
