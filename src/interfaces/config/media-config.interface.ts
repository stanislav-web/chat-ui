import { type ImageType } from '@types/image.type';
import { type VideoContainerType } from '@types/video-container.type';

interface SnapshotInterface {
  isAllow: boolean;
  interval: number;
  type: ImageType;
  quality: number;
  width: number;
  height: number;
}

interface VideoContainerInterface {
  containerId: VideoContainerType;
  containerWidth: number;
  containerHeight: number;
  useNoise: boolean;
}

export interface MediaConfigInterface {
  audio: boolean | MediaTrackConstraints;
  video: boolean | MediaTrackConstraints;
  poster?: string;
  snapshot: SnapshotInterface;
  local: VideoContainerInterface;
  remote: VideoContainerInterface;
}
