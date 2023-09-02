import i18n, { type PluginOptions } from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector, { type DetectorOptions } from 'i18next-browser-languagedetector';
import translationEN from '../Locales/en.json';
import translationRU from '../Locales/ru.json';
import translationUA from '../Locales/ua.json';
import {
  type InitOptions
// eslint-disable-next-line import/no-unresolved
} from 'i18next/typescript/options';
import { AppConfig } from '../Configuration/app.config';

const detectionOptions: DetectorOptions = {
  order: ['localStorage'],
  lookupLocalStorage: AppConfig.languageProperty,
  lookupFromPathIndex: 0,
  lookupFromSubdomainIndex: 0,
  caches: ['localStorage'],
  convertDetectedLanguage: 'Iso15897'
};
const intiOptions = {
  debug: AppConfig.debug,
  fallbackLng: AppConfig.defaultLanguage,
  resources: {
    en: {
      translation: translationEN
    },
    ru: {
      translation: translationRU
    },
    ua: {
      translation: translationUA
    }
  },
  cleanCode: true,
  ns: 'Locales',
  saveMissing: AppConfig.environment !== 'production',
  returnDetails: AppConfig.environment !== 'production',
  interpolation: {
    escapeValue: false
  },
  react: {
    nsMode: 'default'
  },
  detection: detectionOptions
} as InitOptions & PluginOptions<any>;

// eslint-disable-next-line import/no-named-as-default-member
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init(intiOptions).then();

export default i18n;
