import { type IUserBrowser } from './i.user-browser';

/**
 * User account params interface
 */
export interface IUserAccountParams extends IUserBrowser {
  requestId?: string;
  visitorId: string;
  score?: number;
}
