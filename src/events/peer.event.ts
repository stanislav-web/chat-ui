import { notifyError } from '@functions/notification.function';
import { type Socket } from 'socket.io-client';
import { emit } from '@functions/socket.function';
import { type SocketEmitType } from '@types/socket.type';
import { type IEventEmitCandidate } from '@interfaces/socket/i.event-emit';
import { type EventEmitEnum } from '@enums/event-emit.enum';
import { MediaTackException } from '@exceptions/media-tack.exception';

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
  console.info('onConnectionStateChange', { event, peer });
  switch (peer.connectionState) {
    case 'new':
      console.info('PEER CONNECTION STATE', 'new');

      break;
    case 'connecting':
      console.info('PEER CONNECTION STATE', 'connecting');
      break;
    case 'connected':
      console.info('PEER CONNECTION STATE', 'connected');
      break;
    case 'disconnected':
      console.info('PEER CONNECTION STATE', 'disconnected');
      break;
    case 'closed':
      console.info('PEER CONNECTION STATE', 'closed');
      break;
    case 'failed':
      console.info('PEER CONNECTION STATE', 'failed');
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
    case 'have-local-offer':
      console.info('PEER SIGNAL STATE', peer.signalingState);
      break;
    case 'have-local-pranswer':
      console.info('PEER SIGNAL STATE', peer.signalingState);
      break;
    case 'have-remote-offer':
      console.info('PEER SIGNAL STATE', peer.signalingState);
      break;
    case 'have-remote-pranswer':
      console.info('PEER SIGNAL STATE', peer.signalingState);
      break;
    case 'closed':
      console.info('PEER SIGNAL STATE', peer.signalingState);
      break;
    case 'stable':
      console.info('PEER SIGNAL STATE', peer.signalingState);
      break;
    default:
      break;
  }
  console.log('onSignalingStateChange', { peer, event });
}

/**
 * RTC ice candidate handler
 * @param {Socket} socket
 * @param {RTCPeerConnectionIceEvent} event
 * @param {EventEmitEnum} candidate
 * @return void
 */
export function onIceCandidate(socket: Socket, event: RTCPeerConnectionIceEvent, candidate: EventEmitEnum): void {
  if (event.candidate) {
    emit<SocketEmitType, IEventEmitCandidate>(socket, candidate, event.candidate);
  }
  console.log('onIceCandidate', event);
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
