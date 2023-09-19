// i.video-control-local-state.d.ts

import { type IBasePeerConnect } from '@interfaces/base/i.base-peer-connect';
import { type IBasePeerSteam } from '@interfaces/base/i.base-peer-steam';

/**
 * @typedef IVideoControlLocalState VideoControlLocal.tsx state
 * @module interfaces/component/video-control-local
 * @extends IBasePeerConnect
 * @extends IBasePeerSteam
 * @prop {HTMLButtonElement} callBtn
 * @prop {HTMLButtonElement} recallBtn
 * @prop {HTMLButtonElement} breakBtn
 */
export interface IVideoControlLocalState extends IBasePeerConnect, IBasePeerSteam {
  readonly callBtn: HTMLButtonElement;
  readonly recallBtn: HTMLButtonElement;
  readonly breakBtn: HTMLButtonElement;
}
