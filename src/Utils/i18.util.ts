import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import translationEN from '../Locales/en.json';
import translationRU from '../Locales/ru.json';
import translationUA from '../Locales/ua.json';

// the translations
const resources = {
  en: {
    translation: translationEN
  },
  ru: {
    translation: translationRU
  },
  ua: {
    translation: translationUA
  }
};

// eslint-disable-next-line import/no-named-as-default-member
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: process.env.REACT_APP_DEBUG === 'true',
    fallbackLng: process.env.REACT_APP_DEFAULT_LANGUAGE as string,
    interpolation: {
      escapeValue: false // not needed for react as it escapes by default
    },
    resources,
    saveMissing: process.env.NODE_ENV as string !== 'production'

  } as any).then();

export default i18n;
