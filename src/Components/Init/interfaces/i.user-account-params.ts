import { type IUserBrowser } from './i.user-browser';

/**
 * User account params interface
 */
export interface IUserAccountParams extends IUserBrowser {
  readonly requestId?: string;
  readonly visitorId: string;
  readonly score?: number;
}
