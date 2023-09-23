// i.select-remote-country-state.d.ts

import { type IBasePeerSteam } from '@interfaces/base/i.base-peer-steam';

/**
 * @typedef ISelectRemoteCountryState SelectRemoteCountry.tsx state
 * @module interfaces/component/select-remote-country
 * @extends IBasePeerSteam
 * @prop {InputDeviceInfo[]} countries
 * @prop {Array<CountryListItem['code']>} selected
 */
export interface ISelectRemoteCountryState extends IBasePeerSteam {
  countries: CountryListItem[];
  selected: Array<CountryListItem['code']> | [];
}
