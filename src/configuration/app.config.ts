export const AppConfig = {
  debug: process.env.REACT_APP_DEBUG === 'true',
  environment: process.env.NODE_ENV,
  defaultLanguage: process.env.REACT_APP_DEFAULT_LANGUAGE as string,
  languageProperty: 'lang',
  isProduction: process.env.NODE_ENV === 'production',
  isCommandAllowed: process.env.REACT_APP_USER_COMMAND_ALLOWED === 'true',
  isMultiTabAllowed: process.env.REACT_APP_USER_MULTITAB_ALLOWED === 'true'
}
