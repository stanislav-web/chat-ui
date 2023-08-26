import Swal from 'sweetalert2';

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class NotificationService {
  /**
     * Success notification
     * @param {string} title
     * @param {any} message
     * @param {number} timer
     * @param {boolean} confirmation
     */
  public static notifySuccess(title: string, message: any, timer?: number, confirmation?: boolean): void {
    Swal.fire({
      icon: 'success',
      title,
      text: NotificationService.escapeMessage(message),
      showConfirmButton: confirmation,
      timer,
      allowOutsideClick: true,
      backdrop: true,
      allowEscapeKey: true
    }).then()
  }

  /**
     * Error notification
     * @param {string} title
     * @param {string} message
     * @param {number} timer
     * @param {boolean} confirmation
     */
  public static notifyError(title: string, message: any, timer?: number, confirmation?: boolean): void {
    Swal.fire({
      icon: 'error',
      title,
      text: NotificationService.escapeMessage(message),
      showConfirmButton: confirmation,
      timer,
      allowOutsideClick: true,
      backdrop: true,
      allowEscapeKey: true
    }).then()
  }

  /**
     * Error notification
     * @param {string} title
     * @param {string} message
     * @param {number} timer
     * @param {boolean} confirmation
     */
  public static notifyInfo(title: string, message: any, timer?: number, confirmation?: boolean): void {
    Swal.fire({
      icon: 'info',
      title,
      text: NotificationService.escapeMessage(message),
      showConfirmButton: confirmation,
      timer,
      allowOutsideClick: true,
      backdrop: true,
      allowEscapeKey: true
    }).then()
  }

  /**
     * Escape message
     * @param {any} message
     * @private
     */
  private static escapeMessage(message: any): string {
    return typeof message !== 'string' ? JSON.stringify(message) : message;
  }
}
