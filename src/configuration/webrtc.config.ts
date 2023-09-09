import { AppConfig } from '@configuration/app.config';

export const WebrtcConfig: RTCConfiguration = {
  bundlePolicy: 'balanced',
  iceServers: [
    {
      urls: ['stun:23.21.150.121:3478', 'stun:iphone-stun.strato-iphone.de:3478', 'stun:numb.viagenie.ca:3478']
    }
  ],
  iceTransportPolicy: AppConfig.isProduction ? 'relay' : 'all'
}
