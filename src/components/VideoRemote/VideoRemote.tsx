import React from 'react';
import './VideoRemote.css';
import { MediaConfig } from '@configuration/media.config';
import { addCandidate, createPeerAnswer, createPeerConnection } from '@functions/webrtc.function';
import { notifyError } from '@functions/notification.function';
import {
  onConnectionStateChange,
  onIceCandidateError,
  onRemoteIceCandidate,
  onSignalingStateChange,
  onTrack, onDataChannel
} from '@events/peer.event';
import { emit, on } from '@functions/socket.function';
import { type SocketEmitType, type SocketListenType } from '@types/socket.type';
import { type IEventEmitAnswer } from '@interfaces/socket/i.event-emit';
import { EventEmitEnum } from '@enums/event-emit.enum';
import { type IEventListenCandidate, type IEventListenOffer } from '@interfaces/socket/i.event-listen';
import { EventListenEnum } from '@enums/event-listen.enum';
import { PeerException } from '@exceptions/peer.exception';
import { onLoadedVideoMetadata, onResizeVideo } from '@events/media.event';
import { type IVideoRemoteState } from '@interfaces/component/video-remote/i.video-remote-state';
import { type IVideoRemoteProp } from '@interfaces/component/video-remote/i.video-remote-prop';
import { withTranslation } from 'react-i18next';
import { type UniqueId } from '@types/base.type';
import SelectRemoteCountry from '@components/Peer/SelectRemoteCountry/SelectRemoteCountry';
import { type IVideoRemote } from '@interfaces/component/video-remote/i.video-remote';
import { setItem } from '@functions/localstorage.function';

/**
 * VideoRemote app class
 * @module components
 * @extends React.Component<IVideoRemoteProp, IVideoRemoteState>
 * @implements IVideoRemote
 */
class VideoRemote extends React.Component<IVideoRemoteProp, IVideoRemoteState> implements IVideoRemote {
  /**
   * @type string containerId
   * @private
   */
  private readonly containerId: UniqueId = MediaConfig.remote.containerId;

  /**
   * @type string [poster]
   * @private
   */
  private readonly poster: string = MediaConfig.poster ?? '';

  /**
   * @type RTCPeerConnection peer
   * @private
   */
  private peer: RTCPeerConnection = null;

  /**
   * Constructor
   * @param {IVideoRemoteProp} props
   */
  constructor(props: IVideoRemoteProp) {
    super(props);
    this.state = {
      video: null
    };
  }

  /**
   * On component render
   * @return void
   */
  componentDidMount(): void {
    const videoElement = document.getElementById(this.containerId) as HTMLVideoElement;
    if (!videoElement) {
      notifyError(this.props.t('Remote Video', {
        ns: 'VideoRemote'
      }), this.props.t('RemoteVideoUnavailable', {
        ns: 'Errors'
      }));
    } else {
      videoElement.onloadedmetadata = () => { onLoadedVideoMetadata({ videoElement }); };
      videoElement.onresize = () => { onResizeVideo({ videoElement }); };
      this.setState({
        video: videoElement
      }, () => {
        this.remotePeerListener();
      });
    }
  }

  /**
   * On Remote Peer listener
   */
  remotePeerListener (): void {
    const { socket, user } = this.props;
    const { video } = this.state;

    on<SocketListenType, IEventListenOffer>(socket, EventListenEnum.OFFER, async (event: IEventListenOffer) => {
      if (!this.peer) this.peer = createPeerConnection(user.ice);

      await Promise.all([
        this.peer.setRemoteDescription(new RTCSessionDescription(event)),
        createPeerAnswer(this.peer)
      ]).then(() => {
        this.peer.ontrack = (event: RTCTrackEvent) => {
          onTrack(video, event);
        }
        this.peer.ondatachannel = (event: RTCDataChannelEvent) => {
          onDataChannel(event);
        }
        this.peer.onconnectionstatechange = () => {
          onConnectionStateChange(this.peer);
          console.log(`[!] REMOTE PEER CONNECTION STATE: ${this.peer.connectionState}`);
        };
        this.peer.onsignalingstatechange = (event: Event) => {
          onSignalingStateChange(this.peer, event);
          console.log(`[!] <- REMOTE SIGNAL STATE: ${this.peer.signalingState} / ${this.peer.connectionState}`);
        };
        this.peer.onicecandidateerror = (error: RTCPeerConnectionIceErrorEvent) => {
          onIceCandidateError(error);
          console.log('[X] <- REMOTE ICE ERROR', error);
        }
        this.peer.onicecandidate = (event: RTCPeerConnectionIceEvent) => {
          onRemoteIceCandidate(socket, event, EventEmitEnum.CANDIDATE);
        };
        emit<SocketEmitType, IEventEmitAnswer>(socket, EventEmitEnum.ANSWER, this.peer.localDescription);
      });
    });
    on<SocketListenType, IEventListenCandidate>(socket, EventListenEnum.CANDIDATE, async (event: IEventListenCandidate) => {
      try {
        setTimeout(async () => { await addCandidate(this.peer, event); }, 3000)
      } catch (error) {
        throw new PeerException(error.message, error);
      }
    });
  }

  /**
   * On countries change event handler
   * @param {Array<CountryListItem['code']> | []} countries
   * @return void
   */
  onCountriesChange = (countries: Array<CountryListItem['code']> | []): void => {
    setItem('selected', countries);
  }

  render(): React.JSX.Element {
    const { video } = this.state;
    const { socket } = this.props;
    return (
        <div className="video-remote">
          <div className="video-remote-container">
            <video id={this.containerId} disablePictureInPicture autoPlay playsInline poster={this.poster}/>
          </div>
          {video && socket.connected
            ? <div className="video-remote-control">
                <SelectRemoteCountry onCountriesChange={this.onCountriesChange} />
              </div>
            : <></>}
        </div>
    )
  }
}

export default withTranslation(['VideoRemote', 'Errors', 'Exceptions'])(VideoRemote);
