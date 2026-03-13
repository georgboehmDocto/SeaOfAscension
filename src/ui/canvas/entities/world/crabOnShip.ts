import type { Entity } from "../types";
import type { SpriteSheet } from "../../../../sprites/spritesheet";
import { SHIP_SCALE } from "../../../../constants/constants";
import { getVisibleShipRect } from "./shipLayout";

const CRAB_DISPLAY_SIZE = 28 * SHIP_SCALE;
const CRAB_FRAME_COUNT = 6;
const CRAB_FRAME_MS = 180;

export function createCrabOnShipEntity(opts: {
  index: number;
  crabImg: HTMLImageElement;
  shipSheet: SpriteSheet;
}): Entity {
  const crabFrameW = opts.crabImg.width / CRAB_FRAME_COUNT;
  const crabFrameH = opts.crabImg.height;

  // Each crab gets a slightly different animation offset so they don't all walk in sync
  const animOffset = opts.index * 317;

  return {
    id: `crab-ship-${opts.index}`,
    zIndex: 11, // Above ship (10)
    cursor: "default",

    getPickRect: ({ canvas }) => {
      const ship = getVisibleShipRect(canvas, opts.shipSheet);
      const pos = getCrabPosition(ship, opts.index);
      return { left: pos.x, top: pos.y, width: CRAB_DISPLAY_SIZE, height: CRAB_DISPLAY_SIZE };
    },

    draw: ({ ctx, canvas, nowMs }) => {
      const ship = getVisibleShipRect(canvas, opts.shipSheet);
      const pos = getCrabPosition(ship, opts.index);

      ctx.imageSmoothingEnabled = false;
      const frameIdx = Math.floor((nowMs + animOffset) / CRAB_FRAME_MS) % CRAB_FRAME_COUNT;
      ctx.drawImage(
        opts.crabImg,
        frameIdx * crabFrameW,
        0,
        crabFrameW,
        crabFrameH,
        pos.x,
        pos.y,
        CRAB_DISPLAY_SIZE,
        CRAB_DISPLAY_SIZE,
      );
    },
  };
}

/** Position crabs in a grid pattern on the ship deck */
function getCrabPosition(ship: { left: number; top: number; width: number; height: number }, index: number) {
  // Arrange crabs in rows across the ship deck
  const cols = Math.max(2, Math.floor(ship.width / (CRAB_DISPLAY_SIZE * 1.2)));
  const col = index % cols;
  const row = Math.floor(index / cols);

  // Center the grid on the ship
  const totalW = cols * CRAB_DISPLAY_SIZE * 1.2;
  const startX = ship.left + (ship.width - totalW) / 2 + CRAB_DISPLAY_SIZE * 0.1;

  // Start from 60% down the ship (below the mast area)
  const startY = ship.top + ship.height * 0.6;

  return {
    x: startX + col * CRAB_DISPLAY_SIZE * 1.2,
    y: startY + row * CRAB_DISPLAY_SIZE * 1.3,
  };
}
