let waterOffset = 0;

export function drawSea(
  ctx: CanvasRenderingContext2D,
  waterImg: HTMLImageElement,
  canvasWidth: number,
  canvasHeight: number,
  deltaMs: number
) {
  const tileW = waterImg.width;   // 256
  const tileH = waterImg.height;  // 32

  // speed in pixels per second
  const speed = 10;
  waterOffset = (waterOffset + (speed * deltaMs) / 1000) % tileH;

  for (let y = -tileH; y < canvasHeight + tileH; y += tileH) {
    for (let x = 0; x < canvasWidth; x += tileW) {
      ctx.drawImage(
        waterImg,
        x,
        y + waterOffset
      );
    }
  }
}
