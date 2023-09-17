/**
 * MediaTackException
 * @module exceptions
 */
export class MediaTackException extends Error {
  /**
   * @param {string} message
   * @param {Error | undefined} [error]
   */
  constructor(message: string, error?: Error) {
    super(message);
    this.name = 'Media Track';
    this.message = message ?? 'Media Track error';
    this.stack = error !== undefined ? error.toString() : null;
  }
}
