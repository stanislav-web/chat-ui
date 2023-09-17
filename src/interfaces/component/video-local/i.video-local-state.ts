// i.video-local-state.d.ts

import { type IBasePeerElement } from '@interfaces/base/i.base-peer-element';
import { type IBasePeerConnect } from '@interfaces/base/i.base-peer-connect';

/**
 * @typedef IVideoLocalState VideoLocal.tsx state
 * @module interfaces/component/video-local
 * @extends IBasePeerElement
 * @extends i18n
 */
export interface IVideoLocalState extends IBasePeerConnect, IBasePeerElement {
}
