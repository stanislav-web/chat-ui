import React from 'react';
import './VideoRemote.css';
import { MediaConfig } from '@configuration/media.config';
import { getCanvasRenderingContext, makeCanvasNoise } from '@functions/canvas.function';
import { getUserMedia } from '@functions/media.function';
import { notifyError } from '@functions/notification.function';
import { type IVideoChatProp } from '@interfaces/peer/i.video-chat-prop';
import { type IPeerState } from '@interfaces/peer/i.peer-state';

class VideoRemote extends React.Component<IVideoChatProp, IPeerState> {
  private readonly containerId: string = MediaConfig.remote.containerId;
  private readonly videoEl = document.getElementById(this.containerId) as HTMLVideoElement;
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

  /**
   * On component render
   * @return void
   */
  async componentDidMount(): Promise<void> {
    const stream = await getUserMedia();
    const videoEl = document.getElementById(this.containerId) as HTMLVideoElement;
    if (!videoEl) notifyError('Remote Video', 'Remote video is unavailable')
    videoEl.srcObject = stream;

    const canvasCtx = getCanvasRenderingContext('canvas',
      MediaConfig.remote.containerWidth,
      MediaConfig.remote.containerHeight
    );
    let toggle = true;
    if (!MediaConfig.remote.useNoise) {
      makeCanvasNoise(canvasCtx);
      return;
    }
    (function loop() {
      toggle = !toggle;
      if (toggle) {
        requestAnimationFrame(loop);
        return;
      }
      makeCanvasNoise(canvasCtx);
      requestAnimationFrame(loop);
    })();
  }

  render(): React.JSX.Element {
    return (
        <>
          <video id={this.containerId} className="remote" autoPlay playsInline />
          {/* <canvas className="noise"/> */}
          {/* <h1>NOISE</h1> */}
          {/* <h2>adjust canvas opacity to see full effect</h2> */}
        </>
    )
  }
}

export default VideoRemote;
