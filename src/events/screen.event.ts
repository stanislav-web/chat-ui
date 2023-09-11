/* eslint-disable no-mixed-operators */
import { AppConfig } from '@configuration/app.config';
import { notifyInfo } from '@functions/notification.function';
import { ctrlShiftKey, stopDefaultBehavior } from '@functions/keyboard.function';

if (!AppConfig.isCommandAllowed) {
  window.addEventListener('keyup', (event: KeyboardEvent) => {
    if (event.key === 'PrintScreen') {
      notifyInfo('Warning', 'This section is not allowed execute this command');
      stopDefaultBehavior(event);
    }
  });

  window.addEventListener('keydown', (event: KeyboardEvent) => {
    if (event.ctrlKey) {
      notifyInfo('Warning', 'This section is not allowed execute this command');
      stopDefaultBehavior(event);
    }
    if (event.key === 'Meta') {
      notifyInfo('Warning', 'This section is not allowed execute this command');
      stopDefaultBehavior(event);
    }
  });
  document.addEventListener('contextmenu', (event: MouseEvent) => { event.preventDefault(); });
  document.addEventListener('onkeydown', (event: KeyboardEvent) => {
    if (
      event.code === '123' ||
        (ctrlShiftKey(event, 'I') ||
        ctrlShiftKey(event, 'J') ||
        ctrlShiftKey(event, 'C')) ||
      event.ctrlKey && Number(event.code) === 'U'.charCodeAt(0)
    ) { return false; }
  });
}
