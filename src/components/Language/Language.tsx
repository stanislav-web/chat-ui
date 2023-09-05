import React, { type BaseSyntheticEvent } from 'react';
import { getItem } from '@functions/localstorage.function';
import { AppConfig } from '@configuration/app.config';
import { changeLanguage } from 'i18next';
import { notifySuccess } from '@functions/notification.function';
import { type ILanguageState } from '@interfaces/language/i.language-state';

class Language extends React.Component<any, Partial<ILanguageState>> {
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
    const lang = event.target.value as string;
    this.setState(() => ({
      selectedLanguage: lang
    }));
    changeLanguage(lang).then(() => { notifySuccess('Language', 'Language has been changed', 3000); });
  };

  render(): React.JSX.Element {
    const selectedLanguage = this.state.selectedLanguage as string;
    return (
            <div className="language-switcher">
                <select onChange={(event) => { this.onChange(event) }} value={selectedLanguage}>
                    {Object.keys(this.state.languages).map((locale) =>
                        <option key={locale} value={locale}>{this.state.languages?.[locale].title}</option>
                    )}
                </select>
            </div>
    )
  }
}

export default Language;
