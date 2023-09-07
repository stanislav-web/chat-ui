import DetectRTC from 'detectrtc';
import { type IUserPeerInfo } from '@interfaces/user/i.user-peer-info';
import { WebrtcConfig } from '@configuration/webrtc.config';

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
 * @param callback
 * @param error
 */
export function getPeerConnection(callback: any, error: any): RTCPeerConnection {
  const connection = new RTCPeerConnection(WebrtcConfig);
  connection.addEventListener('icecandidate', (event: RTCPeerConnectionIceEvent) => {
    callback(event);
  });
  connection.addEventListener('icecandidateerror', (event: RTCPeerConnectionIceErrorEvent) => {
    error(event);
  });
  return connection;
}

/**
 * Create peer offer
 * @param {RTCPeerConnection} localConnection
 * return Promise<RTCSessionDescriptionInit>
 */
export async function createPeerOffer(localConnection: RTCPeerConnection): Promise<RTCSessionDescriptionInit> {
  const offer = await localConnection.createOffer({
    iceRestart: true,
    offerToReceiveAudio: true,
    offerToReceiveVideo: true
  });
  await localConnection.setLocalDescription(offer);
  return offer;
}

/**
 * Create peer answer
 * @param {RTCPeerConnection} remoteConnection
 * return Promise<RTCSessionDescriptionInit>
 */
export async function createPeerAnswer(remoteConnection: RTCPeerConnection): Promise<RTCSessionDescriptionInit> {
  const answer = await remoteConnection.createAnswer({
    iceRestart: true,
    offerToReceiveAudio: true,
    offerToReceiveVideo: true
  });
  await remoteConnection.setLocalDescription(answer);
  return answer;
}
