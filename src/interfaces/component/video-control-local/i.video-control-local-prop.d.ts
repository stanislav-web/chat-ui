// i.video-control-local-prop.d.ts

import { type IBasePeerConnect } from '@interfaces/base/i.base-peer-connect';
import { type IBasePeerSteam } from '@interfaces/base/i.base-peer-steam';
import { type IBasePeerTransport } from '@interfaces/base/i.base-peer-transport';
import { type IBasePeerElement } from '@interfaces/base/i.base-peer-element';
import { type i18n } from 'i18next';

/**
 * @typedef IVideoControlLocalProp VideoControlLocal.tsx properties
 * @module interfaces/component/video-control-local
 * @extends IBasePeerConnect
 * @extends IBasePeerSteam
 * @extends IBasePeerTransport
 * @extends IBasePeerElement
 * @extends i18n
 */
export interface IVideoControlLocalProp extends IBasePeerConnect, IBasePeerSteam, IBasePeerTransport, IBasePeerElement, Pick<i18n, 't'> {
}
