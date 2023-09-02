import { isCookiesEnabled } from './cookie.function';
import { getUserMediaDevices } from './media.function';
import { getSocketConnection, isSocketSupported } from './socket.function';
import { getUserFingerprint, getUserAccount, getUserBrowser } from './user.function';
import { isWebRTCSupported } from './webrtc.function';
import { notifyError, notifyInfo, notifySuccess } from './notification.function';
import { type IUserLoad, type IUserResponse } from '../Interfaces';
import { type Socket } from 'socket.io-client';
import { AppConfig } from '../Configuration/app.config';
import { EnvironmentEnum } from '../Enums/environment.enum';

/**
 * Get user info
 * @return Promise<IUserLoad | null>
 */
export async function getUserInfo(): Promise<IUserLoad | null> {
  if (!isWebRTCSupported()) {
    notifyError('WebRTC', 'Your browser is not support WebRTC');
  }
  if (!isSocketSupported()) {
    notifyError('WebSockets', 'Your browser is not support WebSockets');
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
      userAccount = await getUserAccount(require('../Mocks/user-payload.json'));
    }

    if (userAccount !== null) {
      if (userAccount.data.id === '') notifyError('Authorization', 'You are not authorized yet');
      if (userAccount.data.ban !== null) notifyError('Ban', 'You have been banned');
      response.user = userAccount.data;
    }
  } catch (error: any) {
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
