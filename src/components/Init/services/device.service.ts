import { type UserDeviceInterface } from '../interfaces/user-device.interface';
import hash from 'object-hash';
import VisitorAPI from 'visitorapi';

export class DeviceService {
  /**
   * Get user device
   * @return Promise<UserDeviceInterface>
   */
  async getUserDevice(): Promise<UserDeviceInterface> {
    const deviceInfo = await VisitorAPI(process.env.REACT_APP_VISITOR_API_KEY as string);
    const deviceId = hash.MD5(deviceInfo);
    return {
      deviceId,
      ...deviceInfo
    };
  }
}
