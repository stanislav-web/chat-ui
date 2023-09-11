import { type Socket } from 'socket.io-client';

/**
 * IPeerProp interface
 */
export interface IPeerProp {
  readonly socket: Socket;
}
