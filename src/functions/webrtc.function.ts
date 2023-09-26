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
import { RtcEventEnum } from '@enums/rtc-event.enum';

/**
 * Create peer connection
 * @param {IUserIce[]} [iceServers]
 * @return Promise<RTCPeerConnection>
 */
export const createPeerConnection = (iceServers?: IUserIce[]): RTCPeerConnection => {
  const config: RTCConfiguration = iceServers
    ? {
        ...WebrtcConfig,
        iceServers: iceServers.map((ice: IUserIce) => ({
          urls: AppConfig.isDecrypt ? decryptMessage(ice.urls) : ice.urls,
          username: AppConfig.isDecrypt ? decryptMessage(ice?.username) : ice.username,
          credential: AppConfig.isDecrypt ? decryptMessage(ice?.credential) : ice.credential
        }))
      }
    : WebrtcConfig;
  return new RTCPeerConnection(config);
}

/**
 * Is peer not closed
 * @param {RTCPeerConnection} peer
 * @return boolean
 */
export const isPeerNotClosed = (peer: RTCPeerConnection): boolean => peer?.connectionState !== RtcConnectionStateEnum.CLOSED &&
      peer?.signalingState !== RtcSignallingStateEnum.CLOSED;

/**
 * Is peer ready for offer
 * @param {RTCPeerConnection} peer
 * @return boolean
 */
export const isPeerReadyForOffer = (peer: RTCPeerConnection): boolean => peer?.connectionState === RtcConnectionStateEnum.NEW &&
    peer?.signalingState === RtcSignallingStateEnum.STABLE;

/**
 * Is peer ready for answer
 * @param {RTCPeerConnection} peer
 * @return boolean
 */
export const isPeerReadyForAnswer = (peer: RTCPeerConnection): boolean => [
  RtcConnectionStateEnum.NEW as string, RtcConnectionStateEnum.CONNECTED as string
].includes(peer.connectionState);

/**
 * Is peer ready to send candidate
 * @param {RTCPeerConnection} peer
 * @param {RTCPeerConnectionIceEvent} event
 * @return boolean
 */
export const isPeerReadyToSendCandidate = (peer: RTCPeerConnection, event: RTCPeerConnectionIceEvent): boolean => isPeerNotClosed(peer) &&
    event.type === RtcEventEnum.ICECANDIDATE && event.candidate;

/**
 * Is peer ready to send candidate
 * @param {RTCPeerConnection} peer
 * @param {RTCPeerConnectionIceEvent} event
 * @return boolean
 */
export const isPeerReadyToAddCandidate = (peer: RTCPeerConnection, event: RTCPeerConnectionIceEvent): boolean => peer &&
    [RtcSignallingStateEnum.STABLE as string, RtcSignallingStateEnum.HAVE_REMOTE_ANSWER].includes(peer.signalingState) &&
  peer?.localDescription && event?.candidate

/**
 * Create peer offer
 * @param {RTCPeerConnection} localConnection
 * @throws PeerException
 * return Promise<RTCSessionDescriptionInit> | null
 */
export async function createPeerOffer(localConnection: RTCPeerConnection): Promise<RTCSessionDescriptionInit> {
  try {
    if (isPeerNotClosed(localConnection)) {
      const offer = await localConnection.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true
      });
      console.log('[!] OFFER:', offer);
      if (!isRemotePeerConnected(localConnection)) {
        await localConnection.setLocalDescription(offer);
      }
      return offer;
    }
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
    console.log('[!] ANSWER:', answer);
    return answer;
  } catch (error: any) {
    const typedError = error as DOMException;
    throw new PeerException(typedError?.message, error);
  }
}

/**
 * Is Remote Peer connected
 * @param {RTCPeerConnection} peer
 * @return boolean
 */
export function isRemotePeerConnected(peer: RTCPeerConnection): boolean {
  return peer.connectionState === RtcConnectionStateEnum.CONNECTED;
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
    if (!hasError && track.readyState === MediaTrackStateEnum.LIVE) {
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
export function addCandidate(peer: RTCPeerConnection, candidate: IEventListenCandidate | RTCIceCandidate): Promise<void> {
  if (isPeerReadyToAddCandidate(peer)) {
    return peer.addIceCandidate(new RTCIceCandidate(candidate))
  } else return Promise.resolve();
}
