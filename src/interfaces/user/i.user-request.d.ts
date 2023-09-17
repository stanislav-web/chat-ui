// i.user-request.d.ts

import { type IUserBrowser } from './i.user-browser';
import { type UniqueId } from '@types/base.type';

/**
 * @typedef IUserRequest
 * @module interfaces/user User request interface
 * @prop {UniqueId} [requestId]
 * @prop {UniqueId} visitorId
 * @prop {number} [score]
 */
export interface IUserRequest extends IUserBrowser {
  readonly requestId?: UniqueId;
  readonly visitorId: UniqueId;
  readonly score?: number;
}
