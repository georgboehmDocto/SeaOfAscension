import type { Entity } from "../types";
import { drawSprite } from "../../../../sprites/drawSprite";
import { rectAt } from "../../../../hitTest/rectHelpers";

const ICON_SIZE = 32; // 32x32

export function createFishEntity(opts: {
  canvas: HTMLCanvasElement;
  fishImg: HTMLImageElement;
  x: number;
  y: number;
}): Entity {
  return {
    id: "fish",
    zIndex: 1,
    cursor: "pointer",
    tooltip: "A fish!",
    getPickRect: () => rectAt(opts.x, opts.y, { width: ICON_SIZE, height: ICON_SIZE }),
    draw: ({ ctx, nowMs }) => {
      const rect = rectAt(opts.x, opts.y, { width: ICON_SIZE, height: ICON_SIZE });
      drawSprite(ctx, { kind: "image", img: opts.fishImg }, rect, nowMs);
    },
    onClick: () => null,
  };
}
