import i18n, { type PluginOptions } from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector, { type DetectorOptions } from 'i18next-browser-languagedetector';

import * as translationEN from '@locales/en';
import * as translationRU from '@locales/ru';
import * as translationUA from '@locales/ua';

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
    en: translationEN,
    ru: translationRU,
    ua: translationUA
  },
  cleanCode: true,
  defaultNS: 'Base',
  keySeparator: '.',
  interpolation: {
    escapeValue: false
  },
  react: {
    useSuspense: true
  },
  detection: detectionOptions
} as InitOptions & PluginOptions<any>;

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init(intiOptions);

export default i18n;
