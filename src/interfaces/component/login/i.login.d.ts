// i.login.d.ts

import { type AuthProviderPath, type AuthProviderType } from '@types/auth-provider.type';

/**
 * @typedef ILogin Login.tsx class interface
 * @module interfaces/component/login
 */
export interface ILogin {
  /**
   * On user call login
   * @param {AuthProviderType} provider
   * @param {AuthProviderPath} path
   * @return void
   */
  onLogin: (provider: AuthProviderType, path: AuthProviderPath) => void;
}
