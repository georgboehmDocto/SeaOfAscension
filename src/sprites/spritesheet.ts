import { OpaqueBounds } from "../hitTest/types";

export type SpriteSheet = {
  img: HTMLImageElement;
  frameW: number;
  frameH: number;
  cols: number;
  rows: number;
  frameCount?: number;

  opaqueBounds?: OpaqueBounds[];
};


export function drawSpriteFrame(
  ctx: CanvasRenderingContext2D,
  sheet: SpriteSheet,
  frameIndex: number,
  dx: number,
  dy: number,
  dw: number = sheet.frameW,
  dh: number = sheet.frameH
) {
  const col = frameIndex % sheet.cols;
  const row = Math.floor(frameIndex / sheet.cols);

  const sx = col * sheet.frameW;
  const sy = row * sheet.frameH;

  ctx.drawImage(sheet.img, sx, sy, sheet.frameW, sheet.frameH, dx, dy, dw, dh);
}
