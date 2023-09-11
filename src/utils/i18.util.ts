import i18n, { type PluginOptions } from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector, { type DetectorOptions } from 'i18next-browser-languagedetector';
import translationEN from '@locales/en.json';
import translationRU from '@locales/ru.json';
import translationUA from '@locales/ua.json';
import {
  type InitOptions
} from 'i18next/typescript/options';
import { AppConfig } from '@configuration/app.config';

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
  ns: 'locales',
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

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init(intiOptions).then();

export default i18n;
