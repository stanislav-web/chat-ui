// i.video-control-local.d.ts

import type React from 'react';
import { type IBasePeerSteam } from '@interfaces/base/i.base-peer-steam';

/**
 * @typedef IVideoControlLocal VideoControlLocal.tsx
 * @module interfaces/component/video-control-local
 */
export interface IVideoControlLocal {

  /**
   * On Stream change (audio or media)
   * @param {IBasePeerSteam['stream']} stream
   */
  readonly onStreamChange: (stream: IBasePeerSteam['stream']) => void;

  /**
   * On call event handler
   * @param {React.MouseEvent<HTMLButtonElement> | React.MouseEvent<HTMLInputElement>} event
   * @return void
   */
  readonly onCall: (event: React.MouseEvent<HTMLButtonElement> | React.MouseEvent<HTMLInputElement>) => void;

  /**
   * On re-call event handler
   * @param {React.MouseEvent<HTMLButtonElement> | React.MouseEvent<HTMLInputElement>} event
   * @return void
   */
  readonly onReCall: (event: React.MouseEvent<HTMLButtonElement> | React.MouseEvent<HTMLInputElement>) => void;

  /**
   * On break event handler
   * @param {React.MouseEvent<HTMLButtonElement> | React.MouseEvent<HTMLInputElement>} event
   * @return void
   */
  readonly onBreak: (event: React.MouseEvent<HTMLButtonElement> | React.MouseEvent<HTMLInputElement>) => void;
}
