// i.init-state.d.ts

import { type IUser } from '../../user/i.user';
import { type IBasePeerSteam } from '@interfaces/base/i.base-peer-steam';

/**
 * @typedef IInitState Init.tsx state
 * @module interfaces/component/init
 * @extends IBasePeerSteam
 * @property {boolean} isUserAgree
 * @property {boolean} isUserLogin
 * @property {IUser | null} user
 */
export interface IInitState extends IBasePeerSteam {
  readonly isLoaded: boolean;
  readonly isUserAgree: boolean;
  readonly isUserLogin: boolean;
  readonly user: IUser | null;
}
