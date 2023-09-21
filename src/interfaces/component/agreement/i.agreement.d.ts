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
  onAccept: () => void;

  /**
   * On decline agreement
   * @return void
   */
  onDecline: () => void;
}
