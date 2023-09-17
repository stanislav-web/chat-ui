import { type ManagerOptions } from 'socket.io-client/build/esm/manager';
import { type SocketOptions } from 'socket.io-client/build/esm/socket';
import * as MsgParser from 'socket.io-msgpack-parser';
import { AppConfig } from '@configuration/app.config';

export const WsConfig: Partial<ManagerOptions & SocketOptions> = {
  transports: ['websocket', 'polling', 'webtransport'],
  forceNew: true,
  autoConnect: false,
  reconnection: true,
  ackTimeout: 10000,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 3000,
  requestTimeout: 10000,
  timeout: 10000,
  upgrade: true,
  reconnectionAttempts: 3,
  parser: AppConfig.isProduction && MsgParser,
  path: process.env.REACT_APP_WS_SERVER_PATH as string,
  auth: {
    key: process.env.REACT_APP_WS_SERVER_KEY as string
  },
  withCredentials: true
}
