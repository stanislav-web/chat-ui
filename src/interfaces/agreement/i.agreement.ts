/**
 * IAgreement interface
 */
export interface IAgreement {
  onAccept: () => void;
  onDecline: () => void;
}
