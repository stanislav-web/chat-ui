// i.user.d.ts
import { type UniqueId } from '@types/base.type';
import { type IUserIce } from '@interfaces/user/i.user-ice';

/**
 * @typedef IUser
 * @module interfaces/user User interface
 * @prop {UniqueId} id
 * @prop {string} [photoUrl]
 * @prop {any} [ban]
 */
export interface IUser {
  readonly id: UniqueId;
  readonly photoUrl?: string;
  readonly ban?: any;
  readonly ice?: IUserIce[];
}
