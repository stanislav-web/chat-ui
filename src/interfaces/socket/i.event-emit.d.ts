// i.event-emit.d.ts

/* eslint-disable @typescript-eslint/no-empty-interface */
import { type MediaDeviceTypeEnum } from '@enums/media-device-type.enum';
import { type UniqueId } from '@types/base.type';

/**
 * Emit 'online'
 * @typedef IEventEmitOnline socket.emit interface
 * @module interfaces/socket/emit
 * @prop {string} photo
 * @prop {Array<CountryListItem['code']> | []} [countries]
 * @prop {Array<{
 *     deviceId: UniqueId;
 *     deviceType: MediaDeviceTypeEnum;
 *     deviceLabel: string;
 *     isVirtual: boolean;
 *   }>} devices
 */
export interface IEventEmitOnline {
  readonly photo: string;
  readonly countries?: Array<CountryListItem['code']> | [];
  readonly devices: Array<{
    deviceId: UniqueId;
    deviceType: MediaDeviceTypeEnum;
    deviceLabel: string;
    isVirtual: boolean;
  }>;
}

/**
 * Emit 'start'
 * @typedef IEventEmitStart socket.emit interface
 * @module interfaces/socket/emit
 * @extends IEventEmitOnline
 * @prop {Array<CountryListItem['code']> | []} countries
 */
export interface IEventEmitStart extends IEventEmitOnline {
  readonly countries: Array<CountryListItem['code']>;
}

/**
 * Emit 'offer'
 * @typedef IEventEmitOffer socket.emit interface
 * @module interfaces/socket/emit
 * @extends RTCSessionDescriptionInit
 */
export interface IEventEmitOffer extends RTCSessionDescriptionInit {

}

/**
 * Emit 'candidate'
 * @typedef IEventEmitCandidate socket.emit interface
 * @module interfaces/socket/emit
 * @extends RTCIceCandidate
 */
export interface IEventEmitCandidate extends RTCIceCandidate {

}

/**
 * Emit 'answer'
 * @typedef IEventEmitAnswer socket.emit interface
 * @module interfaces/socket/emit
 * @extends RTCSessionDescriptionInit
 */
export interface IEventEmitAnswer extends RTCSessionDescriptionInit {

}

/**
 * Emit 'stop'
 * @typedef IEventEmitStop socket.emit interface
 * @module interfaces/socket/emit
 */
export interface IEventEmitStop {

}

/**
 * Emit 'mute'
 * @typedef IEventEmitStop socket.emit interface
 * @module interfaces/socket/emit
 * @prop {UniqueId} deviceId
 * @prop {boolean} isMute
 */
export interface IEventMute {
  readonly deviceId: UniqueId;
  readonly isMute: boolean;
}
