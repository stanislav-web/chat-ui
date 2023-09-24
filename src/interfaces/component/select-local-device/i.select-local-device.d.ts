// i.select-remote-country.d.ts

import { type DropdownChangeEvent } from 'primereact/dropdown';

/**
 * @typedef ISelectLocalDevice SelectRemoteCountry.tsx
 * @module interfaces/component/select-local-device
 */
export interface ISelectLocalDevice {
  /**
   * On media device change event handler
   * @param {DropdownChangeEvent} value
   * @return void
   */
  onVideoChange: (value: DropdownChangeEvent) => void;

  /**
   * On audio device change event handler
   * @param {DropdownChangeEvent} event
   * @return void
   */
  onAudioChange: (value: DropdownChangeEvent) => void;
}
