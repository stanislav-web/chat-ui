/**
 * Prevent double tab opener
 */
export function preventOpener(): void {
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
