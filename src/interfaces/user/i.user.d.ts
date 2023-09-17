// i.user.d.ts
import { type UniqueId } from '@types/base.type';

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
}
