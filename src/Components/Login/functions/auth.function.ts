import { type AuthProviderPath, type AuthProviderType } from '../types/auth-provider.type';
import { HttpConfig } from '../../../Configuration/http.config';

/**
 * Auth user via oauth
 * @param { AuthProviderType} provider
 * @param {AuthProviderPath} path
 * @return void
 */
export function auth(provider: AuthProviderType, path: AuthProviderPath): void {
  const authUrl = `${HttpConfig.baseURL as string}${path}`;
  popup(authUrl, provider);
}
function popup(url: string, provider: AuthProviderType): any {
  (function(wrapped) {
    window.open = function(): any {
      const win = wrapped.apply(this, arguments as any);
      const i = setInterval(function() {
        if (win?.closed) {
          clearInterval(i);
        }
      }, 100);
    };
  })(window.open)
  window.open(url, provider as string, 'width=800,height=600,scrollbars=yes');
}
