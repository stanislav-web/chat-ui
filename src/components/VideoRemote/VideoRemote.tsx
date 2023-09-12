import React from 'react';
import './VideoRemote.css';
import { MediaConfig } from '@configuration/media.config';
import { type IVideoProp } from '@interfaces/peer/i.video-prop';
import { type IPeerState } from '@interfaces/peer/i.peer-state';
import { addCandidate, createPeerAnswer, createPeerConnection, isPeerSignalStable } from '@functions/webrtc.function';
import { notifyError } from '@functions/notification.function';
import { onConnectionStateChange, onDataChannel, onIceCandidate, onIceCandidateError, onSignalingStateChange, onTrack } from '@events/peer.event';
import { emit, on } from '@functions/socket.function';
import { type SocketEmitType, type SocketListenType } from '@types/socket.type';
import { type IEventEmitAnswer } from '@interfaces/socket/i.event-emit';
import { EventEmitEnum } from '@enums/event-emit.enum';
import { type IEventListenCandidate, type IEventListenOffer } from '@interfaces/socket/i.event-listen';
import { EventListenEnum } from '@enums/event-listen.enum';
import { PeerException } from '@exceptions/peer.exception';
// eslint-disable-next-line import/no-unresolved
import { onLoadedVideoMetadata, onResizeVideo } from '@events/media.event';

class VideoRemote extends React.Component<IVideoProp, IPeerState> {
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
      devices: []
    };
  }

  /**
   * On component render
   * @return void
   */
  componentDidMount(): void {
    const videoEl = document.getElementById(this.containerId) as HTMLVideoElement;
    if (!videoEl) {
      notifyError('Local Video', 'Local video is unavailable')
    } else {
      const { socket } = this.props;

      videoEl.onloadedmetadata = (event: Event) => { onLoadedVideoMetadata({ videoEl }); };
      videoEl.onresize = (event: Event) => { onResizeVideo({ videoEl }); };

      const remotePeer = createPeerConnection();
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
        onIceCandidate(socket, event, EventEmitEnum.CANDIDATE);
      };
      remotePeer.ontrack = (event: RTCTrackEvent) => {
        onTrack(videoEl, event);
      }

      on<SocketListenType, IEventListenOffer>(socket, EventListenEnum.OFFER, async (event: IEventListenOffer) => {
        try {
          await remotePeer.setRemoteDescription(event);
          if (event.type === EventListenEnum.OFFER && !isPeerSignalStable(remotePeer)) {
            const answer = await createPeerAnswer(remotePeer);
            console.log('[!] REMOTE: Peer answer', answer);
            setTimeout(() => {
              if (answer) emit<SocketEmitType, IEventEmitAnswer>(socket, EventEmitEnum.ANSWER, answer);
            }, 1000);
          }
        } catch (error) {
          throw new PeerException(error.message, error);
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
    return (
        <>
            <video id={this.containerId} className="remote" autoPlay playsInline poster={this.poster}/>
            {this.useNoise &&
                <canvas className="noise"/>
            }
        </>
    )
  }
}

export default VideoRemote;
