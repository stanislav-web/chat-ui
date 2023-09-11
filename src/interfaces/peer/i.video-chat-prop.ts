import { type Socket } from 'socket.io-client';

/**
 * IVideoProp interface
 */
export interface IVideoChatProp {
  readonly socket: Socket;
}
