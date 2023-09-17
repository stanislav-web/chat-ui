import Swal from 'sweetalert2';

/**
 * Success notification
 * @module functions
 * @param {string} title
 * @param {any} message
 * @param {number} timer
 * @param {boolean} confirmation
 */
export const notifySuccess = (title: string, message: any, timer?: number, confirmation?: boolean): void => {
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
 * @module functions
 * @param {string} title
 * @param {string} message
 * @param {number} timer
 * @param {boolean} confirmation
 */
export const notifyError = (title: string, message: any, timer?: number, confirmation?: boolean): void => {
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
 * @module functions
 * @param {string} title
 * @param {string} message
 * @param {number} timer
 * @param {boolean} confirmation
 */
export const notifyInfo = (title: string, message: any, timer?: number, confirmation?: boolean): void => {
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
 * @module functions
 * @param {any} message
 * @private
 */
function escapeMessage(message: any): string {
  return typeof message !== 'string' ? JSON.stringify(message) : message;
}
