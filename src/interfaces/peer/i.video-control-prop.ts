import { type Socket } from 'socket.io-client';

/**
 * IVideoControlProp interface
 */
export interface IVideoControlProp {
  readonly socket: Socket;
  readonly devices: MediaDeviceInfo[] | [] ;
}
