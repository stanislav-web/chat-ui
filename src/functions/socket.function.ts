import { io, type Socket } from 'socket.io-client';
import { WsConfig } from '@configuration/ws.config';

/**
 * Get websocket instance
 * @module functions
 * @return Socket<S, C>
 */
export const getSocketInstance = <S, C>(): Socket<S, C> => io(process.env.REACT_APP_WS_SERVER_URL as string, WsConfig)
