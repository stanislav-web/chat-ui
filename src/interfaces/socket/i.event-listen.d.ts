// i.event-listen.d.ts

/**
 * Listen 'offer'
 * @typedef IEventListenOffer socket.on interface
 * @module interfaces/socket/listen
 * @extends RTCSessionDescriptionInit
 */
export interface IEventListenOffer extends RTCSessionDescriptionInit {

}

/**
 * Listen 'answer'
 * @typedef IEventListenAnswer socket.on interface
 * @module interfaces/socket/listen
 * @extends RTCSessionDescriptionInit
 */
export interface IEventListenAnswer extends RTCSessionDescriptionInit {

}

/**
 * Listen 'candidate'
 * @typedef IEventListenCandidate socket.on interface
 * @module interfaces/socket/listen
 * @extends RTCIceCandidate
 */
export interface IEventListenCandidate extends RTCIceCandidate {

}
