// i.init-state.d.ts

import { type IUser } from '../../user/i.user';
import { type IBasePeerSteam } from '@interfaces/base/i.base-peer-steam';

/**
 * @typedef IInitState Init.tsx state
 * @module interfaces/component/init
 * @extends IBasePeerSteam
 * @prop {boolean} isUserAgree
 * @prop {boolean} isUserLogin
 * @prop {IUser | null} user
 */
export interface IInitState extends IBasePeerSteam {
  readonly isUserAgree: boolean;
  readonly isUserLogin: boolean;
  readonly user: IUser | null;
}
