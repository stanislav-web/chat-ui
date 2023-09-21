// i.video-control-local-state.d.ts

import { type IBasePeerConnect } from '@interfaces/base/i.base-peer-connect';
import { type IBasePeerSteam } from '@interfaces/base/i.base-peer-steam';

/**
 * @typedef IVideoControlLocalState VideoControlLocal.tsx state
 * @module interfaces/component/video-control-local
 * @extends IBasePeerConnect
 * @extends IBasePeerSteam
 * @prop {Boolean} callBtnLoading
 * @prop {Boolean} breakBtnLoading
 * @prop {Boolean} recallBtnLoading
 */
export interface IVideoControlLocalState extends IBasePeerConnect, IBasePeerSteam {
  callBtnLoading: boolean;
  breakBtnLoading: boolean;
  recallBtnLoading: boolean;
}
