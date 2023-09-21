// i.agreement-props.d.ts

import { type i18n } from 'i18next';

/**
 * @typedef IAgreementProps Agreement.tsx properties
 * @module interfaces/component/agreement
 * @extends i18n
 */
export interface IAgreementProps extends Pick<i18n, 't'> {

  /**
     * On Agreement change
     * @param {boolean} state
     * @return boolean
     */
  onAgreementChange: (state: boolean) => boolean;
}
