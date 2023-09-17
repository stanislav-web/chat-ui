// i.select-local-device.d.ts

import { type SyntheticEvent } from 'react';

/**
 * @typedef ISelectLocalDevice SelectLocalDevice.tsx
 * @module interfaces/component/select-local-device
 */
export interface ISelectLocalDevice {
  /**
   * On video device change event handler
   * @param {SyntheticEvent<EventTarget>} event
   * @return void
   */
  onVideoChange: (event: SyntheticEvent<EventTarget>) => void;

  /**
   * On audio device change event handler
   * @param {SyntheticEvent<EventTarget>} event
   * @return void
   */
  onAudioChange: (event: SyntheticEvent<EventTarget>) => void;
}
