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
import { MediaConfig } from '@configuration/media.config';
import SelectLocalDevice from '@components/Peer/SelectLocalDevice/SelectLocalDevice';
import { Button } from 'primereact/button';
import { countries } from '@utils/countries';
import { type IPeer } from '@interfaces/component/peer/i.peer';
import { type IBasePeerSteam } from '@interfaces/base/i.base-peer-steam';
import SelectRemoteCountry from '@components/Peer/SelectRemoteCountry/SelectRemoteCountry';
import { getItem, setItem } from '@functions/localstorage.function';
import { type SocketEmitType, type SocketListenType } from '@types/socket.type';
import {
  type IEventEmitStart,
  type IEventEmitStop
} from '@interfaces/socket/i.event-emit';
import { EventEmitEnum } from '@enums/event-emit.enum';
import { captureStream, isVirtualDevice, stopStream } from '@functions/media.function';
import {
  addMediaTracks
} from '@functions/webrtc.function';
import { MediaTrackStateEnum } from '@enums/media-track-state.enum';
import { onLoadedVideoMetadata, onPlay, onResizeVideo, onVolumeChange } from '@events/media.event';
import {
  type IEventListenAnswer,
  type IEventListenCandidates,
  type IEventListenConnect,
  type IEventListenConnectError,
  type IEventListenDisconnect,
  type IEventListenException, type IEventListenNext, type IEventListenOffer
} from '@interfaces/socket/i.event-listen';
import { EventListenEnum } from '@enums/event-listen.enum';
import { type IUser } from '@interfaces/user/i.user';
import { type Uri } from '@types/base.type';
import { PeerConnection } from '@components/Peer/PeerConnection';

/**
 * Peer app class
 * @module components
 * @extends React.Component<IPeerProp, IPeerState>
 * @implements IPeer
 */
class Peer extends React.Component<IPeerProp, IPeerState> implements IPeer {
  /**
   * @type {IUser} user
   * @private
   * @readonly
   */
  private readonly user: IUser = null;

  /**
   * @type {PeerConnection} peer
   * @private
   */
  private peer: PeerConnection = null;

  /**
   * Poster video placeholder
   * @type {Uri} poster
   * @readonly
   * @private
   */
  private readonly poster: Uri;

  /**
   * Socket connection
   * @type {Socket} socket
   * @private
   * @readonly
   */
  private readonly socket: Socket;

  /**
     * Constructor
     * @param {IPeerProp} props
     */
  constructor(props: IPeerProp) {
    super(props);
    this.poster = MediaConfig.poster;
    this.state = {
      stream: this.props.stream,
      callBtnLabel: 'Start',
      isPeerConnected: false,
      isPeerReady: false,
      isDevicesAvailable: true,
      isCountriesAvailable: true,
      callBtnDisabled: false,
      breakBtnDisabled: true,
      recallBtnDisabled: true,
      callBtnLoading: false,
      breakBtnLoading: false,
      recallBtnLoading: false
    };
    this.socket = getSocketInstance();
    this.user = this.props.user;
  }

  /**
   * On component render
   * @return Promise<void>
   */
  componentDidMount(): void {
    const localVideo = document.querySelector('[data-id="' + MediaConfig.local.containerId + '"]');
    const remoteVideo = document.querySelector('[data-id="' + MediaConfig.remote.containerId + '"]');
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
    this.setState({
      localVideo, remoteVideo, isDevicesAvailable: true, isCountriesAvailable: true, callBtnDisabled: false
    }, () => {
      if (!this.socket.connected) this.socket.connect();
      this.socket.on<SocketListenType, IEventListenConnect>(EventListenEnum.CONNECT,
        (): void => { this.onSocketConnectHandler(localVideo); });
      this.socket.on<SocketListenType, IEventListenDisconnect>(EventListenEnum.DISCONNECT,
        (reason: Socket.DisconnectReason): void => { this.onSocketDisconnectHandler(reason); });
      this.socket.on<SocketListenType, IEventListenConnectError>(EventListenEnum.CONNECT_ERROR,
        (error: Error): void => { this.onSocketConnectErrorHandler(error); });
      this.socket.on<SocketListenType, IEventListenException>(EventListenEnum.EXCEPTION,
        (exception: IException): void => { this.onSocketExceptionHandler(exception); });
    });
  }

  /**
   * On Socket connect callback handler
   * @param {HTMLVideoElement} localVideo
   * @return void
   */
  onSocketConnectHandler(localVideo: HTMLVideoElement): void {
    console.log('[!] Socket `connect`:', this.socket.connected);
    const { stream } = this.props;
    const { snapshot } = MediaConfig;
    localVideo.srcObject = stream;
    localVideo.onloadedmetadata = () => { onLoadedVideoMetadata({ videoElement: localVideo }); };
    localVideo.onresize = () => { onResizeVideo(localVideo); };
    localVideo.onvolumechange = () => {
      onVolumeChange({
        videoElement: localVideo,
        stream,
        socket: this.socket
      });
    };
    localVideo.onplay = () => {
      onPlay({
        videoElement: localVideo,
        stream,
        socket: this.socket,
        snapshot
      });
    };
    notifySuccess(this.props.t('Connected', {
      ns: 'Base'
    }), this.props.t('Welcome', {
      ns: 'Base'
    }), 2000);
  }

  /**
   * On Socket disconnect callback handler
   * @param {Socket.DisconnectReason} reason
   * @return void
   */
  onSocketDisconnectHandler(reason: Socket.DisconnectReason): void {
    console.log('[!] Socket `disconnect`: ', this.socket.disconnected, { reason });
    this.closeConnections();
    notifyInfo(this.props.t('Disconnected', {
      ns: 'Base'
    }), this.props.t('Goodbye', {
      ns: 'Base'
    }), 2000);
  }

  /**
   * On Socket connect error callback handler
   * @param {Error} error
   * @return void
   */
  onSocketConnectErrorHandler(error: Error): void {
    console.log('[!] Socket `connect_error`:', { error })
    this.closeConnections()
    notifyError(this.props.t('Disconnected', {
      ns: 'Base'
    }), error.message, 2000);
  }

  /**
   * On Socket exception error callback handler
   * @param {IException} exception
   * @return void
   */
  onSocketExceptionHandler(exception: IException): void {
    console.log('[!] Socket `exception`:', { exception });
    this.setState({
      isPeerConnected: false,
      isDevicesAvailable: true,
      isCountriesAvailable: true,
      callBtnLabel: 'Start',
      callBtnDisabled: false,
      breakBtnDisabled: true,
      recallBtnDisabled: false,
      callBtnLoading: false,
      breakBtnLoading: false,
      recallBtnLoading: false
    }, () => {
      notifyError(this.props.t('Exception', {
        ns: 'Exceptions'
      }), this.props.t(exception.message, {
        ns: 'Exceptions'
      }), 3000);
    });
  }

  /**
   * Stop connections from local side
   * @return void
   */
  stopConnections(): void {
    this.setState({
      isPeerConnected: false,
      isPeerReady: false,
      isDevicesAvailable: true,
      isCountriesAvailable: true,
      callBtnDisabled: false,
      breakBtnDisabled: false,
      recallBtnDisabled: false,
      callBtnLoading: false,
      breakBtnLoading: true,
      recallBtnLoading: false
    }, () => {
      if (!this.peer) { notifyInfo('Local Peer', 'Connection has already closed', 3000); return; }
      this.peer.close();
      if (this.state.remoteVideo) {
        stopStream(this.state.remoteVideo);
        this.setState({ remoteVideo: null });
      }
    })
  }

  /**
   * Close connections from local side
   * @return void
   */
  closeConnections(): void {
    this.setState({
      isPeerReady: false,
      isPeerConnected: false,
      isDevicesAvailable: false,
      isCountriesAvailable: false,
      callBtnDisabled: true,
      breakBtnDisabled: true,
      recallBtnDisabled: true,
      callBtnLoading: false,
      breakBtnLoading: false,
      recallBtnLoading: false
    }, () => {
      if (!this.peer) { notifyInfo('Local Peer', 'Connection has already closed', 3000); return; }
      this.peer.close()
      if (this.state.remoteVideo) {
        stopStream(this.state.remoteVideo);
        this.setState({ remoteVideo: null });
      }
      this.socket.emit<SocketEmitType, IEventEmitStop>(EventEmitEnum.STOP);
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
    console.log('[!] CALL');
    this.setState({
      callBtnLoading: true,
      callBtnDisabled: true
    }, () => {
      const { stream, localVideo } = this.state;
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
      const countries = getItem('selected') === null ? [] : getItem('selected');
      this.socket.emit<SocketEmitType, IEventEmitStart>(EventEmitEnum.START, {
        devices: [videoDevice, audioDevice].map((device) => ({
          deviceId: device.id,
          deviceType: device.kind,
          deviceLabel: device.label,
          isVirtual: isVirtualDevice(device.label)
        })),
        photo: captureStream(localVideo, MediaConfig.snapshot),
        countries
      });
      this.socket.on<SocketListenType, IEventListenNext>(EventListenEnum.READY, async () => {
        if (!this.peer) {
          this.peer = new PeerConnection(this.socket, this.state.remoteVideo, this.user.ice);
          await this.peer.createPeer();
          this.peer.createDataChanel();
          this.peer.trackDataChannel();
          this.peer.trackPeer(() => {
            this.setState({
              callBtnLabel: 'Next',
              isPeerConnected: true,
              callBtnLoading: false,
              callBtnDisabled: false,
              breakBtnDisabled: false
            });
          }, (error: any) => {
            this.setState({
              callBtnLabel: 'Start',
              isPeerConnected: false,
              callBtnLoading: false,
              callBtnDisabled: false,
              breakBtnDisabled: false,
              recallBtnDisabled: false
            }, () => { notifyInfo(error.name, error.message); }
            );
          })
        }
        try {
          addMediaTracks(this.peer.getPeer(), stream);
          await this.peer.sendOffer();
          this.setState({ isPeerReady: true });
        } catch (error: Error) {
          notifyError(error.name, error.message);
        }
        this.socket.on<SocketListenType, IEventListenCandidates>(EventListenEnum.CANDIDATES, (candidates: IEventListenCandidates) => {
          if (this.state.isPeerReady && this.peer.getCandidates().length > 0) {
            candidates.forEach((candidate) => {
              this.peer.addCandidate(candidate);
            })
          }
        })
        this.socket.on<SocketListenType, IEventListenOffer>(EventListenEnum.OFFER, (event: IEventListenOffer) => {
          if (this.state.isPeerReady) {
            this.peer.sendAnswer(new RTCSessionDescription(event));
          }
        });
        this.socket.on<SocketListenType, IEventListenOffer>(EventListenEnum.ANSWER, (event: IEventListenAnswer) => {
          this.peer.setRemoteDescription(event)
            .catch((error: Error) => {
              notifyError('Peer', error.message);
            });
        });
      });
    });
  }

  /**
   * On break event handler
   * @return void
   */
  onBreak(): void {
    console.log('[!] BREAK');
    this.setState({
      breakBtnLoading: true,
      isPeerReady: false,
      isPeerConnected: false
    }, () => {
      this.stopConnections();
      this.setState({
        callBtnLabel: 'Start',
        breakBtnLoading: false,
        breakBtnDisabled: false
      });
    });
  }

  /**
   * On re-call event handler
   * @return void
   */
  onReCall(): void {
    console.log('[!] RECALL');
    notifyInfo('Re Call', 'Not implemented'); return;
    this.setState({
      recallBtnDisabled: true,
      recallBtnLoading: true,
      callBtnDisabled: true,
      breakBtnDisabled: true,
      isPeerReady: false,
      isPeerConnected: false
    }, () => {
      this.stopConnections();
      this.setState({
        callBtnLabel: 'Next',
        recallBtnDisabled: false,
        recallBtnLoading: false
      });
    });
  }

  render(): React.JSX.Element {
    const {
      stream, localVideo,
      isCountriesAvailable, isDevicesAvailable, callBtnLabel,
      callBtnLoading, recallBtnLoading, breakBtnLoading,
      callBtnDisabled, recallBtnDisabled, breakBtnDisabled
    } = this.state;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const country = countries.find((country: CountryListItem) => country.code === this.props.user?.country) as CountryListItem;
    return (
        <div className="peer-container">
          <div className="peer-output">
            <Splitter className="mb-5">
              <SplitterPanel className="flex align-items-center justify-content-center">
                <div className="peer-remote">
                  <div className="peer-remote-container">
                    <video data-id={MediaConfig.remote.containerId} autoPlay playsInline poster={this.poster}/>
                  </div>
                  <div className="peer-remote-country"></div>
                  {isCountriesAvailable
                    ? <div className="peer-remote-control">
                        <SelectRemoteCountry onCountriesChange={this.onCountriesChange} />
                      </div>
                    : <></>
                  }
                </div>
              </SplitterPanel>
              <SplitterPanel className="flex align-items-center justify-content-center">
                <div className="peer-local">
                  <div className="peer-local-container">
                    <video data-id={MediaConfig.local.containerId} autoPlay playsInline muted poster={this.poster} />
                  </div>
                  {country
                    ? <div className="peer-local-country">
                        <span>{country.flag} {country.name}</span>
                      </div>
                    : <></>
                  }
                  {isDevicesAvailable && stream
                    ? <div className="peer-local-control">
                        <div className="peer-local-device">
                          <SelectLocalDevice onStreamChange={this.onStreamChange} stream={stream} peer={this.peer?.getPeer()} video={localVideo} />
                        </div>
                        <div className="peer-local-buttons">
                          <Button
                              label={callBtnLabel}
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
        </div>
    )
  }
}

export default withTranslation(['Base', 'Exceptions'])(Peer);
