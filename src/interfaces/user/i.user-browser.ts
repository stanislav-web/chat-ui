import { type UniqueId } from '@types/user.type';

/**
 * UserBrowser interface
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
