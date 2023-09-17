// i.base-peer-connect.d.ts

/**
 * @typedef IBasePeerConnect
 * @module interfaces/base Peer connect
 * @prop {RTCPeerConnection | null} peer
 */
export interface IBasePeerConnect {
  readonly peer: RTCPeerConnection | null;
}
