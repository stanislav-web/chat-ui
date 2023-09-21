// i.login-props.d.ts

import { type i18n } from 'i18next';

/**
 * @typedef ILoginProps Login.tsx properties
 * @module interfaces/component/login
 * @extends i18n
 */
export interface ILoginProps extends Pick<i18n, 't'> {

}
