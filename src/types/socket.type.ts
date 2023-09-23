/**
 * SocketEmit type
 * @type {string|string|string|string|string|string}
 * @const
 */
 type SocketEmitType = 'start' | 'online' | 'mute' | 'offer' | 'answer' | 'candidate';

/**
 * SocketListen type
 * @type {SocketEmitType|string|string}
 * @const
 */
 type SocketListenType = SocketEmitType | 'ban' | 'exception';

export type {
  SocketEmitType,
  SocketListenType
}
