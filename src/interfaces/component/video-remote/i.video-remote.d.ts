// i.video-remote.d.ts

/**
 * @typedef VideoRemote VideoRemote.tsx
 * @module interfaces/component/video-remote
 */
export interface IVideoRemote {

  /**
   * Remote Peer listener
   * @return void
   */
  readonly remotePeerListener: () => void;

  /**
   * On Countries change
   * @param {Array<CountryListItem['code']> | []} countries
   */
  readonly onCountriesChange: (countries: Array<CountryListItem['code']> | []) => void;
}
