import axios from 'axios';
import { type IUserBrowser, type IUserFingerprint, type IUserResponse } from '../interfaces';
import { type IUserAccountParams } from '../interfaces/i.user-account-params';
import VisitorAPI from 'visitorapi';
import hash from 'object-hash';
import { defaultScriptUrlPattern, load, type Region } from '@fingerprintjs/fingerprintjs-pro';
import { replace } from '../../../utils/string.util';

/**
 * Get user browser
 * @return Promise<IUserBrowser>
 */
export async function getUserBrowser(): Promise<IUserBrowser> {
  const browserInfo = await VisitorAPI(process.env.REACT_APP_VISITOR_API_KEY as string);
  const browserId = hash.MD5(browserInfo);
  return {
    deviceId: browserId,
    ...browserInfo
  };
}

/**
 * Get user fingerprint
 * @param {boolean} extendedResult
 * @param {string} linkedId
 * @return Promise<IUserFingerprint>
 */
export async function getUserFingerprint(extendedResult: boolean = true, linkedId?: string): Promise<IUserFingerprint> {
  const options = {
    apiKey: process.env.REACT_APP_FINGERPRINT_JS_PUBLIC_KEY as string,
    region: process.env.REACT_APP_FINGERPRINT_JS_REGION as Region,
    scriptUrlPattern: [process.env.REACT_APP_FINGERPRINT_JS_SCRIPT_URL_PATTERN, defaultScriptUrlPattern] as string[],
    endpoint: replace(process.env.REACT_APP_FINGERPRINT_JS_ENDPOINT as string, {
      region: process.env.REACT_APP_FINGERPRINT_JS_REGION as string
    })
  }
  return await load(options).then(fp => fp.get({
    extendedResult,
    linkedId,
    debug: process.env.REACT_APP_DEBUG === 'true',
    products: ['identification', 'botd']
  }))
}

/**
 * Get user account info
 * @param {IUserAccountParams} payload
 * @return Promise<UserResponseType>
 */
export function getUserAccount(payload: IUserAccountParams): Promise<IUserResponse> {
  return axios.post('/user', payload)
    .then(response => ({
      status: response.status,
      data: response.data
    }));
}
