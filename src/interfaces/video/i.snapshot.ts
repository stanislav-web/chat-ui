import { type ImageHeight, type ImageType, type ImageWidth } from '@types/image.type';

export interface ISnapshot {
  type: ImageType;
  quality?: number;
  width?: ImageWidth;
  height?: ImageHeight;
}

export interface IESnapshot extends ISnapshot {
  isAllow: boolean;
  interval: number;
}
