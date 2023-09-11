import DetectRTC from 'detectrtc';
import { type IUserPeerInfo } from '@interfaces/user/i.user-peer-info';
import { WebrtcConfig } from '@configuration/webrtc.config';
import { PeerException } from '@exceptions/peer.exception';
import { RtcConnectionStateEnum } from '@enums/rtc-connection-state.enum';
import { type IEventListenCandidate } from '@interfaces/socket/i.event-listen';
import { MediaTrackStateEnum } from '@enums/media-track-state.enum';
import { MediaTackException } from '@exceptions/media-tack.exception';
import { RtcStatsTypeEnum } from '@enums/rtc-stats-type.enum';

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
 * @return RTCPeerConnection
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
 * @throws PeerException
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
 * Add tracks to peer
 * @param {RTCPeerConnection} peer
 * @param {MediaStream} stream
 * @throws MediaTackException
 * @return void
 */
export function addTracks(peer: RTCPeerConnection, stream: MediaStream): void {
  let error: { label: string } = {};
  let hasError = false;
  stream.getTracks().forEach((track: MediaStreamTrack) => {
    if (!hasError && track.enabled && track.readyState === MediaTrackStateEnum.LIVE) {
      peer.addTrack(track, stream);
    } else {
      hasError = true;
      error = { label: track.label };
    }
  });
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
  if (peer?.remoteDescription && candidate.candidate) {
    const cand = new RTCIceCandidate(candidate);
    await peer.addIceCandidate(cand);
  } else await peer.addIceCandidate({});
}

/**
 * Get RTC Statistics
 * @param {RTCPeerConnection} peer
 * @param {MediaStreamTrack | null} track
 */
export async function getRTCStats(
  peer: RTCPeerConnection,
  track?: MediaStreamTrack | null
): Promise<{ activeCandidatePair: unknown; remoteCandidate: unknown }> {
  const results = await peer.getStats(track);
  let activeCandidatePair: unknown = null;
  let remoteCandidate: unknown = null;
  results.forEach((report: RTCTransportStats) => {
    if (report.type === RtcStatsTypeEnum.TRANSPORT) {
      activeCandidatePair = results.get(report.selectedCandidatePairId);
    }
  });
  if (!activeCandidatePair) {
    results.forEach((report: RTCIceCandidatePairStats) => {
      if (report.type === RtcStatsTypeEnum.CANDIDATE_PAIR && report.state === 'succeeded') {
        activeCandidatePair = report;
      }
    });
  }
  if (activeCandidatePair?.remoteCandidateId) {
    results.forEach(report => {
      if (report.type === RtcStatsTypeEnum.REMOTE_CANDIDATE && report.id === activeCandidatePair.remoteCandidateId) {
        remoteCandidate = report;
      }
    });
  }
  return {
    remoteCandidate,
    activeCandidatePair
  }
}
