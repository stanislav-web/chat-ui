export interface IUserPeerInfo {
  readonly isWebRTCSupported: boolean;
  readonly isMobileDevice: boolean;
  readonly isWebSocketsBlocked: boolean;
  readonly isWebSocketsSupported: boolean;
  readonly hasWebcam: boolean;
  readonly hasMicrophone: boolean;
  readonly hasSpeakers: boolean;
  readonly detectRTCVersion: string;
  readonly osName: string;
  readonly osVersion: string;
  readonly browserName: 'Edge' | 'Chrome' | 'Firefox' | string;
  readonly browserVersion: string | number;
}
