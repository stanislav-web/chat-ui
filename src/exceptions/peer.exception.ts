/**
 * PeerException
 * @module exceptions
 */
export class PeerException extends Error {
  /**
   * @param {string} message
   * @param {Error | undefined} [error]
   */
  constructor(message: string, error?: Error) {
    super(message);
    this.name = 'Peer';
    this.message = message ?? 'Peer error';
    this.stack = error !== undefined ? error.toString() : null;
  }
}
