/**
 *
 */
export const AppConfig = {
  debug: process.env.REACT_APP_DEBUG === 'true',
  environment: process.env.NODE_ENV,
  isDecrypt: process.env.REACT_APP_SENSITIVE_DATA_CRYPT === 'true',
  key: process.env.REACT_APP_DATA_CRYPTO_KEY as string,
  defaultLanguage: process.env.REACT_APP_DEFAULT_LANGUAGE as string,
  languageProperty: 'lang',
  isProduction: process.env.NODE_ENV === 'production',
  isCommandAllowed: process.env.REACT_APP_USER_COMMAND_ALLOWED === 'true',
  isMultiTabAllowed: process.env.REACT_APP_USER_MULTITAB_ALLOWED === 'true',
  routes: {
    index: {
      href: '/',
      title: 'Home'
    },
    about: {
      href: '/about',
      title: 'About'
    },
    agreement: {
      href: '/agreement',
      title: 'Agreement'
    },
    rules: {
      href: '/rules',
      title: 'Rules'
    },
    payments: {
      href: '/payments',
      title: 'Payments'
    },
    notFound: '/*'
  }
}
