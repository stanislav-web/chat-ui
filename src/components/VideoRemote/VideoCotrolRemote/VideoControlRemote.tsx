import React from 'react';
import './VideoControlRemote.css';
import { type IVideoControlRemoteProp } from '@interfaces/component/video-control-remote/i.video-control-remote-prop';
import { withTranslation } from 'react-i18next';
import SelectRemoteCountry from '@components/VideoRemote/VideoCotrolRemote/SelectRemoteCountry/SelectRemoteCountry';
import { type IVideoControlRemoteState } from '@interfaces/component/video-control-remote/i.video-control-remote-state';

/**
 * VideoControlRemote app class
 * @module components
 * @extends React.Component<IVideoControlRemoteProp, IVideoControlRemoteState>
 * @implements VideoControlRemote
 */
class VideoControlRemote extends React.Component<IVideoControlRemoteProp, IVideoControlRemoteState> {
  /**
     * Constructor
     * @param {IVideoControlRemoteProp} props
     */
  constructor(props: IVideoControlRemoteProp) {
    super(props);
    this.state = {
      socket: null
    };
  }

  /**
     * On component render
     * @return void
     */
  componentDidMount(): void {
    this.setState({
      socket: this.props.socket
    })
  }

  render(): React.JSX.Element {
    const { video } = this.props;
    const { socket } = this.state;
    return (
        <div className="peer-control-remote">
          { video && socket?.connected
            ? <SelectRemoteCountry video={video} />
            : <></>
          }
        </div>
    )
  }
}

export default withTranslation(['VideoControlRemote', 'Errors', 'Exceptions'])(VideoControlRemote);
