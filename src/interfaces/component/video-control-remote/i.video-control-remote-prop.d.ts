// i.video-control-remote.d.ts
import { type IBasePeerElement } from '@interfaces/base/i.base-peer-element';
import { type i18n } from 'i18next';
import { type IBasePeerTransport } from '@interfaces/base/i.base-peer-transport';

/**
 * @typedef IVideoControlRemoteProp VideoControlRemote.tsx properties
 * @module interfaces/component/video-control-remote
 * @extends IBasePeerTransport
 * @extends IBasePeerElement
 * @extends i18n
 */
export interface IVideoControlRemoteProp extends IBasePeerTransport, IBasePeerElement, Pick<i18n, 't'> {
}
