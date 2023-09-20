// i.language-state.d.ts

import { type BaseSyntheticEvent } from 'react';

/**
 * @typedef ILanguage Language.tsx class interface
 * @module interfaces/component/language
 * @prop {LanguageType | null} selectedLanguage
 * @prop {{
 *     en_us: { title: string };
 *     ua: { title: string };
 *     ru: { title: string };
 *   }} languages
 */
export interface ILanguage {
  /**
   * Change language
   * @param {BaseSyntheticEvent} event
   */
  onChange: (event: BaseSyntheticEvent) => void;
}
