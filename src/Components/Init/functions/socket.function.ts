import { io, type Socket } from 'socket.io-client';

/**
 * Get websocket connection
 * @return Socket
 */
export function getSocketConnection(): Socket {
  const socket = io(process.env.REACT_APP_WS_SERVER_URL as string, {
    transports: ['websocket'],
    forceNew: true,
    autoConnect: false,
    reconnectionDelayMax: 3000,
    requestTimeout: 10000,
    timeout: 10000,
    reconnection: true,
    reconnectionAttempts: 3,
    path: process.env.REACT_APP_WS_SERVER_PATH,
    auth: {
      key: process.env.REACT_APP_WS_SERVER_KEY as string
    },
    withCredentials: true
  });
  return socket;
}
