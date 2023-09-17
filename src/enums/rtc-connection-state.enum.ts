/**
 * RTC connections states
 * @module enums
 * @enum {string}
 */
export enum RtcConnectionStateEnum {
  NEW = 'new',
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
  DISCONNECTED = 'disconnected',
  FAILED = 'failed',
  CLOSED = 'closed',
}
