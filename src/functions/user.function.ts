import axios from 'axios';
import VisitorAPI from 'visitorapi';
import hash from 'object-hash';
import { defaultScriptUrlPattern, load, type Region } from '@fingerprintjs/fingerprintjs-pro';
import { replace } from '@utils/string.util';
import { type IUserBrowser } from '@interfaces/user/i.user-browser';
import { type IUserFingerprint } from '@interfaces/user/i.user-fingerprint';
import { type IUserResponse } from '@interfaces/user/i.user-response';
import { type IUserAccountParams } from '@interfaces/user/i.user-account-params';
import { UserFingerprintException } from '@exceptions/user-fingerprint.exception';
import { UserBrowserException } from '@exceptions/user-browser.exception';

/**
 * Get user browser
 * @return Promise<IUserBrowser>
 */
export async function getUserBrowser(): Promise<IUserBrowser> {
  try {
    const browserInfo = await VisitorAPI(process.env.REACT_APP_VISITOR_API_KEY as string) as IUserBrowser;
    const browserId = hash.MD5(browserInfo);
    return {
      deviceId: browserId,
      ...browserInfo
    };
  } catch (e) {
    throw new UserBrowserException('Cannot get user browser info', e);
  }
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
  try {
    return await load(options).then(fp => fp.get({
      extendedResult,
      linkedId,
      debug: process.env.REACT_APP_DEBUG === 'true',
      products: ['identification', 'botd']
    }))
  } catch (e) {
    throw new UserFingerprintException('Cannot get user fingerprint', e)
  }
}

/**
 * Get user account info
 * @param {IUserAccountParams} payload
 * @return Promise<UserResponseType | null>
 */
export async function getUserAccount(payload: IUserAccountParams): Promise<IUserResponse | null> {
  try {
    return await axios.post('/user', payload);
  } catch (e) {
    console.log({ e })
    return null;
  }
}
