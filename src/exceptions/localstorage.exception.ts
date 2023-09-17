/**
 * LocalstorageException
 * @module exceptions
 */
export class LocalstorageException extends Error {
  /**
   * @param {string} message
   * @param {Error | undefined} [error]
   */
  constructor(message: string, error?: Error) {
    super(message);
    this.name = 'LocalStorage';
    this.message = message ?? 'LocalStorage error';
    this.stack = error !== undefined ? error.toString() : null;
  }
}
