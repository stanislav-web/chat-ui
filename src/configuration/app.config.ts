export const AppConfig = {
  debug: process.env.REACT_APP_DEBUG === 'true',
  environment: process.env.NODE_ENV,
  defaultLanguage: process.env.REACT_APP_DEFAULT_LANGUAGE as string,
  languageProperty: 'lang',
  isProduction: process.env.NODE_ENV === 'production',
  isCommandEnabled: process.env.NODE_ENV !== 'production'
}
