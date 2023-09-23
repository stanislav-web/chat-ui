// i.agreement.d.ts

/**
 * @typedef IAgreement Agreement.tsx class interface
 * @module interfaces/component/agreement
 */
export interface IAgreement {
  /**
   * On accept agreement
   * @return void
   */
  readonly onAccept: () => void;

  /**
   * On decline agreement
   * @return void
   */
  readonly onDecline: () => void;
}
