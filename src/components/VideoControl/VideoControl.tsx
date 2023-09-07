import React from 'react';
import './VideoControl.css';
import { type IVideoChatProp } from '@interfaces/peer/i.video-chat-prop';

class VideoControl extends React.Component<IVideoChatProp, any> {
  /**
     * Constructor
     * @param {IVideoChatProp} props
     */
  constructor(props: IVideoChatProp) {
    super(props);
    this.state = {
      isReady: false
    };
  }

  render(): React.JSX.Element {
    return (
        <div>
          <button id="stop">Stop</button>
          <button id="call">Call</button>
        </div>
    )
  }
}

export default VideoControl;
