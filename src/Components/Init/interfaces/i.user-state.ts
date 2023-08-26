import { type IUser } from './i.user';
import { type Socket } from 'socket.io-client';

/**
 * UserState interface
 */
export interface IUserState {
  hasError?: false;
  isCookieEnabled?: boolean;
  isUserAuthorized?: boolean;
  isUserBanned?: boolean;
  isSocketConnected?: boolean;
  user?: IUser | null;
  socket?: Socket | null;
  userBan?: null;
  access_token?: string | null;
}
