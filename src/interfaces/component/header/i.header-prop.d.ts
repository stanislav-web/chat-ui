// i.header.prop.d.ts

import { type i18n } from 'i18next';
import { type INavigationConfig } from '@interfaces/config/i.navigation-config';

/**
 * @typedef IHeaderProp Header.tsx properties
 * @module interfaces/component/header
 * @param {Record<string, INavigationConfig>} navItems
 * @extends i18n
 */
export interface IHeaderProp extends Pick<i18n, 't'> {
  navItems: Record<string, INavigationConfig>;
}
