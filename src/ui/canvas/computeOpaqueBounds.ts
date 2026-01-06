import { OpaqueBounds } from "../../hitTest/types";
import { SpriteSheet } from "../../sprites/spritesheet";

export function computeOpaqueBounds(sheet: SpriteSheet): OpaqueBounds[] {
  const frameCount = sheet.frameCount ?? sheet.cols * sheet.rows;

  const c = document.createElement("canvas");
  c.width = sheet.frameW;
  c.height = sheet.frameH;
  const ctx = c.getContext("2d");
  if (!ctx) throw new Error("2D canvas context not available");

  const out: OpaqueBounds[] = new Array(frameCount);

  for (let i = 0; i < frameCount; i++) {
    ctx.clearRect(0, 0, c.width, c.height);

    const col = i % sheet.cols;
    const row = Math.floor(i / sheet.cols);
    const sx = col * sheet.frameW;
    const sy = row * sheet.frameH;

    ctx.drawImage(
      sheet.img,
      sx,
      sy,
      sheet.frameW,
      sheet.frameH,
      0,
      0,
      sheet.frameW,
      sheet.frameH
    );

    const img = ctx.getImageData(0, 0, sheet.frameW, sheet.frameH);
    const { data, width, height } = img;

    let minX = width,
      minY = height,
      maxX = -1,
      maxY = -1;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const a = data[(y * width + x) * 4 + 3]; // alpha
        if (a > 0) {
          if (x < minX) minX = x;
          if (y < minY) minY = y;
          if (x > maxX) maxX = x;
          if (y > maxY) maxY = y;
        }
      }
    }

    out[i] =
      maxX === -1
        ? { x: 0, y: 0, width: 0, height: 0 }
        : { x: minX, y: minY, width: maxX - minX + 1, height: maxY - minY + 1 };
  }

  sheet.opaqueBounds = out;
  return out;
}
