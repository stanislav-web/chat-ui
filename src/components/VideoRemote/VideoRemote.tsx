import React from 'react';
import './VideoRemote.css';
import { MediaConfig } from '@configuration/media.config';
import { addCandidate, createPeerAnswer, createPeerConnection } from '@functions/webrtc.function';
import { notifyError } from '@functions/notification.function';
import {
  onConnectionStateChange,
  onCloseDataChannel,
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
import { type IVideoRemoteState } from '@interfaces/component/video-remote/i.video-remote-state';
import { type IVideoRemoteProp } from '@interfaces/component/video-remote/i.video-remote-prop';
import { withTranslation } from 'react-i18next';
import { type UniqueId } from '@types/base.type';
import SelectRemoteCountry from '@components/VideoRemote/SelectRemoteCountry/SelectRemoteCountry';
import { type IVideoRemote } from '@interfaces/component/video-remote/i.video-remote';
import { setItem } from '@functions/localstorage.function';

/**
 * VideoRemote app class
 * @module components
 * @extends React.Component<IVideoRemoteProp, IVideoRemoteState>
 * @implements IVideoRemote
 */
class VideoRemote extends React.Component<IVideoRemoteProp, IVideoRemoteState> implements IVideoRemote {
  private readonly containerId: UniqueId = MediaConfig.remote.containerId;
  private readonly poster: string = MediaConfig.poster ?? '';

  /**
   * Constructor
   * @param {IVideoRemoteProp} props
   */
  constructor(props: IVideoRemoteProp) {
    super(props);
    this.state = {
      video: null,
      peer: null,
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
      notifyError(this.props.t('Remote Video', {
        ns: 'VideoRemote'
      }), this.props.t('RemoteVideoUnavailable', {
        ns: 'Errors'
      }));
    } else {
      const { socket, user } = this.props;

      videoElement.onloadedmetadata = () => { onLoadedVideoMetadata({ videoElement }); };
      videoElement.onresize = () => { onResizeVideo({ videoElement }); };
      const peer = createPeerConnection(user.ice);
      this.setState({
        video: videoElement,
        peer,
        socket
      });

      peer.onconnectionstatechange = () => {
        onConnectionStateChange(peer);
      };
      peer.onsignalingstatechange = (event: Event) => {
        onSignalingStateChange(peer, event);
      };
      peer.ondatachannel = (event: RTCDataChannelEvent) => {
        onCloseDataChannel(event);
      };
      peer.onicecandidateerror = (error: RTCPeerConnectionIceErrorEvent) => {
        onIceCandidateError(error);
      }
      peer.onicecandidate = (event: RTCPeerConnectionIceEvent) => {
        onRemoteIceCandidate(socket, event, EventEmitEnum.CANDIDATE);
      };
      peer.ontrack = (event: RTCTrackEvent) => {
        onTrack(videoElement, event);
      }

      on<SocketListenType, IEventListenOffer>(socket, EventListenEnum.OFFER, async (event: IEventListenOffer) => {
        console.log(event);
        console.log(peer);
        if (event.type === EventListenEnum.OFFER) {
          await Promise.all([
            peer.setRemoteDescription(new RTCSessionDescription(event)),
            createPeerAnswer(peer)
          ]).then(() => { emit<SocketEmitType, IEventEmitAnswer>(socket, EventEmitEnum.ANSWER, peer.localDescription); });
        }
      });
      on<SocketListenType, IEventListenOffer>(socket, EventListenEnum.CANDIDATE, async (event: IEventListenCandidate) => {
        try {
          await addCandidate(peer, event);
        } catch (error) {
          throw new PeerException(error.message, error);
        }
      });
    }
  }

  /**
   * On Remote Peer listener
   */
  remotePeerListener (): void {

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
