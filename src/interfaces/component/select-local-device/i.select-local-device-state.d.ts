// i.select-remote-country-state.d.ts

import { type IBasePeerSteam } from '@interfaces/base/i.base-peer-steam';

/**
 * @typedef ISelectLocalDeviceState SelectRemoteCountry.tsx state
 * @module interfaces/component/select-local-device
 * @extends IBasePeerSteam
 * @prop {InputDeviceInfo[]} audioDevices
 * @prop {InputDeviceInfo[]} videoDevices
 */
export interface ISelectLocalDeviceState extends IBasePeerSteam {
  audioDevices: InputDeviceInfo[];
  videoDevices: InputDeviceInfo[];
}
