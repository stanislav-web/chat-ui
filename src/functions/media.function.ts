import { MediaConfig } from '@configuration/media.config';
import { type ISnapshot } from '@interfaces/video/i.snapshot';

/**
 * Get user media
 * @return Promise<MediaStream>
 */
export function getUserMedia(): Promise<MediaStream> {
  return navigator.mediaDevices.getUserMedia({
    video: MediaConfig.allowVideo,
    audio: MediaConfig.allowAudio
  })
}

/**
 * Get user media devices
 * @return Promise<MediaDeviceInfo[]>
 */
export function getUserMediaDevices(): Promise<MediaDeviceInfo[]> {
  return getUserMedia().then(() => navigator.mediaDevices.enumerateDevices())
}

/**
 * Get user media devices support properties
 * @return MediaTrackSupportedConstraints
 */
export function getUserMediaConstraints(): MediaTrackSupportedConstraints {
  return navigator.mediaDevices.getSupportedConstraints();
}

/**
 * Capture video snapshot
 * @param {ISnapshot} param
 * @return string
 */
export function captureSnapshot(param: ISnapshot): string {
  if (param.stream !== null) {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d');
    const sourceEl = document.getElementById(param.sourceId) as HTMLVideoElement;
    ctx.canvas.width = param.width;
    ctx.canvas.height = param.height;
    ctx.drawImage(sourceEl, 0, 0, param.width, param.height);
    return canvas.toDataURL('image/png', 1).split(',')[1];
  }
  return '';
}
