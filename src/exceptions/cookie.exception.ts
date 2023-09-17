/**
 * CookieException
 * @module exceptions
 */
export class CookieException extends Error {
  /**
   * @param {string} message
   * @param {Error | undefined} [error]
   */
  constructor(message: string, error?: Error) {
    super(message);
    this.name = 'Cookie';
    this.message = message ?? 'Cookie error';
    this.stack = error !== undefined ? error.toString() : null;
  }
}
