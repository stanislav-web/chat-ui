/**
 * SocketEmitType
 */
export type SocketEmitType = 'online' | 'mute' | 'offer' | 'answer' | 'candidate';

/**
 * SocketListenType
 */
export type SocketListenType = SocketEmitType | 'ban' | 'exception';
