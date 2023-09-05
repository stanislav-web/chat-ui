import React from 'react';

class VideoRemote extends React.Component<any, any> {
  /**
     * Constructor
     * @param {any} props
     */
  constructor(props: any) {
    super(props);
    this.state = {
      isReady: false
    };
  }

  render(): React.JSX.Element {
    return (
        <video id="remote-video" height="150" autoPlay/>
    )
  }
}

export default VideoRemote;
