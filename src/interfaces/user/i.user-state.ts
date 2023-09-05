import { type IUser } from './i.user';

/**
 * UserState interface
 */
export interface IUserState {
  hasError?: false;
  readonly isUserAgree?: boolean;
  readonly isUserLogin?: boolean;
  readonly user?: IUser | null;
}
