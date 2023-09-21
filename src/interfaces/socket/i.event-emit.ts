import { type MediaDeviceTypeEnum } from '@enums/media-device-type.enum';

/**
 * Emit 'online'
 */
export interface IEventEmitOnline {
  readonly photo: string;
  readonly countries?: Array<CountryListItem['code']> | [];
  readonly devices: Array<{
    deviceId: string;
    deviceType: MediaDeviceTypeEnum;
    deviceLabel: string;
    isVirtual: boolean;
  }>;
}

/**
 * Emit 'start'
 */
export interface IEventEmitStart {
  readonly photo: string;
  readonly countries: Array<CountryListItem['code']>;
  readonly devices: Array<{
    deviceId: string;
    deviceType: MediaDeviceTypeEnum;
    deviceLabel: string;
    isVirtual: boolean;
  }>;
}

/**
 * Emit 'mute'
 */
export interface IEventMute {
  readonly deviceId: string;
  readonly isMute: boolean;
}

/**
 * Emit 'offer'
 */
export interface IEventEmitOffer extends RTCSessionDescriptionInit {

}

/**
 * Emit 'answer'
 */
export interface IEventEmitAnswer extends RTCSessionDescriptionInit {

}

/**
 * Emit 'candidate'
 */
export interface IEventEmitCandidate extends RTCIceCandidate {

}
