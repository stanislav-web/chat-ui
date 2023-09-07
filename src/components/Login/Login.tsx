import React from 'react';
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
import { Modal, type ModalProps } from 'flowbite-react';

class Login extends React.Component<any, any> {
  /**
     * Constructor
     * @param {any} props
     */
  constructor(props: ModalProps | any) {
    super(props);
    this.state = {
      setOpenModal: 'default' as string | undefined,
      openModal: 'default' as string | undefined
    };
  }

  /**
     * Authentication provider handler
     * @param {AuthProviderType} provider
     * @param {AuthProviderPath} path
     * @return Promise<void>
     */
  handleAuth (provider: AuthProviderType, path: AuthProviderPath): any {
    auth(provider, path);
  }

  render(): React.JSX.Element {
    const { openModal } = this.state;
    return (
        <Modal show={openModal === 'default'}>
            <Modal.Header>Login</Modal.Header>
            <Modal.Body>
                <div className="space-y-6 social-logins">
                        <FacebookLoginButton onClick={ () => {
                          this.handleAuth('facebook', '/auth/facebook')
                        }} crossorigin="anonymous" />
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
            </Modal.Body>
            <Modal.Footer>
            </Modal.Footer>
        </Modal>
    )
  }
}

export default Login;
