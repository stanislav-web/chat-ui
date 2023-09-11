import { notifyError } from '@functions/notification.function';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { type MediaDevicesTypes, MediaTypeError } from '@types/media.type';
import { type ISnapshot } from '@interfaces/video/i.snapshot';

/**
 * Get user medias
 * @param {MediaTrackConstraints | boolean} audio
 * @param {MediaTrackConstraints | boolean} video
 * @throws MediaTypeError
 * @return Promise<MediaStream>
 */
export function getUserMedia(audio: MediaTrackConstraints | boolean = true, video: MediaTrackConstraints | boolean = true): Promise<MediaStream> {
  const constraints: MediaStreamConstraints = {
    audio,
    video
  };

  try {
    return navigator.mediaDevices.getUserMedia(constraints)
  } catch (error: MediaTypeError) {
    notifyError('Media', error.message);
  }
}

/**
 * Get user media devices
 * @param {MediaDevicesTypes | null} type
 * @return Promise<MediaDeviceInfo[]>
 */
export async function getUserMediaDevices(type: MediaDevicesTypes | null): Promise<MediaDeviceInfo[]> {
  const devices = await navigator.mediaDevices.enumerateDevices();
  if (type === null) return devices;
  else return devices.filter(device => device.kind === type)
}

/**
 * Get user media devices support properties
 * @return MediaTrackSupportedConstraints
 */
export function getUserMediaConstraints(): MediaTrackSupportedConstraints {
  return navigator.mediaDevices.getSupportedConstraints();
}

/**
 * Capture video stream
 * @param {HTMLVideoElement} sourceEl
 * @param {ISnapshot} config
 * @param {MediaStream} stream
 * @param {MediaStreamTrack} device
 * @return string
 */
export function captureStream(
  sourceEl: HTMLVideoElement,
  config: ISnapshot,
  stream: MediaStream,
  device: MediaStreamTrack
): string {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d');
  ctx.canvas.width = config?.width | 128;
  ctx.canvas.height = config?.height | 128;
  ctx.drawImage(sourceEl, 0, 0, ctx.canvas.width, ctx.canvas.height);
  return canvas.toDataURL(config.type, config.quality).split(',')[1];
}
