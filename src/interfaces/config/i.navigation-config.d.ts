// i.navigation-config.d.ts

/**
 * @typedef INavigationConfig Navigation config interface
 * @module interfaces/config
 * @property {string} title
 * @property {string} href
 * @property {string} onClick
 */
export interface INavigationConfig {
  title: string;
  href: string;
  onClick?: string;
}
