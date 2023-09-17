// i.video-local-prop.d.ts

import { type IBasePeerTransport } from '@interfaces/base/i.base-peer-transport';
import { type IBasePeerSteam } from '@interfaces/base/i.base-peer-steam';
import { type i18n } from 'i18next';

/**
 * @typedef IVideoLocalProp VideoLocal.tsx properties
 * @module interfaces/component/video-local
 * @extends IBasePeerTransport
 * @extends IBasePeerSteam
 * @extends i18n
 */
export interface IVideoLocalProp extends IBasePeerTransport, IBasePeerSteam, Pick<i18n, 't'> {

}
