/**
 * Stop default page behavior
 * @param {KeyboardEvent} event
 */
export function stopDefaultBehavior (event: KeyboardEvent): void {
  event.stopPropagation();
  event.preventDefault();
  event.stopImmediatePropagation();
}
/**
 * CTRL+SHIFT+KEY
 * @param {KeyboardEvent} event
 * @param {string} keyCode
 */
export function ctrlShiftKey (event: KeyboardEvent, keyCode: string): boolean {
  return event.ctrlKey && event.shiftKey && event.code === keyCode.charCodeAt(0)
}
