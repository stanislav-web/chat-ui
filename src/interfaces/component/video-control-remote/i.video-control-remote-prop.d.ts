import { type IBasePeerElement } from '@interfaces/base/i.base-peer-element';
import { type i18n } from 'i18next';

/**
 * @typedef IVideoControlRemoteProp VideoControlRemote.tsx properties
 * @module interfaces/component/video-control-local
 * @extends IBasePeerElement
 * @extends i18n
 */
export interface IVideoControlRemoteProp extends IBasePeerElement, Pick<i18n, 't'> {
}
