/* eslint-disable @typescript-eslint/no-empty-interface */

// i.event-listen.d.ts

import { type Socket } from 'socket.io-client';
import { type IException } from '@interfaces/socket/i.exception';

/**
 * Listen 'connect'
 * @typedef IEventListenConnect socket.on interface
 * @module interfaces/socket/listen
 */
export interface IEventListenConnect {

}

/**
 * Listen 'disconnect'
 * @typedef IEventListenDisconnect socket.on interface
 * @module interfaces/socket/listen
 * @prop {Socket.DisconnectReason} reason
 */
export interface IEventListenDisconnect {
  reason: Socket.DisconnectReason;
}

/**
 * Listen 'connect_error'
 * @typedef IEventListenDisconnect socket.on interface
 * @module interfaces/socket/listen
 * @prop {Error} error
 */
export interface IEventListenConnectError {
  error: Error;
}

/**
 * Listen 'exception'
 * @typedef IEventListenException socket.on interface
 * @module interfaces/socket/listen
 * @prop {IException} exception
 */
export interface IEventListenException {
  exception: IException;
}

/**
 * Listen 'next'
 * @typedef IEventListenNext socket.on interface
 * @module interfaces/socket/listen
 */
export interface IEventListenNext {

}

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
