import { centeredRect, rectWithOpaqueBounds } from "../../../../hitTest/rectHelpers";
import { SHIP_SCALE } from "../../../../constants/constants";
import { drawSpriteFrame } from "../../../../sprites/spritesheet";
import type { SpriteSheet } from "../../../../sprites/spritesheet";
import type { Entity } from "../types";

export function createShipEntity(opts: { sheet: SpriteSheet }): Entity {
  const frameCount = opts.sheet.frameCount ?? opts.sheet.cols * opts.sheet.rows;
  const scaledSize = {
    width: opts.sheet.frameW * SHIP_SCALE,
    height: opts.sheet.frameH * SHIP_SCALE,
  };

  const frameIndexAt = (t: number) => Math.floor(t / 150) % frameCount;

  return {
    id: "ship",
    zIndex: 10,
    cursor: "default",

    getPickRect({ canvas, nowMs }) {
      const base = centeredRect(canvas, scaledSize);

      const boundsArr = opts.sheet.opaqueBounds;
      if (!boundsArr) return base;

      const idx = frameIndexAt(nowMs);
      const b = boundsArr[idx];
      if (!b || b.width === 0 || b.height === 0) return base;

      return rectWithOpaqueBounds(base, {
        x: b.x * SHIP_SCALE,
        y: b.y * SHIP_SCALE,
        width: b.width * SHIP_SCALE,
        height: b.height * SHIP_SCALE,
      });
    },

    draw({ ctx, canvas, nowMs }) {
      const rect = centeredRect(canvas, scaledSize);
      const frame = frameIndexAt(nowMs);

      drawSpriteFrame(
        ctx,
        opts.sheet,
        frame,
        rect.left,
        rect.top,
        scaledSize.width,
        scaledSize.height
      );
    },
  };
}
