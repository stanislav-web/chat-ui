import DetectRTC from 'detectrtc';

/**
 * Is WebRTC supported by browser
 * @return boolean
 */
export function isWebRTCSupported(): boolean {
  return DetectRTC.isWebRTCSupported;
}
