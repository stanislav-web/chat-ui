import React, { type BaseSyntheticEvent } from 'react';
import { getItem } from '../../Functions/localstorage.function';
import { AppConfig } from '../../Configuration/app.config';
import i18n from 'i18next';

class Language extends React.Component<any, any> {
  /**
     * Constructor
     * @param {any} props
     */
  constructor(props: any) {
    super(props);
    this.state = {
      selectedLanguage: getItem(AppConfig.languageProperty) ?? null,
      languages: {
        en_us: { title: 'English' },
        ua: { title: 'Український' },
        ru: { title: 'Русский' }
      }
    };
  }

  /**
     * Change language
     * @param {BaseSyntheticEvent} event
     */
  onChange = (event: BaseSyntheticEvent): void => {
    const lang = event.target.value;
    this.setState(() => ({
      selectedLanguage: lang
    }));
    // eslint-disable-next-line import/no-named-as-default-member
    i18n.changeLanguage(lang).then();
  };

  render(): React.JSX.Element {
    return (
            <div className="language-switcher">
                <select onChange={(event) => { this.onChange(event) }} value={this.state.selectedLanguage}>
                    {Object.keys(this.state.languages).map((locale) =>
                        <option key={locale} value={locale}>{this.state.languages[locale].title}</option>
                    )}
                </select>
            </div>
    )
  }
}

export default Language;
