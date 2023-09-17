// i.user-fingerprint.d.ts
import { type GetResult } from '@fingerprintjs/fingerprintjs';
import { type UniqueId } from '@types/base.type';

/**
 * @typedef IUserFingerprint
 * @module interfaces/user User fingerprint interface
 */
export interface IUserFingerprint extends GetResult {
  readonly requestId?: UniqueId;
}
