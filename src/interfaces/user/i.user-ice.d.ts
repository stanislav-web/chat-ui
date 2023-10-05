// i.user-ice.d.ts

import { type UniqueId } from '@types/base.type';
import { type WebrtcStunServerType, type WebrtcTurnServerType } from '@types/webrtc.type';

/**
 * @typedef IUserIce
 * @module interfaces/user User ice servers
 * @property {WebrtcStunServerType | WebrtcTurnServerType | string} urls
 * @property {UniqueId} [username]
 * @property {UniqueId} [credential]
 */
export interface IUserIce {
  readonly urls: WebrtcStunServerType | WebrtcTurnServerType | string;
  readonly username?: UniqueId;
  readonly credential?: UniqueId;
}
