import { type MediaDeviceTypeEnum } from '@enums/media-device-type.enum';

/**
 * Emit 'online'
 */
export interface IEventEmitOnline {
  readonly photo: string;
  readonly countries?: string[];
  readonly deviceId: string;
  readonly deviceType: MediaDeviceTypeEnum;
  readonly deviceLabel: string;
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
