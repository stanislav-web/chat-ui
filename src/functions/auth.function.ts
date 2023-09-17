import { type AuthProviderPath, type AuthProviderType } from '@types/auth-provider.type';
import { HttpConfig } from '@configuration/http.config';
import { openPopUp } from './window.function';

/**
 * Auth user via oauth
 * @module functions
 * @param { AuthProviderType} provider
 * @param {AuthProviderPath} path
 * @return void
 */
export const auth = (provider: AuthProviderType, path: AuthProviderPath): void => {
  const authUrl = `${HttpConfig.baseURL as string}${path}`;
  const child = openPopUp(authUrl, provider, 650, 700);
  child.localStorage.setItem('auth', String(true));
}
