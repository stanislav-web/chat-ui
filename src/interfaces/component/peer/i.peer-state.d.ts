// i.peer-state.d.ts

import { type IBasePeerSteam } from '@interfaces/base/i.base-peer-steam';
import { type IBasePeerElement } from '@interfaces/base/i.base-peer-element';
import { type IBasePeerTransport } from '@interfaces/base/i.base-peer-transport';
import { type IBasePeerConnect } from '@interfaces/base/i.base-peer-connect';
import { type IBasePeerChannel } from '@interfaces/base/i.base-peer-channel';

/**
 * @typedef IPeerState Loading.tsx state
 * @module interfaces/component/peer
 * @prop {IBasePeerConnect['peer'] | null} localPeer
 * @prop {IBasePeerConnect['peer'] | null} remotePeer
 * @prop {IBasePeerElement['video'] | null} localVideo
 * @prop {IBasePeerElement['video'] | null} remoteVideo
 * @prop {boolean} callBtnLoading
 * @prop {boolean} breakBtnLoading
 * @prop {boolean} recallBtnLoading
 * @prop {boolean} callBtnDisabled
 * @prop {boolean} breakBtnDisabled
 * @prop {boolean} recallBtnDisabled
 * @extends IBasePeerSteam
 * @extends IBasePeerTransport
 * @extends IBasePeerChannel
 */
export interface IPeerState extends IBasePeerSteam, IBasePeerTransport, IBasePeerChannel {
  localPeer: IBasePeerConnect['peer'];
  remotePeer: IBasePeerConnect['peer'];
  localVideo: IBasePeerElement['video'];
  remoteVideo: IBasePeerElement['video'];
  callBtnDisabled: boolean;
  breakBtnDisabled: boolean;
  recallBtnDisabled: boolean;
  callBtnLoading: boolean;
  breakBtnLoading: boolean;
  recallBtnLoading: boolean;
}
