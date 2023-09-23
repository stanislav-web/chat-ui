import React from 'react';
import './VideoLocal.css';
import { MediaConfig } from '@configuration/media.config';
import { notifyError, notifyInfo } from '@functions/notification.function';
import { onLoadedVideoMetadata, onPlay, onResizeVideo, onVolumeChange } from '@events/media.event';
import { type IVideoLocalState } from '@interfaces/component/video-local/i.video-local-state';
import { type IVideoLocalProp } from '@interfaces/component/video-local/i.video-local-prop';
import { withTranslation } from 'react-i18next';
import { type UniqueId } from '@types/base.type';
import {
  onConnectionStateChange,
  onIceGatheringStateChange,
  onNegotiationNeeded,
  onSignalingStateChange
} from '@events/peer.event';
import SelectLocalDevice from '@components/VideoLocal/SelectLocalDevice/SelectLocalDevice';
import { Button } from 'primereact/button';
import { type IBasePeerSteam } from '@interfaces/base/i.base-peer-steam';
import { type IVideoLocal } from '@interfaces/component/video-local/i.video-local';
import { emit } from '@functions/socket.function';
import { type SocketEmitType } from '@types/socket.type';
import { type IEventEmitStart } from '@interfaces/socket/i.event-emit';
import { EventEmitEnum } from '@enums/event-emit.enum';
import { captureStream, isVirtualDevice } from '@functions/media.function';
import { addMediaTracks, createPeerConnection } from '@functions/webrtc.function';
import { v4 as uuid } from 'uuid';
import { isNullUndefEmptyStr } from '@functions/string.function';
import { RtcIceGatheringStateEnum } from '@enums/rtc-ice-gathering-state.enum';
import { getItem } from '@functions/localstorage.function';

/**
 * VideoLocal app class
 * @module components
 * @extends React.Component<IVideoLocalProp, IVideoLocalState>
 * @implements IVideoLocal
 */
class VideoLocal extends React.Component<IVideoLocalProp, IVideoLocalState> implements IVideoLocal {
  /**
   * @type string containerId
   * @private
   */
  private readonly containerId: UniqueId = MediaConfig.local.containerId;

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
   * @type RTCDataChannel channel
   * @private
   */
  private channel: RTCDataChannel = null;

  /**
     * Constructor
     * @param {IVideoLocalProp} props
     */
  constructor(props: IVideoLocalProp) {
    super(props);
    this.state = {
      video: null,
      stream: null,
      callBtnLoading: false,
      breakBtnLoading: false,
      recallBtnLoading: false
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
      videoElement.onloadedmetadata = () => { onLoadedVideoMetadata({ videoElement }); };
      videoElement.onresize = () => { onResizeVideo(videoElement); };
      videoElement.onvolumechange = () => { onVolumeChange({ videoElement, stream, socket }); };
      videoElement.onplay = () => {
        onPlay({
          videoElement,
          stream,
          socket,
          snapshot
        });

        this.setState({
          video: videoElement,
          stream
        });
      };

      // const peer = createPeerConnection();
      // peer.onicecandidate = (event: RTCPeerConnectionIceEvent) => {
      //   onLocalIceCandidate(socket, event, EventEmitEnum.CANDIDATE);
      // }
      // peer.onicecandidateerror = (error: RTCPeerConnectionIceErrorEvent) => {
      //   onIceCandidateError(error);
      // }
      // on<SocketListenType, IEventListenOffer>(socket, EventListenEnum.CANDIDATE, async (event: IEventListenCandidate) => {
      //   try {
      //     await addCandidate(peer, event);
      //   } catch (error) {
      //     throw new PeerException(error.message, error);
      //   }
      // });
    }
  }

  /**
   * On Stream change
   * @param {IBasePeerSteam['stream']} stream
   */
  onStreamChange = (stream: IBasePeerSteam['stream']): void => {
    this.setState({ stream });
  }

  /**
   * On Local Peer listener
   */
  localPeerListener (): void {
    this.peer.onsignalingstatechange = () => {
      onSignalingStateChange(this.peer);
    }
    this.peer.onconnectionstatechange = () => {
      onConnectionStateChange(this.peer);
    }
    this.peer.onicegatheringstatechange = (event) => {
      const iceGatheringState = onIceGatheringStateChange(event.target);
      if (iceGatheringState === RtcIceGatheringStateEnum.COMPLETE) {
        this.setState({ callBtnLoading: false });
      }
    }
    this.peer.onnegotiationneeded = () => {
      onNegotiationNeeded(this.props.socket, this.peer);
    }
    this.channel.onclose = () => {
      this.setState({ breakBtnLoading: false });
    }
  }

  /**
   * On Call handler
   * @return void
   */
  onCall(): void {
    this.setState({ breakBtnLoading: false, callBtnLoading: true, recallBtnLoading: false });
    const countries = getItem('selected') === null ? undefined : getItem('selected');
    const { stream, video } = this.state;
    const videoDevice = stream?.getVideoTracks().find(device => device.readyState === 'live');
    const audioDevice = stream?.getAudioTracks().find(device => device.readyState === 'live');
    const { user, socket } = this.props;
    if (user && socket.connected) {
      // 1. Send search credentials on server
      emit<SocketEmitType, IEventEmitStart>(socket, EventEmitEnum.START, {
        devices: [videoDevice, audioDevice].map((device) => ({
          deviceId: device.id,
          deviceType: device.kind,
          deviceLabel: device.label,
          isVirtual: isVirtualDevice(device.label)
        })),
        photo: captureStream(
          video,
          MediaConfig.snapshot
        ),
        countries
      });

      const peer = createPeerConnection(user.ice);
      const channel = peer.createDataChannel(uuid());
      try {
        addMediaTracks(peer, stream);
      } catch (error: Error) {
        notifyError(error.name, error.message);
      }
      this.peer = peer;
      this.channel = channel;
      this.localPeerListener();
    }
  }

  /**
   * On Break handler
   * @return void
   */
  onBreak(): void {
    this.setState({ breakBtnLoading: true, callBtnLoading: false, recallBtnLoading: false });
    if (isNullUndefEmptyStr(this.peer) && isNullUndefEmptyStr(this.channel)) {
      notifyInfo('Peer', 'Connection has already closed', 3000);
      setTimeout(() => {
        this.setState({ breakBtnLoading: false });
      }, 3000);
    } else {
      this.peer?.close();
      this.channel?.close();
      this.peer = null;
      this.channel = null;
    }
  }

  /**
   * On ReCall handler
   * @return void
   */
  onReCall(): void {
    this.setState({ breakBtnLoading: false, callBtnLoading: false, recallBtnLoading: true });
  }

  render(): React.JSX.Element {
    const {
      video,
      callBtnLoading, recallBtnLoading, breakBtnLoading
    } = this.state;
    const { stream, socket } = this.props;
    return (
        <div className="video-local">
          <div className="video-local-container">
            <video id={this.containerId} autoPlay playsInline muted poster={this.poster} />
          </div>
            {stream && socket.connected
              ? <div className="video-local-control">
                  <div className="video-local-device">
                    <SelectLocalDevice onStreamChange={this.onStreamChange} stream={stream} peer={this.peer} video={video} />
                  </div>
                  <div className="video-local-buttons">
                    <Button
                        label="Start"
                        icon="pi pi-phone"
                        loading={callBtnLoading}
                        onClick={() => { this.onCall(); }}
                    />
                    <Button
                        label="Stop"
                        icon="pi pi-stop-circle"
                        loading={breakBtnLoading}
                        onClick={() => { this.onBreak(); }}
                    />
                    <Button
                        label="Restart"
                        icon="pi pi-history"
                        loading={recallBtnLoading}
                        onClick={() => { this.onReCall(); }}
                    />
                  </div>
                </div>
              : <></>
            }
        </div>
    )
  }
}

export default withTranslation(['VideoLocal', 'Errors', 'Exceptions'])(VideoLocal);
