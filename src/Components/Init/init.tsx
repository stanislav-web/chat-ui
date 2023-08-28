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
import { getSocketConnection, isSocketSupported } from './functions/socket.function';
import { isCookiesEnabled } from './functions/cookie.function';
import {
  getUserAccount,
  getUserBrowser,
  getUserFingerprint
} from './functions/user.function';
import { type IUser, type IUserProp, type IUserState } from './interfaces';
import { withCookies, Cookies } from 'react-cookie';
import { instanceOf } from 'prop-types';
import { auth } from './functions/auth.function';
import { type AuthProviderPath, type AuthProviderType } from './types/auth-provider.type';
import { type Socket } from 'socket.io-client';
import { NotificationService } from '../../services/notification.service';
import { isWebRTCSupported } from './functions/webrtc.function';
import { getUserMediaDevices } from './functions/media.function';

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
      user: null
    };
  }

  async componentDidMount(): Promise<void> {
    getUserMediaDevices()
      .then((devices) => {
        console.log({ devices });
        if (!isWebRTCSupported()) {
          NotificationService.notifyError('WebRTC', 'Your browser is not support WebRTC');
        }
        if (!isSocketSupported()) {
          NotificationService.notifyError('WebSockets', 'Your browser is not support WebSockets');
        }
        if (!isCookiesEnabled()) {
          NotificationService.notifyError('Cookies', 'Please enable cookies');
        }
        return this.getUser();
      })
      .then((user) => {
        if (user.id === '') NotificationService.notifyError('Authorization', 'You are not authorized yet');
        if (user?.ban !== null) NotificationService.notifyError('Ban', 'You have been banned');
        this.startChat();
      })
      .catch(() => { NotificationService.notifyError('Media', 'Please enable media access'); });
  }

  /**
     * Check user state
     * @return Promise<IUser>
     */
  private async getUser(): Promise<IUser> {
    const browserInfo = await getUserBrowser();
    console.log({ visitor: browserInfo });
    const fp = await getUserFingerprint();
    console.log({ fingerprint: fp });
    const { data } = await getUserAccount({
      requestId: fp.requestId,
      visitorId: fp.visitorId,
      score: fp.confidence.score,
      ...browserInfo
    });
    console.log({ user: data });

    this.setState({
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
    socket.on('connect', (): void => {
      NotificationService.notifySuccess('Connection', 'Welcome to Chat');
    });
    socket.on('disconnect', (reason: Socket.DisconnectReason): void => {
      NotificationService.notifyInfo('Disconnected', reason);
    });
    socket.on('connect_error', (error: Error): void => {
      NotificationService.notifyError('Disconnected', error);
    });
    socket.on('exception', (data): void => {
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
