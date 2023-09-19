// i.video-remote-state.d.ts

import { type IBasePeerElement } from '@interfaces/base/i.base-peer-element';
import { type IBasePeerConnect } from '@interfaces/base/i.base-peer-connect';
import { type IBasePeerTransport } from '@interfaces/base/i.base-peer-transport';

/**
 * @typedef IVideoRemoteState VideoRemote.tsx state
 * @module interfaces/component/video-remote
 * @extends IBasePeerTransport
 * @extends IBasePeerConnect
 * @extends IBasePeerElement
 */
export interface IVideoRemoteState extends IBasePeerTransport, IBasePeerConnect, IBasePeerElement {
}
