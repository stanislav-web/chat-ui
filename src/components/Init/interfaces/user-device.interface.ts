/**
 * UserDeviceInterface
 */
export interface UserDeviceInterface {
  deviceId: string;
  browser: string;
  browserVersion: string;
  deviceModel: string;
  deviceBrand: string;
  deviceFamily: string;
  os: string;
  osVersion: string;
  region: string;
  ipAddress?: string;
  languages?: string[];
  city?: string;
  cityLatLong?: string;
  countryCode?: string;
  countryName?: string;
  currencies?: string[];
}
