import { type MediaDevicesTypes } from '@types/media.type';
import { type ISnapshot } from '@interfaces/video/i.snapshot';
import { type Base64String } from '@types/base.type';
import { type IMediaConfig } from '@interfaces/config/media-config.interface';
import { MediaDeviceException } from '@exceptions/media-device.exception';
import { MediaConfig } from '@configuration/media.config';

/**
 * Get user media
 * @module functions
 * @param {MediaTrackConstraints | boolean} audio
 * @param {MediaTrackConstraints | boolean} video
 * @return Promise<MediaStream>
 */
export const getUserMedia = (
  audio: MediaTrackConstraints | boolean = true,
  video: MediaTrackConstraints | boolean = true
): Promise<MediaStream> => {
  const constraints: MediaStreamConstraints = {
    audio,
    video
  };
  return navigator.mediaDevices.getUserMedia(constraints)
}

/**
 * Get user devices
 * @module functions
 * @param {MediaDevicesTypes} type
 * @throws MediaDeviceException
 * @return Promise<MediaDeviceInfo[]>
 */
export const getUserDevices = async (type?: MediaDevicesTypes): Promise<MediaDeviceInfo[]> => {
  const enumerateDevices = await navigator.mediaDevices.enumerateDevices();
  if (enumerateDevices.length < 1) {
    throw new MediaDeviceException('No devices found');
  }
  if (!type) return enumerateDevices;
  return filterUserDevicesByType(enumerateDevices, type);
}

/**
 * Filter user media devices by type
 * @module functions
 * @param {MediaDeviceInfo[]} devices
 * @param {MediaDevicesTypes} type
 * @return MediaDeviceInfo[]
 */
export const filterUserDevicesByType = (
  devices: MediaDeviceInfo[],
  type: MediaDevicesTypes
): MediaDeviceInfo[] => devices.filter(device => device.kind === type)

/**
 * Find selected user media device by label
 * @module functions
 * @param {MediaDeviceInfo[]} devices
 * @param {string} label
 * @return MediaDeviceInfo | undefined
 */
export const findUserDeviceByLabel = (
  devices: MediaDeviceInfo[],
  label: string
): MediaDeviceInfo | undefined => devices.find(device => device.label === label)

/**
 * Get user media devices support properties
 * @module functions
 * @return MediaTrackSupportedConstraints
 */
export const getUserMediaConstraints = (): MediaTrackSupportedConstraints => navigator.mediaDevices.getSupportedConstraints()

/**
 * Capture video stream
 * @module functions
 * @param {HTMLVideoElement} sourceEl
 * @param {ISnapshot} config
 * @return Base64String
 */
export const captureStream = (
  sourceEl: HTMLVideoElement,
  config: ISnapshot
): Base64String => {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d');
  ctx.canvas.width = config?.width | 128;
  ctx.canvas.height = config?.height | 128;
  ctx.drawImage(sourceEl, 0, 0, ctx.canvas.width, ctx.canvas.height);
  return canvas.toDataURL(config.type, config.quality).split(',')[1];
}

/**
 * Attach audio output device to video element using device/sink ID.
 * @module functions
 * @param {HTMLMediaElement} element
 * @throws MediaDeviceException
 * @param {string} sinkId
 * @return Promise<undefined>
 */
export function attachSinkId(element: HTMLMediaElement, sinkId: string): Promise<undefined> {
  if (typeof element.sinkId !== 'undefined') {
    return element.setSinkId(sinkId);
  } else throw new MediaDeviceException('Browser does not support output device selection.');
}

/**
 * Camera switcher
 * @module functions
 * @param {Pick<IMediaConfig, 'audio' | 'video'>} constraints
 * @param {HTMLVideoElement} videoElement
 * @param {MediaStream} currentStream
 * @param {RTCPeerConnection} [peer]
 * @return Promise<MediaStream>
 */
export const switchCamera = (
  constraints: Pick<IMediaConfig, 'audio' | 'video'>,
  videoElement: HTMLVideoElement,
  currentStream: MediaStream,
  peer?: RTCPeerConnection
): Promise<MediaStream> => {
  currentStream.getVideoTracks().forEach(track => {
    track.stop();
  });
  return getUserMedia(constraints.audio, constraints.video)
    .then(stream => {
      videoElement.srcObject = stream;
      const videoSender = peer?.getSenders().find(sender => sender.track.kind === 'video');
      return videoSender
        ? Promise.all([...stream.getVideoTracks().map(track => videoSender.replaceTrack(track))])
          .then(() => Promise.resolve(stream))
        : Promise.resolve(stream);
    })
}

/**
 * Microphone switcher
 * @module functions
 * @param {Pick<IMediaConfig, 'audio' | 'video'>} constraints
 * @param {MediaStream} currentStream
 * @param {RTCPeerConnection} [peer]
 * @return Promise<MediaStream>
 */
export const switchMicrophone = (
  constraints: Pick<IMediaConfig, 'audio' | 'video'>,
  currentStream: MediaStream,
  peer?: RTCPeerConnection
): Promise<MediaStream> => {
  currentStream.getAudioTracks().forEach(track => {
    track.stop();
  });
  return getUserMedia(constraints.audio, constraints.video)
    .then(stream => {
      const audioSender = peer?.getSenders().find(sender => sender.track.kind === 'audio');
      return audioSender
        ? Promise.all([...stream.getAudioTracks().map(track => audioSender.replaceTrack(track))])
          .then(() => Promise.resolve(stream))
        : Promise.resolve(stream)
    });
}

/**
 * Check for virtual media device
 * @module functions
 * @param {MediaDeviceInfo['label']} label
 * @return boolean
 */
export const isVirtualDevice = (label: MediaDeviceInfo['label']): boolean => {
  const regex = new RegExp(MediaConfig.virtualDevicesRegex, 'i')
  return regex.test(label);
}
