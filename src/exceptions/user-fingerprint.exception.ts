/**
 * UserFingerprintException
 * @module exceptions
 */
export class UserFingerprintException extends Error {
  /**
   * @param {string} message
   * @param {Error | undefined} [error]
   */
  constructor(message: string, error?: Error) {
    super(message);
    this.name = 'User Fingerprint';
    this.message = message ?? 'User Fingerprint Error';
    this.stack = error !== undefined ? error.toString() : null;
  }
}
