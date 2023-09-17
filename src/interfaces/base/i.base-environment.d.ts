// i.base-environment.d.ts

/**
 * @typedef IBaseEnvironment
 * @module interfaces/base Base environment
 * @prop {boolean} isWebRTCSupported
 * @prop {boolean} isMobileDevice
 * @prop {boolean} isWebSocketsBlocked
 * @prop {boolean} isWebSocketsSupported
 * @prop {boolean} isCookiesSupported
 * @prop {boolean} isLocalStorageSupported
 * @prop {boolean} hasWebcam
 * @prop {boolean} hasMicrophone
 * @prop {boolean} hasSpeakers
 * @prop {string} detectRTCVersion
 * @prop {string} osName
 * @prop {string} osVersion
 * @prop {'Edge' | 'Chrome' | 'Firefox' | string} browserName
 * @prop {string | number} browserVersion
 */
export interface IBaseEnvironment {
  readonly isWebRTCSupported: boolean;
  readonly isMobileDevice: boolean;
  readonly isWebSocketsBlocked: boolean;
  readonly isWebSocketsSupported: boolean;
  readonly isCookiesSupported: boolean;
  readonly isLocalStorageSupported: boolean;
  readonly hasWebcam: boolean;
  readonly hasMicrophone: boolean;
  readonly hasSpeakers: boolean;
  readonly detectRTCVersion: string;
  readonly osName: string;
  readonly osVersion: string;
  readonly browserName: 'Edge' | 'Chrome' | 'Firefox' | string;
  readonly browserVersion: string | number;
}
