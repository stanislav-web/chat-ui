import { notifyError } from '@functions/notification.function';
import { type Socket } from 'socket.io-client';
import { emit, on } from '@functions/socket.function';
import { type SocketEmitType, type SocketListenType } from '@types/socket.type';
import { type IEventEmitCandidate, type IEventEmitOffer } from '@interfaces/socket/i.event-emit';
import { MediaTackException } from '@exceptions/media-tack.exception';
import { createPeerOffer, isPeerAvailable, parseCandidate } from '@functions/webrtc.function';
import { RtcConnectionStateEnum } from '@enums/rtc-connection-state.enum';
import { RtcSignallingStateEnum } from '@enums/rtc-signalling-state.enum';
import { type IEventListenAnswer, type IEventListenOffer } from '@interfaces/socket/i.event-listen';
import { EventListenEnum } from '@enums/event-listen.enum';
import { EventEmitEnum } from '@enums/event-emit.enum';
import { RtcIceGatheringStateEnum } from '@enums/rtc-ice-gathering-state.enum';

/**
 * RTC Negotiation start event handler
 * @module events
 * @param {Socket} socket
 * @param {RTCPeerConnection} peer
 * @return void
 */
export const onNegotiationNeeded = async (socket: Socket, peer: RTCPeerConnection): void => {
  try {
    const offer = await createPeerOffer(peer);
    emit<SocketEmitType, IEventEmitOffer>(socket, EventEmitEnum.OFFER, offer);
    on<SocketListenType, IEventListenOffer>(socket, EventListenEnum.ANSWER, async (event: IEventListenAnswer) => {
      try {
        if (event.type === EventListenEnum.ANSWER && isPeerAvailable(peer?.connectionState)) {
          await peer?.setRemoteDescription(new RTCSessionDescription(event));
        }
      } catch (error) {
        notifyError(error.name, error.message);
      }
    });
  } catch (error: Error) {
    notifyError(error.name, error.message);
  }
}

/**
 * RTC Signaling state change handler
 * @module events
 * @param {RTCPeerConnection} peer
 * @return void
 */
export function onSignalingStateChange(peer: RTCPeerConnection): void {
  switch (peer.signalingState) {
    case RtcSignallingStateEnum.HAVE_LOCAL_OFFER:
      console.log(`[!] -> SIGNAL STATE: ${peer.signalingState} / ${peer.connectionState}`);
      break;
    case RtcSignallingStateEnum.HAVE_LOCAL_ANSWER:
      break;
    case RtcSignallingStateEnum.HAVE_REMOTE_OFFER:
      break;
    case RtcSignallingStateEnum.HAVE_REMOTE_ANSWER:
      break;
    case RtcSignallingStateEnum.CLOSED:
      console.log(`[X] -> SIGNAL STATE: ${peer.signalingState} / ${peer.connectionState}`);
      break;
    case RtcSignallingStateEnum.STABLE:
      break;
    default:
      break;
  }
}

/**
 * RTC ICE gathering state change handler
 * @module events
 * @param {RTCPeerConnection} peer
 * @return void
 */
export function onIceGatheringStateChange(peer: RTCPeerConnection): void {
  switch (peer.iceGatheringState) {
    case RtcIceGatheringStateEnum.NEW:
      console.log(`[!] -> ICE GATHERING STATE: ${peer.iceGatheringState}`);
      break;
    case RtcIceGatheringStateEnum.GATHERING:
      console.log(`[!] -> ICE GATHERING STATE: ${peer.iceGatheringState}`);
      break;
    case RtcIceGatheringStateEnum.COMPLETE:
      console.log(`[!] -> ICE GATHERING STATE: ${peer.iceGatheringState}`);
      break;
    default:
      break;
  }
}

/**
 * Event is sent on an RTCPeerConnection object after a new track has been added to an RTCRtpReceiver
 * which is part of the connection.
 * The new connection state can be found in connectionState
 * and is one of the string values: new, connecting, connected, disconnected, failed, or closed.
 * @module events
 * @param {RTCPeerConnection} peer
 * @return void
 */
export const onConnectionStateChange = (peer: RTCPeerConnection): void => {
  switch (peer.connectionState) {
    case RtcConnectionStateEnum.NEW:
      break;
    case RtcConnectionStateEnum.CONNECTING:
      break;
    case RtcConnectionStateEnum.CONNECTED:
      break;
    case RtcConnectionStateEnum.DISCONNECTED:
      break;
    case RtcConnectionStateEnum.CLOSED:
      break;
    case RtcConnectionStateEnum.FAILED:
      peer.restartIce();
      break;
    default:
      break;
  }
  console.log(`[!] PEER CONNECTION STATE: ${peer.connectionState}`);
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
 * RTC local ice candidates handler
 * @param {Socket} socket
 * @param {RTCPeerConnectionIceEvent} event
 * @param {EventEmitEnum} candidate
 * @return void
 */
export function onLocalIceCandidate(socket: Socket, event: RTCPeerConnectionIceEvent, candidate: EventEmitEnum): void {
  if (event.candidate) {
    const cand = parseCandidate(event.candidate.candidate);
    console.log('[!] -> LOCAL: CANDIDATE', cand);
    emit<SocketEmitType, IEventEmitCandidate>(socket, candidate, event.candidate);
  }
}

/**
 * RTC remote ice candidates handler
 * @param {Socket} socket
 * @param {RTCPeerConnectionIceEvent} event
 * @param {EventEmitEnum} candidate
 * @return void
 */
export function onRemoteIceCandidate(socket: Socket, event: RTCPeerConnectionIceEvent, candidate: EventEmitEnum): void {
  if (event.candidate) {
    emit<SocketEmitType, IEventEmitCandidate>(socket, candidate, event.candidate);
    const cand = parseCandidate(event.candidate.candidate);
    console.log('[!] <- REMOTE: CANDIDATE', cand);
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
