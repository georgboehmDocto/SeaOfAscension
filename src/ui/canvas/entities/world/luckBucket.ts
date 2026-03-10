import { centeredRect } from "../../../../hitTest/rectHelpers";
import type { Rect } from "../../../../hitTest/types";
import { SHIP_SCALE } from "../../../../constants/constants";
import type { SpriteSheet } from "../../../../sprites/spritesheet";
import type { Entity } from "../types";
import { getVisibleShipRect } from "./shipLayout";

const BUCKET_DISPLAY_SIZE = 32 * SHIP_SCALE; // 48px

/**
 * Position bucket at horizontal center of the visible ship,
 * at 70% of the visible ship's height.
 */
function computeBucketRect(
  canvas: HTMLCanvasElement,
  shipSheet: SpriteSheet
): Rect {
  const visibleShip = getVisibleShipRect(canvas, shipSheet);

  return {
    left: visibleShip.left + (visibleShip.width - BUCKET_DISPLAY_SIZE) / 2,
    top: visibleShip.top + visibleShip.height * 0.7 - BUCKET_DISPLAY_SIZE / 2,
    width: BUCKET_DISPLAY_SIZE,
    height: BUCKET_DISPLAY_SIZE,
  };
}

export function createLuckBucketEntity(opts: {
  bucketImg: HTMLImageElement;
  shipSheet: SpriteSheet;
}): Entity {
  return {
    id: "luckBucket",
    zIndex: 12,
    cursor: "pointer",
    tooltip: "Luck Bucket",

    getPickRect({ canvas }) {
      return computeBucketRect(canvas, opts.shipSheet);
    },

    draw({ ctx, canvas }) {
      const rect = computeBucketRect(canvas, opts.shipSheet);
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(
        opts.bucketImg,
        rect.left,
        rect.top,
        rect.width,
        rect.height
      );
    },

    onClick: () => ({ type: "ship/upgradePurchased", upgradeId: "luckBucket" }),
  };
}
