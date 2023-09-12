import DetectRTC from 'detectrtc';
import { type IUserPeerInfo } from '@interfaces/user/i.user-peer-info';
import { WebrtcConfig } from '@configuration/webrtc.config';
import { PeerException } from '@exceptions/peer.exception';
import { RtcConnectionStateEnum } from '@enums/rtc-connection-state.enum';
import { type IEventListenCandidate } from '@interfaces/socket/i.event-listen';
import { MediaTrackStateEnum } from '@enums/media-track-state.enum';
import { MediaTackException } from '@exceptions/media-tack.exception';
import { RtcSignallingStateEnum } from '@enums/rtc-signalling-state.enum';

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
 * @param {MediaStream} stream
 * @return Promise<RTCPeerConnection>
 */
export function createPeerConnection(stream?: MediaStream): RTCPeerConnection {
  const peer = new RTCPeerConnection(WebrtcConfig);
  if (stream) addTracks(peer, stream);
  return peer;
}

/**
 * Create peer offer
 * @param {RTCPeerConnection} localConnection
 * @throws PeerException
 * return Promise<RTCSessionDescriptionInit> | null
 */
export async function createPeerOffer(localConnection: RTCPeerConnection): Promise<RTCSessionDescriptionInit> | null {
  try {
    const offer = await localConnection.createOffer({
      iceRestart: true,
      offerToReceiveAudio: true,
      offerToReceiveVideo: true
    });
    if (!isPeerSignalStable(localConnection)) return null;
    await localConnection.setLocalDescription(offer);
    return localConnection.localDescription;
  } catch (error) {
    throw new PeerException(error.message, error);
  }
}

/**
 * Create peer answer
 * @param {RTCPeerConnection} remoteConnection
 * @throws PeerException
 * return Promise<RTCSessionDescriptionInit> | null
 */
export async function createPeerAnswer(remoteConnection: RTCPeerConnection): Promise<RTCSessionDescriptionInit> | null {
  try {
    const answer = await remoteConnection.createAnswer({
      iceRestart: true,
      offerToReceiveAudio: true,
      offerToReceiveVideo: true
    });
    if (isPeerSignalStable(remoteConnection)) return null;
    await remoteConnection.setLocalDescription(answer);
    return remoteConnection.localDescription;
  } catch (error) {
    throw new PeerException(error.message, error);
  }
}

/**
 * Is Peer available
 * @param {RTCPeerConnectionState} state
 * @return boolean
 */
export function isPeerAvailable(state: RTCPeerConnectionState): boolean {
  return [RtcConnectionStateEnum.NEW as string, RtcConnectionStateEnum.CONNECTED as string]
    .includes(state);
}

/**
 * Is Peer signal stable
 * @param {RTCPeerConnection} connection
 * @return boolean
 */
export function isPeerSignalStable(connection: RTCPeerConnection): boolean {
  return RtcSignallingStateEnum.STABLE === connection.signalingState;
}

/**
 * Add tracks to peer
 * @param {RTCPeerConnection} peer
 * @param {MediaStream} stream
 * @throws MediaTackException
 * @return void
 */
export function addTracks(peer: RTCPeerConnection, stream: MediaStream): void {
  let error: { label: string } = {};
  let hasError = false;
  for (const track: MediaStreamTrack of stream.getTracks()) {
    if (!hasError && track.enabled && track.readyState === MediaTrackStateEnum.LIVE) {
      peer.addTrack(track, stream);
    } else {
      hasError = true;
      error = { label: track.label };
    }
  }
  if (error?.label) {
    throw new MediaTackException(`${error.label} is not ready to add`);
  }
}

/**
 * Add candidate to peer
 * @param {RTCPeerConnection} peer
 * @param {IEventListenCandidate | RTCIceCandidate} candidate
 * @return void
 */
export async function addCandidate(peer: RTCPeerConnection, candidate: IEventListenCandidate | RTCIceCandidate): Promise<void> {
  if (peer.remoteDescription !== null && candidate.candidate) {
    const cand = new RTCIceCandidate(candidate);
    await peer.addIceCandidate(cand);
  } else await peer.addIceCandidate({});
}

/**
 * Parse ICE Candidate
 * @param {string} line
 * @return RTCIceCandidate
 */
export function parseCandidate(line): RTCIceCandidate {
  const parts: string[] = line.indexOf('a=candidate:') === 0
    ? line.substring(12).split(' ') as string[]
    : line.substring(10).split(' ') as string[];

  // @TODO fix interface type
  const candidate: RTCIceCandidate & any = {
    foundation: parts[0],
    component: parts[1],
    protocol: parts[2].toLowerCase(),
    priority: parseInt(parts[3], 10),
    ip: parts[4],
    relatedAddress: null,
    relatedPort: null,
    tcpType: null,
    port: parseInt(parts[5], 10),
    type: parts[7]
  };

  for (let i: number = 8; i < parts.length; i += 2) {
    switch (parts[i]) {
      case 'raddr':
        candidate.relatedAddress = parts[i + 1];
        break;
      case 'rport':
        candidate.relatedPort = parseInt(parts[i + 1], 10);
        break;
      case 'tcptype':
        candidate.tcpType = parts[i + 1];
        break;
      default:
        break;
    }
  }
  return candidate;
}
