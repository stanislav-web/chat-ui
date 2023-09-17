/* eslint-disable no-unused-vars */
import React from 'react';
import './VideoLocal.css';
import { MediaConfig } from '@configuration/media.config';
import { notifyError } from '@functions/notification.function';
import {
  addCandidate, addMediaTracks,
  createPeerConnection,
  createPeerOffer,
  isPeerAvailable
} from '@functions/webrtc.function';
import { onLoadedVideoMetadata, onPlay, onResizeVideo, onVolumeChange } from '@events/media.event';
import {
  onConnectionStateChange,
  onDataChannel,
  onIceCandidateError,
  onLocalIceCandidate,
  onSignalingStateChange
} from '@events/peer.event';
import { emit, on } from '@functions/socket.function';
import { type SocketEmitType, type SocketListenType } from '@types/socket.type';
import { type IEventEmitOffer } from '@interfaces/socket/i.event-emit';
import { EventEmitEnum } from '@enums/event-emit.enum';
import { PeerException } from '@exceptions/peer.exception';
import { type IEventListenAnswer, type IEventListenCandidate, type IEventListenOffer } from '@interfaces/socket/i.event-listen';
import { EventListenEnum } from '@enums/event-listen.enum';
import VideoControlLocal from '@components/VideoLocal/VideoControlLocal/VideoControlLocal';
import { type IVideoLocalState } from '@interfaces/component/video-local/i.video-local-state';
import { type IVideoLocalProp } from '@interfaces/component/video-local/i.video-local-prop';
import { withTranslation } from 'react-i18next';

/**
 * VideoLocal app class
 * @module components
 * @extends React.Component<IVideoLocalProp, IVideoLocalState>
 */
class VideoLocal extends React.Component<IVideoLocalProp, IVideoLocalState> {
  /**
   * @type string containerId
   * @private
   */
  private readonly containerId: string = MediaConfig.local.containerId;

  /**
   * @type string [poster]
   * @private
   */
  private readonly poster: string = MediaConfig.poster ?? '';

  /**
     * Constructor
     * @param {IVideoLocalProp} props
     */
  constructor(props: IVideoLocalProp) {
    super(props);
    this.state = {
      video: null,
      peer: null
    };
  }

  /**
   * On component render
   * @return Promise<void>
   */
  componentDidMount(): Promise<void> {
    const videoElement = document.getElementById(this.containerId) as HTMLVideoElement;
    if (!videoElement) {
      notifyError(this.props.t('Local Video', {
        ns: 'VideoLocal'
      }), this.props.t('LocalVideoUnavailable', {
        ns: 'Errors'
      }));
    } else {
      const { socket, stream } = this.props;
      const { snapshot } = MediaConfig;
      videoElement.srcObject = stream;
      videoElement.onloadedmetadata = (event: Event) => { onLoadedVideoMetadata({ videoElement }); };
      videoElement.onresize = (event: Event) => { onResizeVideo(videoElement); };
      videoElement.onvolumechange = (event: Event) => { onVolumeChange({ videoElement, stream, socket }); };
      videoElement.onplay = (event: Event) => {
        onPlay({
          videoElement,
          stream,
          socket,
          snapshot
        });
      };

      const peer = createPeerConnection();
      addMediaTracks(peer, stream);
      peer.onconnectionstatechange = (event: Event) => {
        onConnectionStateChange(event, peer);
      };
      peer.onsignalingstatechange = (event: Event) => {
        onSignalingStateChange(peer, event);
      };
      peer.ondatachannel = (event: RTCDataChannelEvent) => {
        onDataChannel(event);
      };
      peer.onicecandidate = (event: RTCPeerConnectionIceEvent) => {
        onLocalIceCandidate(socket, event, EventEmitEnum.CANDIDATE);
      }
      peer.onicecandidateerror = (error: RTCPeerConnectionIceErrorEvent) => {
        onIceCandidateError(error);
      }
      // eslint-disable-next-line no-unused-vars
      peer.onnegotiationneeded = async (event: Event) => {
        try {
          const offer = await createPeerOffer(peer);
          emit<SocketEmitType, IEventEmitOffer>(socket, EventEmitEnum.OFFER, offer);
          on<SocketListenType, IEventListenOffer>(socket, EventListenEnum.ANSWER, async (event: IEventListenAnswer) => {
            try {
              if (event.type === EventListenEnum.ANSWER && isPeerAvailable(peer.connectionState)) {
                await peer.setRemoteDescription(new RTCSessionDescription(event));
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
          await addCandidate(peer, event);
        } catch (error) {
          throw new PeerException(error.message, error);
        }
      });
      this.setState({
        video: videoElement,
        peer
      });
    }
  }

  render(): React.JSX.Element {
    const { peer, video } = this.state;
    const { stream, socket } = this.props;
    return (
        <div className="video-local">
          <div className="video-local-container">
            <video id={this.containerId} autoPlay playsInline muted poster={this.poster} />
          </div>
          <div className="video-local-control">
            {peer && stream
              ? <VideoControlLocal socket={socket} peer={peer} stream={stream} video={video} />
              : <></>
            }
          </div>
        </div>
    )
  }
}

export default withTranslation(['VideoLocal', 'Errors', 'Exceptions'])(VideoLocal);
