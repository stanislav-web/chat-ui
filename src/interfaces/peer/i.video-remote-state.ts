import { type IBasePeerElement } from '@interfaces/base/i.base-peer-element';
import { type IBasePeerConnect } from '@interfaces/base/i.base-peer-connect';
import { type IBasePeerTransport } from '@interfaces/base/i.base-peer-transport';
import { type IBasePeerSteam } from '@interfaces/base/i.base-peer-steam';

/**
 * IVideoRemoteState interface
 */
export interface IVideoRemoteState extends IBasePeerTransport, IBasePeerConnect, IBasePeerSteam, IBasePeerElement {
}
