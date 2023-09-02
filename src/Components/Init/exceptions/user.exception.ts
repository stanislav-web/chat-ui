export class UserAccountException extends Error {
  constructor(message: string, error: any) {
    super(message);
    this.name = 'User Account';
    this.message = message ?? 'User Account Error';
    this.stack = error.toString();
  }
}

export class UserFingerprintException extends Error {
  constructor(message: string, error: any) {
    super(message);
    this.name = 'User Fingerprint';
    this.message = message ?? 'User Fingerprint Error';
    this.stack = error.toString();
  }
}

export class UserBrowserException extends Error {
  constructor(message: string, error: any) {
    super(message);
    this.name = 'User Browser';
    this.message = message ?? 'User Browser Error';
    this.stack = error.toString();
  }
}
