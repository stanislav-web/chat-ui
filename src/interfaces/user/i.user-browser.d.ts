// i.user-browser.d.ts
import { type UniqueId } from '@types/base.type';

/**
 * @typedef IUserBrowser
 * @module interfaces/user User browser interface
 * @prop {UniqueId} deviceId
 * @prop {string} browser
 * @prop {string} browserVersion
 * @prop {string} deviceModel
 * @prop {string} deviceBrand
 * @prop {string} deviceFamily
 * @prop {string} os
 * @prop {string} osVersion
 * @prop {string} region
 * @prop {string} [ipAddress]
 * @prop {string[]} [languages]
 * @prop {string} [city]
 * @prop {string} [cityLatLong]
 * @prop {string} [countryCode]
 * @prop {string} [countryName]
 * @prop {string[]} [currencies]
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
