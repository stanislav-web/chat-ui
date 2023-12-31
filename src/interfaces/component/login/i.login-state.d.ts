// i.login-state.d.ts

import { type AuthProviderType } from '@types/auth-provider.type';

/**
 * @typedef ILoginState Login.tsx state
 * @module interfaces/component/login
 * @property {boolean} isHidden
 */
export interface ILoginState {
  open: Record<AuthProviderType, boolean>;
}
