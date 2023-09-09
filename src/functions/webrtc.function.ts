import DetectRTC from 'detectrtc';
import { type IUserPeerInfo } from '@interfaces/user/i.user-peer-info';
import { WebrtcConfig } from '@configuration/webrtc.config';
import { notifyError } from '@functions/notification.function';
import { PeerException } from '@exceptions/peer.exception';

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

/**
 * Get peer connection
 * @return RTCPeerConnection
 */
export function getPeerConnection(): RTCPeerConnection {
  return new RTCPeerConnection(WebrtcConfig);
}

/**
 * Create peer offer
 * @param {RTCPeerConnection} localConnection
 * return Promise<RTCSessionDescriptionInit>
 */
export async function createPeerOffer(localConnection: RTCPeerConnection): Promise<RTCSessionDescriptionInit> {
  try {
    const offer = await localConnection.createOffer({
      iceRestart: true,
      offerToReceiveAudio: true,
      offerToReceiveVideo: true
    });
    await localConnection.setLocalDescription(offer);
    return offer;
  } catch (error) {
    throw new PeerException(error.message, error);
  }
}

/**
 * Create peer answer
 * @param {RTCPeerConnection} remoteConnection
 * return Promise<RTCSessionDescriptionInit>
 */
export async function createPeerAnswer(remoteConnection: RTCPeerConnection): Promise<RTCSessionDescriptionInit> {
  try {
    const answer = await remoteConnection.createAnswer({
      iceRestart: true,
      offerToReceiveAudio: true,
      offerToReceiveVideo: true
    });
    await remoteConnection.setLocalDescription(answer);
    return answer;
  } catch (error) {
    throw new PeerException(error.message, error);
  }
}
