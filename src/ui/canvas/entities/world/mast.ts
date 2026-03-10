import { rectWithOpaqueBounds } from "../../../../hitTest/rectHelpers";
import type { Rect } from "../../../../hitTest/types";
import { SHIP_SCALE } from "../../../../constants/constants";
import { drawSpriteFrame } from "../../../../sprites/spritesheet";
import type { SpriteSheet } from "../../../../sprites/spritesheet";
import type { Entity } from "../types";
import { getVisibleShipRect } from "./shipLayout";

function computeMastRect(
  canvas: HTMLCanvasElement,
  shipSheet: SpriteSheet,
  mastSheet: SpriteSheet,
): Rect {
  const mastW = mastSheet.frameW * SHIP_SCALE;
  const mastH = mastSheet.frameH * SHIP_SCALE;

  const visibleShip = getVisibleShipRect(canvas, shipSheet);
  const shipCenterX = visibleShip.left + visibleShip.width / 2;

  const css = canvas.getBoundingClientRect();
  const canvasCenterY = css.height / 2;

  return {
    left: shipCenterX - mastW / 2 + mastW * 0.15,
    top: canvasCenterY - mastH / 1.5,
    width: mastW,
    height: mastH,
  };
}

export function createShipMastEntity(opts: {
  sheet: SpriteSheet;
  shipSheet: SpriteSheet;
}): Entity {
  const frameCount = opts.sheet.frameCount ?? opts.sheet.cols * opts.sheet.rows;

  const frameIndexAt = (t: number) => Math.floor(t / 150) % frameCount;

  return {
    id: "mast",
    zIndex: 11,
    cursor: "pointer",
    tooltip: "Your Mast",

    getPickRect({ canvas, nowMs }) {
      const rect = computeMastRect(canvas, opts.shipSheet, opts.sheet);

      const boundsArr = opts.sheet.opaqueBounds;
      if (!boundsArr) return rect;

      const idx = frameIndexAt(nowMs);
      const b = boundsArr[idx];
      if (!b || b.width === 0 || b.height === 0) return rect;

      return rectWithOpaqueBounds(rect, {
        x: b.x * SHIP_SCALE,
        y: b.y * SHIP_SCALE,
        width: b.width * SHIP_SCALE,
        height: b.height * SHIP_SCALE,
      });
    },

    draw({ ctx, canvas, nowMs }) {
      const rect = computeMastRect(canvas, opts.shipSheet, opts.sheet);
      const frame = frameIndexAt(nowMs);

      drawSpriteFrame(
        ctx,
        opts.sheet,
        frame,
        rect.left,
        rect.top,
        rect.width,
        rect.height,
      );
    },

    onClick: () => ({ type: "ship/upgradePurchased", upgradeId: "sail" }),
  };
}
