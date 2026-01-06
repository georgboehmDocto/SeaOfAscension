import {
  centeredRect,
  rectWithOpaqueBounds,
} from "../../../../hitTest/rectHelpers";
import { drawSprite } from "../../../../sprites/drawSprite";
import type { SpriteSheet } from "../../../../sprites/spritesheet";
import type { Entity } from "../types";

export function createShipMastEntity(opts: { sheet: SpriteSheet }): Entity {
  const frameCount = opts.sheet.frameCount ?? opts.sheet.cols * opts.sheet.rows;
  const mastSize = { width: opts.sheet.frameW, height: opts.sheet.frameH };

  const frameIndexAt = (t: number) => Math.floor(t / 150) % frameCount;

  return {
    id: "mast",
    zIndex: 11,
    cursor: "pointer",
    tooltip: "Your Mast",

    getPickRect({ canvas, nowMs }) {
      const base = centeredRect(canvas, mastSize);

      const boundsArr = opts.sheet.opaqueBounds;
      if (!boundsArr) return base;

      const idx = frameIndexAt(nowMs);
      const b = boundsArr[idx];
      if (!b || b.width === 0 || b.height === 0) return base;

      return rectWithOpaqueBounds(base, b);
    },

    draw({ ctx, canvas, nowMs }) {
      const rect = centeredRect(canvas, mastSize);

      drawSprite(
        ctx,
        {
          kind: "sheet",
          sheet: opts.sheet,
          frameIndex: frameIndexAt,
        },
        rect,
        nowMs
      );
    },

    onClick: () => ({ type: "ship/upgradePurchased", upgradeId: "sail" }),
  };
}
