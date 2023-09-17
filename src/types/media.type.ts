/**
 * MediaTypeError type
 * @type {string|string|string}
 * @const
 */
 type MediaDevicesTypes = Pick<MediaDeviceKind, 'audioinput' | 'videoinput' | 'audiooutput'>;

export type {
  MediaDevicesTypes
}
