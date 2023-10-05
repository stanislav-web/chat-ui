/**
 * SocketEmit type
 * @type {string|string|string|string|string|string}
 * @const
 */
 type SocketEmitType = 'start' | 'online' | 'mute' | 'offer' | 'answer' | 'candidate';

/**
 * SocketListen type
 * @type {string|string|string|string|string|string}
 * @const
 */
 type SocketListenType = 'next' | 'ban' | 'exception' | 'connect' | 'disconnect' | 'connect_error';

export type {
  SocketEmitType,
  SocketListenType
}
