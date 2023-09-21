// i.footer.prop.d.ts

import { type i18n } from 'i18next';
import { type INavigationConfig } from '@interfaces/config/i.navigation-config';

/**
 * @typedef IFooterProp Footer.tsx properties
 * @module interfaces/component/footer
 * @param {Record<string, INavigationConfig>} navItems
 * @extends i18n
 */
export interface IFooterProp extends Pick<i18n, 't'> {
  navItems: Record<string, INavigationConfig>;
}
