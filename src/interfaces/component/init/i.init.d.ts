// i.init.d.ts

/**
 * @typedef IInit Init.tsx class interface
 * @module interfaces/component/init
 */
export interface IInit {
  /**
   * On Rules change
   * @param {boolean} state
   * @return void
   */
  readonly onAgreementChange: (state: boolean) => void;
}
