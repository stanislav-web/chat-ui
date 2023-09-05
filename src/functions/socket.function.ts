import { io } from 'socket.io-client';
import { WsConfig } from '@configuration/ws.config';
import { type ISocketResponse } from '@interfaces/socket/i.socket-response';

/**
 * Get websocket connection
 * @return Socket
 */
export function getSocketConnection(): ISocketResponse {
  const socket = io(process.env.REACT_APP_WS_SERVER_URL as string, WsConfig);
  const connection = socket.connect();
  return { socket, connection }
}
