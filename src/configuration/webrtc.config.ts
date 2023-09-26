import { AppConfig } from '@configuration/app.config';

export const WebrtcConfig: RTCConfiguration = {
  bundlePolicy: 'balanced',
  iceCandidatePoolSize: parseInt(process.env.REACT_APP_WEB_RTC_POOL_SIZE),
  iceTransportPolicy: AppConfig.isProduction ? 'relay' : 'all',
  rtcpMuxPolicy: 'require'
}
