import Swal from 'sweetalert2';

/**
 * Success notification
 * @param {string} title
 * @param {any} message
 * @param {number} timer
 * @param {boolean} confirmation
 */
export function notifySuccess(title: string, message: any, timer?: number, confirmation?: boolean): void {
  Swal.fire({
    icon: 'success',
    title,
    text: escapeMessage(message),
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
export function notifyError(title: string, message: any, timer?: number, confirmation?: boolean): void {
  Swal.fire({
    icon: 'error',
    title,
    text: escapeMessage(message),
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
export function notifyInfo(title: string, message: any, timer?: number, confirmation?: boolean): void {
  Swal.fire({
    icon: 'info',
    title,
    text: escapeMessage(message),
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
function escapeMessage(message: any): string {
  return typeof message !== 'string' ? JSON.stringify(message) : message;
}
