import { type MediaConfigInterface } from '@interfaces/config/media-config.interface';

export const MediaConfig: MediaConfigInterface = {
  audio: {
    echoCancellation: true,
    noiseSuppression: true
  },
  video: {
    displaySurface: 'browser',
    facingMode: 'user',
    frameRate: 30,
    noiseSuppression: true
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
    containerId: 'local-video',
    containerWidth: 500,
    containerHeight: 500,
    useNoise: false
  },
  remote: {
    containerId: 'remote-video',
    containerWidth: 500,
    containerHeight: 500,
    useNoise: false
  }
}
