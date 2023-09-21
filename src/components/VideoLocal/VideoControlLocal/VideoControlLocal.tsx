import React from 'react';
import './VideoControlLocal.css';
import { type IVideoControlLocalProp } from '@interfaces/component/video-control-local/i.video-control-local-prop';
import { type IVideoControlLocal } from '@interfaces/component/video-control-local/i.video-control-local';
import { type IVideoControlLocalState } from '@interfaces/component/video-control-local/i.video-control-local-state';
import SelectLocalDevice from '@components/VideoLocal/VideoControlLocal/SelectLocalDevice/SelectLocalDevice';
import { withTranslation } from 'react-i18next';
import { addMediaTracks, createPeerConnection } from '@functions/webrtc.function';
import { onConnectionStateChange, onDataChannel, onIceGatheringStateChange, onNegotiationNeeded, onSignalingStateChange } from '@events/peer.event';
import { Button } from 'primereact/button';
import { isNullUndefEmptyStr } from '@functions/string.function';
import { notifyInfo } from '@functions/notification.function';
import { emit } from '@functions/socket.function';
import { type SocketEmitType } from '@types/socket.type';
import { type IEventEmitOffer, type IEventEmitStart } from '@interfaces/socket/i.event-emit';
import { EventEmitEnum } from '@enums/event-emit.enum';
import { captureStream, isVirtualDevice } from '@functions/media.function';
import { type IBasePeerSteam } from '@interfaces/base/i.base-peer-steam';
import { MediaConfig } from '@configuration/media.config';

/**
 * VideoControlLocal app class
 * @module components
 * @extends React.Component<IVideoControlLocalProp, IVideoControlLocalState>
 * @implements IVideoControlLocal
 */
class VideoControlLocal extends React.Component<IVideoControlLocalProp, IVideoControlLocalState> implements IVideoControlLocal {
  /**
     * Constructor
     * @param {IVideoControlLocalProp} props
     */
  constructor(props: IVideoControlLocalProp) {
    super(props);
    this.state = {
      callBtnLoading: false,
      breakBtnLoading: false,
      recallBtnLoading: false,
      peer: null,
      channel: null,
      stream: null
    };
    this.onStreamChange = this.onStreamChange.bind(this);
  }

  /**
     * On component render
     * @return void
     */
  componentDidMount(): void {
    this.setState({
      stream: this.props.stream
    });
  }

  componentDidUpdate(): void {
    // const { socket } = this.props;
    // const { peer, channel } = this.state;
    // if (peer && channel) {
    //   channel.onclose = (e) => { console.log(e); };
    //   channel.onmessage = (e) => { console.log('onmessage', e); };
    //   channel.onopen = (e) => { console.log('onopen', e); };
    //   channel.onerror = (e) => { console.log('onerror', e); };
    //   channel.onclosing = (e) => { console.log('onclosing', e); };
    //   channel.onbufferedamountlow = (e) => { console.log('onbufferedamountlow', e); };
    //   peer.onicegatheringstatechange = (event) => {
    //     onIceGatheringStateChange(event.target);
    //   }
    //   peer.onnegotiationneeded = () => {
    //     onNegotiationNeeded(socket, peer);
    //   }
    //   peer.ondatachannel = (event: RTCDataChannelEvent) => {
    //     onDataChannel(event);
    //   };
    //   peer.onsignalingstatechange = () => {
    //     onSignalingStateChange(peer);
    //   }
    //   peer.onconnectionstatechange = () => {
    //     onConnectionStateChange(peer);
    //   }
    // }
  }

  /**
   * On Stream change
   * @param {IBasePeerSteam['stream']} stream
   */
  onStreamChange = (stream: IBasePeerSteam['stream']): void => {
    this.setState({ stream });
  }

  /**
     * On Call handler
     * @return void
     */
  onCall(): void {
    this.setState({ callBtnLoading: true });
    const { stream } = this.state;
    const videoDevice = stream?.getVideoTracks().find(device => device.readyState === 'live');
    const audioDevice = stream?.getAudioTracks().find(device => device.readyState === 'live');
    const { user, socket, video } = this.props;
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
        countries: ['UA', 'RU']
      });

      // const peer = createPeerConnection(user.ice);
      // const channel = peer.createDataChannel('my channel');
      // addMediaTracks(peer, stream);
      this.setState({ /* peer, channel, */ callBtnLoading: false });
    }
  }

  /**
     * On ReCall handler
     * @return void
     */
  onReCall(): void {
    this.setState({ recallBtnLoading: true });
    const { stream } = this.state;
    const { user } = this.props;
    if (user) {
      const peer = createPeerConnection(user.ice);
      addMediaTracks(peer, stream);
      this.setState({ peer, recallBtnLoading: false });
    }
  }

  /**
     * On Break handler
     * @return void
     */
  onBreak(): void {
    this.setState({ breakBtnLoading: true });
    const { peer, channel } = this.state;
    if (isNullUndefEmptyStr(peer) && isNullUndefEmptyStr(channel)) {
      notifyInfo('Peer', 'Connection has already closed');
    } else {
      console.log('channel', channel)
      channel?.close();
    }
    this.setState({ breakBtnLoading: false });
  }

  render(): React.JSX.Element {
    const { video, socket } = this.props;
    const {
      stream, peer,
      callBtnLoading, recallBtnLoading, breakBtnLoading
    } = this.state;
    return (
        <div className="video-local-control">
            { stream && socket?.connected
              ? <SelectLocalDevice onStreamChange={this.onStreamChange} stream={stream} peer={peer} video={video} />
              : <></>
            }
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
        </div>)
  }
}

export default withTranslation(['Base', 'Exceptions'])(VideoControlLocal);
