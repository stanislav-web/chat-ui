import React from 'react';
import './Login.css';
import {
  AppleLoginButton,
  FacebookLoginButton,
  GithubLoginButton,
  GoogleLoginButton,
  LinkedInLoginButton,
  TwitterLoginButton
} from 'react-social-login-buttons';
import { type AuthProviderPath, type AuthProviderType } from '@types/auth-provider.type';
import { auth } from '@functions/auth.function';
import { type ILoginProps } from '@interfaces/component/login/i.login-props';
import { withTranslation } from 'react-i18next';
import { type ILoginState } from '@interfaces/component/login/i.login-state';
import { type ILogin } from '@interfaces/component/login/i.login';
import { Dialog } from 'primereact/dialog';

/**
 * Login app class
 * @module components
 * @extends React.Component<ILoginProps, ILoginState>
 * @implements ILogin
 */
class Login extends React.Component<ILoginProps, ILoginState> implements ILogin {
  /**
     * Constructor
     * @param {ILoginProps} props
     */
  constructor(props: ILoginProps) {
    super(props);
    this.state = {
      open: {}
    };
  }

  /**
     * Authentication provider handler
     * @param {AuthProviderType} provider
     * @param {AuthProviderPath} path
     * @return Promise<void>
     */
  onLogin (provider: AuthProviderType, path: AuthProviderPath): any {
    auth(provider, path);
    this.state.open[provider] = true;
    this.setState({ open: this.state.open });
  }

  render(): React.JSX.Element {
    const Header: React.ReactNode =
        <div className="modal-header">
            <span icon="pi pi-user">Login to Chat</span>
        </div>;
    const Footer: React.ReactNode = <div className="modal-footer">
      </div>;

    return (
        <Dialog
            header={Header}
            closable={false}
            closeOnEscape={false}
            draggable={false}
            modal={true}
            visible={true}
            style={{ width: '35vw' }}
            onHide={() => { }}
            footer={Footer}>
            <div className="space-y-6 social-logins">
                <FacebookLoginButton onClick={ () => {
                  this.onLogin('facebook', '/auth/facebook')
                }} crossorigin="anonymous" />
                <GoogleLoginButton onClick={ () => {
                  this.onLogin('google', '/auth/google')
                }} />
                <GithubLoginButton onClick={ () => {
                  this.onLogin('github', '/auth/github')
                }} />
                <TwitterLoginButton onClick={ () => {
                  this.onLogin('twitter', '/auth/twitter')
                }} />
                <LinkedInLoginButton onClick={ () => {
                  this.onLogin('linkedin', '/auth/linkedin')
                }} />
                <AppleLoginButton onClick={ () => {
                  this.onLogin('apple', '/auth/apple')
                }} />
            </div>
        </Dialog>
    )
  }
}

export default withTranslation()(Login);
