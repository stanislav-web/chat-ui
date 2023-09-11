import React from 'react';
import './VideoLocal.css';
import { MediaConfig } from '@configuration/media.config';
import { getUserMedia } from '@functions/media.function';
import { notifyError } from '@functions/notification.function';
import {
  addCandidate,
  createPeerConnection,
  createPeerOffer,
  getRTCStats,
  isPeerAvailable
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
      const stream = await getUserMedia(audio, video);
      console.log('3. User media stream', stream);
      videoEl.srcObject = stream;
      console.log('4. Local video element', videoEl);

      videoEl.onloadedmetadata = (event: Event) => { onLoadedVideoMetadata({ videoEl }); };
      videoEl.onresize = (event: Event) => { onResizeVideo({ videoEl }); };
      videoEl.onvolumechange = (event: Event) => { onVolumeChange({ videoEl, stream, socket }); };
      videoEl.onplay = (event: Event) => {
        onPlay({
          videoEl,
          stream,
          socket,
          snapshot
        });
      };

      const localPeer = createPeerConnection(stream);
      console.log('5. Local peer', localPeer);

      localPeer.onconnectionstatechange = (event: Event) => {
        onConnectionStateChange(event, localPeer);
        getRTCStats(localPeer).then(console.info)
      };
      localPeer.onsignalingstatechange = (event: Event) => {
        onSignalingStateChange(localPeer, event);
        getRTCStats(localPeer).then(console.info)
      };
      localPeer.ondatachannel = (event: RTCDataChannelEvent) => {
        onDataChannel(event);
      };
      localPeer.onicecandidate = (event: RTCPeerConnectionIceEvent) => {
        onIceCandidate(socket, event, EventEmitEnum.CANDIDATE);
      }
      localPeer.onicecandidateerror = (error: RTCPeerConnectionIceErrorEvent) => {
        onIceCandidateError(error);
      }

      localPeer.onnegotiationneeded = async (event: Event) => {
        try {
          const offer = await createPeerOffer(localPeer);
          emit<SocketEmitType, IEventEmitOffer>(socket, EventEmitEnum.OFFER, offer);
          on<SocketListenType, IEventListenOffer>(socket, EventListenEnum.ANSWER, async (event: IEventListenAnswer) => {
            try {
              if (event.type === EventListenEnum.ANSWER && isPeerAvailable(localPeer.connectionState)) {
                await localPeer.setRemoteDescription(new RTCSessionDescription(event));
              }
            } catch (error) {
              throw new PeerException(error.message, error);
            }
          });
        } catch (error) {
          notifyError(error.name, error.message);
        }
      }

      on<SocketListenType, IEventListenOffer>(socket, EventListenEnum.CANDIDATE, async (event: IEventListenCandidate) => {
        try {
          await addCandidate(localPeer, event);
        } catch (error) {
          throw new PeerException(error.message, error);
        }
      });
    }
  }

  render(): React.JSX.Element {
    return (
        <>
          <video id={this.containerId} disablePictureInPicture className="local" autoPlay playsInline />
        </>
    )
  }
}

export default VideoLocal;
