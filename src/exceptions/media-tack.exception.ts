export class MediaTackException extends Error {
  constructor(message: string, error?: Error) {
    super(message);
    this.name = 'Media Track';
    this.message = message ?? 'Media Track error';
    this.stack = error?.toString();
  }
}
