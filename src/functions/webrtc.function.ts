import { PeerException } from '@exceptions/peer.exception';
import { RtcConnectionStateEnum } from '@enums/rtc-connection-state.enum';
import { MediaTrackStateEnum } from '@enums/media-track-state.enum';
import { MediaTackException } from '@exceptions/media-tack.exception';
import { RtcSignallingStateEnum } from '@enums/rtc-signalling-state.enum';
import { RtcEventEnum } from '@enums/rtc-event.enum';

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
 * Create peer offer
 * @param {RTCPeerConnection} peer
 * @throws PeerException
 * return Promise<RTCSessionDescriptionInit> | null
 */
export async function createPeerOffer(peer: RTCPeerConnection): Promise<RTCSessionDescriptionInit> {
  try {
    if (isPeerNotClosed(peer)) {
      const offer = await peer.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
        voiceActivityDetection: true
      });
      console.log('[!] OFFER:', offer);
      await peer.setLocalDescription(offer);
      return offer;
    }
  } catch (error: any) {
    const typedError = error as DOMException;
    throw new PeerException(typedError?.message, error);
  }
}

/**
 * Create peer answer
 * @param {RTCPeerConnection} peer
 * @throws PeerException
 * return Promise<RTCSessionDescriptionInit> | null
 */
export async function createPeerAnswer(peer: RTCPeerConnection): Promise<RTCSessionDescriptionInit> | null {
  try {
    const answer = await peer.createAnswer({
      offerToReceiveAudio: true,
      offerToReceiveVideo: true
    });
    // if (isPeerSignalStable(peer)) return null;
    await peer.setLocalDescription(answer);
    console.log('[!] ANSWER:', answer);
    return answer;
  } catch (error: any) {
    const typedError = error as DOMException;
    throw new PeerException(typedError?.message, error);
  }
}

/**
 * Add tracks to peer
 * @param {RTCPeerConnection} peer
 * @param {MediaStream} stream
 * @throws MediaTackException
 * @return void
 */
export function addMediaTracks(peer: RTCPeerConnection, stream: MediaStream): void {
  let error: { label: string } = {
    label: ''
  };
  let hasError = false;
  stream.getTracks().forEach((track: MediaStreamTrack) => {
    if (!hasError && track.readyState === MediaTrackStateEnum.LIVE) {
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
