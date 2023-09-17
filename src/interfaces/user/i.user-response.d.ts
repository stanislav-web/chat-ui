// i.user-response.d.ts

import { type IUser } from './i.user';
import { type ExceptionStatusType, type FailedStatusType, type SuccessStatusType } from '@types/http-status.type';

/**
 * @typedef IUserResponse
 * @module interfaces/user User response interfaces
 * @prop {SuccessStatusType|FailedStatusType|ExceptionStatusType} status
 * @prop {IUser} data
 */
export interface IUserResponse {
  readonly status: SuccessStatusType | FailedStatusType | ExceptionStatusType;
  readonly data: IUser;
}
