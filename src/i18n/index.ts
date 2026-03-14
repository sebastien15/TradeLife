import i18n from 'i18next';
import { initReactI18next, useTranslation } from 'react-i18next';
import en from './locales/en.json';
import rw from './locales/rw.json';
import fr from './locales/fr.json';
import zh from './locales/zh.json';

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v3', // Changed from v4 to avoid Intl.PluralRules requirement
  lng: 'en',
  fallbackLng: 'en',
  resources: {
    en: { translation: en },
    rw: { translation: rw },
    fr: { translation: fr },
    zh: { translation: zh },
  },
  interpolation: {
    escapeValue: false, // React Native handles escaping
  },
});

export default i18n;
export const t = i18n.t.bind(i18n);
export { useTranslation };
