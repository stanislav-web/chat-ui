/**
 * Events listen enum
 * @module enums
 * @enum {string}
 */
export enum EventListenEnum {
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  CONNECT_ERROR = 'connect_error',
  EXCEPTION = 'exception',
  NEXT = 'next',
  OFFER = 'offer',
  ANSWER = 'answer',
  CANDIDATE = 'candidate'
}
