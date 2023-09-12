import { notifyError } from '@functions/notification.function';
import { type Socket } from 'socket.io-client';
import { emit } from '@functions/socket.function';
import { type SocketEmitType } from '@types/socket.type';
import { type IEventEmitCandidate } from '@interfaces/socket/i.event-emit';
import { type EventEmitEnum } from '@enums/event-emit.enum';
import { MediaTackException } from '@exceptions/media-tack.exception';
import { parseCandidate } from '@functions/webrtc.function';
import { RtcConnectionStateEnum } from '@enums/rtc-connection-state.enum';
import { RtcSignallingStateEnum } from '@enums/rtc-signalling-state.enum';

/**
 * Event is sent on an RTCPeerConnection object after a new track has been added to an RTCRtpReceiver
 * which is part of the connection.
 * The new connection state can be found in connectionState
 * and is one of the string values: new, connecting, connected, disconnected, failed, or closed.
 * @param {Event} event
 * @param {RTCPeerConnection} peer
 * @return void
 */
export const onConnectionStateChange = (event: Event, peer: RTCPeerConnection): void => {
  switch (peer.connectionState) {
    case RtcConnectionStateEnum.NEW:
      console.log('[!] PEER CONNECTION STATE: NEW', peer);
      break;
    case RtcConnectionStateEnum.CONNECTING:
      console.log('[!] PEER CONNECTION STATE: CONNECTING', peer);
      break;
    case RtcConnectionStateEnum.CONNECTED:
      console.log('[!] PEER CONNECTION STATE: CONNECTED', peer);
      break;
    case RtcConnectionStateEnum.DISCONNECTED:
      console.log('[!] PEER CONNECTION STATE: DISCONNECTED', peer);
      break;
    case RtcConnectionStateEnum.CLOSED:
      console.log('[!] PEER CONNECTION STATE: CLOSED', peer);
      break;
    case RtcConnectionStateEnum.FAILED:
      console.log('[!] PEER CONNECTION STATE: FAILED', peer);
      peer.restartIce();
      break;
    default:
      break;
  }
}

/**
 * Event is sent to an RTCPeerConnection instance when an RTCDataChannel has been added to the connection,
 * as a result of the remote peer calling
 * @param {RTCDataChannelEvent} event
 * @return void
 */
export const onDataChannel = (event: RTCDataChannelEvent): void => {
  console.info('onDataChannel', event);
}

/**
 * RTC ice candidate error handler
 * @param {RTCPeerConnectionIceEvent} error
 * @return void
 */
export const onIceCandidateError = (error: RTCPeerConnectionIceErrorEvent): void => {
  console.info('iceCandidateErrorHandler', error);
  notifyError('Peer', error.errorText);
}

/**
 * RTC signaling state change handler
 * @param {RTCPeerConnection} peer
 * @param {Event} event
 * @return void
 */
export function onSignalingStateChange(peer: RTCPeerConnection, event: Event): void {
  switch (peer.signalingState) {
    case RtcSignallingStateEnum.HAVE_LOCAL_OFFER:
      break;
    case RtcSignallingStateEnum.HAVE_LOCAL_ANSWER:
      break;
    case RtcSignallingStateEnum.HAVE_REMOTE_OFFER:
      break;
    case RtcSignallingStateEnum.HAVE_REMOTE_ANSWER:
      break;
    case RtcSignallingStateEnum.CLOSED:
      break;
    case RtcSignallingStateEnum.STABLE:
      break;
    default:
      break;
  }
  console.log(`[!] SIGNAL/CONNECTION STATE: ${peer.signalingState} / ${peer.connectionState}`, peer);
}

/**
 * RTC ice candidate handler
 * @param {Socket} socket
 * @param {RTCPeerConnectionIceEvent} event
 * @param {EventEmitEnum} candidate
 * @return void
 */
export function onIceCandidate(socket: Socket, event: RTCPeerConnectionIceEvent, candidate: EventEmitEnum): void {
  const candidates = [];
  if (event.candidate?.candidate.includes('srflx')) {
    const cand = parseCandidate(event.candidate.candidate);
    console.log('[!] CANDIDATE', cand);
    if (!candidates[cand.relatedPort]) candidates[cand.relatedPort] = [];
    candidates[cand.relatedPort].push(cand.port);
    setTimeout(() => {
      emit<SocketEmitType, IEventEmitCandidate>(socket, candidate, event.candidate);
    }, 1000);
  } else if (!event.candidate) {
    if (Object.keys(candidates).length === 1) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const ports: any = candidates[Object.keys(candidates)[0]];
      console.log(ports.length === 1 ? 'normal nat' : 'symmetric nat');
    }
  }
}

/**
 * RTC track handler
 * @param {HTMLVideoElement} target
 * @param {RTCTrackEvent} event
 * @return void
 */
export function onTrack(target: HTMLVideoElement, event: RTCTrackEvent): void {
  const [remoteStream] = event.streams;
  if (!'srcObject' in target) {
    throw new MediaTackException('No remote video');
  } else {
    if (target.srcObject !== remoteStream) {
      target.srcObject = remoteStream;
    }
  }
}
