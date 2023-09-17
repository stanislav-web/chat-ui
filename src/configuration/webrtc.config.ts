import { AppConfig } from '@configuration/app.config';

export const WebrtcConfig: RTCConfiguration = {
  bundlePolicy: 'balanced',
  iceServers: [
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' }
  ],
  iceCandidatePoolSize: parseInt(process.env.REACT_APP_WEB_RTC_POOL_SIZE),
  iceTransportPolicy: AppConfig.isProduction ? 'relay' : 'all',
  rtcpMuxPolicy: 'require'
}
