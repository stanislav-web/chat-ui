import Swal from 'sweetalert2';
import React from 'react';
import {
  FacebookLoginButton,
  GoogleLoginButton,
  GithubLoginButton,
  TwitterLoginButton,
  LinkedInLoginButton,
  AppleLoginButton
} from 'react-social-login-buttons';
import { getSocketConnection } from './functions/socket.function';
import { isCookiesEnabled } from './functions/cookie.function';
import { getUser } from './functions/user.function';
import { type IUser, type IUserProp, type IUserState } from './interfaces';
import { withCookies, Cookies } from 'react-cookie';
import { instanceOf } from 'prop-types';
import { auth } from './functions/auth.function';
import { type AuthProviderPath, type AuthProviderType } from './types/auth-provider.type';
import { type Socket } from 'socket.io-client';
import { NotificationService } from '../../services/notification.service';

class Init extends React.Component<IUserProp, Partial<IUserState>> {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired
  };

  /**
   * Constructor
   * @param {IUserProp} props
   */
  constructor(props: IUserProp) {
    super(props);
    this.state = {
      isCookieEnabled: false,
      isUserAuthorized: false,
      isUserBanned: false,
      isSocketConnected: false,
      user: null,
      userBan: null,
      socket: null,
      access_token: null
    };
  }

  async componentDidMount(): Promise<void> {
    if (!this.isCookiesEnabled()) {
      NotificationService.notifyError('Cookies', 'Please enable cookies');
    }

    const user = await this.getUser();
    if (user.id === '') NotificationService.notifyError('Authorization', 'You are not authorized yet');
    if (user?.ban !== null) NotificationService.notifyError('Ban', 'You have been banned');

    this.startChat();
  }

  /**
     * Check cookies state
     * @return boolean
     */
  private isCookiesEnabled(): boolean {
    if (isCookiesEnabled()) {
      this.setState({
        access_token: this.props.cookies.get('access_token'),
        isCookieEnabled: true
      });
      return true;
    }
    return false;
  }

  /**
     * Check user state
     * @return Promise<IUser>
     */
  private async getUser(): Promise<IUser> {
    const { data } = await getUser();
    this.setState({
      isUserAuthorized: true,
      isUserBanned: data.ban !== null,
      user: data
    });
    return data;
  }

  /**
     * Get socket state
     * @return void
     */
  private startChat(): void {
    const socket = getSocketConnection();
    const connection = socket.connect();
    socket.on('connect', (): void => {
      this.setState({ socket: connection, isSocketConnected: connection.connected });
      NotificationService.notifySuccess('Connection', 'Welcome to Chat');
    });
    socket.on('disconnect', (reason: Socket.DisconnectReason): void => {
      this.setState({ isSocketConnected: false, socket: null });
      NotificationService.notifyInfo('Disconnected', reason);
    });
    socket.on('connect_error', (error: Error): void => {
      this.setState({ isSocketConnected: false, socket: null });
      NotificationService.notifyError('Disconnected', error);
    });
    socket.on('exception', (data): void => {
      this.setState({ isSocketConnected: false });
      NotificationService.notifyError('Exception', data);
    });
  }

  /**
   * Authentication provider handler
   * @param {AuthProviderType} provider
   * @param {AuthProviderPath} path
   * @return Promise<void>
   */
  handleAuth (provider: AuthProviderType, path: AuthProviderPath): void {
    auth(provider, path).catch(error => Swal.fire({
      icon: 'error',
      title: `${provider} launch error`,
      text: error.toString(),
      showConfirmButton: false,
      timer: 2000
    }));
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
    );
  }
}

export default withCookies(Init);
