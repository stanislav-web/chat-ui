/* eslint-disable @typescript-eslint/no-empty-interface */

// i.peer-prop.d.ts

import { type i18n } from 'i18next';
import { type IBasePeerSteam } from '@interfaces/base/i.base-peer-steam';

/**
 * @typedef IPeerProp Peer.tsx properties
 * @module interfaces/component/peer
 * @extends i18n
 * @extends IBasePeerSteam
 */
export interface IPeerProp extends IBasePeerSteam, Pick<i18n, 't'> {
}
