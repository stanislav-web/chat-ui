// i.video-control-remote.d.ts
import { type i18n } from 'i18next';
import { type IBasePeerTransport } from '@interfaces/base/i.base-peer-transport';

/**
 * @typedef IVideoControlRemoteState VideoControlRemote.tsx properties
 * @module interfaces/component/video-control-remote
 * @extends IBasePeerTransport
 * @extends i18n
 */
export interface IVideoControlRemoteState extends IBasePeerTransport, Pick<i18n, 't'> {
}
