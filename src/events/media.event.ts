import { captureStream, getUserDevices, isVirtualDevice } from '@functions/media.function';
import { notifyError } from '@functions/notification.function';
import { type IOnLoadedVideoMetadata, type IOnPlayEvent, type IOnVolumeChange } from '@interfaces/media/i.media';
import { type IEventEmitOnline, type IEventMute } from '@interfaces/socket/i.event-emit';
import { EventEmitEnum } from '@enums/event-emit.enum';
import { type SocketEmitType } from '@types/socket.type';
import { type MediaDevicesTypes } from '@types/media.type';
import { getItem } from '@functions/localstorage.function';
import { MediaTrackStateEnum } from '@enums/media-track-state.enum';
import { AppConfig } from '@configuration/app.config';
import { encryptMessage } from '@functions/crypt.function';

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
 * Event is fired when resize media
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
 * Event is fired when media start play
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
  const photo = captureStream(
    videoElement,
    snapshot
  );
  const videoDevice = stream.getVideoTracks().find(device => device.readyState === MediaTrackStateEnum.LIVE);
  const audioDevice = stream.getAudioTracks().find(device => device.readyState === MediaTrackStateEnum.LIVE);
  if (photo && videoDevice && audioDevice && socket.connected) {
    const trackOnline = function (): void {
      socket.volatile.emit<SocketEmitType, IEventEmitOnline>(EventEmitEnum.ONLINE, {
        photo: AppConfig.isDecrypt ? encryptMessage(photo) : photo,
        countries: getItem('selected') === null ? undefined : getItem('selected'),
        devices: [videoDevice, audioDevice].map((device) => ({
          deviceId: device.id,
          deviceType: device.kind,
          deviceLabel: device.label,
          isVirtual: isVirtualDevice(device.label)
        }))
      });
    };
    setTimeout(() => { trackOnline(); }, 2000);
    if (snapshot.isAllow) {
      setInterval(() => { trackOnline(); }, snapshot.interval);
    }
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
    socket.volatile.emit<SocketEmitType, IEventMute>(EventEmitEnum.MUTE, {
      deviceId: videoTrack.id,
      isMute: videoTrack.muted
    })
  }
}
