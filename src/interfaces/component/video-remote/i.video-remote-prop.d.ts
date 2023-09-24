// i.media-remote-prop.d.ts

import { type IBasePeerTransport } from '@interfaces/base/i.base-peer-transport';
import { type i18n } from 'i18next';
import { type IUser } from '@interfaces/user/i.user';

/**
 * @typedef IVideoRemoteProp VideoRemote.tsx properties
 * @module interfaces/component/video-remote
 * @extends IUser
 * @extends IBasePeerSteam
 * @extends i18n
 */
export interface IVideoRemoteProp extends IBasePeerTransport, Pick<i18n, 't'> {
  user: IUser;
}
