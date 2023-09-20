// i.language-state.d.ts
import { type EnglishLanguageType, type LanguageType, type RussianLanguageType, type UkrainianLanguageType } from '@types/language.type';

/**
 * @typedef ILanguageState Language.tsx class interface
 * @module interfaces/component/language
 * @prop {LanguageType | null} selectedLanguage
 * @prop {Record<EnglishLanguageType | UkrainianLanguageType | RussianLanguageType, { title: string; }>} languages
 */
export interface ILanguageState {
  selectedLanguage: LanguageType | null;
  readonly languages: Record<EnglishLanguageType | UkrainianLanguageType | RussianLanguageType, {
    title: string;
  }>;
}
