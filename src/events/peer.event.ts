import { notifyError } from '@functions/notification.function';
import { type Socket } from 'socket.io-client';
import { type SocketEmitType, type SocketListenType } from '@types/socket.type';
import { type IEventEmitCandidate, type IEventEmitOffer } from '@interfaces/socket/i.event-emit';
import { MediaTackException } from '@exceptions/media-tack.exception';
import { createPeerOffer, isPeerReadyForAnswer, isPeerReadyForOffer, isPeerReadyToSendCandidate } from '@functions/webrtc.function';
import { RtcConnectionStateEnum } from '@enums/rtc-connection-state.enum';
import { RtcSignallingStateEnum } from '@enums/rtc-signalling-state.enum';
import { type IEventListenAnswer, type IEventListenNext, type IEventListenOffer } from '@interfaces/socket/i.event-listen';
import { EventListenEnum } from '@enums/event-listen.enum';
import { EventEmitEnum } from '@enums/event-emit.enum';
import { RtcIceGatheringStateEnum } from '@enums/rtc-ice-gathering-state.enum';

/**
 * RTC Negotiation start event handler
 * @module events
 * @param {RTCPeerConnection} peer
 * @param {Socket} socket
 * @return void
 */
export const onNegotiationNeeded = (peer: RTCPeerConnection, socket: Socket): void => {
  socket.on<SocketListenType, IEventListenNext>(EventListenEnum.NEXT, () => {
    if (isPeerReadyForOffer(peer)) {
      createPeerOffer(peer)
        .then((offer) => socket.emit<SocketEmitType, IEventEmitOffer>(EventEmitEnum.OFFER, offer))
        .catch(error => { notifyError('Peer', error?.message); })
    }
  });
  socket.on<SocketListenType, IEventListenOffer>(EventListenEnum.ANSWER, (event: IEventListenAnswer) => {
    if (isPeerReadyForAnswer(peer)) {
      peer.setRemoteDescription(new RTCSessionDescription(event))
        .catch((error: Error) => { notifyError('Peer', error.message); });
    }
  });
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
}

/**
 * RTC ICE gathering state change handler
 * @module events
 * @param {RTCPeerConnection} peer
 * @return RTCIceGatheringState
 */
export function onIceGatheringStateChange(peer: RTCPeerConnection): RTCIceGatheringState {
  switch (peer.iceGatheringState) {
    case RtcIceGatheringStateEnum.NEW:
      console.log(`[!] ICE STATE: ${peer.iceGatheringState}`);
      break;
    case RtcIceGatheringStateEnum.GATHERING:
      console.log(`[!] ICE STATE: ${peer.iceGatheringState}`);
      break;
    case RtcIceGatheringStateEnum.COMPLETE:
      console.log(`[!] ICE STATE: ${peer.iceGatheringState}`);
      break;
    default:
      break;
  }
  return peer.iceGatheringState;
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
      console.log('FAILED.... Restart')
      peer.restartIce();
      break;
    default:
      break;
  }
}

/**
 * On Data chanel
 * @param {RTCDataChannelEvent} event
 * @return void
 */
export const onDataChannel = (event: RTCDataChannelEvent): void => {
  console.log('onDataChannel', event)
}

/**
 * RTC ice candidate error handler
 * @param {RTCPeerConnectionIceEvent} error
 * @return void
 */
export const onIceCandidateError = (error: RTCPeerConnectionIceErrorEvent): void => {
  notifyError('Peer', error.errorText);
}

/**
 * RTC ice candidates handler
 * @param {RTCPeerConnection} peer
 * @param {Socket} socket
 * @param {RTCPeerConnectionIceEvent} event
 * @return void
 */
export function onIceCandidate(peer: RTCPeerConnection, socket: Socket, event: RTCPeerConnectionIceEvent): void {
  if (isPeerReadyToSendCandidate(peer, event)) {
    console.log('[!] CANDIDATE:', event.candidate);
    socket.emit<SocketEmitType, IEventEmitCandidate>(EventEmitEnum.CANDIDATE, event.candidate);
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
    throw new MediaTackException('No remote media');
  } else {
    console.log({ remoteVideo: target, remoteStream });
    if (target.srcObject !== remoteStream) {
      target.srcObject = remoteStream;
    }
  }
}
