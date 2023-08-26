import { DeviceService } from '../services/device.service';
import { FingerprintService } from '../services/fingerprint.service';
import axios from 'axios';
import { type IUserDevice, type IUserFingerprint, type IUserResponse } from '../interfaces';

/**
 * Get incoming user info
 * @return Promise<UserResponseType>
 */
export function getUser(): Promise<IUserResponse> {
  const param: IUserFingerprint & IUserDevice | object = {};
  const fingerprintService = new FingerprintService();
  const deviceService = new DeviceService();
  const device = deviceService.getUserDevice();
  const fingerprint = fingerprintService.getUserFingerprint();
  return device
    .then(deviceData => Object.assign(param, deviceData))
    .then(() => fingerprint
      .then(fingerprintData => Object.assign(param, {
        requestId: fingerprintData.requestId,
        visitorId: fingerprintData.visitorId,
        score: fingerprintData.confidence.score
      }))
      .then(() => axios.post('/user', param))
      .then(response => ({
        status: response.status,
        data: response.data
      })));
}
