// i.select-remote-country-prop.d.ts

import { type i18n } from 'i18next';
import { type IBasePeerElement } from '@interfaces/base/i.base-peer-element';

/**
 * @typedef ISelectRemoteCountryProp SelectRemoteCountry.tsx props
 * @module interfaces/component/select-remote-country
 * @extends i18n
 * @extends IBasePeerElement
 */
export interface ISelectRemoteCountryProp extends IBasePeerElement, Pick<i18n, 't'> {

}
