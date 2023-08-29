import axios, { type AxiosResponse } from 'axios';
import { type AuthProviderPath, type AuthProviderType } from '../types/auth-provider.type';

/**
 * Auth user via oauth
 * @param { AuthProviderType} provider
 * @param {AuthProviderPath} path
 * @return Promise<AxiosResponse>
 */
export function auth(provider: AuthProviderType, path: AuthProviderPath): Promise<AxiosResponse> {
  return axios.get(path);
}
