import React from 'react';
import {
  connectSocket,
  getUserInfo
} from '../../functions';
import { withCookies, Cookies } from 'react-cookie';
import { instanceOf } from 'prop-types';
import { Agreement } from '../index';
import { getItem } from '@functions/localstorage.function';
import Login from '../Login/Login';
import VideoLocal from '../VideoLocal/VideoLocal';
import VideoRemote from '../VideoRemote/VideoRemote';
import VideoControl from '../VideoControl/VideoControl';
import Chat from '../Chat/Chat';
import { preventOpener } from '@functions/window.function';
import { type IUserProp } from '@interfaces/user/i.user-prop';
import { type IUserState } from '@interfaces/user/i.user-state';

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
      console.info({ user: u });
      if (u?.user !== null) {
        connectSocket();
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
        <div className="Init">
          {isUserAgree === true ? <></> : <Agreement onAgreementChange={this.onAgreementChange} />}
          {isUserAgree === true && isUserLogin === false ? <Login /> : <></>}
          {isUserAgree === true && isUserLogin === true && user !== null
            ? <>
              <VideoRemote />
              <VideoLocal />
              <VideoControl />
              <Chat />
              </>
            : <></>}
        </div>
    );
  }
}

export default withCookies(Init);
