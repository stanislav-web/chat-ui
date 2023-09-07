import React from 'react';
import './Peer.css';
import VideoRemote from '@components/VideoRemote/VideoRemote';
import VideoLocal from '@components/VideoLocal/VideoLocal';
import VideoControl from '@components/VideoControl/VideoControl';
import VideoChat from '@components/VideoChat/VideoChat';
import { type IPeerProp } from '@interfaces/peer/i.peer-prop';
import { notifyError } from '@functions/notification.function';

class Peer extends React.Component<IPeerProp, any> {
  /**
     * Constructor
     * @param {IPeerProp} props
     */
  constructor(props: IPeerProp) {
    super(props);
    this.state = {
      isReady: false
    };
  }

  /**
     * On component render
     * @return void
     */
  componentDidMount(): void {
    if (!this.props.socket?.connected) {
      this.props.socket?.connect();
    } else notifyError('WebSocket', 'Cannot connected to Socket')
  }

  handleSocketEvents(): void {

  }

  handlePeerEvents(): void {

  }

  render(): React.JSX.Element {
    return (
        <div className="peer-container">
            <VideoRemote socket={this.props.socket} />
            <VideoLocal socket={this.props.socket} />
            <VideoControl socket={this.props.socket} />
            <VideoChat socket={this.props.socket} />
        </div>
    )
  }
}

export default Peer;
