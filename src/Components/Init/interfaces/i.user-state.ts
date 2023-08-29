import { type IUser } from './i.user';

/**
 * UserState interface
 */
export interface IUserState {
  hasError?: false;
  readonly user?: IUser | null;
}
