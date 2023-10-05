// i.user-request.d.ts

import { type IUserBrowser } from './i.user-browser';
import { type UniqueId } from '@types/base.type';

/**
 * @typedef IUserRequest
 * @module interfaces/user User request interface
 * @property {UniqueId} [requestId]
 * @property {UniqueId} visitorId
 * @property {number} [score]
 */
export interface IUserRequest extends IUserBrowser {
  readonly requestId?: UniqueId;
  readonly visitorId: UniqueId;
  readonly score?: number;
}
