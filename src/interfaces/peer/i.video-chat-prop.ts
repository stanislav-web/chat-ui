import { type Socket } from 'socket.io-client';

/**
 * IVideoChatProp interface
 */
export interface IVideoChatProp {
  readonly socket: Socket;
}
