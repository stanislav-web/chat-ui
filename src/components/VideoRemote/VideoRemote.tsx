import React from 'react';
import './VideoRemote.css';
import { MediaConfig } from '@configuration/media.config';
import { addCandidate, createPeerAnswer, createPeerConnection, isPeerAvailable } from '@functions/webrtc.function';
import { notifyError } from '@functions/notification.function';
import {
  onConnectionStateChange,
  onDataChannel,
  onIceCandidateError,
  onRemoteIceCandidate,
  onSignalingStateChange,
  onTrack
} from '@events/peer.event';
import { emit, on } from '@functions/socket.function';
import { type SocketEmitType, type SocketListenType } from '@types/socket.type';
import { type IEventEmitAnswer } from '@interfaces/socket/i.event-emit';
import { EventEmitEnum } from '@enums/event-emit.enum';
import { type IEventListenCandidate, type IEventListenOffer } from '@interfaces/socket/i.event-listen';
import { EventListenEnum } from '@enums/event-listen.enum';
import { PeerException } from '@exceptions/peer.exception';
import { onLoadedVideoMetadata, onResizeVideo } from '@events/media.event';
import { type IVideoProp } from '@interfaces/peer/i.video-prop';
import { type IVideoRemoteState } from '@interfaces/peer/i.video-remote-state';
import VideoControlRemote from '@components/VideoRemote/VideoCotrolRemote/VideoControlRemote';

class VideoRemote extends React.Component<IVideoProp, IVideoRemoteState> {
  private readonly containerId: string = MediaConfig.remote.containerId;
  private readonly useNoise: boolean = MediaConfig.remote.useNoise;
  private readonly poster: string = MediaConfig.poster ?? '';

  /**
     * Constructor
     * @param {IVideoProp} props
     */
  constructor(props: IVideoProp) {
    super(props);
    this.state = {
      video: null,
      peer: null,
      stream: null,
      socket: null
    };
  }

  /**
   * On component render
   * @return void
   */
  componentDidMount(): void {
    const videoElement = document.getElementById(this.containerId) as HTMLVideoElement;
    if (!videoElement) {
      notifyError('Local Video', 'Local video is unavailable')
    } else {
      const { socket } = this.props;

      // eslint-disable-next-line no-unused-vars
      videoElement.onloadedmetadata = (event: Event) => { onLoadedVideoMetadata({ videoElement }); };
      // eslint-disable-next-line no-unused-vars
      videoElement.onresize = (event: Event) => { onResizeVideo({ videoElement }); };
      const remotePeer = createPeerConnection();
      this.setState({
        remoteVideoElement: videoElement,
        remotePeer
      });

      remotePeer.onconnectionstatechange = (event: Event) => {
        onConnectionStateChange(event, remotePeer);
      };
      remotePeer.onsignalingstatechange = (event: Event) => {
        onSignalingStateChange(remotePeer, event);
      };
      remotePeer.ondatachannel = (event: RTCDataChannelEvent) => {
        onDataChannel(event);
      };
      remotePeer.onicecandidateerror = (error: RTCPeerConnectionIceErrorEvent) => {
        onIceCandidateError(error);
      }
      remotePeer.onicecandidate = (event: RTCPeerConnectionIceEvent) => {
        onRemoteIceCandidate(socket, event, EventEmitEnum.CANDIDATE);
      };
      remotePeer.ontrack = (event: RTCTrackEvent) => {
        onTrack(videoElement, event);
      }

      on<SocketListenType, IEventListenOffer>(socket, EventListenEnum.OFFER, async (event: IEventListenOffer) => {
        if (event.type === EventListenEnum.OFFER && isPeerAvailable(remotePeer.connectionState)) {
          await Promise.all([
            remotePeer.setRemoteDescription(new RTCSessionDescription(event)),
            createPeerAnswer(remotePeer)
          ]).then(() => { emit<SocketEmitType, IEventEmitAnswer>(socket, EventEmitEnum.ANSWER, remotePeer.localDescription); });
        }
      });
      on<SocketListenType, IEventListenOffer>(socket, EventListenEnum.CANDIDATE, async (event: IEventListenCandidate) => {
        try {
          await addCandidate(remotePeer, event);
        } catch (error) {
          throw new PeerException(error.message, error);
        }
      });
    }
  }

  render(): React.JSX.Element {
    const { peer, stream, video, socket } = this.state;

    return (
        <div className="video-remote">
          <div className="video-remote-container">
            <video id={this.containerId} disablePictureInPicture autoPlay playsInline poster={this.poster}/>
            {this.useNoise &&
                <canvas className="noise"/>
            }
          </div>
          <div className="video-remote-control">
            <VideoControlRemote socket={socket} peer={peer} stream={stream} video={video} />
          </div>
        </div>
    )
  }
}

export default VideoRemote;
