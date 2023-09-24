// i.media-local-state.d.ts

import { type IBasePeerElement } from '@interfaces/base/i.base-peer-element';
import { type IBasePeerSteam } from '@interfaces/base/i.base-peer-steam';

/**
 * @typedef IVideoLocalState VideoLocal.tsx state
 * @module interfaces/component/video-local
 * @extends IBasePeerElement
 * @extends IBasePeerSteam
 * @prop {boolean} callBtnLoading
 * @prop {boolean} breakBtnLoading
 * @prop {boolean} recallBtnLoading
 * @prop {boolean} callBtnDisabled
 * @prop {boolean} breakBtnDisabled
 * @prop {boolean} recallBtnDisabled
 */
export interface IVideoLocalState extends IBasePeerSteam, IBasePeerElement {
  callBtnDisabled: boolean;
  breakBtnDisabled: boolean;
  recallBtnDisabled: boolean;
  callBtnLoading: boolean;
  breakBtnLoading: boolean;
  recallBtnLoading: boolean;
}
