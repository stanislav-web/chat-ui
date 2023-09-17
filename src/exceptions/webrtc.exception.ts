/**
 * WebRTCException
 * @module exceptions
 */
export class WebRTCException extends Error {
  /**
   * @param {string} message
   * @param {Error | undefined} [error]
   */
  constructor(message: string, error?: Error) {
    super(message);
    this.name = 'WebRTC';
    this.message = message ?? 'WebRTC error';
    this.stack = error !== undefined ? error.toString() : null;
  }
}
