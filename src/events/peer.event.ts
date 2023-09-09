import { notifyError } from '@functions/notification.function';
import { type Socket } from 'socket.io-client';
import { emit } from '@functions/socket.function';
import { type SocketEmitType } from '@types/socket.type';
import { type IEventEmitCandidate } from '@interfaces/socket/i.event-emit';
import { EventEmitEnum } from '@enums/event-emit.enum';

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
    case 'connecting':
      // setOnlineStatus('Connecting…');
      break;
    case 'connected':
      // setOnlineStatus('Online');
      break;
    case 'disconnected':
      // setOnlineStatus('Disconnecting…');
      break;
    case 'closed':
      // setOnlineStatus('Offline');
      break;
    case 'failed':
      // setOnlineStatus('Error');
      break;
    default:
      // setOnlineStatus('Unknown');
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
    case 'stable':
      // updateStatus('ICE negotiation complete');
      break;
  }
  console.log('onSignalingStateChange', { peer, event });
}

/**
 * RTC ice candidate handler
 * @param {Socket} socket
 * @param {RTCPeerConnectionIceEvent} event
 * @return void
 */
export function onIceCandidate(socket: Socket, event: RTCPeerConnectionIceEvent): void {
  if (event.candidate) {
    emit<SocketEmitType, IEventEmitCandidate>(socket, EventEmitEnum.CANDIDATE, event.candidate);
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
  target.srcObject = event.streams[0];
  // hangupButton.disabled = false;
  console.log('onTrack', { event });
}
