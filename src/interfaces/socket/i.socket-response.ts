import { type Socket } from 'socket.io-client';
import { type DefaultEventsMap } from '@socket.io/component-emitter';

/**
 * UserResponse interface
 */
export interface ISocketResponse {
  readonly socket: Socket;
  readonly connection: Socket<DefaultEventsMap, any>;
}
