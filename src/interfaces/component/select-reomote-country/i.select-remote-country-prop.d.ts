// i.select-remote-country-prop.d.ts

import { type i18n } from 'i18next';

/**
 * @typedef ISelectRemoteCountryProp SelectRemoteCountry.tsx props
 * @module interfaces/component/select-remote-country
 * @extends i18n
 */
export interface ISelectRemoteCountryProp extends Pick<i18n, 't'> {
  /**
     * On Countries change
     * @param {Array<CountryListItem['code']> | []} countries
     */
  readonly onCountriesChange: (countries: Array<CountryListItem['code']> | []) => void;
}
