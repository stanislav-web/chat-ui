import React, { type BaseSyntheticEvent } from 'react';
import { getItem } from '../../Functions/localstorage.function';
import { AppConfig } from '../../Configuration/app.config';
import { changeLanguage } from 'i18next';
import { notifySuccess } from '../../Functions/notification.function';

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
    changeLanguage(lang).then(() => { notifySuccess('Language', 'Language has been changed', 3000); });
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
