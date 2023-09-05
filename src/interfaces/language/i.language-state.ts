/**
 * LanguageState interface
 */
export interface ILanguageState {
  selectedLanguage: string | null;
  readonly languages: {
    en_us: { title: string };
    ua: { title: string };
    ru: { title: string };
  };
}
