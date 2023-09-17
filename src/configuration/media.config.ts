import { type IMediaConfig } from '@interfaces/config/media-config.interface';
import { v4 as uuid } from 'uuid';

export const MediaConfig: IMediaConfig = {
  audio: {
    echoCancellation: true,
    sampleSize: 16,
    channelCount: 1
  },
  video: {
    advanced: [{ frameRate: 30 }]
  },
  poster: 'assets/noise.gif',
  snapshot: {
    isAllow: true,
    interval: 180000,
    type: 'image/png',
    quality: 0.92,
    width: 64,
    height: 64
  },
  local: {
    containerId: uuid(),
    containerWidth: 500,
    containerHeight: 500,
    useNoise: false
  },
  remote: {
    containerId: uuid(),
    containerWidth: 500,
    containerHeight: 500,
    useNoise: false
  },
  control: {
    videoSelectorId: uuid(),
    audioSelectorId: uuid(),
    callBtnId: uuid(),
    breakBtnId: uuid(),
    recallBtnId: uuid()
  }
}
