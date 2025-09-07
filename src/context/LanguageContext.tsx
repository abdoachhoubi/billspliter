import React, { createContext, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { I18nManager } from 'react-native';
import * as Localization from 'expo-localization';
import * as SecureStore from 'expo-secure-store';
import { isRTL, setRTLLayout } from '../i18n/index';

interface LanguageContextType {
  currentLanguage: string;
  availableLanguages: { code: string; name: string; nativeName: string; isRTL?: boolean }[];
  changeLanguage: (languageCode: string) => Promise<void>;
  isLoading: boolean;
  isCurrentLanguageRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: React.ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);
  const [isLoading, setIsLoading] = useState(true);

  const availableLanguages = [
    { code: 'en', name: 'English', nativeName: 'English', isRTL: false },
    { code: 'es', name: 'Spanish', nativeName: 'Español', isRTL: false },
    { code: 'fr', name: 'French', nativeName: 'Français', isRTL: false },
    { code: 'ar', name: 'Arabic', nativeName: 'العربية', isRTL: true },
    { code: 'de', name: 'German', nativeName: 'Deutsch', isRTL: false },
    { code: 'ru', name: 'Russian', nativeName: 'Русский', isRTL: false },
    { code: 'zh', name: 'Chinese', nativeName: '中文', isRTL: false },
    { code: 'ja', name: 'Japanese', nativeName: '日本語', isRTL: false },
    { code: 'el', name: 'Greek', nativeName: 'Ελληνικά', isRTL: false },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', isRTL: false },
  ];

  useEffect(() => {
    loadSavedLanguage();
  }, []);

  const loadSavedLanguage = async () => {
    try {
      const savedLanguage = await SecureStore.getItemAsync('app-language');
      if (savedLanguage && availableLanguages.some(lang => lang.code === savedLanguage)) {
        await i18n.changeLanguage(savedLanguage);
        setCurrentLanguage(savedLanguage);
      } else {
        // Use device language if supported, otherwise default to English
        const deviceLanguage = Localization.getLocales()[0].languageCode;
        const supportedLanguage = availableLanguages.find(lang => lang.code === deviceLanguage);
        const languageToUse = supportedLanguage?.code || 'en';
        
        await i18n.changeLanguage(languageToUse);
        setCurrentLanguage(languageToUse);
        setRTLLayout(languageToUse);
        await SecureStore.setItemAsync('app-language', languageToUse);
      }
    } catch (error) {
      console.log('Error loading language:', error);
      // Fallback to English
      await i18n.changeLanguage('en');
      setCurrentLanguage('en');
    } finally {
      setIsLoading(false);
    }
  };

  const changeLanguage = async (languageCode: string) => {
    try {
      setIsLoading(true);
      await i18n.changeLanguage(languageCode);
      setCurrentLanguage(languageCode);
      setRTLLayout(languageCode);
      await SecureStore.setItemAsync('app-language', languageCode);
    } catch (error) {
      console.log('Error changing language:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const isCurrentLanguageRTL = isRTL(currentLanguage);

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        availableLanguages,
        changeLanguage,
        isLoading,
        isCurrentLanguageRTL,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};
