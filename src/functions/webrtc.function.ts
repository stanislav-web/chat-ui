import { WebrtcConfig } from '@configuration/webrtc.config';
import { PeerException } from '@exceptions/peer.exception';
import { RtcConnectionStateEnum } from '@enums/rtc-connection-state.enum';
import { type IEventListenCandidate } from '@interfaces/socket/i.event-listen';
import { MediaTrackStateEnum } from '@enums/media-track-state.enum';
import { MediaTackException } from '@exceptions/media-tack.exception';
import { RtcSignallingStateEnum } from '@enums/rtc-signalling-state.enum';
import { type IUserIce } from '@interfaces/user/i.user-ice';
import { decryptMessage } from '@functions/crypt.function';
import { AppConfig } from '@configuration/app.config';

/**
 * Create peer connection
 * @param {IUserIce[]} [iceServers]
 * @return Promise<RTCPeerConnection>
 */
export function createPeerConnection(iceServers?: IUserIce[]): RTCPeerConnection {
  const config: RTCConfiguration = iceServers
    ? {
        ...WebrtcConfig,
        iceServers: iceServers.map((ice: IUserIce) => ({
          urls: AppConfig.isDecrypt ? decryptMessage(ice.urls) : ice.urls,
          username: AppConfig.isDecrypt ? decryptMessage(ice.username) : ice.username,
          credential: AppConfig.isDecrypt ? decryptMessage(ice.credential) : ice.credential
        }))
      }
    : WebrtcConfig;
  return new RTCPeerConnection(config);
}

/**
 * Create peer offer
 * @param {RTCPeerConnection} localConnection
 * @throws PeerException
 * return Promise<RTCSessionDescriptionInit> | null
 */
export async function createPeerOffer(localConnection: RTCPeerConnection): Promise<RTCSessionDescriptionInit> {
  try {
    const offer = await localConnection.createOffer({
      iceRestart: true,
      offerToReceiveAudio: true,
      offerToReceiveVideo: true
    });
    console.log('[!] -> LOCAL: Peer offer', offer);
    if (!isPeerConnected(localConnection)) {
      await localConnection.setLocalDescription(offer);
    }
    return offer;
  } catch (error: any) {
    const typedError = error as DOMException;
    throw new PeerException(typedError?.message, error);
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
      offerToReceiveAudio: true,
      offerToReceiveVideo: true
    });
    if (isPeerSignalStable(remoteConnection)) return null;
    await remoteConnection.setLocalDescription(answer);
    console.log('[!] <- REMOTE: Peer answer', answer);
    return answer;
  } catch (error: any) {
    const typedError = error as DOMException;
    throw new PeerException(typedError?.message, error);
  }
}

/**
 * Is Peer connected
 * @param {RTCPeerConnection} peer
 * @return boolean
 */
export function isPeerConnected(peer: RTCPeerConnection): boolean {
  return peer.connectionState === RtcConnectionStateEnum.CONNECTED;
}

/**
 * Is Peer New
 * @param {RTCPeerConnection} peer
 * @return boolean
 */
export function isPeerNew(peer: RTCPeerConnection): boolean {
  return peer.connectionState === RtcConnectionStateEnum.NEW;
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
 * @param {RTCPeerConnection} peer
 * @return boolean
 */
export function isPeerSignalStable(peer: RTCPeerConnection): boolean {
  return RtcSignallingStateEnum.STABLE === peer.signalingState;
}

/**
 * Add tracks to peer
 * @param {RTCPeerConnection} peer
 * @param {MediaStream} stream
 * @param {boolean} replace
 * @throws MediaTackException
 * @return void
 */
export function addMediaTracks(peer: RTCPeerConnection, stream: MediaStream, replace: boolean = false): void {
  let error: { label: string } = {
    label: ''
  };
  let hasError = false;
  stream.getTracks().forEach((track: MediaStreamTrack) => {
    if (!hasError && track.enabled && track.readyState === MediaTrackStateEnum.LIVE) {
      if (replace) {
        const sender = peer
          .getSenders()
          .find((s) => s.track.kind === track.kind);
        sender.replaceTrack(track).then();
      } else {
        peer.addTrack(track, stream);
      }
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
 *
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
    protocol: parts[2]?.toLowerCase(),
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
