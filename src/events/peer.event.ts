import { notifyError } from '@functions/notification.function';
import { type Socket } from 'socket.io-client';
import { type SocketEmitType, type SocketListenType } from '@types/socket.type';
import { type IEventEmitOffer } from '@interfaces/socket/i.event-emit';
import { MediaTackException } from '@exceptions/media-tack.exception';
import { createPeerOffer, isPeerReadyForAnswer, isPeerReadyForOffer } from '@functions/webrtc.function';
import { type IEventListenAnswer, type IEventListenNext, type IEventListenOffer } from '@interfaces/socket/i.event-listen';
import { EventListenEnum } from '@enums/event-listen.enum';
import { EventEmitEnum } from '@enums/event-emit.enum';
import { RtcIceGatheringStateEnum } from '@enums/rtc-ice-gathering-state.enum';

/**
 * RTC Negotiation start event handler
 * @module events
 * @param {RTCPeerConnection} peer
 * @param {Socket} socket
 * @param {function} cb
 * @return void
 */
export const onNegotiationNeeded = (peer: RTCPeerConnection, socket: Socket, cb?: undefined): void => {
  socket.on<SocketListenType, IEventListenNext>(EventListenEnum.READY, () => {
    if (isPeerReadyForOffer(peer)) {
      createPeerOffer(peer)
        .then((offer) => socket.emit<SocketEmitType, IEventEmitOffer>(EventEmitEnum.OFFER, offer))
        .then(() => cb())
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
 * RTC track handler
 * @param {HTMLVideoElement} target
 * @param {MediaStreamTrack} track
 * @param {MediaStream[]} streams
 * @return void
 */
export function onTrack(target: HTMLVideoElement, track: MediaStreamTrack, streams: MediaStream[]): void {
  const [remoteStream] = streams;
  if (!'srcObject' in target) {
    throw new MediaTackException('No remote media');
  } else {
    track.onunmute = () => {
      if (target.srcObject) return;
      target.srcObject = remoteStream;
    };
    if (target.srcObject !== remoteStream) {
      target.srcObject = remoteStream;
    }
  }
}
