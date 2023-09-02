import { io } from 'socket.io-client';
import DetectRTC from 'detectrtc';
import { WsConfig } from '../Configuration/ws.config';
import { type ISocketResponse } from '../Interfaces';

/**
 * Is WebSockets supported by browser
 * @return boolean
 */
export function isSocketSupported(): boolean {
  return DetectRTC.isWebSocketsSupported
}

/**
 * Get websocket connection
 * @return Socket
 */
export function getSocketConnection(): ISocketResponse {
  const socket = io(process.env.REACT_APP_WS_SERVER_URL as string, WsConfig);
  const connection = socket.connect();
  return { socket, connection }
}
