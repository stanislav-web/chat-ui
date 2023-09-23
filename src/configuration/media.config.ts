import { type IMediaConfig } from '@interfaces/config/media-config.interface';
import { v4 as uuid } from 'uuid';

export const MediaConfig: IMediaConfig = {
  audio: {
    echoCancellation: true,
    sampleSize: 16,
    channelCount: 1
  },
  video: {
    facingMode: 'user',
    width: { min: 320, max: 640, ideal: 640 },
    height: { min: 240, max: 480, ideal: 480 },
    advanced: [{ frameRate: 30, torch: false }]
  },
  poster: 'assets/noise.gif',
  virtualDevicesRegex: /Virtual|OBS|MeetCam|Soundflower|BlackHole/i,
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
    containerHeight: 500
  },
  remote: {
    containerId: uuid(),
    containerWidth: 500,
    containerHeight: 500
  },
  control: {
    videoSelectorId: uuid(),
    audioSelectorId: uuid(),
    callBtnId: uuid(),
    breakBtnId: uuid(),
    recallBtnId: uuid()
  }
}
