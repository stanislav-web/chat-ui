import { captureStream, getUserDevices } from '@functions/media.function';
import { notifyError } from '@functions/notification.function';
import { type IOnLoadedVideoMetadata, type IOnPlayEvent, type IOnVolumeChange } from '@interfaces/video/i.media';
import { emitVolatile } from '@functions/socket.function';
import { type IEventEmitOnline, type IEventMute } from '@interfaces/socket/i.event-emit';
import { MediaDeviceTypeEnum } from '@enums/media-device-type.enum';
import { EventEmitEnum } from '@enums/event-emit.enum';
import { type SocketEmitType } from '@types/socket.type';
import { type MediaDevicesTypes } from '@types/media.type';

/**
 * Event is fired when device has changed
 * @param {MediaDevicesTypes} type
 * @return void
 */
export const onDeviceChange = (type: MediaDevicesTypes): void => {
  const deviceList = getUserDevices(type);
  console.info('onDeviceChange', deviceList);
}

/**
 * Event is fired when the metadata has been loaded
 * @param {IOnLoadedVideoMetadata} params
 * @return void
 */
export const onLoadedVideoMetadata = (params: IOnLoadedVideoMetadata): void => {
  params.videoElement.play().then().catch((error) => { notifyError('Video', error.toString()); })
}

/**
 * Event is fired when resize video
 * @param {HTMLVideoElement} videoElement
 * @return void
 */
export const onResizeVideo = (videoElement: HTMLVideoElement): void => {
  const w = videoElement.videoWidth;
  const h = videoElement.videoHeight;
  if (w && h) {
    videoElement.style.width = `${w}px`;
    videoElement.style.height = `${h}px`;
  }
}

/**
 * Event is fired when video start play
 * @param {IOnPlayEvent} params
 * @return void
 */
export const onPlay = (params: IOnPlayEvent): void => {
  const {
    videoElement,
    snapshot,
    stream,
    socket
  } = params;

  if (snapshot.isAllow) {
    const videoTrack = stream.getVideoTracks()[0];
    setInterval(() => {
      const photo = captureStream(
        videoElement,
        snapshot
      );
      if (photo) {
        emitVolatile<SocketEmitType, IEventEmitOnline>(socket, EventEmitEnum.ONLINE, {
          photo,
          deviceId: videoTrack.id,
          deviceType: MediaDeviceTypeEnum.VIDEO,
          deviceLabel: videoTrack.label
        });
      }
    }, snapshot.interval);
  }
}

/**
 * On volume changed
 * @param {IOnVolumeChange} params
 * @return void
 */
export const onVolumeChange = (params: IOnVolumeChange): void => {
  console.info('onVolumeChange', params);
  const { stream, socket } = params;
  const videoTrack = stream.getVideoTracks()[0];

  if (videoTrack.readyState === 'live') {
    emitVolatile<SocketEmitType, IEventMute>(socket, EventEmitEnum.MUTE, {
      deviceId: videoTrack.id,
      isMute: videoTrack.muted
    })
  }
}
