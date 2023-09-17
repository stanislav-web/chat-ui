import { io, type Socket } from 'socket.io-client';
import { WsConfig } from '@configuration/ws.config';

/**
 * Get websocket instance
 * @module functions
 * @return Socket<S, C>
 */
export const getSocketInstance = <S, C>(): Socket<S, C> => io(process.env.REACT_APP_WS_SERVER_URL as string, WsConfig)

/**
 * Emit data to server
 * @module functions
 * @param {Socket} socket
 * @param {<Ev>} event
 * @param {<D>} params
 * @return void
 */
export const emit = <Ev, D>(socket: Socket, event: Ev, params: D): void => {
  socket.emit<Ev>(event, params);
}

/**
 * Emit data to server (volatile)
 * @module functions
 * @param {Socket} socket
 * @param {<Ev>} event
 * @param {<D>} params
 * @return void
 */
export const emitVolatile = <Ev, D>(socket: Socket, event: Ev, params: D): void => {
  socket.volatile.emit<Ev>(event, params);
}

/**
 * Event Listener
 * @module functions
 * @param {Socket} socket
 * @param {<Ev>} event
 * @param {any} callback
 * @return void
 */
export const on = <Ev>(socket: Socket, event: Ev, callback: any): void => {
  socket.on<Ev>(event, callback);
}
