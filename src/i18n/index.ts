import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import language files
import en from './locales/en.json';
import fr from './locales/fr.json';
import ar from './locales/ar.json';
import de from './locales/de.json';
import ru from './locales/ru.json';
import zh from './locales/zh.json';
import ja from './locales/ja.json';
import el from './locales/el.json';
import es from './locales/es.json';
import hi from './locales/hi.json';

// Language configuration
export const languages = {
  en: { name: 'English', nativeName: 'English', flag: '🇺🇸', rtl: false },
  fr: { name: 'French', nativeName: 'Français', flag: '🇫🇷', rtl: false },
  ar: { name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', rtl: true },
  de: { name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', rtl: false },
  ru: { name: 'Russian', nativeName: 'Русский', flag: '🇷🇺', rtl: false },
  zh: { name: 'Chinese', nativeName: '中文', flag: '🇨🇳', rtl: false },
  ja: { name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', rtl: false },
  el: { name: 'Greek', nativeName: 'Ελληνικά', flag: '🇬🇷', rtl: false },
  es: { name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', rtl: false },
  hi: { name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', rtl: true },
};

// RTL languages
export const RTL_LANGUAGES = ['ar', 'hi'];

// Check if a language is RTL
export const isRTL = (languageCode: string): boolean => {
  return RTL_LANGUAGES.includes(languageCode);
};

// Get device language with fallback
const getDeviceLanguage = (): string => {
  const deviceLocales = Localization.getLocales();
  const deviceLocale = deviceLocales[0]?.languageCode || 'en';
  return Object.keys(languages).includes(deviceLocale) ? deviceLocale : 'en';
};

// Storage functions
const LANGUAGE_STORAGE_KEY = 'app_language';

export const saveLanguage = async (languageCode: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, languageCode);
  } catch (error) {
    console.error('Error saving language:', error);
  }
};

export const getStoredLanguage = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
  } catch (error) {
    console.error('Error getting stored language:', error);
    return null;
  }
};

// Initialize i18n
const initI18n = async () => {
  const storedLanguage = await getStoredLanguage();
  const initialLanguage = storedLanguage || getDeviceLanguage();

  await i18n
    .use(initReactI18next)
    .init({
      compatibilityJSON: 'v4',
      resources: {
        en: { translation: en },
        fr: { translation: fr },
        ar: { translation: ar },
        de: { translation: de },
        ru: { translation: ru },
        zh: { translation: zh },
        ja: { translation: ja },
        el: { translation: el },
        es: { translation: es },
        hi: { translation: hi },
      },
      lng: initialLanguage,
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false,
      },
    });
};

// Change language function
export const changeLanguage = async (languageCode: string): Promise<void> => {
  await i18n.changeLanguage(languageCode);
  await saveLanguage(languageCode);
  
  // Don't force RTL here - we'll handle it dynamically in components
  // I18nManager.forceRTL(isRTL(languageCode));
};

// Get current language info
export const getCurrentLanguageInfo = () => {
  const currentLang = i18n.language;
  return {
    code: currentLang,
    ...languages[currentLang as keyof typeof languages],
  };
};

// Initialize on import
initI18n();

export default i18n;
