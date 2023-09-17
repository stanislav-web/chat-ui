/**
 * Check if cookie is supported
 * @module functions
 * @return boolean
 */
export const isCookiesSupported = (): boolean => {
  try {
    document.cookie = 'test=1';
    const cookiesEnabled = document.cookie.includes('test=');
    document.cookie = 'test=1; expires=Thu, 01-Jan-1970 00:00:01 GMT';
    return cookiesEnabled;
  } catch (e) {
    return false;
  }
}
