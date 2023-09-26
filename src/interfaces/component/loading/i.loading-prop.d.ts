/* eslint-disable @typescript-eslint/no-empty-interface */

// i.loading-prop.d.ts

import { type i18n } from 'i18next';

/**
 * @typedef ILoadingProp Loading.tsx properties
 * @module interfaces/component/loading
 * @extends i18n
 */
export interface ILoadingProp extends Pick<i18n, 't'> {
}
