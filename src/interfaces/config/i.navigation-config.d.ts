// i.navigation-config.d.ts

/**
 * @typedef INavigationConfig Navigation config interface
 * @module interfaces/config
 * @prop {string} title
 * @prop {string} href
 * @prop {string} onClick
 */
export interface INavigationConfig {
  title: string;
  href: string;
  onClick?: string;
}
