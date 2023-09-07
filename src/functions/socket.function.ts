import { io, type Socket } from 'socket.io-client';
import { WsConfig } from '@configuration/ws.config';

/**
 * Get websocket instance
 * @return Socket<S, C>
 */
export function getSocketInstance<S, C>(): Socket<S, C> {
  let socket: Socket<S, C>;
  // eslint-disable-next-line prefer-const
  socket = io(process.env.REACT_APP_WS_SERVER_URL as string, WsConfig);
  return socket;
}
