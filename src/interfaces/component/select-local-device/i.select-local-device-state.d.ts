// i.select-local-device-state.d.ts

import { type IBasePeerSteam } from '@interfaces/base/i.base-peer-steam';

/**
 * @typedef ISelectLocalDeviceState SelectLocalDevice.tsx state
 * @module interfaces/component/select-local-device
 * @extends IBasePeerSteam
 * @prop {InputDeviceInfo[]} audioDevices
 * @prop {InputDeviceInfo[]} videoDevices
 */
export interface ISelectLocalDeviceState extends IBasePeerSteam {
  audioDevices: InputDeviceInfo[];
  videoDevices: InputDeviceInfo[];
}
