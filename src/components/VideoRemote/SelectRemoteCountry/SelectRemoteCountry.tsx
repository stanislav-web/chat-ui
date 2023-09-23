import React from 'react';
import './SelectRemoteCountry.css';
import { withTranslation } from 'react-i18next';
import { type ISelectRemoteCountry } from '@interfaces/component/select-reomote-country/i.select-remote-country';
import { type ISelectRemoteCountryProp } from '@interfaces/component/select-reomote-country/i.select-remote-country-prop';
import { type ISelectRemoteCountryState } from '@interfaces/component/select-reomote-country/i.select-remote-country-state';
import { countries } from '@utils/countries';
import { MultiSelect } from 'primereact/multiselect';
import { type LanguageType } from '@types/language.type';
import { getItem } from '@functions/localstorage.function';

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
      selected: getItem('selected') === null ? undefined : getItem('selected'),
      countries
    }
  }

  /**
   * On countries change event handler
   * @param {countries: Array<CountryListItem['code']> | []} countries
   * @return void
   */
  onCountriesChange(countries: Array<CountryListItem['code']> | []): void {
    this.setState({
      selected: countries
    }, () => {
      this.props.onCountriesChange(countries);
    })
  }

  render(): React.JSX.Element {
    const { countries, selected } = this.state;

    const countryListTpl = (option: { code: string; name: string }): React.JSX.Element => {
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

    return <div className="video-remote-country card flex justify-content-center">
            <MultiSelect
                filter
                showClear
                value={selected}
                onChange={(event) => { this.onCountriesChange(event.value); }}
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
