// i.media.d.ts

import { type Socket } from 'socket.io-client';
import { type IESnapshot } from '@interfaces/media/i.snapshot';

/**
 * On video load
 * @typedef IOnLoadedVideoMetadata On load video
 * @module interfaces/media
 * @prop {HTMLVideoElement} videoElement
 */
export interface IOnLoadedVideoMetadata {
  videoElement: HTMLVideoElement;
}

/**
 * On video play
 * @typedef IOnPlayEvent
 * @module interfaces/media
 * @extends IOnLoadedVideoMetadata
 * @prop {MediaStream} stream
 * @prop {Socket} socket
 * @prop {IESnapshot} snapshot
 */
export interface IOnPlayEvent extends IOnLoadedVideoMetadata {
  stream: MediaStream;
  socket: Socket;
  snapshot: IESnapshot;
}

/**
 * On media volume change
 * @typedef IOnVolumeChange
 * @module interfaces/media
 * @extends IOnLoadedVideoMetadata
 * @prop {MediaStream} stream
 * @prop {Socket} socket
 */
export interface IOnVolumeChange extends IOnLoadedVideoMetadata {
  stream: MediaStream;
  socket: Socket;
}
