import { isCookiesEnabled } from './cookie.function';
import { getUserMediaDevices } from './media.function';
import { getSocketConnection } from './socket.function';
import { getUserFingerprint, getUserAccount, getUserBrowser } from './user.function';
import { getPeerInfo } from './webrtc.function';
import { notifyError, notifyInfo, notifySuccess } from './notification.function';
import { type Socket } from 'socket.io-client';
import { AppConfig } from '@configuration/app.config';
import { EnvironmentEnum } from '@enums/environment.enum';
import { type IUserLoad } from '@interfaces/user/i.user-load';
import { type IUserResponse } from '@interfaces/user/i.user-response';
import { type IUserAccountParams } from '@interfaces/user/i.user-account-params';

/**
 * Get user info
 * @return Promise<IUserLoad | null>
 */
export async function getUserInfo(): Promise<IUserLoad | null> {
  const peerInfo = getPeerInfo();
  console.info({ peerInfo });
  if (!peerInfo.isWebRTCSupported) {
    notifyError('WebRTC', 'Your browser is not support WebRTC');
  }
  if (!peerInfo.isWebSocketsSupported) {
    notifyError('WebSockets', 'Your browser is not support WebSockets');
  }
  if (peerInfo.isWebSocketsBlocked) {
    notifyError('WebSockets', 'Your WebSockets has been blocked');
  }
  if (!isCookiesEnabled()) {
    notifyError('Cookies', 'Please enable cookies');
  }
  const response: IUserLoad = {
    devices: null,
    user: null
  }
  try {
    response.devices = await getUserMediaDevices();
  } catch (_) {
    notifyError('Media', 'Please enable media access');
  }

  let userAccount: IUserResponse | null;

  try {
    if (AppConfig.environment !== EnvironmentEnum.DEVELOPMENT) {
      const browser = await getUserBrowser();
      const fingerprint = await getUserFingerprint();
      userAccount = await getUserAccount({
        requestId: fingerprint.requestId,
        visitorId: fingerprint.visitorId,
        score: fingerprint.confidence.score,
        ...browser
      });
    } else {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      userAccount = await getUserAccount(require('../mocks/user-payload.json') as IUserAccountParams);
    }

    if (userAccount !== null) {
      if (userAccount.data.id === '') notifyError('Authorization', 'You are not authorized yet');
      if (userAccount.data.ban !== null) notifyError('Ban', 'You have been banned');
      response.user = userAccount.data;
    }
  } catch (error: Error) {
    notifyError('Error', error.message);
  }
  return response;
}

/**
 * Connect chat
 * @return void
 */
export function connectSocket(): void {
  const { socket } = getSocketConnection();
  socket.on('connect', (): void => {
    notifySuccess('Connection', 'Welcome to Chat', 3000);
  });
  socket.on('disconnect', (reason: Socket.DisconnectReason): void => {
    notifyInfo('Disconnected', reason);
  });
  socket.on('connect_error', (error: Error): void => {
    notifyError('Disconnected', error);
  });
  socket.on('exception', (data): void => {
    notifyError('Exception', data);
  });
}
