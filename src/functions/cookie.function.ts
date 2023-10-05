/**
 * Check if cookie is supported
 * @module functions
 * @return boolean
 */
export const isCookiesSupported = (): boolean => {
  try {
    document.cookie = 'promo=1; SameSite=Lax';
    const cookiesEnabled = document.cookie.includes('promo=');
    document.cookie = 'promo=1; expires=Thu, 01-Jan-1970 00:00:01 GMT; SameSite=Lax';
    return cookiesEnabled;
  } catch (e) {
    return false;
  }
}
