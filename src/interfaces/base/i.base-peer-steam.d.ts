// i.base-peer-stream.d.ts

/**
 * @typedef IBasePeerSteam
 * @module interfaces/base Peer stream
 * @prop {MediaStream | null} stream
 */
export interface IBasePeerSteam {
  readonly stream: MediaStream | null;
}
