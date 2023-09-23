// i.select-remote-country.d.ts

/**
 * @typedef ISelectRemoteCountry SelectRemoteCountry.tsx
 * @module interfaces/component/select-remote-country
 */
export interface ISelectRemoteCountry {
  /**
   * On countries change event handler
   * @param {Array<CountryListItem['code']> | []} countries
   * @return void
   */
  readonly onCountriesChange: (countries: Array<CountryListItem['code']> | []) => void;
}
