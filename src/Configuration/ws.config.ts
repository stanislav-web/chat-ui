/* eslint-disable import/no-unresolved */
import { type ManagerOptions } from 'socket.io-client/build/esm/manager';
import { type SocketOptions } from 'socket.io-client/build/esm/socket';

export const WsConfig: Partial<ManagerOptions & SocketOptions> = {
  transports: ['websocket'],
  forceNew: true,
  autoConnect: false,
  reconnectionDelayMax: 3000,
  requestTimeout: 10000,
  timeout: 10000,
  reconnection: true,
  reconnectionAttempts: 3,
  path: process.env.REACT_APP_WS_SERVER_PATH as string,
  auth: {
    key: process.env.REACT_APP_WS_SERVER_KEY as string
  },
  withCredentials: true
}
