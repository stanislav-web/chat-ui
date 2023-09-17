/**
 * UserBrowserException
 * @module exceptions
 */
export class UserBrowserException extends Error {
  /**
   * @param {string} message
   * @param {Error | undefined} [error]
   */
  constructor(message: string, error?: Error) {
    super(message);
    this.name = 'User Browser';
    this.message = message ?? 'User Browser Error';
    this.stack = error !== undefined ? error.toString() : null;
  }
}
