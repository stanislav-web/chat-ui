import React from 'react';
import './VideoLocal.css';
import { MediaConfig } from '@configuration/media.config';
import { getUserMedia } from '@functions/media.function';
import { notifyError } from '@functions/notification.function';
import {
  createPeerOffer, getPeerConnection
} from '@functions/webrtc.function';
import { type IVideoProp } from '@interfaces/peer/i.video-prop';
import { type IPeerState } from '@interfaces/peer/i.peer-state';
// eslint-disable-next-line import/no-unresolved
import { onLoadedVideoMetadata, onPlay, onResizeVideo, onVolumeChange } from '@events/media.event';
// eslint-disable-next-line import/no-unresolved
import { onConnectionStateChange, onDataChannel, onIceCandidate, onIceCandidateError, onSignalingStateChange } from '@events/peer.event';
import { emit, on } from '@functions/socket.function';
import { type SocketEmitType, type SocketListenType } from '@types/socket.type';
import { type IEventEmitOffer } from '@interfaces/socket/i.event-emit';
import { EventEmitEnum } from '@enums/event-emit.enum';
import { PeerException } from '@exceptions/peer.exception';
import { type IEventListenAnswer, type IEventListenCandidate, type IEventListenOffer } from '@interfaces/socket/i.event-listen';
import { EventListenEnum } from '@enums/event-listen.enum';

class VideoLocal extends React.Component<IVideoProp, IPeerState> {
  private readonly containerId: string = MediaConfig.local.containerId;

  /**
     * Constructor
     * @param {IVideoProp} props
     */
  constructor(props: IVideoProp) {
    super(props);
    this.state = {
      isReady: false,
      devices: []
    };
  }

  /**
   * On component render
   * @return Promise<void>
   */
  async componentDidMount(): Promise<void> {
    const videoEl = document.getElementById(this.containerId) as HTMLVideoElement;
    if (!videoEl) {
      notifyError('Local Video', 'Local video is unavailable')
    } else {
      const { socket } = this.props;
      const { snapshot, audio, video } = MediaConfig;
      // 1. Load user devices
      const stream = await getUserMedia(audio, video);
      // 2. Create video stream
      videoEl.srcObject = stream;
      const videoTrack = stream.getVideoTracks().pop();
      const audioTrack = stream.getAudioTracks().pop();

      videoEl.onloadedmetadata = (event: Event) => { onLoadedVideoMetadata({ videoEl }); };
      videoEl.onresize = (event: Event) => { onResizeVideo({ videoEl }); };
      videoEl.onvolumechange = (event: Event) => { onVolumeChange({ videoEl, videoTrack, socket }); };
      videoEl.onplay = (event: Event) => {
        onPlay({
          videoEl,
          stream,
          videoTrack,
          socket,
          snapshot
        });
      };

      // 3. Create peer connection
      const localPeer = getPeerConnection();
      localPeer.addTrack(videoTrack, stream);
      localPeer.onconnectionstatechange = (event: Event) => {
        onConnectionStateChange(event, localPeer);
      };
      localPeer.onsignalingstatechange = (event: Event) => {
        onSignalingStateChange(localPeer, event);
      };
      localPeer.ondatachannel = (event: RTCDataChannelEvent) => {
        onDataChannel(event);
      };
      localPeer.onicecandidate = (event: RTCPeerConnectionIceEvent) => {
        onIceCandidate(socket, event);
      }
      localPeer.onicecandidateerror = (error: RTCPeerConnectionIceErrorEvent) => {
        onIceCandidateError(error);
      }

      try {
        const offer = await createPeerOffer(localPeer);
        emit<SocketEmitType, IEventEmitOffer>(socket, EventEmitEnum.OFFER, offer);
        on<SocketListenType, IEventListenOffer>(socket, EventListenEnum.ANSWER, async (event: IEventListenAnswer) => {
          try {
            await localPeer.setRemoteDescription(event);
          } catch (error) {
            throw new PeerException(error.message, error);
          }
        });
        on<SocketListenType, IEventListenOffer>(socket, EventListenEnum.CANDIDATE, (event: IEventListenCandidate) => {
          setTimeout(() => {
            localPeer.addIceCandidate(new RTCIceCandidate(event)).catch();
          }, 300);
        });

        console.log('LOCAL: VideoElement', videoEl);
        console.log('LOCAL: Stream', stream);
        console.log('LOCAL: VideoTrack', videoTrack);
        console.log('LOCAL: AudioTrack', audioTrack);
        console.log('LOCAL: Peer', localPeer);
        console.log('LOCAL: Peer Offer', offer);
      } catch (error) {
        notifyError(error.name, error.message);
      }
    }
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
