// i.peer-state.d.ts

import { type IBasePeerTransport } from '@interfaces/base/i.base-peer-transport';

/**
 * @typedef IPeerState Peer.tsx state
 * @module interfaces/component/peer
 * @param {boolean} connected
 * @extends IBasePeerTransport
 */
export interface IPeerState extends IBasePeerTransport {
  connected: boolean;
}
