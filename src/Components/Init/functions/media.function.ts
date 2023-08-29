import { MediaConfig } from '../configuration/media.config';

/**
 * Get user media devices
 * @return Promise<MediaDeviceInfo[]>
 */
export function getUserMediaDevices(): Promise<MediaDeviceInfo[]> {
  return navigator.mediaDevices.getUserMedia({
    video: MediaConfig.allowVideo,
    audio: MediaConfig.allowAudio
  }).then(() => navigator.mediaDevices.enumerateDevices())
}

/**
 * Get user media devices support properties
 * @return MediaTrackSupportedConstraints
 */
export function getUserMediaConstraints(): MediaTrackSupportedConstraints {
  return navigator.mediaDevices.getSupportedConstraints();
}
