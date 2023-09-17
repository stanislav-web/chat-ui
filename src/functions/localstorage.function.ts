/**
 * Check if localStorage is supported
 * @module functions
 * @return boolean
 */
export const isLocalStorageSupported = (): boolean => {
  try {
    return 'localStorage' in window && window.localStorage !== null;
  } catch (e) {
    return false;
  }
}

/**
 * Save an item to localStorage
 * @module functions
 * @param {string} key
 * @param {object | string | number | boolean} value
 * @return void
 */
export const setItem = <T>(key: T, value: object | string | number | boolean): void => {
  localStorage.setItem(key, JSON.stringify({ value }));
}

/**
 * Get an item from localStorage
 * @module functions
 * @param {string} key
 * @return any
 */
export function getItem<T>(key: string): T | null;
export function getItem<T>(key: string): T | string | null {
  const data: string | null = localStorage.getItem(key);
  if (data) {
    try {
      return JSON.parse(data).value;
    } catch (e) {
      return data;
    }
  }
  return null;
}

/**
 * Remove an item from localStorage
 * @module functions
 * @param {string} key
 * @return void
 */
export const removeItem = (key: string): void => {
  localStorage.removeItem(key);
}
