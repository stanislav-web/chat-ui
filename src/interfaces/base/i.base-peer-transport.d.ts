// i.base-peer-transport.d.ts
import { type Socket } from 'socket.io-client';

/**
 * @typedef IBasePeerTransport
 * @module interfaces/base Peer transport
 * @property {Socket} stream
 */
export interface IBasePeerTransport {
  readonly socket: Socket;
}
