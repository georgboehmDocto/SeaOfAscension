import type { Entity } from "../types";
import type { Rect } from "../../../../hitTest/types";
import { drawSprite } from "../../../../sprites/drawSprite";
import { rectAt } from "../../../../hitTest/rectHelpers";

const ICON_SIZE = 48;
const ICON_TEXT_GAP = 5;
const GOLD_FONT = "18px monospace";
const GOLD_TEXT_OFFSET_Y = 30;

function computeGoldRect(canvas: HTMLCanvasElement): Rect {
  const css = canvas.getBoundingClientRect();

  return rectAt(680, 350, {
    width: ICON_SIZE,
    height: ICON_SIZE,
  });
}

export function createGoldChestEntity(opts: {
  canvas: HTMLCanvasElement;
  goldChestImg: HTMLImageElement;
}): Entity {
  return {
    id: "chest",
    zIndex: 1000,
    cursor: "pointer",
    tooltip: "Your Gold",

    getPickRect({ canvas }) {
      return computeGoldRect(canvas);
    },

    draw({ ctx, canvas, state, nowMs }) {
      const rect = computeGoldRect(canvas);
      drawSprite(ctx, { kind: "image", img: opts.goldChestImg }, rect, nowMs);

      // const goldText = Math.floor(state.resources.gold).toString();
      // ctx.font = GOLD_FONT;
      // ctx.fillStyle = "#000000";
      // ctx.fillText(
      //   goldText,
      //   rect.left + rect.width + ICON_TEXT_GAP,
      //   rect.top + GOLD_TEXT_OFFSET_Y
      // );
    },

    onClick: () => null,
  };
}
