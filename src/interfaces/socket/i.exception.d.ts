// i.exception.d.ts

import { type ExceptionStatusType, type FailedStatusType, type SuccessStatusType } from '@types/http-status.type';

/**
 * @typedef IException
 * @module interfaces/socket Socket exception interface
 * @prop {SuccessStatusType|FailedStatusType|ExceptionStatusType} status
 * @prop {any} message
 */
export interface IException {
  readonly status: SuccessStatusType | FailedStatusType | ExceptionStatusType;
  readonly message: any;
}
