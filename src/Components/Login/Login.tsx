import React from 'react';
import {
  AppleLoginButton,
  FacebookLoginButton,
  GithubLoginButton,
  GoogleLoginButton,
  LinkedInLoginButton,
  TwitterLoginButton
} from 'react-social-login-buttons';
import { type AuthProviderPath, type AuthProviderType } from './types/auth-provider.type';
import { NotificationService } from '../../Services/notification.service';
import { auth } from './functions/auth.function';
import { type AxiosError } from 'axios';

class Login extends React.Component<any, any> {
  /**
     * Authentication provider handler
     * @param {AuthProviderType} provider
     * @param {AuthProviderPath} path
     * @return Promise<void>
     */
  handleAuth (provider: AuthProviderType, path: AuthProviderPath): void {
    auth(provider, path).catch((error: AxiosError) => {
      NotificationService.notifyError(
        `${provider} launch error`,
        error.message
      );
    });
  }

  render(): React.JSX.Element {
    return (
        <div className="social-logins">
            <FacebookLoginButton onClick={ () => {
              this.handleAuth('facebook', '/auth/facebook')
            }} />
            <GoogleLoginButton onClick={ () => {
              this.handleAuth('google', '/auth/google')
            }} />
            <GithubLoginButton onClick={ () => {
              this.handleAuth('github', '/auth/github')
            }} />
            <TwitterLoginButton onClick={ () => {
              this.handleAuth('twitter', '/auth/twitter')
            }} />
            <LinkedInLoginButton onClick={ () => {
              this.handleAuth('linkedin', '/auth/linkedin')
            }} />
            <AppleLoginButton onClick={ () => {
              this.handleAuth('apple', '/auth/apple')
            }} />
        </div>
    )
  }
}

export default Login;
