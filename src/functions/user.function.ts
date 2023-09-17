import axios from 'axios';
import VisitorAPI from 'visitorapi';
import hash from 'object-hash';
import { defaultScriptUrlPattern, load, type Region } from '@fingerprintjs/fingerprintjs-pro';
import { replace } from '@functions/string.function';
import { type IUserBrowser } from '@interfaces/user/i.user-browser';
import { type IUserFingerprint } from '@interfaces/user/i.user-fingerprint';
import { type IUserResponse } from '@interfaces/user/i.user-response';
import { type IUserRequest } from '@interfaces/user/i.user-request';
import { UserFingerprintException } from '@exceptions/user-fingerprint.exception';
import { UserBrowserException } from '@exceptions/user-browser.exception';
import { AppConfig } from '@configuration/app.config';
import { UserException } from '@exceptions/user.exception';

/**
 * Get user browser
 * @module functions
 * @return Promise<IUserBrowser>
 */
export const getUserBrowser = async (): Promise<IUserBrowser> => {
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
 * @module functions
 * @param {boolean} extendedResult
 * @param {string} linkedId
 * @return Promise<IUserFingerprint>
 */
export const getUserFingerprint = async (extendedResult: boolean = true, linkedId?: string): Promise<IUserFingerprint> => {
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
      debug: AppConfig.debug,
      products: ['identification', 'botd']
    }))
  } catch (e) {
    throw new UserFingerprintException('Cannot get user fingerprint', e)
  }
}

/**
 * Get user account info
 * @module functions
 * @param {IUserRequest} payload
 * @throws UserException
 * @return Promise<UserResponseType | null>
 */
export const getUserAccount = async (payload: IUserRequest): Promise<IUserResponse | null> => {
  try {
    return await axios.post(process.env.REACT_APP_HTTP_USER_PATH, payload);
  } catch (error: Error) {
    throw new UserException(error.name, error.message)
  }
}
