import { defaultScriptUrlPattern, load, type Region } from '@fingerprintjs/fingerprintjs-pro';
import { replace } from '../../../utils/string.util';
import { type IUserFingerprint } from '../interfaces';

export class FingerprintService {
  private readonly fpLoadOptions = {
    apiKey: process.env.REACT_APP_FINGERPRINT_JS_PUBLIC_KEY as string,
    region: process.env.REACT_APP_FINGERPRINT_JS_REGION as Region,
    scriptUrlPattern: [process.env.REACT_APP_FINGERPRINT_JS_SCRIPT_URL_PATTERN, defaultScriptUrlPattern] as string[],
    endpoint: replace(process.env.REACT_APP_FINGERPRINT_JS_ENDPOINT as string, {
      region: process.env.REACT_APP_FINGERPRINT_JS_REGION as string
    })
  };

  /**
   * Get user fingerprint
   * @param {boolean} extendedResult
   * @param {string} linkedId
   * @return Promise<IUserFingerprint>
   */
  async getUserFingerprint(extendedResult: boolean = true, linkedId?: string): Promise<IUserFingerprint> {
    return await load(this.fpLoadOptions).then(fp => fp.get({
      extendedResult,
      linkedId,
      debug: process.env.REACT_APP_DEBUG === 'true',
      products: ['identification', 'botd']
    }))
  }
}
