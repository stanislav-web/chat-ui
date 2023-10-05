// i.user-browser.d.ts
import { type UniqueId } from '@types/base.type';

/**
 * @typedef IUserBrowser
 * @module interfaces/user User browser interface
 * @property {UniqueId} deviceId
 * @property {string} browser
 * @property {string} browserVersion
 * @property {string} deviceModel
 * @property {string} deviceBrand
 * @property {string} deviceFamily
 * @property {string} os
 * @property {string} osVersion
 * @property {string} region
 * @property {string} [ipAddress]
 * @property {string[]} [languages]
 * @property {string} [city]
 * @property {string} [cityLatLong]
 * @property {string} [countryCode]
 * @property {string} [countryName]
 * @property {string[]} [currencies]
 */
export interface IUserBrowser {
  readonly deviceId: UniqueId;
  readonly browser: string;
  readonly browserVersion: string;
  readonly deviceModel: string;
  readonly deviceBrand: string;
  readonly deviceFamily: string;
  readonly os: string;
  readonly osVersion: string;
  readonly region: string;
  readonly ipAddress?: string;
  readonly languages?: string[];
  readonly city?: string;
  readonly cityLatLong?: string;
  readonly countryCode?: string;
  readonly countryName?: string;
  readonly currencies?: string[];
}
