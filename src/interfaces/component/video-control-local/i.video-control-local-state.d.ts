// i.video-control-local-state.d.ts

/**
 * @typedef IVideoControlLocalState VideoControlLocal.tsx state
 * @module interfaces/component/video-control-local
 * @prop {HTMLButtonElement} callBtn
 * @prop {HTMLButtonElement} recallBtn
 * @prop {HTMLButtonElement} breakBtn
 */
export interface IVideoControlLocalState {
  readonly callBtn: HTMLButtonElement;
  readonly recallBtn: HTMLButtonElement;
  readonly breakBtn: HTMLButtonElement;
}
