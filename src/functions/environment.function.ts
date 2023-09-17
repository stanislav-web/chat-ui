import DetectRTC from 'detectrtc';
import { WebRTCException } from '@exceptions/webrtc.exception';
import { WebsocketException } from '@exceptions/websocket.exception';
import { isCookiesSupported } from '@functions/cookie.function';
import { isLocalStorageSupported } from '@functions/localstorage.function';
import { type IBaseEnvironment } from '@interfaces/base/i.base-environment';
import { CookieException } from '@exceptions/cookie.exception';
import { LocalstorageException } from '@exceptions/localstorage.exception';

/**
 * Check supported environments
 * @module functions
 * @throws  WebRTCException
 * @throws  WebsocketException
 * @throws  CookieException
 * @throws  LocalstorageException
 * @return void
 */
export const checkSupportedEnvironments = (): void => {
  const env = getEnvironmentSupportInfo();
  if (!env.isWebRTCSupported) {
    throw new WebRTCException('Your browser is not support WebRTC');
  }
  if (!env.isWebSocketsSupported) {
    throw new WebsocketException('Your browser is not support WebSockets');
  }
  if (env.isWebSocketsBlocked) {
    throw new WebsocketException('Your WebSockets has been blocked by undefined reason');
  }
  if (!env.isCookiesSupported) {
    throw new CookieException('Cookies are not enabled. Please turn on and reload');
  }
  if (!env.isLocalStorageSupported) {
    throw new LocalstorageException('Your browser is not support LocalStorage');
  }
}

/**
 * Get Environment support info
 * @module functions
 * @return IBaseEnvironment
 */
export const getEnvironmentSupportInfo = (): IBaseEnvironment => ({
  isWebRTCSupported: DetectRTC.isWebRTCSupported,
  isMobileDevice: DetectRTC.isMobileDevice,
  isWebSocketsBlocked: DetectRTC.isWebSocketsBlocked,
  isWebSocketsSupported: DetectRTC.isWebSocketsSupported,
  isCookiesSupported: isCookiesSupported(),
  isLocalStorageSupported: isLocalStorageSupported(),
  hasMicrophone: DetectRTC.hasMicrophone,
  hasSpeakers: DetectRTC.hasSpeakers,
  hasWebcam: DetectRTC.hasWebcam,
  detectRTCVersion: DetectRTC.version,
  osName: DetectRTC.osName,
  osVersion: DetectRTC.osVersion,
  browserName: DetectRTC.browser.name,
  browserVersion: DetectRTC.browser.version
});
