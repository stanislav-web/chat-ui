// i.navbar.prop.d.ts

import { type i18n } from 'i18next';
import { type INavigationConfig } from '@interfaces/config/i.navigation-config';

/**
 * @typedef INavbarProp Navbar.tsx properties
 * @module interfaces/component/navbar
 * @param {Record<string, INavigationConfig>} navItems
 * @extends i18n
 */
export interface INavbarProp extends Pick<i18n, 't'> {
  navItems: Record<string, INavigationConfig>;
}
