import { type IUserBrowser } from './i.user-browser';
import { type UniqueId } from '@types/user.type';

/**
 * User account params interface
 */
export interface IUserAccountParams extends IUserBrowser {
  readonly requestId?: UniqueId;
  readonly visitorId: UniqueId;
  readonly score?: number;
}
