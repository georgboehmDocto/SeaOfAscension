import { centeredRect, rectWithOpaqueBounds } from "../../../../hitTest/rectHelpers";
import { drawSprite } from "../../../../sprites/drawSprite";
import type { SpriteSheet } from "../../../../sprites/spritesheet";
import type { Entity } from "../types";

export function createShipEntity(opts: { sheet: SpriteSheet }): Entity {
  const frameCount = opts.sheet.frameCount ?? opts.sheet.cols * opts.sheet.rows;
  const shipSize = { width: opts.sheet.frameW, height: opts.sheet.frameH };

  const frameIndexAt = (t: number) => Math.floor(t / 150) % frameCount;

  return {
    id: "ship",
    zIndex: 10,
    cursor: "pointer",
    tooltip: "Your ship",

    getPickRect({ canvas, nowMs }) {
      const base = centeredRect(canvas, shipSize);

      const boundsArr = opts.sheet.opaqueBounds;
      if (!boundsArr) return base;

      const idx = frameIndexAt(nowMs);
      const b = boundsArr[idx];
      if (!b || b.width === 0 || b.height === 0) return base;

      return rectWithOpaqueBounds(base, b);
    },

    draw({ ctx, canvas, nowMs }) {
      const rect = centeredRect(canvas, shipSize);

      drawSprite(
        ctx,
        {
          kind: "sheet",
          sheet: opts.sheet,
          frameIndex: (t) => Math.floor(t / 150) % frameCount,
        },
        rect,
        nowMs
      );
    },

    onClick: () => null,
  };
}
