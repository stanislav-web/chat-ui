import React from 'react';
import './Peer.css';
import VideoRemote from '@components/VideoRemote/VideoRemote';
import VideoLocal from '@components/VideoLocal/VideoLocal';
import { type IPeerProp } from '@interfaces/component/peer/i.peer-prop';
import { notifyError, notifySuccess } from '@functions/notification.function';
import { type IPeerState } from '@interfaces/component/peer/i.peer-state';
import { getSocketInstance } from '@functions/socket.function';
import { type Socket } from 'socket.io-client';
import { type IException } from '@interfaces/socket/i.exception';
import { withTranslation } from 'react-i18next';

/**
 * Peer app class
 * @module components
 * @extends React.Component<IPeerProp, IPeerState>
 */
class Peer extends React.Component<IPeerProp, IPeerState> {
  /**
     * Constructor
     * @param {IPeerProp} props
     */
  constructor(props: IPeerProp) {
    super(props);
    this.state = {
      socket: null,
      connected: false
    };
  }

  /**
   * On component render
   * @return Promise<void>
   */
  componentDidMount(): void {
    const { user, stream } = this.props;
    if (user && stream) {
      const socket: Socket = getSocketInstance();
      if (!socket.connected) socket.connect();
      socket.on('connect', (): void => {
        this.setState({
          socket,
          connected: true
        });
        notifySuccess(this.props.t('Connected', {
          ns: 'Base'
        }), this.props.t('Welcome', {
          ns: 'Base'
        }), 2000);
      });
      socket.on('disconnect', (reason: Socket.DisconnectReason): void => {
        console.log('[!] Socket disconnected: ', socket.disconnected, { reason });
        this.setState({
          socket,
          connected: false
        });
      });
      socket.on('connect_error', (error: Error): void => {
        console.log('[!] Socket connect error:', { error })
        this.setState({
          socket,
          connected: false
        });
        notifyError(this.props.t('Disconnected', {
          ns: 'Base'
        }), error.message, 2000);
      });
      socket.on('exception', (data: IException): void => {
        console.log('[!] Socket exception:', { data })
        this.setState({
          socket,
          connected: true
        });
        notifyError(this.props.t('Exception', {
          ns: 'Exceptions'
        }), this.props.t(data.message, {
          ns: 'Exceptions'
        }), 2000);
      });
    }
  }

  render(): React.JSX.Element {
    const { connected, socket } = this.state;
    const { stream, user } = this.props;
    return (
        <div className="peer-container">
            {stream && user && connected
              ? <div className="peer-output">
                  <VideoLocal socket={socket} stream={stream} user={user} />
                  <VideoRemote socket={socket} user={user} />
                </div>
              : <div className="peer-error">TODO: Error connection</div>
            }
        </div>
    )
  }
}

export default withTranslation(['Base', 'Exceptions'])(Peer);
