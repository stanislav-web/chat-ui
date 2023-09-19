// i.video-control-local-prop.d.ts

import { type IBasePeerSteam } from '@interfaces/base/i.base-peer-steam';
import { type IBasePeerTransport } from '@interfaces/base/i.base-peer-transport';
import { type IBasePeerElement } from '@interfaces/base/i.base-peer-element';
import { type i18n } from 'i18next';
import { type IUser } from '@interfaces/user/i.user';

/**
 * @typedef IVideoControlLocalProp VideoControlLocal.tsx properties
 * @module interfaces/component/video-control-local
 * @extends IBasePeerSteam
 * @extends IBasePeerTransport
 * @extends IBasePeerElement
 * @extends IUser
 * @extends i18n
 */
export interface IVideoControlLocalProp extends IBasePeerSteam, IBasePeerTransport, IBasePeerElement, Pick<i18n, 't'> {
  user: IUser;
}
