import React, { type BaseSyntheticEvent } from 'react';
import './Language.css';
import { getItem } from '@functions/localstorage.function';
import { AppConfig } from '@configuration/app.config';
import { changeLanguage } from 'i18next';
import { notifySuccess } from '@functions/notification.function';
import { type ILanguageState } from '@interfaces/component/language/i.language-state';
import { type ILanguage } from '@interfaces/component/language/i.language';
import { Dropdown } from 'primereact/dropdown';
import { type JSX } from 'typedoc';
import { type LanguageType } from '@types/language.type';

/**
 * Language app class
 * @module components
 * @extends React.Component<any, Partial<ILanguageState>>
 * @implements ILanguage
 */
class Language extends React.Component<any, ILanguageState> implements ILanguage {
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
  onChange(event: BaseSyntheticEvent): void {
    const lang = event.target.value as string;
    this.setState(() => ({
      selectedLanguage: lang
    }));
    changeLanguage(lang).then(() => { notifySuccess('Language', 'Language has been changed', 3000); });
  };

  render(): React.JSX.Element {
    const { selectedLanguage, languages } = this.state;
    const options = [];
    for (const [key, value] of Object.entries(languages)) {
      options.push({ key, title: value.title });
    }
    const selectedLanguageTpl = (option: { key: LanguageType; title: string }, props: { placeholder: string }): JSX.Element => {
      if (option) {
        let flag: LanguageType | string;
        if (option.key === 'en_us') {
          flag = 'gb';
        } else {
          flag = option.key;
        }
        return (
            <div className="flex align-items-center">
              <img alt={option.title}
                   src="https://primefaces.org/cdn/primereact/images/flag/flag_placeholder.png"
                   className={`mr-2 flag flag-${flag.toLowerCase()}`} style={{ width: '18px' }} />
              <div>{option.title}</div>
            </div>
        );
      }
      return <span>{props.placeholder}</span>;
    };

    const languageListTpl = (option: { key: LanguageType; title: string }): JSX.Element => {
      let flag: LanguageType | string;
      if (option.key === 'en_us') {
        flag = 'gb';
      } else {
        flag = option.key;
      }
      return (
            <div className="flex align-items-center">
              <img alt={option.title}
                   src="https://primefaces.org/cdn/primereact/images/flag/flag_placeholder.png"
                   className={`mr-2 flag flag-${flag.toLowerCase()}`} style={{ width: '18px' }} />
              <div>{option.title}</div>
            </div>
      )
    }

    return (
        <div className="card flex justify-content-center">
        <Dropdown value={selectedLanguage}
                  onChange={(event) => { this.onChange(event); }}
                  options={options}
                  optionLabel="title"
                  optionValue="key"
                  valueTemplate={selectedLanguageTpl}
                  itemTemplate={languageListTpl}
                  className="w-full md:w-14rem" />
        </div>
    )
  }
}

export default Language;
