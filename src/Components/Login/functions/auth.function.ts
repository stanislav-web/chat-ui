import { type AuthProviderPath, type AuthProviderType } from '../types/auth-provider.type';
import { HttpConfig } from '../../../Configuration/http.config';

/**
 * Auth user via oauth
 * @param { AuthProviderType} provider
 * @param {AuthProviderPath} path
 * @return void
 */
export function auth(provider: AuthProviderType, path: AuthProviderPath): Promise<any> {
  const authUrl = `${HttpConfig.baseURL as string}${path}`;
  return popup(authUrl, provider);
}

async function popup(url: string, provider: AuthProviderType): Promise<any> {
  const child = window.open(url, provider, 'toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes');
  await new Promise((resolve) => {
    const ke = (): void => {
      setTimeout(() => {
        if (!child || child.closed) {
          resolve(true);
          return
        }
        ke()
      }, 500);
    };
    ke()
  });
  window.location.reload()
}
