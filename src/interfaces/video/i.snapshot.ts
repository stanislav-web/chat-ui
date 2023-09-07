/**
 * ISnapshot interface
 */
export interface ISnapshot {
  stream: MediaStream | null;
  type: 'image/png' | 'image/jpeg' | 'image/webp';
  quality: number;
  sourceId: string;
  width: number;
  height: number;
}
