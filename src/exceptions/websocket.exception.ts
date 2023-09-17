/**
 * WebsocketException
 * @module exceptions
 */
export class WebsocketException extends Error {
  /**
   * @param {string} message
   * @param {Error | undefined} [error]
   */
  constructor(message: string, error?: Error) {
    super(message);
    this.name = 'WebSocket';
    this.message = message ?? 'WebSocket error';
    this.stack = error !== undefined ? error.toString() : null;
  }
}
