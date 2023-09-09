import React from 'react';
import {
  getSocket,
  getUserInfo
} from '../../functions';
import './Init.css';
import { withCookies, Cookies } from 'react-cookie';
import { instanceOf } from 'prop-types';
import { Agreement } from '../index';
import { getItem } from '@functions/localstorage.function';
import Login from '../Login/Login';
import { preventOpener } from '@functions/window.function';
import { type IUserProp } from '@interfaces/user/i.user-prop';
import { type IUserState } from '@interfaces/user/i.user-state';
import Peer from '@components/Peer/Peer';
import { type Socket } from 'socket.io-client';

class Init extends React.Component<IUserProp, Partial<IUserState>> {
  private socket: Socket;

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
      isUserAgree: getItem('isUserAgree') !== null ?? false,
      isUserLogin: undefined,
      user: null
    };
    this.onAgreementChange = this.onAgreementChange.bind(this);
  }

  /**
   * On component render
   * @return Promise<void>
   */
  async componentDidMount(): Promise<void> {
    preventOpener();
    if (this.state.isUserAgree === true) {
      const u = await getUserInfo();
      console.info('Auth user', { user: u });
      if (u?.user !== null) {
        this.socket = getSocket();
      }
      this.setState({ isUserLogin: u?.user != null, user: u?.user ?? null });
    }
  }

  /**
   * On Agreement change
   * @param {boolean} state
   */
  onAgreementChange = (state: boolean): void => {
    this.setState({ isUserAgree: state });
    this.setState({ isUserLogin: false });
  }

  render(): React.JSX.Element {
    const { isUserAgree, isUserLogin, user } = this.state;
    return (
        <div className="init">
          {isUserAgree === true ? <></> : <Agreement onAgreementChange={this.onAgreementChange} />}
          {isUserAgree === true && isUserLogin === false ? <Login /> : <></>}
          {isUserAgree === true && isUserLogin === true && user !== null
            ? <Peer socket={ this.socket }>
              </Peer>
            : <></>}
        </div>
    );
  }
}

export default withCookies(Init);
