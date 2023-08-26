import axios from 'axios';
import { type AuthProviderPath, type AuthProviderType } from '../types/auth-provider.type';

/**
 * Auth user via oauth
 * @param { AuthProviderType} provider
 * @param {AuthProviderPath} path
 */
export function auth(provider: AuthProviderType, path: AuthProviderPath): Promise<void> {
  return axios.get(path);
}
