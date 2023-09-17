import { type IBasePeerConnect } from '@interfaces/base/i.base-peer-connect';
import { type IBasePeerSteam } from '@interfaces/base/i.base-peer-steam';
import { type IBasePeerTransport } from '@interfaces/base/i.base-peer-transport';
import { type IBasePeerElement } from '@interfaces/base/i.base-peer-element';
/**
 * IVideoControlRemoteProp interface
 */
export interface IVideoControlRemoteProp extends IBasePeerConnect, IBasePeerSteam, IBasePeerTransport, IBasePeerElement {
}
