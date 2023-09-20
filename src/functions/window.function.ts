import { removeItem } from './localstorage.function';

/**
 * Redirect to page with reloading
 * @module functions
 * @param {string} [location]
 * @return void
 */
export const redirectPage = (location?: string): void => {
  if (location) window.location.href = location;
  window.location.reload();
}
/**
 * Prevent double tab opener
 * @module functions
 * @return void
 */
export const preventOpener = (): void => {
  localStorage.o = Date.now();
  window.addEventListener('storage', (e: StorageEvent) => {
    if (e.key === 'o') {
      localStorage.a = Date.now();
    }
    while (e.key === 'a') {
      alert('One more page already open')
    }
  }, false);
}

/**
 * Custom popup
 * @module functions
 * @param {string} url
 * @param {string} title
 * @param {number} w
 * @param {number} h
 * @return Window
 */
export const openPopUp = (url: string, title: string, w: number, h: number): Window => {
  const dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : window.screenX;
  const dualScreenTop = window.screenTop !== undefined ? window.screenTop : window.screenY;
  const width = window.innerWidth
    ? window.innerWidth
    : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
  const height = window.innerHeight
    ? window.innerHeight
    : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;
  const systemZoom = width / window.screen.availWidth;
  const left = (width - w) / 2 / systemZoom + dualScreenLeft
  const top = (height - h) / 2 / systemZoom + dualScreenTop
  const newWindow = window.open(url, title,
      `
      scrollbars=yes,
      width=${w / systemZoom}, 
      height=${h / systemZoom}, 
      top=${top}, 
      left=${left}
      `
  )
  if (window.focus) newWindow.focus();
  return newWindow
}

/**
 * Check tab authentication
 * @module functions
 * @return void
 */
export const checkAuth = (): void => {
  const handler = function(event: StorageEvent): void {
    if (event.key === 'auth' && event.newValue === null) {
      window.removeEventListener('storage', handler, false)
      window.location.reload();
    }
  }
  window.addEventListener('storage', handler, false);
  if (window.localStorage.getItem('auth') !== null) {
    removeItem('auth');
    window.close()
  }
}
