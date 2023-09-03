import { type AuthProviderPath, type AuthProviderType } from '../types/auth-provider.type';
import { HttpConfig } from '../../../Configuration/http.config';
import { openPopUp } from '../../../Functions/window.function';

/**
 * Auth user via oauth
 * @param { AuthProviderType} provider
 * @param {AuthProviderPath} path
 * @return void
 */
export function auth(provider: AuthProviderType, path: AuthProviderPath): void {
  const authUrl = `${HttpConfig.baseURL as string}${path}`;
  const child = openPopUp(authUrl, provider, 600, 700);
  child.localStorage.setItem('auth', String(true));
}
