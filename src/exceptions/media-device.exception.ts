/**
 * MediaDeviceException
 * @module exceptions
 */
export class MediaDeviceException extends Error {
  /**
   * @param {string} message
   * @param {Error | undefined} [error]
   */
  constructor(message: string, error?: Error) {
    super(message);
    this.name = 'Media Device';
    this.message = message ?? 'Media Device error';
    this.stack = error !== undefined ? error.toString() : null;
  }
}
