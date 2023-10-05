// i.base-environment.d.ts

/**
 * @typedef IBaseEnvironment
 * @module interfaces/base Base environment
 * @property {boolean} isWebRTCSupported
 * @property {boolean} isMobileDevice
 * @property {boolean} isWebSocketsBlocked
 * @property {boolean} isWebSocketsSupported
 * @property {boolean} isCookiesSupported
 * @property {boolean} isLocalStorageSupported
 * @property {boolean} hasWebcam
 * @property {boolean} hasMicrophone
 * @property {boolean} hasSpeakers
 * @property {string} detectRTCVersion
 * @property {string} osName
 * @property {string} osVersion
 * @property {'Edge' | 'Chrome' | 'Firefox' | string} browserName
 * @property {string | number} browserVersion
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
