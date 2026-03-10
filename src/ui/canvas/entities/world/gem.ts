import type { Entity } from "../types";
import { rectAt } from "../../../../hitTest/rectHelpers";

const DISPLAY_SIZE = 72;
const GEM_FRAMES = 8;
const GEM_FRAME_SIZE = 32; // source sprite frame is 32x32
const DRIFT_SPEED = 10; // pixels per second downward

export function createGemEntity(opts: {
  entityId: string;
  gemImg: HTMLImageElement;
  x: number;
  y: number;
  spawnMs: number;
}): Entity {
  function getCurrentY(nowMs: number): number {
    const elapsed = (nowMs - opts.spawnMs) / 1000;
    return opts.y + elapsed * DRIFT_SPEED;
  }

  return {
    id: opts.entityId,
    zIndex: 5,
    cursor: "pointer",
    tooltip: "Gem (+1)",
    selfDestructOnClick: true,

    getPickRect: ({ nowMs }) =>
      rectAt(opts.x, getCurrentY(nowMs), { width: DISPLAY_SIZE, height: DISPLAY_SIZE }),

    draw: ({ ctx, nowMs }) => {
      const y = getCurrentY(nowMs);
      const frame = Math.floor(nowMs / 120) % GEM_FRAMES;
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(
        opts.gemImg,
        frame * GEM_FRAME_SIZE,
        0,
        GEM_FRAME_SIZE,
        GEM_FRAME_SIZE,
        opts.x,
        y,
        DISPLAY_SIZE,
        DISPLAY_SIZE
      );
    },

    onClick: () => ({ type: "gem/collected" }),
  };
}
