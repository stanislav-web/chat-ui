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

/**
 * Emit data to server
 * @param {Socket} socket
 * @param event
 * @param params
 */
export function emit<Ev, D>(socket: Socket, event: Ev, params: D): void {
  socket.emit<Ev>(event, params);
}

/**
 * Emit data to server (volatile)
 * @param {Socket} socket
 * @param event
 * @param params
 */
export function emitVolatile<Ev, D>(socket: Socket, event: Ev, params: D): void {
  socket.volatile.emit<Ev>(event, params);
}

/**
 * Emit Listener
 * @param {Socket} socket
 * @param event
 * @param callback
 */
export function on<Ev>(socket: Socket, event: Ev, callback: any): void {
  socket.on<Ev>(event, callback);
}
