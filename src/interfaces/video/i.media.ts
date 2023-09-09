import { type Socket } from 'socket.io-client';
import { type IESnapshot } from '@interfaces/video/i.snapshot';

export interface IOnLoadedVideoMetadata {
  videoEl: HTMLVideoElement;
}

export interface IOnPlayEvent extends IOnLoadedVideoMetadata {
  stream: MediaStream;
  socket: Socket;
  snapshot: IESnapshot;
  videoTrack: MediaStreamTrack;
}

export interface IOnVolumeChange extends IOnLoadedVideoMetadata {
  videoTrack: MediaStreamTrack;
  socket: Socket;
}
