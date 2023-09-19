import React, { type SyntheticEvent } from 'react';
import './SelectRemoteCountry.css';
import { type ISelectLocalDeviceProp } from '@interfaces/component/select-local-device/i.select-local-device-prop';
import { filterUserDevicesByType, findUserDeviceByLabel, getUserDevices, switchCamera, switchMicrophone } from '@functions/media.function';
import { notifyError } from '@functions/notification.function';
import { type ISelectLocalDevice } from '@interfaces/component/select-local-device/i.select-local-device';
import { MediaDeviceTypeEnum } from '@enums/media-device-type.enum';
import { type ISelectLocalDeviceState } from '@interfaces/component/select-local-device/i.select-local-device-state';
import { BsCameraVideo } from 'react-icons/bs';
import { BiSolidMicrophone } from 'react-icons/bi';
import { withTranslation } from 'react-i18next';
import { MediaConfig } from '@configuration/media.config';

/**
 * SelectRemoteCountry app class
 * @module components
 * @extends React.Component<ISelectLocalDeviceProp, ISelectLocalDeviceState>
 * @implements ISelectLocalDevice
 */
class SelectRemoteCountry extends React.Component<ISelectLocalDeviceProp, ISelectLocalDeviceState> implements ISelectLocalDevice {
  /**
     * @type UniqueId videoSelectorId
     * @private
     */
  private readonly videoSelectorId: string = MediaConfig.control.videoSelectorId;

  /**
     * @type UniqueId audioSelectorId
     * @private
     */
  private readonly audioSelectorId: string = MediaConfig.control.audioSelectorId;

  /**
     * Constructor
     * @param {ISelectLocalDeviceProp} props
     */
  constructor(props: ISelectLocalDeviceProp) {
    super(props);
    this.state = {
      stream: null,
      audioDevices: [],
      videoDevices: []
    }
  }

  async componentDidMount(): void {
    const { stream } = this.props;
    if (stream !== null) {
      const devices = await getUserDevices();
      this.setState({
        stream,
        audioDevices: filterUserDevicesByType(devices, MediaDeviceTypeEnum.AUDIO_INPUT),
        videoDevices: filterUserDevicesByType(devices, MediaDeviceTypeEnum.VIDEO)
      });
    }
  };

  /**
     * On audio device change event handler
     * @param {SyntheticEvent<EventTarget>} event
     * @return void
     */
  async onAudioChange(event: SyntheticEvent<EventTarget>): void {
    const { peer } = this.props;
    const audioDeviceLabel = (event.target as HTMLInputElement).value;
    const videoDeviceLabel = (document.getElementById(this.videoSelectorId) as HTMLInputElement).value;
    const audioDevice = findUserDeviceByLabel(this.state.audioDevices, audioDeviceLabel);
    const videoDevice = findUserDeviceByLabel(this.state.videoDevices, videoDeviceLabel);
    if (audioDevice && videoDevice) {
      const audio = Object.assign({}, MediaConfig.audio, { deviceId: { exact: audioDevice.deviceId } });
      const video = Object.assign({}, MediaConfig.video, { deviceId: { exact: videoDevice.deviceId } });
      try {
        const stream = await switchMicrophone(
          {
            audio,
            video
          },
          peer
        );
        this.setState({
          stream,
          audioDevices: filterUserDevicesByType(this.state.audioDevices, MediaDeviceTypeEnum.AUDIO_INPUT)
        });
      } catch (error: Error) {
        notifyError(error.name, error.message);
      }
    } else notifyError('Audio Device', 'Has not recognized');
  }

  /**
     * On video device change event handler
     * @param {SyntheticEvent<EventTarget>} event
     * @return void
     */
  async onVideoChange(event: SyntheticEvent<EventTarget>): void {
    const { peer, video: videoElement } = this.props;
    const videoDeviceLabel = (event.target as HTMLInputElement).value;
    const audioDeviceLabel = (document.getElementById(this.audioSelectorId) as HTMLInputElement).value;
    const videoDevice = findUserDeviceByLabel(this.state.videoDevices, videoDeviceLabel);
    const audioDevice = findUserDeviceByLabel(this.state.audioDevices, audioDeviceLabel);
    if (videoDevice && audioDevice) {
      const audio = Object.assign({}, MediaConfig.audio, { deviceId: { exact: audioDevice.deviceId } });
      const video = Object.assign({}, MediaConfig.video, { deviceId: { exact: videoDevice.deviceId } });
      try {
        const stream = await switchCamera(
          {
            audio,
            video
          },
          peer,
          videoElement
        );
        this.setState({
          stream,
          videoDevices: filterUserDevicesByType(this.state.videoDevices, MediaDeviceTypeEnum.VIDEO)
        });
      } catch (error: Error) {
        notifyError(error.name, error.message);
      }
    } else notifyError('Video Device', 'Has not recognized');
  }

  render(): React.JSX.Element {
    const { videoDevices, audioDevices, stream } = this.state;
    return <div className="select-local-device">
            <div className="select-local-device-video">
                <label htmlFor={this.videoSelectorId}>
                    <BsCameraVideo />
                    <select id={this.videoSelectorId} className="focus:outline-none"
                            autoComplete="false"
                            value={ stream?.getVideoTracks()[0].label }
                            onChange={(event) => { this.onVideoChange(event); }}
                        >
                        {videoDevices?.map((option) =>
                            <option key={option?.deviceId}
                                    value={option?.label}>
                                {option.label}
                            </option>
                        )}
                    </select>
                </label>
            </div>
            <div className="select-local-device-audio">
                <label htmlFor={this.audioSelectorId}>
                    <BiSolidMicrophone />
                    <select id={this.audioSelectorId} className="focus:outline-none"
                            autoComplete="false"
                            value={ stream?.getAudioTracks()[0].label }
                            onChange={(event) => { this.onAudioChange(event); }}
                    >
                            {audioDevices?.map((option) =>
                                <option key={option?.deviceId}
                                    value={option?.label}>
                                    {option.label}
                                </option>
                            )}
                    </select>
                </label>
            </div>
          </div>;
  }
}

export default withTranslation(['Base', 'Exceptions'])(SelectRemoteCountry);
