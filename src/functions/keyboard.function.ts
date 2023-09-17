/**
 * Stop default page behavior
 * @module functions
 * @param {KeyboardEvent} event
 * @return void
 */
export const stopDefaultBehavior = (event: KeyboardEvent): void => {
  event.stopPropagation();
  event.preventDefault();
  event.stopImmediatePropagation();
}

/**
 * CTRL+SHIFT+KEY
 * @module functions
 * @param {KeyboardEvent} event
 * @param {string} keyCode
 * @return boolean
 */
export const ctrlShiftKey = (event: KeyboardEvent, keyCode: string): boolean =>
  event.ctrlKey && event.shiftKey && event.code === keyCode.charCodeAt(0)
