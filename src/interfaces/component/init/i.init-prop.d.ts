/* eslint-disable @typescript-eslint/no-empty-interface */

// i.init-prop.d.ts

import { type i18n } from 'i18next';

/**
 * @typedef IInitProp Init.tsx properties
 * @module interfaces/component/init
 * @extends i18n
 */
export interface IInitProp extends Pick<i18n, 't'> {

}
