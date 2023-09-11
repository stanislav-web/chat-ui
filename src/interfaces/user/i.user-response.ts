import { type IUser } from './i.user';
import { type Status } from '@types/http-status.type';

/**
 * UserResponse interface
 */
export interface IUserResponse {
  readonly status: Status;
  readonly data: IUser;
}
