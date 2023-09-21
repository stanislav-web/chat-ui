// i.select-remote-country.d.ts

import { type MultiSelectChangeEvent } from 'primereact/multiselect';

/**
 * @typedef ISelectRemoteCountry SelectRemoteCountry.tsx
 * @module interfaces/component/select-remote-country
 */
export interface ISelectRemoteCountry {
  /**
   * On country change event handler
   * @param {MultiSelectChangeEvent} event
   * @return void
   */
  readonly onCountryChange: (event: MultiSelectChangeEvent) => void;
}
