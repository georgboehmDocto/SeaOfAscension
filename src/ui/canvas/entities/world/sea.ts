// sea.ts
import type { Entity } from "../types";
import type { Rect } from "../../../../hitTest/types";

function getCanvasRect(canvas: HTMLCanvasElement): Rect {
  return {
    left: 0,
    top: 0,
    width: canvas.width,
    height: canvas.height,
  };
}

// TODO: Create generalized function 'createEntity'
export function createSeaEntity(opts: {
  waterImg: HTMLImageElement;
}): Entity {
  return {
    id: "sea",
    zIndex: 0,
    cursor: "default",

    // Sea is not interactive → return an empty rect
    getPickRect() {
      return { left: 0, top: 0, width: 0, height: 0 };
    },

    draw({ ctx, canvas, nowMs }) {
      const rect = getCanvasRect(canvas);

      const tileW = opts.waterImg.width;
      const tileH = opts.waterImg.height;

      // pixels per second
      const speedX = 2;
      const speedY = 10;

      const timeSeconds = nowMs / 1000;
      const offsetX = Math.floor((timeSeconds * speedX) % tileW);
      const offsetY = Math.floor((timeSeconds * speedY) % tileH);

      for (let y = -tileH; y < rect.height + tileH; y += tileH) {
        for (let x = -tileW; x < rect.width + tileW; x += tileW) {
          ctx.drawImage(
            opts.waterImg,
            rect.left + x + offsetX,
            rect.top + y + offsetY
          );
        }
      }
    },
  };
}
