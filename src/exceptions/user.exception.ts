/**
 * UserException
 * @module exceptions
 */
export class UserException extends Error {
  /**
   * @param {string} message
   * @param {Error | undefined} [error]
   */
  constructor(message: string, error?: Error) {
    super(message);
    this.name = 'User';
    this.message = message ?? 'User Error';
    this.stack = error !== undefined ? error.toString() : null;
  }
}
