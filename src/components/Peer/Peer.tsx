import React from 'react';
import './Peer.css';
import { type IPeerProp } from '@interfaces/component/peer/i.peer-prop';
import { notifyError, notifyInfo, notifySuccess } from '@functions/notification.function';
import { type IPeerState } from '@interfaces/component/peer/i.peer-state';
import { getSocketInstance } from '@functions/socket.function';
import { type Socket } from 'socket.io-client';
import { type IException } from '@interfaces/socket/i.exception';
import { withTranslation } from 'react-i18next';
import { Splitter, SplitterPanel } from 'primereact/splitter';
import { type UniqueId } from '@types/base.type';
import { MediaConfig } from '@configuration/media.config';
import SelectLocalDevice from '@components/Peer/SelectLocalDevice/SelectLocalDevice';
import { Button } from 'primereact/button';
import { countries } from '@utils/countries';
import { type IPeer } from '@interfaces/component/peer/i.peer';
import { type IBasePeerSteam } from '@interfaces/base/i.base-peer-steam';
import { type IBasePeerElement } from '@interfaces/base/i.base-peer-element';
import SelectRemoteCountry from '@components/Peer/SelectRemoteCountry/SelectRemoteCountry';
import { getItem, setItem } from '@functions/localstorage.function';
import { type SocketEmitType, type SocketListenType } from '@types/socket.type';
import { type IEventEmitAnswer, type IEventEmitStart, type IEventEmitStop } from '@interfaces/socket/i.event-emit';
import { EventEmitEnum } from '@enums/event-emit.enum';
import { captureStream, isVirtualDevice } from '@functions/media.function';
import { addCandidate, addMediaTracks, createPeerAnswer, createPeerConnection } from '@functions/webrtc.function';
import { v4 as uuid } from 'uuid';
import { MediaTrackStateEnum } from '@enums/media-track-state.enum';
import { onLoadedVideoMetadata, onPlay, onResizeVideo, onVolumeChange } from '@events/media.event';
import {
  type IEventListenCandidate,
  type IEventListenConnect,
  type IEventListenConnectError,
  type IEventListenDisconnect,
  type IEventListenException, type IEventListenOffer
} from '@interfaces/socket/i.event-listen';
import { EventListenEnum } from '@enums/event-listen.enum';
import {
  onConnectionStateChange, onDataChannel,
  onIceCandidate,
  onIceCandidateError,
  onIceGatheringStateChange,
  onNegotiationNeeded,
  onSignalingStateChange, onTrack
} from '@events/peer.event';
import { RtcIceGatheringStateEnum } from '@enums/rtc-ice-gathering-state.enum';

/**
 * Peer app class
 * @module components
 * @extends React.Component<IPeerProp, IPeerState>
 * @implements IPeer
 */
class Peer extends React.Component<IPeerProp, IPeerState> implements IPeer {
  /**
   * @type RTCPeerConnection peer
   * @private
   */
  private peer: RTCPeerConnection = null;

  /**
   * @type string localContainerId
   * @private
   */
  private readonly localContainerId: UniqueId = MediaConfig.local.containerId;

  /**
   * @type string remoteContainerId
   * @private
   */
  private readonly remoteContainerId: UniqueId = MediaConfig.remote.containerId;

  /**
   * @type string [poster]
   * @private
   */
  private readonly poster: string = MediaConfig.poster ?? '';

  /**
     * Constructor
     * @param {IPeerProp} props
     */
  constructor(props: IPeerProp) {
    super(props);
    this.state = {
      socket: null,
      localVideo: null,
      remoteVideo: null,
      localPeer: null,
      remotePeer: null,
      channel: null,
      callBtnDisabled: false,
      breakBtnDisabled: true,
      recallBtnDisabled: true,
      callBtnLoading: false,
      breakBtnLoading: false,
      recallBtnLoading: false
    };
  }

  /**
   * On Socket connect callback handler
   * @param {Socket} socket
   * @param {IBasePeerElement['video']} localVideo
   * @param {IBasePeerElement['video']} remoteVideo
   * @return void
   */
  onSocketConnectHandler(socket: Socket, localVideo: IBasePeerElement['video'], remoteVideo: IBasePeerElement['video']): void {
    console.log('[!] Socket `connect`:', socket.connected);
    const { stream } = this.props;
    this.setState({
      localVideo,
      remoteVideo,
      socket,
      stream
    }, () => {
      const { snapshot } = MediaConfig;
      localVideo.srcObject = stream;
      localVideo.onloadedmetadata = () => { onLoadedVideoMetadata({ videoElement: localVideo }); };
      localVideo.onresize = () => { onResizeVideo(localVideo); };
      localVideo.onvolumechange = () => { onVolumeChange({ videoElement: localVideo, stream, socket }); };
      localVideo.onplay = () => {
        onPlay({
          videoElement: localVideo,
          stream,
          socket,
          snapshot
        });
      };

      notifySuccess(this.props.t('Connected', {
        ns: 'Base'
      }), this.props.t('Welcome', {
        ns: 'Base'
      }), 2000);
    });
  }

  /**
   * On Socket disconnect callback handler
   * @param {Socket} socket
   * @param {Socket.DisconnectReason} reason
   * @return void
   */
  onSocketDisconnectHandler(socket: Socket, reason: Socket.DisconnectReason): void {
    console.log('[!] Socket `disconnect`: ', socket.disconnected, { reason });
    this.setState({
      socket,
      callBtnLoading: false,
      callBtnDisabled: false,
      recallBtnLoading: false,
      recallBtnDisabled: true,
      breakBtnLoading: false,
      breakBtnDisabled: true
    }, () => {
      notifyInfo(this.props.t('Disconnected', {
        ns: 'Base'
      }), this.props.t('Goodbye', {
        ns: 'Base'
      }), 2000);
    });
  }

  /**
   * On Socket connect error callback handler
   * @param {Socket} socket
   * @param {Error} error
   * @return void
   */
  onSocketConnectErrorHandler(socket: Socket, error: Error): void {
    console.log('[!] Socket `connect_error`:', { error })
    this.setState({
      socket,
      callBtnLoading: false,
      callBtnDisabled: false,
      recallBtnLoading: false,
      recallBtnDisabled: true,
      breakBtnLoading: false,
      breakBtnDisabled: true
    }, () => {
      notifyError(this.props.t('Disconnected', {
        ns: 'Base'
      }), error.message, 2000);
    });
  }

  /**
   * On Socket connect error callback handler
   * @param {Socket} socket
   * @param {IException} exception
   * @return void
   */
  onSocketExceptionHandler(socket: Socket, exception: IException): void {
    console.log('[!] Socket `exception`:', { exception });
    this.setState({
      socket,
      callBtnLoading: false,
      callBtnDisabled: false,
      recallBtnLoading: false,
      recallBtnDisabled: true,
      breakBtnLoading: false,
      breakBtnDisabled: true
    }, () => {
      notifyError(this.props.t('Exception', {
        ns: 'Exceptions'
      }), this.props.t(exception.message, {
        ns: 'Exceptions'
      }), 3000);
    });
  }

  /**
   * On component render
   * @return Promise<void>
   */
  componentDidMount(): void {
    const { user } = this.props;
    const localVideo = document.querySelector('[data-id="' + this.localContainerId + '"]') as HTMLVideoElement;
    const remoteVideo = document.querySelector('[data-id="' + this.remoteContainerId + '"]') as HTMLVideoElement;
    if (!localVideo) {
      notifyError(this.props.t('Local Video', {
        ns: 'VideoLocal'
      }), this.props.t('LocalVideoUnavailable', {
        ns: 'Errors'
      })); return;
    }
    if (!remoteVideo) {
      notifyError(this.props.t('Remote Video', {
        ns: 'VideoRemote'
      }), this.props.t('RemoteVideoUnavailable', {
        ns: 'Errors'
      })); return;
    }
    const socket: Socket = getSocketInstance();
    if (!socket.connected) socket.connect();
    socket.on<SocketListenType, IEventListenConnect>(EventListenEnum.CONNECT,
      (): void => { this.onSocketConnectHandler(socket, localVideo, remoteVideo); });
    socket.on<SocketListenType, IEventListenDisconnect>(EventListenEnum.DISCONNECT,
      (reason: Socket.DisconnectReason): void => { this.onSocketDisconnectHandler(socket, reason); });
    socket.on<SocketListenType, IEventListenConnectError>(EventListenEnum.CONNECT_ERROR,
      (error: Error): void => { this.onSocketConnectErrorHandler(socket, error); });
    socket.on<SocketListenType, IEventListenException>(EventListenEnum.EXCEPTION,
      (exception: IException): void => { this.onSocketExceptionHandler(socket, exception); });
    socket.on<SocketListenType, IEventListenOffer>(EventListenEnum.OFFER, (event: IEventListenOffer) => {
      this.peer = createPeerConnection(user.ice);
      this.peer.ontrack = (event: RTCTrackEvent) => {
        onTrack(remoteVideo, event);
      }
      Promise.all([
        this.peer.setRemoteDescription(new RTCSessionDescription(event)),
        createPeerAnswer(this.peer)
      ]).then(([, answer]) => socket.emit<SocketEmitType, IEventEmitAnswer>(EventEmitEnum.ANSWER, answer))
        .then(() => {
          // this.setState({ remotePeer });
        })
        .catch((error: Error) => { notifyError('Peer Answer', error?.message); });
    });
    socket.on<SocketListenType, IEventListenCandidate>(EventListenEnum.CANDIDATE, (event: IEventListenCandidate) => {
      addCandidate(this.peer, event).catch((error: Error) => { notifyError('Candidate', error?.message); });
    });
  }

  /**
   * Local Peer listener
   * @param {Socket} socket
   * @param {RTCPeerConnection} peer
   * @param {RTCDataChannel} channel
   * @return void
   */
  localPeerListener (socket: Socket, peer: RTCPeerConnection, channel: RTCDataChannel): void {
    if (socket && peer && channel) {
      peer = this.peer;
      const { remoteVideo } = this.state;
      peer.onsignalingstatechange = () => {
        onSignalingStateChange(peer);
        console.log(`[!] SIGNAL STATE: ${peer.signalingState} / ${peer.connectionState}`);
      }
      peer.onconnectionstatechange = () => {
        onConnectionStateChange(peer);
        console.log(`[!] CONNECTION STATE: ${peer.connectionState}`);
      }
      peer.onnegotiationneeded = () => {
        onNegotiationNeeded(peer, socket);
      }
      peer.onicegatheringstatechange = (event: Event) => {
        const iceGatheringState = onIceGatheringStateChange(event.target);
        console.log('iceGatheringState', iceGatheringState);
        if (iceGatheringState === RtcIceGatheringStateEnum.COMPLETE) {
          this.setState({
            breakBtnLoading: false,
            breakBtnDisabled: false,
            callBtnLoading: true,
            callBtnDisabled: true,
            recallBtnLoading: false,
            recallBtnDisabled: true
          });
        }
      }
      peer.onicecandidate = (event: RTCPeerConnectionIceEvent) => {
        onIceCandidate(peer, socket, event);
      }
      peer.onicecandidateerror = (error: RTCPeerConnectionIceErrorEvent) => {
        onIceCandidateError(error);
        this.closeConnections();
        console.log('[X] ICE CANDIDATE ERROR', error);
      }
      peer.ontrack = (event: RTCTrackEvent) => {
        onTrack(remoteVideo, event);
      }
      channel.onopen = (event) => {
        onDataChannel(event);
      };
      channel.onmessage = (event) => {
        onDataChannel(event);
      }
      channel.onerror = (event) => {
        onDataChannel(event);
      }
      channel.onclose = (event) => {
        onDataChannel(event);
      };
    }
  }

  /**
   * Close connections from local side
   * @return void
   */
  closeConnections(): void {
    const {
      socket, channel,
      localPeer, remotePeer
    } = this.state;
    this.setState({
      channel: null,
      localPeer: null,
      remotePeer: null,
      callBtnLoading: false,
      callBtnDisabled: false,
      breakBtnDisabled: false,
      breakBtnLoading: false,
      recallBtnDisabled: false,
      recallBtnLoading: false
    }, () => {
      if (localPeer) {
        localPeer.onconnectionstatechange = null;
        localPeer.ondatachannel = null;
        localPeer.ontrack = null;
        localPeer.onsignalingstatechange = null;
        localPeer.onicecandidate = null;
        localPeer.close();
      }
      if (remotePeer) {
        remotePeer.onconnectionstatechange = null;
        remotePeer.ondatachannel = null;
        remotePeer.ontrack = null;
        remotePeer.onsignalingstatechange = null;
        remotePeer.onicecandidate = null;
        remotePeer.close();
      }
      if (channel) channel.close();
      socket.off<SocketListenType, IEventListenCandidate>(EventListenEnum.NEXT);
      socket.off<SocketListenType, IEventListenCandidate>(EventListenEnum.OFFER);
      socket.off<SocketListenType, IEventListenCandidate>(EventListenEnum.ANSWER);
      socket.off<SocketListenType, IEventListenCandidate>(EventListenEnum.CANDIDATE);
    })
  }

  /**
   * On Stream change
   * @param {IBasePeerSteam['stream']} stream
   */
  onStreamChange = (stream: IBasePeerSteam['stream']): void => {
    this.setState({ stream });
  }

  /**
   * On countries change event handler
   * @param {Array<CountryListItem['code']> | []} countries
   * @return void
   */
  onCountriesChange = (countries: Array<CountryListItem['code']> | []): void => {
    setItem('selected', countries);
  }

  /**
   * On call event handler
   * @return void
   */
  onCall(): void {
    this.setState({
      callBtnLoading: true,
      callBtnDisabled: true,
      breakBtnLoading: false,
      breakBtnDisabled: false,
      recallBtnLoading: false,
      recallBtnDisabled: false
    }, () => {
      console.log('[!] CALL START');
      const { stream, socket, localVideo } = this.state;
      const { user } = this.props;
      const videoDevice = stream?.getVideoTracks().find(device => device.readyState === MediaTrackStateEnum.LIVE);
      const audioDevice = stream?.getAudioTracks().find(device => device.readyState === MediaTrackStateEnum.LIVE);
      if (!videoDevice) {
        notifyError(this.props.t('Video Device', {
          ns: 'Base'
        }), this.props.t('Video device has not recognized', {
          ns: 'Errors'
        }), 2000); return;
      }
      if (!audioDevice) {
        notifyError(this.props.t('Audio Device', {
          ns: 'Base'
        }), this.props.t('Audio device has not recognized', {
          ns: 'Errors'
        }), 2000);
      }
      if (user && socket.connected) {
        const countries = getItem('selected') === null ? [] : getItem('selected');
        socket.emit<SocketEmitType, IEventEmitStart>(EventEmitEnum.START, {
          devices: [videoDevice, audioDevice].map((device) => ({
            deviceId: device.id,
            deviceType: device.kind,
            deviceLabel: device.label,
            isVirtual: isVirtualDevice(device.label)
          })),
          photo: captureStream(localVideo, MediaConfig.snapshot),
          countries
        });
        this.peer = createPeerConnection(user.ice);
        const channel = this.peer.createDataChannel(uuid(), {
          ordered: true,
          maxRetransmits: 3
        });
        try {
          addMediaTracks(this.peer, stream);
          this.setState({
            localPeer: this.peer, stream, channel
          }, () => { this.localPeerListener(socket, this.peer, channel); });
        } catch (error: Error) {
          notifyError(error.name, error.message);
        }
      }
    });
  }

  /**
   * On break event handler
   * @return void
   */
  onBreak(): void {
    this.setState({
      breakBtnLoading: true,
      breakBtnDisabled: true,
      callBtnLoading: false,
      callBtnDisabled: true,
      recallBtnLoading: false,
      recallBtnDisabled: true
    }, () => {
      console.log('[!] onBreak');
      const { socket, localPeer, remotePeer } = this.state;
      if (!localPeer && !remotePeer) {
        this.setState({
          breakBtnLoading: false,
          breakBtnDisabled: false,
          callBtnLoading: false,
          callBtnDisabled: false
        }, () => {
          notifyInfo('Peer', 'Connection has already closed', 3000);
        });
      } else {
        if (socket.connected) {
          socket.emit<SocketEmitType, IEventEmitStop>(EventEmitEnum.STOP);
        }
        setTimeout(() => { this.closeConnections(); }, 500)
      }
    });
  }

  /**
   * On re-call event handler
   * @return void
   */
  onReCall(): void {
    this.setState({
      recallBtnLoading: true,
      recallBtnDisabled: true,
      breakBtnLoading: false,
      breakBtnDisabled: true,
      callBtnLoading: false,
      callBtnDisabled: true
    }, () => {
      console.log('[!] onReCall');
    });
  }

  render(): React.JSX.Element {
    const {
      localPeer,
      socket, localVideo, remoteVideo,
      callBtnLoading, recallBtnLoading, breakBtnLoading,
      callBtnDisabled, recallBtnDisabled, breakBtnDisabled
    } = this.state;
    const { stream, user } = this.props;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const country = countries.find((country: CountryListItem) => country.code === user?.country) as CountryListItem;
    return (
        <div className="peer-container">
            {stream && user
              ? <div className="peer-output">
                  <Splitter className="mb-5">
                    <SplitterPanel className="flex align-items-center justify-content-center">
                      <div className="peer-remote">
                        <div className="peer-remote-container">
                          <video id="rmd" data-id={this.remoteContainerId} autoPlay playsInline poster={this.poster}/>
                        </div>
                        {remoteVideo && socket.connected
                          ? <div className="peer-remote-control">
                              <SelectRemoteCountry onCountriesChange={this.onCountriesChange} />
                            </div>
                          : <></>}
                      </div>
                    </SplitterPanel>
                    <SplitterPanel className="flex align-items-center justify-content-center">
                      <div className="peer-local">
                        <div className="peer-local-container">
                          <video data-id={this.localContainerId} autoPlay playsInline muted poster={this.poster} />
                        </div>
                        {country
                          ? <div className="peer-local-country">
                              <span>{country.flag} {country.name}</span>
                            </div>
                          : <></>
                        }
                        {localVideo && socket.connected
                          ? <div className="peer-local-control">
                              <div className="peer-local-device">
                                <SelectLocalDevice onStreamChange={this.onStreamChange} stream={stream} peer={localPeer} video={localVideo} />
                              </div>
                              <div className="peer-local-buttons">
                                <Button
                                    label="Start"
                                    disabled={callBtnDisabled}
                                    icon="pi pi-phone"
                                    loading={callBtnLoading}
                                    onClick={() => { this.onCall(); }}
                                />
                                <Button
                                    label="Stop"
                                    disabled={breakBtnDisabled}
                                    icon="pi pi-stop-circle"
                                    loading={breakBtnLoading}
                                    onClick={() => { this.onBreak(); }}
                                />
                                <Button
                                    label="Restart"
                                    icon="pi pi-history"
                                    disabled={recallBtnDisabled}
                                    loading={recallBtnLoading}
                                    onClick={() => { this.onReCall(); }}
                                />
                              </div>
                            </div>
                          : <></>}
                      </div>
                    </SplitterPanel>
                  </Splitter>
                </div>
              : <></>
            }
        </div>
    )
  }
}

export default withTranslation(['Base', 'Exceptions'])(Peer);
