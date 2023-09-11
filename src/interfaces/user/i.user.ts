import { type UniqueId } from '@types/user.type';

/**
 * User interface
 */
export interface IUser {
  readonly id: UniqueId;
  readonly photoUrl?: string;
  readonly ban?: any;
}
