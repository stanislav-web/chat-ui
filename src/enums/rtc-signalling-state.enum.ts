/**
 * RTC signals states
 * @module enums
 * @enum {string}
 */
export enum RtcSignallingStateEnum {
  HAVE_LOCAL_OFFER = 'have-local-offer',
  HAVE_LOCAL_ANSWER = 'have-local-pranswer',
  HAVE_REMOTE_OFFER = 'have-remote-offer',
  HAVE_REMOTE_ANSWER = 'have-remote-pranswer',
  STABLE = 'stable',
  CLOSED = 'closed',
}
