export class UserFingerprintException extends Error {
  constructor(message: string, error: Error) {
    super(message);
    this.name = 'User Fingerprint';
    this.message = message ?? 'User Fingerprint Error';
    this.stack = error.toString();
  }
}
