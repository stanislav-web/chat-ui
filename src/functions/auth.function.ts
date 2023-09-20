import { type AuthProviderPath, type AuthProviderType, type LogoutPath, type RefreshTokenPath } from '@types/auth-provider.type';
import { HttpConfig } from '@configuration/http.config';
import { openPopUp, redirectPage } from './window.function';
import axios, { AxiosError } from 'axios';
import { UserException } from '@exceptions/user.exception';

/**
 * Auth user via oauth
 * @module functions
 * @param {AuthProviderType} provider
 * @param {AuthProviderPath} path
 * @return void
 */
export const auth = (provider: AuthProviderType, path: AuthProviderPath): void => {
  const authUrl = `${HttpConfig.baseURL as string}${path}`;
  const child = openPopUp(authUrl, provider, 650, 700);
  child.localStorage.setItem('auth', String(true));
}

/**
 * Refresh authentication
 * @module functions
 * @param {RefreshTokenPath} path
 * @throws UserException
 * @return Promise<void>
 */
export const refreshAuth = async (path: RefreshTokenPath): Promise<void> => {
  const authUrl = `${HttpConfig.baseURL as string}${path}`;
  try {
    await axios.post(authUrl);
  } catch (error: any) {
    if (error instanceof AxiosError) {
      throw new UserException(error.name, error.message);
    } else {
      const typedError = error as Error;
      throw new UserException(typedError.name, typedError.message);
    }
  }
}

/**
 * Logout user
 * @module functions
 * @param {RefreshTokenPath} path
 * @throws UserException
 * @return Promise<void>
 */
export const logout = async (path: LogoutPath): Promise<void> => {
  const authUrl = `${HttpConfig.baseURL as string}${path}`;
  try {
    await axios.post(authUrl);
    redirectPage();
  } catch (error: any) {
    if (error instanceof AxiosError) {
      throw new UserException(error.name, error.message);
    } else {
      const typedError = error as Error;
      throw new UserException(typedError.name, typedError.message);
    }
  }
}
