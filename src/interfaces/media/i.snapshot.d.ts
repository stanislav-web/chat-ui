// i.snapshot.d.ts

import { type ImageHeight, type ImageType, type ImageWidth } from '@types/image.type';

/**
 * On snapshot
 * @typedef ISnapshot
 * @module interfaces/media
 * @prop {ImageType} type
 * @prop {number} [quality]
 * @prop {ImageWidth} [width]
 * @prop {ImageHeight} height
 */
export interface ISnapshot {
  type: ImageType;
  quality?: number;
  width?: ImageWidth;
  height?: ImageHeight;
}

/**
 * On snapshot create
 * @typedef IESnapshot
 * @module interfaces/media
 * @extends ISnapshot
 * @prop {boolean} isAllow
 * @prop {number} interval
 */
export interface IESnapshot extends ISnapshot {
  isAllow: boolean;
  interval: number;
}
