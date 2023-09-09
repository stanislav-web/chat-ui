import React from 'react';
import './Peer.css';
import VideoRemote from '@components/VideoRemote/VideoRemote';
import VideoLocal from '@components/VideoLocal/VideoLocal';
import VideoControl from '@components/VideoControl/VideoControl';
import VideoChat from '@components/VideoChat/VideoChat';
import { type IPeerProp } from '@interfaces/peer/i.peer-prop';
import { notifyError } from '@functions/notification.function';
import { getUserMediaDevices } from '@functions/media.function';
import { type IPeerState } from '@interfaces/peer/i.peer-state';
import { getPeerConnection } from '@functions/webrtc.function';

class Peer extends React.Component<IPeerProp, IPeerState> {
  /**
     * Constructor
     * @param {IPeerProp} props
     */
  constructor(props: IPeerProp) {
    super(props);
    this.state = {
      isReady: false,
      devices: []
    };
  }

  /**
   * On component render
   * @return Promise<void>
   */
  async componentDidMount(): Promise<void> {
    if (!this.props.socket?.connected) {
      this.props.socket?.connect();
      try {
        const devices = await getUserMediaDevices();
        this.setState({
          devices,
          isReady: this.props.socket.connected
        })
      } catch (error) {
        notifyError('Media', error?.message)
      }
    } else notifyError('WebSocket', 'Cannot connected to Socket')
  }

  render(): React.JSX.Element {
    const { socket } = this.props;
    const { devices } = this.state;

    return (
        <div className="peer-container">
            <VideoRemote socket={socket} />
            <VideoLocal socket={socket} />
            <VideoControl socket={socket} devices={devices}/>
            <VideoChat socket={socket} />
        </div>
    )
  }
}

export default Peer;
