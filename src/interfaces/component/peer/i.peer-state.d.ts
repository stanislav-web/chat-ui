// i.peer-state.d.ts

import { type IBasePeerSteam } from '@interfaces/base/i.base-peer-steam';
import { type IBasePeerElement } from '@interfaces/base/i.base-peer-element';

/**
 * @typedef IPeerState IPeer.tsx state
 * @module interfaces/component/peer
 * @extends {IBasePeerSteam}
 * @property {boolean} isPeerConnected
 * @property {boolean} isPeerReady
 * @property {boolean} isDevicesAvailable
 * @property {boolean} isCountriesAvailable
 * @property {IBasePeerElement['video']} localVideo
 * @property {IBasePeerElement['video']} remoteVideo
 * @property {boolean} callBtnLoading
 * @property {boolean} breakBtnLoading
 * @property {boolean} recallBtnLoading
 * @property {string} callBtnLabel
 * @property {boolean} callBtnDisabled
 * @property {boolean} breakBtnDisabled
 * @property {boolean} recallBtnDisabled
 */
export interface IPeerState extends IBasePeerSteam {
  isPeerConnected: boolean;
  isPeerReady: boolean;
  isDevicesAvailable: boolean;
  isCountriesAvailable: boolean;
  localVideo: IBasePeerElement['video'];
  remoteVideo: IBasePeerElement['video'];
  callBtnDisabled: boolean;
  callBtnLabel: string;
  breakBtnDisabled: boolean;
  recallBtnDisabled: boolean;
  callBtnLoading: boolean;
  breakBtnLoading: boolean;
  recallBtnLoading: boolean;
}
