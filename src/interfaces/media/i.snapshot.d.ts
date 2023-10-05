// i.snapshot.d.ts

import { type ImageHeight, type ImageType, type ImageWidth } from '@types/image.type';

/**
 * On snapshot
 * @typedef ISnapshot
 * @module interfaces/media
 * @property {ImageType} type
 * @property {number} [quality]
 * @property {ImageWidth} [width]
 * @property {ImageHeight} height
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
 * @property {boolean} isAllow
 * @property {number} interval
 */
export interface IESnapshot extends ISnapshot {
  isAllow: boolean;
  interval: number;
}
