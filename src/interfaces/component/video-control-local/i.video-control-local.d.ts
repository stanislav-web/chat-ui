// i.video-control-local.d.ts

import type React from 'react';

/**
 * @typedef IVideoControlLocal VideoControlLocal.tsx
 * @module interfaces/component/video-control-local
 */
export interface IVideoControlLocal {

  /**
   * On call event handler
   * @param {React.MouseEvent<HTMLButtonElement> | React.MouseEvent<HTMLInputElement>} event
   * @return void
   */
  onCall: (event: React.MouseEvent<HTMLButtonElement> | React.MouseEvent<HTMLInputElement>) => void;

  /**
   * On re-call event handler
   * @param {React.MouseEvent<HTMLButtonElement> | React.MouseEvent<HTMLInputElement>} event
   * @return void
   */
  onReCall: (event: React.MouseEvent<HTMLButtonElement> | React.MouseEvent<HTMLInputElement>) => void;

  /**
   * On break event handler
   * @param {React.MouseEvent<HTMLButtonElement> | React.MouseEvent<HTMLInputElement>} event
   * @return void
   */
  onBreak: (event: React.MouseEvent<HTMLButtonElement> | React.MouseEvent<HTMLInputElement>) => void;
}
