/**
 * Get canvas rendering noise
 * @param {string} selector
 * @param {number} width
 * @param {number} height
 */
export function getCanvasRenderingContext(selector: string, width: number, height: number): CanvasRenderingContext2D {
  const canvas: HTMLCanvasElement = document.querySelector(selector);
  if (canvas) {
    const ctx = canvas.getContext('2d');
    resizeCanvasElement(canvas, width, height);
    window.onresize = (event) => resizeCanvasElement;
    return ctx;
  }
}

/**
 * Make noise
 * @param {CanvasRenderingContext2D} ctx
 */
export function makeCanvasNoise(ctx: CanvasRenderingContext2D): void {
  if (ctx) {
    const w = ctx.canvas.width;
    const h = ctx.canvas.height;
    const iData = ctx.createImageData(w, h);
    const buffer32 = new Uint32Array(iData.data.buffer);
    const len = buffer32.length
    let i = 0
    for (; i < len; i++) { if (Math.random() < 0.5) buffer32[i] = 0xffffffff; }
    ctx.putImageData(iData, 0, 0);
  }
}

/**
 * Resize canvas element
 * @param {HTMLCanvasElement} canvas
 * @param {number} width
 * @param {number} height
 */
function resizeCanvasElement(canvas: HTMLCanvasElement, width: number, height: number): void {
  canvas.width = width * window.devicePixelRatio;
  canvas.height = height * window.devicePixelRatio;
  canvas.style.width = String(width) + 'px';
  canvas.style.height = String(height) + 'px';
}
