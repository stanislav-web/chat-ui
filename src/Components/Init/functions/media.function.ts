import JsMediaDevices from 'js-media-devices';

/**
 * Get user media devices
 * @return Promise<MediaDeviceInfo[]>
 */
export function getUserMediaDevices(): Promise<MediaDeviceInfo[]> {
  const jsMediaDevices = new JsMediaDevices();
  return jsMediaDevices.getDeviceList();
}
