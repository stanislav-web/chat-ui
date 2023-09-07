import { type MediaDeviceTypeEnum } from '@enums/media-device-type.enum';

export interface IEventOnline {
  photo: string;
  countries?: string[];
  deviceId: string;
  deviceType: MediaDeviceTypeEnum;
  deviceLabel: string;
}
