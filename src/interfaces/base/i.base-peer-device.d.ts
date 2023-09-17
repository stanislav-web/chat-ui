// i.base-peer-device.d.ts

/**
 * @typedef IBasePeerDevice
 * @module interfaces/base Peer device
 * @prop {MediaDeviceInfo[] | []} devices
 */
export interface IBasePeerDevice {
  readonly devices: MediaDeviceInfo[] | [];
}
