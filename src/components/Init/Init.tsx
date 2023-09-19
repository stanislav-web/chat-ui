import React from 'react';
import './Init.css';
import { getItem } from '@functions/localstorage.function';
import Login from '../Login/Login';
import { preventOpener } from '@functions/window.function';
import { type IInitState } from '@interfaces/component/init/i.init-state';
import Peer from '@components/Peer/Peer';
import { AppConfig } from '@configuration/app.config';
import Agreement from '@components/Agreement/Agreement';
import { notifyError } from '@functions/notification.function';
import { checkSupportedEnvironments } from '@functions/environment.function';
import { type IInitProp } from '@interfaces/component/init/i.init-prop';
import { getUserDevices, getUserMedia } from '@functions/media.function';
import { getUserAccount, getUserBrowser, getUserFingerprint } from '@functions/user.function';
import { EnvironmentEnum } from '@enums/environment.enum';
import { type IUserRequest } from '@interfaces/user/i.user-request';
import { type IUserResponse } from '@interfaces/user/i.user-response';
import { type IInit } from '@interfaces/component/init/i.init';
import { withTranslation } from 'react-i18next';
import { MediaConfig } from '@configuration/media.config';

/**
 * Init app class
 * @module components
 * @extends React.Component<IInitProp, Partial<IInitState>>
 * @implements IInit
 */
class Init extends React.Component<IInitProp, Partial<IInitState>> implements IInit {
  /**
   * Constructor
   * @param {IInitProp} props
   */
  constructor(props: IInitProp) {
    super(props);
    this.state = {
      stream: null,
      isUserAgree: getItem('isUserAgree') !== null ?? false,
      isUserLogin: undefined,
      user: null
    };
    this.onAgreementChange = this.onAgreementChange.bind(this);
  }

  /**
   * On Init render
   * @return Promise<void>
   */
  async componentDidMount(): Promise<void> {
    !AppConfig.isMultiTabAllowed && preventOpener();
    const { audio, video } = MediaConfig;

    try {
      checkSupportedEnvironments();
    } catch (error: Error) {
      notifyError(this.props.t(error?.name, {
        ns: 'Exceptions'
      }), this.props.t(error?.message, {
        ns: 'Exceptions'
      }));
      return;
    }

    try {
      const stream = await getUserMedia(audio, video);
      this.setState({ stream });
    } catch (error: DOMException | TypeError) {
      notifyError(this.props.t(error?.name, {
        ns: 'Exceptions'
      }), this.props.t(error?.message, {
        ns: 'Exceptions'
      }));
      return;
    }

    if (this.state.isUserAgree === true) {
      try {
        let user: IUserResponse | null;
        const devices = await getUserDevices();
        if (AppConfig.environment !== EnvironmentEnum.DEVELOPMENT) {
          const browser = await getUserBrowser();
          const fingerprint = await getUserFingerprint();
          user = await getUserAccount({
            requestId: fingerprint.requestId,
            visitorId: fingerprint.visitorId,
            score: fingerprint.confidence.score,
            ...browser
          });
          console.log('[!] DEVICES', devices);
          console.log('[!] BROWSER INFO', browser);
        } else {
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          user = await getUserAccount(require('../../mocks/user-payload.json') as IUserRequest);
        }
        console.log('[!] USER', user?.data);

        if (user !== null) {
          if (user.data.id === '') {
            notifyError(this.props.t('Authorization', {
              ns: 'Errors'
            }), this.props.t('Not authorized', {
              ns: 'Errors'
            }));
          }
          if (user.data.ban !== null) {
            notifyError(this.props.t('Ban', {
              ns: 'Errors'
            }), this.props.t('Banned', {
              ns: 'Errors'
            }));
          }
          this.setState({
            isUserLogin: user.data.ban === null,
            user: user.data ?? null
          });
        }
      } catch (error: Error) {
        notifyError(this.props.t(error.name, {
          ns: 'Exceptions'
        }), this.props.t(error.message, {
          ns: 'Exceptions'
        }));
      }
    }
  }

  /**
   * On Rules change
   * @param {boolean} state
   */
  onAgreementChange = (state: boolean): void => {
    this.setState({ isUserAgree: state, isUserLogin: false });
  }

  render(): React.JSX.Element {
    const { stream, isUserAgree, isUserLogin, user } = this.state;
    return (
        <div className="init">
          {isUserAgree === true ? <></> : <Agreement onAgreementChange={this.onAgreementChange} />}
          {stream && isUserAgree === true && isUserLogin === false ? <Login /> : <></>}
          {stream && isUserAgree === true && isUserLogin === true && user !== null
            ? <Peer stream={stream} user={user}>
              </Peer>
            : <Peer>
              </Peer>}
        </div>
    );
  }
}

export default withTranslation(['Errors', 'Exceptions'])(Init);
