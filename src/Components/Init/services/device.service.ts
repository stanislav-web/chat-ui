import hash from 'object-hash';
import VisitorAPI from 'visitorapi';
import { type IUserDevice } from '../interfaces';

export class DeviceService {
  /**
   * Get user device
   * @return Promise<IUserDevice>
   */
  async getUserDevice(): Promise<IUserDevice> {
    const deviceInfo = await VisitorAPI(process.env.REACT_APP_VISITOR_API_KEY as string);
    const deviceId = hash.MD5(deviceInfo);
    return {
      deviceId,
      ...deviceInfo
    };
  }
}
