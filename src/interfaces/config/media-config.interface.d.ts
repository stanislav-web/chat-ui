import { type ImageType } from '@types/image.type';
import { type UniqueId, type Uri } from '@types/base.type';

/**
 * @typedef ISnapshot Media config interface
 * @module interfaces/config
 * @property {boolean} isAllow
 * @property {number} interval
 * @property {ImageType} type
 * @property {number} quality
 * @property {number} width
 * @property {number} height
 */
interface ISnapshot {
  isAllow: boolean;
  interval: number;
  type: ImageType;
  quality: number;
  width: number;
  height: number;
}

/**
 * @typedef IVideoContainer Media config interface
 * @module interfaces/config
 * @property {UniqueId} containerId
 * @property {number} containerWidth
 * @property {number} containerHeight
 */
interface IVideoContainer {
  containerId: UniqueId;
  containerWidth: number;
  containerHeight: number;
}

/**
 * @typedef IControlContainer Media config interface
 * @module interfaces/config
 * @property {UniqueId} videoSelectorId
 * @property {UniqueId} audioSelectorId
 * @property {UniqueId} callBtnId
 * @property {UniqueId} breakBtnId
 * @property {UniqueId} recallBtnId
 */
interface IControlContainer {
  videoSelectorId: UniqueId;
  audioSelectorId: UniqueId;
  callBtnId: UniqueId;
  breakBtnId: UniqueId;
  recallBtnId: UniqueId;
}

/**
 * @typedef IControlContainer Media config interface
 * @module interfaces/config
 * @property {boolean | MediaTrackConstraints} audio
 * @property {boolean | MediaTrackConstraints} media
 * @property {Uri} [poster]
 * @property {string} snapshot
 * @property {IVideoContainer} local
 * @property {IVideoContainer} remote
 * @property {IControlContainer} control
 */
export interface IMediaConfig {
  audio: boolean | MediaTrackConstraints;
  video: boolean | MediaTrackConstraints;
  poster?: Uri;
  virtualDevicesRegex: RegExp;
  snapshot: ISnapshot;
  local: IVideoContainer;
  remote: IVideoContainer;
  control: IControlContainer;
}
