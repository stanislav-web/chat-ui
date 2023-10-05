// i.peer.d.ts

import { type IBasePeerSteam } from '@interfaces/base/i.base-peer-steam';

/**
 * @typedef IPeer Peer.tsx
 * @module interfaces/component/peer
 */
export interface IPeer {

  /**
   * On Device stream change (audio or media)
   * @param {IBasePeerSteam['stream']} stream
   * @return void
   */
  readonly onStreamChange: (stream: IBasePeerSteam['stream']) => void;

  /**
   * On Countries change
   * @param {Array<CountryListItem['code']> | []} countries
   * @return void
   */
  readonly onCountriesChange: (countries: Array<CountryListItem['code']> | []) => void;

  /**
   * On call event handler
   * @return void
   */
  readonly onCall: () => void;

  /**
   * On break event handler
   * @return void
   */
  readonly onBreak: () => void;

  /**
   * On re-call event handler
   * @return void
   */
  readonly onReCall: () => void;

  /**
   * Stop connection from local side
   * @return void
   */
  readonly stopConnections: () => void;

  /**
   * Close connection from local side
   * @return void
   */
  readonly closeConnections: () => void;
}
