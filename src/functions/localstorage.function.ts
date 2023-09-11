/**
 * Save an item to localStorage
 * @param {string} key
 * @param {object} value
 * @return void
 */
export function setItem(key: string, value: object | string | number | boolean): void {
  localStorage.setItem(key, JSON.stringify({ value }));
}

/**
 * Get an item from localStorage
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
 * @param {string} key
 * @return void
 */
export function removeItem(key: string): void {
  localStorage.removeItem(key);
}
