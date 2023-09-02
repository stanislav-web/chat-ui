import { type IUser } from './i.user';

/**
 * IUserLoad interface
 */
export interface IUserLoad {
  devices: MediaDeviceInfo[] | null;
  user: IUser | null;
}
