import type { Rect } from "../../../../hitTest/types";
import { SHIP_SCALE } from "../../../../constants/constants";
import type { SpriteSheet } from "../../../../sprites/spritesheet";
import type { Entity } from "../types";
import { getVisibleShipRect } from "./shipLayout";

const RUDDER_DISPLAY_H = 48 * SHIP_SCALE;

function computeRudderRect(
  canvas: HTMLCanvasElement,
  shipSheet: SpriteSheet,
  side: "left" | "right",
  img: HTMLImageElement,
): Rect {
  const visibleShip = getVisibleShipRect(canvas, shipSheet);
  const aspectRatio = img.width / img.height;
  const displayW = RUDDER_DISPLAY_H * aspectRatio;

  // Vertical center: 50% down the visible ship
  const cy = visibleShip.top + visibleShip.height * 0.5;

  if (side === "left") {
    return {
      left: visibleShip.left - displayW * 0.5,
      top: cy - RUDDER_DISPLAY_H / 2,
      width: displayW,
      height: RUDDER_DISPLAY_H,
    };
  } else {
    return {
      left: visibleShip.left + visibleShip.width - displayW * 0.5,
      top: cy - RUDDER_DISPLAY_H / 2,
      width: displayW,
      height: RUDDER_DISPLAY_H,
    };
  }
}

export function createRudderEntity(opts: {
  side: "left" | "right";
  img: HTMLImageElement;
  shipSheet: SpriteSheet;
}): Entity {
  // Brief visual feedback on click
  let clickFlashUntil = 0;

  return {
    id: `rudder-${opts.side}`,
    zIndex: 9, // Below ship (10)
    cursor: "pointer",
    tooltip: "Row!",

    getPickRect({ canvas }) {
      return computeRudderRect(canvas, opts.shipSheet, opts.side, opts.img);
    },

    draw({ ctx, canvas, nowMs }) {
      const rect = computeRudderRect(canvas, opts.shipSheet, opts.side, opts.img);
      ctx.imageSmoothingEnabled = false;

      // Brief scale-up on click
      const isFlashing = nowMs < clickFlashUntil;
      if (isFlashing) {
        const progress = 1 - (clickFlashUntil - nowMs) / 120;
        const scale = 1 + 0.15 * (1 - progress);
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        ctx.drawImage(
          opts.img,
          cx - (rect.width * scale) / 2,
          cy - (rect.height * scale) / 2,
          rect.width * scale,
          rect.height * scale,
        );
      } else {
        ctx.drawImage(opts.img, rect.left, rect.top, rect.width, rect.height);
      }
    },

    onClick: (_state, nowMs) => {
      clickFlashUntil = nowMs + 120;
      return { type: "rudder/clicked", nowMs };
    },
  };
}
