import React from 'react';
import {
  connectSocket,
  getUserInfo
} from '../../Functions';
import { type IUserProp, type IUserState } from '../../Interfaces';
import { withCookies, Cookies } from 'react-cookie';
import { instanceOf } from 'prop-types';
import { Agreement } from '../index';
import { getItem } from '../../Functions/localstorage.function';
import Login from '../Login/Login';
import VideoLocal from '../VideoLocal/VideoLocal';
import VideoRemote from '../VideoRemote/VideoRemote';
import VideoControl from '../VideoControl/VideoControl';
import Chat from '../Chat/Chat';
import { preventOpener } from '../../Functions/window.function';

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
    const { cookies } = props;
    const accessToken = cookies.get('access_token');
    const refreshToken = cookies.get('refresh_token');
    this.state = {
      isUserAgree: getItem('isUserAgree') !== null ?? false,
      isUserLogin: accessToken !== undefined && refreshToken !== undefined,
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
  async onAgreementChange (state: boolean): Promise<void> {
    this.setState({ isUserAgree: state });
    this.setState({ isUserLogin: false });
  }

  render(): React.JSX.Element {
    const { isUserAgree, isUserLogin, user } = this.state;
    return (
        <div className="Init">
          {isUserAgree === true ? <></> : <Agreement onAgreementChange={this.onAgreementChange} />}
          {isUserAgree === false && isUserLogin === false ? <Agreement onAgreementChange={this.onAgreementChange} /> : <></>}
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
