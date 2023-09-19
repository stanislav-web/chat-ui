import { type ImageType } from '@types/image.type';
import { type UniqueId } from '@types/base.type';

/**
 * @typedef ISnapshot Media config interface
 * @module interfaces/config
 * @prop {boolean} isAllow
 * @prop {number} interval
 * @prop {ImageType} type
 * @prop {number} quality
 * @prop {number} width
 * @prop {number} height
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
 * @prop {UniqueId} containerId
 * @prop {number} containerWidth
 * @prop {number} containerHeight
 */
interface IVideoContainer {
  containerId: UniqueId;
  containerWidth: number;
  containerHeight: number;
}

/**
 * @typedef IControlContainer Media config interface
 * @module interfaces/config
 * @prop {UniqueId} videoSelector
 * @prop {UniqueId} audioSelector
 * @prop {UniqueId} callBtnId
 * @prop {UniqueId} breakBtnId
 * @prop {UniqueId} recallBtnId
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
 * @prop {boolean | MediaTrackConstraints} audio
 * @prop {boolean | MediaTrackConstraints} video
 * @prop {UniqueId} [poster]
 * @prop {string} snapshot
 * @prop {IVideoContainer} local
 * @prop {IVideoContainer} remote
 * @prop {IControlContainer} control
 */
export interface IMediaConfig {
  audio: boolean | MediaTrackConstraints;
  video: boolean | MediaTrackConstraints;
  poster?: string;
  snapshot: ISnapshot;
  local: IVideoContainer;
  remote: IVideoContainer;
  control: IControlContainer;
}
