import React from 'react';

class VideoControl extends React.Component<any, any> {
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
        <div>
          <button id="stop">Stop</button>
          <button id="call">Call</button>
        </div>
    )
  }
}

export default VideoControl;
