// i.language-state.d.ts

import { type BaseSyntheticEvent } from 'react';

/**
 * @typedef ILanguage Language.tsx class interface
 * @module interfaces/component/language
 */
export interface ILanguage {
  /**
   * Change language
   * @param {BaseSyntheticEvent} event
   */
  readonly onChange: (event: BaseSyntheticEvent) => void;
}
