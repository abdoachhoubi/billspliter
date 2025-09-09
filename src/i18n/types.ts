export interface LanguageInfo {
  name: string;
  nativeName: string;
  flag: string;
  rtl: boolean;
}

export interface CurrentLanguageInfo extends LanguageInfo {
  code: string;
}

export type SupportedLanguage = 'en' | 'fr' | 'ar' | 'de' | 'ru' | 'zh' | 'ja' | 'el' | 'es' | 'hi';

export interface TranslationKeys {
  common: {
    hello: string;
    welcome: string;
    language: string;
    settings: string;
    back: string;
    save: string;
    cancel: string;
    ok: string;
    yes: string;
    no: string;
  };
  app: {
    title: string;
  };
  language_settings: {
    title: string;
    select_language: string;
    current_language: string;
  };
}
