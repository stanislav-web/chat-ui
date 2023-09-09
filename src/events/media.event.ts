import { captureStream } from '@functions/media.function';
import { notifyError } from '@functions/notification.function';
import { type IOnLoadedVideoMetadata, type IOnPlayEvent, type IOnVolumeChange } from '@interfaces/video/i.media';
import { emit, emitVolatile } from '@functions/socket.function';
import { type IEventEmitOnline, type IEventMute } from '@interfaces/socket/i.event-emit';
import { MediaDeviceTypeEnum } from '@enums/media-device-type.enum';
import { EventEmitEnum } from '@enums/event-emit.enum';
import { type SocketEmitType } from '@types/socket.type';

/**
 * Event is fired when the metadata has been loaded
 * @param {IOnLoadedVideoMetadata} params
 * @return void
 */
export const onLoadedVideoMetadata = (params: IOnLoadedVideoMetadata): void => {
  console.info('onLoadedVideoMetadata', params);
  params.videoEl.play().then().catch((error) => { notifyError('Video', error.toString()); })
}

/**
 * Event is fired when resize video
 * @param {IOnLoadedVideoMetadata} params
 * @return void
 */
export const onResizeVideo = (params: IOnLoadedVideoMetadata): void => {
  const { videoEl } = params;
  console.info('onResizeVideo', params);
  const w = videoEl.videoWidth;
  const h = videoEl.videoHeight;
  if (w && h) {
    videoEl.style.width = `${w}px`;
    videoEl.style.height = `${h}px`;
  }
}

/**
 * Event is fired when video start play
 * @param {IOnPlayEvent} params
 * @return void
 */
export const onPlay = (params: IOnPlayEvent): void => {
  console.info('onPlay', params);
  const {
    videoEl,
    snapshot,
    stream,
    videoTrack, socket
  } = params;

  if (snapshot.isAllow) {
    setInterval(() => {
      const photo = captureStream(
        videoEl,
        snapshot,
        stream,
        videoTrack
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
  const { videoTrack, videoEl, socket } = params;
  if (videoTrack.readyState === 'live') {
    emit<SocketEmitType, IEventMute>(socket, EventEmitEnum.MUTE, {
      deviceId: videoTrack.id,
      isMute: videoEl.muted && videoTrack.muted
    })
  }
}
