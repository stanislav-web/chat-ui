// i.user-ice.d.ts

import { type UniqueId } from '@types/base.type';
import { type WebrtcStunServerType, type WebrtcTurnServerType } from '@types/webrtc.type';

/**
 * @typedef IUserIce
 * @module interfaces/user User ice servers
 * @prop {WebrtcStunServerType | WebrtcTurnServerType | string} urls
 * @prop {UniqueId} [username]
 * @prop {UniqueId} [credential]
 */
export interface IUserIce {
  readonly urls: WebrtcStunServerType | WebrtcTurnServerType | string;
  readonly username?: UniqueId;
  readonly credential?: UniqueId;
}
