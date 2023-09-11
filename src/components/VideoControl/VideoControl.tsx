import React from 'react';
import './VideoControl.css';
import { type IVideoControlProp } from '@interfaces/peer/i.video-control-prop';

class VideoControl extends React.Component<IVideoControlProp, any> {
  /**
     * Constructor
     * @param {IVideoControlProp} props
     */
  constructor(props: IVideoControlProp) {
    super(props);
    this.state = {
      isReady: false
    };
  }

  render(): React.JSX.Element {
    return (
        <div className="peer-control">
          <button id="stop">Stop</button>
          <button id="call">Call</button>
        </div>
    )
  }
}

export default VideoControl;
