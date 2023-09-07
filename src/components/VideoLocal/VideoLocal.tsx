import React from 'react';
import './VideoLocal.css';
import { MediaConfig } from '@configuration/media.config';
import { captureSnapshot, getUserMedia, getUserMediaDevices } from '@functions/media.function';
import { notifyError /** ,notifySuccess */ } from '@functions/notification.function';
// import { getPeerConnection } from '@functions/webrtc.function';
import { type IVideoChatProp } from '@interfaces/peer/i.video-chat-prop';
import { type IPeerState } from '@interfaces/peer/i.peer-state';
import { type IEventOnline } from '@interfaces/socket/i.event-online';
import { MediaDeviceTypeEnum } from '@enums/media-device-type.enum';

class VideoLocal extends React.Component<IVideoChatProp, IPeerState> {
  private readonly containerId: string = MediaConfig.local.containerId;

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
   * @return Promise<void>
   */
  async componentDidMount(): Promise<void> {
    const { socket } = this.props;
    const stream = await getUserMedia();
    const videoEl = document.getElementById(this.containerId) as HTMLVideoElement;
    if (!videoEl) {
      notifyError('Local Video', 'Local video is unavailable')
    } else {
      videoEl.srcObject = stream;
      await videoEl.play();

      /// Devices switch list
      const devices = await getUserMediaDevices();
      console.log({ devices });
      ///
      const videoTracks = stream.getVideoTracks();
      const audioTracks = stream.getAudioTracks();
      console.log({ videoTracks, audioTracks });
      if (MediaConfig.allowSnapshots) {
        setInterval(() => {
          const photo = captureSnapshot({
            stream,
            type: 'image/png',
            quality: 0.92,
            sourceId: this.containerId,
            width: 64,
            height: 64
          });
          socket.volatile.emit('online', {
            photo,
            deviceId: videoTracks[0].id,
            deviceType: MediaDeviceTypeEnum.VIDEO,
            deviceLabel: videoTracks[0].label
          } as IEventOnline);
        }, MediaConfig.snapshotsInterval);
      }
    }

    // const peerConnection = getPeerConnection((event: RTCPeerConnectionIceEvent) => {
    //   notifySuccess('Peer connection', 'Success');
    // }, (error: RTCPeerConnectionIceErrorEvent) => {
    //   notifyError('Peer connection', error.errorText);
    // });
    //
    // peerConnection.setLocalDescription()
  }

  render(): React.JSX.Element {
    return (
        <>
          <video id={this.containerId} className="local" autoPlay playsInline />
        </>
    )
  }
}

export default VideoLocal;
