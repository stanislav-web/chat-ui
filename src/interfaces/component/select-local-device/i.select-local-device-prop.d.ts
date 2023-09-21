// i.select-local-device-prop.d.ts

import { type IBasePeerSteam } from '@interfaces/base/i.base-peer-steam';
import { type i18n } from 'i18next';
import { type IBasePeerConnect } from '@interfaces/base/i.base-peer-connect';
import { type IBasePeerElement } from '@interfaces/base/i.base-peer-element';

/**
 * @typedef ISelectLocalDeviceProp SelectLocalDevice.tsx props
 * @module interfaces/component/select-local-device
 * @extends i18n
 * @extends IBasePeerSteam
 * @extends IBasePeerConnect
 * @extends IBasePeerElement
 */
export interface ISelectLocalDeviceProp extends IBasePeerSteam, IBasePeerConnect, IBasePeerElement, Pick<i18n, 't'> {
  /**
     * On Stream change
     * @param {IBasePeerSteam['stream']} stream
     */
  readonly onStreamChange: (stream: IBasePeerSteam['stream']) => void;
}
