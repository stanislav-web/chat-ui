import { type IUser } from './i.user';

/**
 * UserResponse interface
 */
export interface IUserResponse {
  readonly status: number;
  readonly data: IUser;
}
