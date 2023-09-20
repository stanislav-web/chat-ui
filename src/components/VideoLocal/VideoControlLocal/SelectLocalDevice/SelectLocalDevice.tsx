import React from 'react';
import './SelectLocalDevice.css';
import { type ISelectLocalDeviceProp } from '@interfaces/component/select-local-device/i.select-local-device-prop';
import {
  filterUserDevicesByType,
  findUserDeviceByLabel,
  getUserDevices,
  switchCamera,
  switchMicrophone
} from '@functions/media.function';
import { notifyError } from '@functions/notification.function';
import { type ISelectLocalDevice } from '@interfaces/component/select-local-device/i.select-local-device';
import { MediaDeviceTypeEnum } from '@enums/media-device-type.enum';
import { type ISelectLocalDeviceState } from '@interfaces/component/select-local-device/i.select-local-device-state';
import { withTranslation } from 'react-i18next';
import { MediaConfig } from '@configuration/media.config';
import { Dropdown, type DropdownChangeEvent } from 'primereact/dropdown';
import { type UniqueId } from '@types/base.type';

/**
 * SelectLocalDevice app class
 * @module components
 * @extends React.Component<ISelectLocalDeviceProp, ISelectLocalDeviceState>
 * @implements ISelectLocalDevice
 */
class SelectLocalDevice extends React.Component<ISelectLocalDeviceProp, ISelectLocalDeviceState> implements ISelectLocalDevice {
  /**
     * @type UniqueId videoSelectorId
     * @private
     */
  private readonly videoSelectorId: UniqueId = MediaConfig.control.videoSelectorId;

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
     * @param {DropdownChangeEvent} value
     * @return void
     */
  async onAudioChange(value: DropdownChangeEvent): void {
    const { peer } = this.props;
    const audioDeviceLabel = value;
    const videoDeviceLabel = (document.querySelector(
      '[itemid="' + this.videoSelectorId + '"] > span[data-pc-section="input"]') as HTMLInputElement
    ).textContent;
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
     * @param {DropdownChangeEvent} value
     * @return void
     */
  async onVideoChange(value: DropdownChangeEvent): void {
    const { peer, video: videoElement } = this.props;
    const { stream: currentStream } = this.state;
    const videoDeviceLabel = value;
    const audioDeviceLabel = (document.querySelector(
      '[itemid="' + this.audioSelectorId + '"] > span[data-pc-section="input"]') as HTMLInputElement
    ).textContent;
    const videoDevice = findUserDeviceByLabel(this.state.videoDevices, videoDeviceLabel);
    const audioDevice = findUserDeviceByLabel(this.state.audioDevices, audioDeviceLabel);
    if (videoDevice && audioDevice) {
      const audio = Object.assign({}, MediaConfig.audio, { deviceId: { exact: audioDevice.deviceId } });
      const video = Object.assign({}, MediaConfig.video, { deviceId: { exact: videoDevice.deviceId } });
      try {
        currentStream?.getTracks().forEach(track => {
          track.stop();
        });
        const stream = await switchCamera(
          {
            audio,
            video
          },
          videoElement,
          peer
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
    const videoTracks = stream?.getVideoTracks();
    const audioTracks = stream?.getAudioTracks();
    return (
        <div className="select-local-device">
            {videoDevices.length > 0 && videoTracks.length > 0
              ? <div className="select-local-device-video">
                        <i className="pi pi-camera" style={{ fontSize: '1rem' }}>.</i>
                        <Dropdown value={videoTracks[0].label}
                            itemID={this.videoSelectorId}
                            onChange={(event) => { this.onVideoChange(event.value); }}
                            options={videoDevices.map(videoDevice => ({
                              deviceId: videoDevice.deviceId,
                              label: videoDevice.label
                            }))}
                            optionLabel="label"
                            optionValue="label"
                            className="w-full md:w-14rem" />
                    </div>
              : <></>
            }
            {stream && audioDevices.length > 0
              ? <div className="select-local-device-audio">
                    <i className="pi pi-microphone" style={{ fontSize: '1rem' }}>.</i>
                    <Dropdown value={audioTracks[0].label}
                              itemID={this.audioSelectorId}
                              onChange={(event) => { this.onAudioChange(event.value); }}
                              options={audioDevices.map(audioDevice => ({
                                deviceId: audioDevice.deviceId,
                                label: audioDevice.label
                              }))}
                              optionLabel="label"
                              optionValue="label"
                              className="w-full md:w-14rem" />
                </div>
              : <></>
            }
        </div>
    );
  }
}

export default withTranslation(['Base', 'Exceptions'])(SelectLocalDevice);
