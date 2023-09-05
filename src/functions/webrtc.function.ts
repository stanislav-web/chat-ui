import DetectRTC from 'detectrtc';
import { type IUserPeerInfo } from '@interfaces/user/i.user-peer-info';

/**
 * Get peer info
 */
export function getPeerInfo(): IUserPeerInfo {
  return {
    isWebRTCSupported: DetectRTC.isWebRTCSupported,
    isMobileDevice: DetectRTC.isMobileDevice,
    isWebSocketsBlocked: DetectRTC.isWebSocketsBlocked,
    isWebSocketsSupported: DetectRTC.isWebSocketsSupported,
    hasMicrophone: DetectRTC.hasMicrophone,
    hasSpeakers: DetectRTC.hasSpeakers,
    hasWebcam: DetectRTC.hasWebcam,
    detectRTCVersion: DetectRTC.version,
    osName: DetectRTC.osName,
    osVersion: DetectRTC.osVersion,
    browserName: DetectRTC.browser.name,
    browserVersion: DetectRTC.browser.version
  }
}
