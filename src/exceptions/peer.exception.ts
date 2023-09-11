export class PeerException extends Error {
  constructor(message: string, error: Error) {
    super(message);
    this.name = 'Peer';
    this.message = message ?? 'Peer error';
    this.stack = error.toString();
  }
}
