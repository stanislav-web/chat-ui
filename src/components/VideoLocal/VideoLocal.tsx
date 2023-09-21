import React from 'react';
import './VideoLocal.css';
import { MediaConfig } from '@configuration/media.config';
import { notifyError } from '@functions/notification.function';
import { onLoadedVideoMetadata, onPlay, onResizeVideo, onVolumeChange } from '@events/media.event';
import VideoControlLocal from '@components/VideoLocal/VideoControlLocal/VideoControlLocal';
import { type IVideoLocalState } from '@interfaces/component/video-local/i.video-local-state';
import { type IVideoLocalProp } from '@interfaces/component/video-local/i.video-local-prop';
import { withTranslation } from 'react-i18next';
import { type UniqueId } from '@types/base.type';

/**
 * VideoLocal app class
 * @TODO
 * @module components
 * @extends React.Component<IVideoLocalProp, IVideoLocalState>
 */
class VideoLocal extends React.Component<IVideoLocalProp, IVideoLocalState> {
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
      this.setState({
        video: videoElement
      });
    }
  }

  render(): React.JSX.Element {
    const { video } = this.state;
    const { stream, socket, user } = this.props;
    return (
        <div className="video-local">
          <div className="video-local-container">
            <video id={this.containerId} autoPlay playsInline muted poster={this.poster} />
          </div>
          <div className="video-local-control">
            {stream
              ? <VideoControlLocal socket={socket} stream={stream} video={video} user={user} />
              : <></>
            }
          </div>
        </div>
    )
  }
}

export default withTranslation(['VideoLocal', 'Errors', 'Exceptions'])(VideoLocal);
