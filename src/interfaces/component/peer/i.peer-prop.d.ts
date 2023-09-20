/* eslint-disable @typescript-eslint/no-empty-interface */

// i.peer-prop.d.ts

import { type i18n } from 'i18next';
import { type IBasePeerSteam } from '@interfaces/base/i.base-peer-steam';
import { type IUser } from '@interfaces/user/i.user';

/**
 * @typedef IPeerProp Peer.tsx properties
 * @module interfaces/component/peer
 * @extends IBasePeerSteam
 * @extends IUser
 * @extends i18n
 */
export interface IPeerProp extends IBasePeerSteam, Pick<i18n, 't'> {
  readonly user: IUser;
}
