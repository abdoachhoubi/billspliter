import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import { I18nManager } from 'react-native';

// Import types for TypeScript support
import './types';

// Import translation files
import en from './locales/en.json';
import es from './locales/es.json';
import fr from './locales/fr.json';
import ar from './locales/ar.json';
import de from './locales/de.json';
import ru from './locales/ru.json';
import zh from './locales/zh.json';
import ja from './locales/ja.json';
import el from './locales/el.json';
import hi from './locales/hi.json';

// Get device locale with better fallback handling
const getDeviceLanguage = () => {
  try {
    const locales = Localization.getLocales();
    if (locales && locales.length > 0) {
      const deviceLocale = locales[0];
      const languageCode = deviceLocale.languageCode?.toLowerCase();
      
      // Check if we support the exact language code
      const supportedLanguages = ['en', 'es', 'fr', 'ar', 'de', 'ru', 'zh', 'ja', 'el', 'hi'];
      if (languageCode && supportedLanguages.includes(languageCode)) {
        return languageCode;
      }
      
      // Handle special cases for language variants
      if (languageCode) {
        // Chinese variants
        if (languageCode.startsWith('zh')) {
          return 'zh';
        }
        // English variants
        if (languageCode.startsWith('en')) {
          return 'en';
        }
        // Spanish variants
        if (languageCode.startsWith('es')) {
          return 'es';
        }
        // French variants
        if (languageCode.startsWith('fr')) {
          return 'fr';
        }
        // German variants
        if (languageCode.startsWith('de')) {
          return 'de';
        }
        // Arabic variants
        if (languageCode.startsWith('ar')) {
          return 'ar';
        }
        // Russian variants
        if (languageCode.startsWith('ru')) {
          return 'ru';
        }
        // Japanese variants
        if (languageCode.startsWith('ja')) {
          return 'ja';
        }
        // Greek variants
        if (languageCode.startsWith('el')) {
          return 'el';
        }
        // Hindi variants
        if (languageCode.startsWith('hi')) {
          return 'hi';
        }
      }
    }
  } catch (error) {
    console.log('Error detecting device language:', error);
  }
  
  // Fallback to English
  return 'en';
};

// Translation resources
const resources = {
  en: {
    translation: en,
  },
  es: {
    translation: es,
  },
  fr: {
    translation: fr,
  },
  ar: {
    translation: ar,
  },
  de: {
    translation: de,
  },
  ru: {
    translation: ru,
  },
  zh: {
    translation: zh,
  },
  ja: {
    translation: ja,
  },
  el: {
    translation: el,
  },
  hi: {
    translation: hi,
  },
};

// RTL language codes
const RTL_LANGUAGES = ['ar', 'he', 'fa'];

// Helper function to check if a language is RTL
export const isRTL = (languageCode: string): boolean => {
  return RTL_LANGUAGES.includes(languageCode);
};

// Helper function to set RTL layout
export const setRTLLayout = (languageCode: string) => {
  const shouldBeRTL = isRTL(languageCode);
  if (I18nManager.isRTL !== shouldBeRTL) {
    I18nManager.allowRTL(shouldBeRTL);
    I18nManager.forceRTL(shouldBeRTL);
  }
};

// Initialize i18next
i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getDeviceLanguage(), // Use device language
    fallbackLng: 'en', // Fallback to English if device language not supported
    
    // Namespace configuration
    defaultNS: 'translation',
    ns: ['translation'],
    
    // Interpolation configuration
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    
    // React configuration
    react: {
      useSuspense: false, // Disable suspense for React Native
    },
    
    // Debug mode (disable in production)
    debug: __DEV__,
    
    // Compatibility settings
    compatibilityJSON: 'v4',
  });

export default i18n;
