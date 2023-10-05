// i.base-peer-stream.d.ts

/**
 * @typedef IBasePeerSteam
 * @module interfaces/base Peer stream
 * @property {MediaStream | null} stream
 */
export interface IBasePeerSteam {
  readonly stream: MediaStream | null;
}
