import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import enTranslations from './translations/en.json';
import esTranslations from './translations/es.json';
import hiTranslations from './translations/hi.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslations },
      es: { translation: esTranslations },
      hi: { translation: hiTranslations }
    },
    lng: "en", // Always start in Spanish
    fallbackLng: "es", // Ensure fallback is also Spanish
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
