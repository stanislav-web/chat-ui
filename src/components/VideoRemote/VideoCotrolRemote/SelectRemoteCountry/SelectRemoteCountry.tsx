import React from 'react';
import './SelectRemoteCountry.css';
import { withTranslation } from 'react-i18next';
import { type ISelectRemoteCountry } from '@interfaces/component/select-reomote-country/i.select-remote-country';
import { type ISelectRemoteCountryProp } from '@interfaces/component/select-reomote-country/i.select-remote-country-prop';
import { type ISelectRemoteCountryState } from '@interfaces/component/select-reomote-country/i.select-remote-country-state';
import { countries } from '@utils/countries';
import { MultiSelect, type MultiSelectChangeEvent } from 'primereact/multiselect';
import { type LanguageType } from '@types/language.type';
import { type JSX } from 'typedoc';

/**
 * SelectRemoteCountry app class
 * @module components
 * @extends React.Component<ISelectRemoteCountryProp, ISelectRemoteCountryState>
 * @implements ISelectRemoteCountry
 */
class SelectRemoteCountry extends React.Component<ISelectRemoteCountryProp, ISelectRemoteCountryState> implements ISelectRemoteCountry {
  /**
     * Constructor
     * @param {ISelectRemoteCountryProp} props
     */
  constructor(props: ISelectRemoteCountryProp) {
    super(props);
    this.state = {
      stream: null,
      countries
    }
  }

  async componentDidMount(): void {
    // const { stream } = this.props;
    // if (stream !== null) {
    //   const devices = await getUserDevices();
    //   this.setState({
    //     stream,
    //     audioDevices: filterUserDevicesByType(devices, MediaDeviceTypeEnum.AUDIO_INPUT),
    //     videoDevices: filterUserDevicesByType(devices, MediaDeviceTypeEnum.VIDEO)
    //   });
    // }
  };

  /**
     * On audio device change event handler
     * @param {MultiSelectChangeEvent} event
     * @return void
     */
  onCountryChange(event: MultiSelectChangeEvent): void {
    const { video } = this.props;
    console.log({ video, event });
    this.setState({
      selected: event
    })
    // const audioDevice = findUserDeviceByLabel(this.state.audioDevices, audioDeviceLabel);
    // const videoDevice = findUserDeviceByLabel(this.state.videoDevices, videoDeviceLabel);
    // if (audioDevice && videoDevice) {
    //   const audio = Object.assign({}, MediaConfig.audio, { deviceId: { exact: audioDevice.deviceId } });
    //   const video = Object.assign({}, MediaConfig.video, { deviceId: { exact: videoDevice.deviceId } });
    //   try {
    //     const stream = await switchMicrophone(
    //       {
    //         audio,
    //         video
    //       },
    //       peer
    //     );
    //     this.setState({
    //       stream,
    //       audioDevices: filterUserDevicesByType(this.state.audioDevices, MediaDeviceTypeEnum.AUDIO_INPUT)
    //     });
    //   } catch (error: Error) {
    //     notifyError(error.name, error.message);
    //   }
    // } else notifyError('Audio Device', 'Has not recognized');
  }

  render(): React.JSX.Element {
    const { countries, selected } = this.state;

    const countryListTpl = (option: { code: string; name: string }): JSX.Element => {
      let flag: LanguageType | string;
      if (option.code === 'en_us') {
        flag = 'gb';
      } else {
        flag = option.code;
      }
      return (
          <div className="flex align-items-center">
            <img alt={option.name}
                 src="https://primefaces.org/cdn/primereact/images/flag/flag_placeholder.png"
                 className={`mr-2 flag flag-${flag.toLowerCase()}`} style={{ width: '18px' }} />
            <div>{option.name}</div>
          </div>
      )
    }

    return <div className="select-remote-country card flex justify-content-center">
            <MultiSelect
                filter
                showClear
                value={selected}
                onChange={(event) => { this.onCountryChange(event.value); }}
                options={countries}
                itemTemplate={countryListTpl}
                optionLabel="name"
                optionValue="code"
                display="chip"
                placeholder="Select Countries"
                maxSelectedLabels={3}
                className="w-full md:w-30rem" />
          </div>;
  }
}

export default withTranslation(['Base', 'Exceptions'])(SelectRemoteCountry);
