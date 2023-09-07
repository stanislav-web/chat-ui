import React from 'react';
import './VideoChat.css';
import { type IVideoChatProp } from '@interfaces/peer/i.video-chat-prop';

class VideoChat extends React.Component<IVideoChatProp, any> {
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
        </div>
    )
  }
}

export default VideoChat;
