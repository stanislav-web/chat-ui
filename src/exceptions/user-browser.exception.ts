export class UserBrowserException extends Error {
  constructor(message: string, error: Error) {
    super(message);
    this.name = 'User Browser';
    this.message = message ?? 'User Browser Error';
    this.stack = error.toString();
  }
}
