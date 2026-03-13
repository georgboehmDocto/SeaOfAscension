import type { Entity } from "../types";
import type { SpriteSheet } from "../../../../sprites/spritesheet";
import { getVisibleShipRect } from "./shipLayout";
import { getNextCrabCost } from "../../../recruitmentModal";
import { formatResource } from "../../../../helpers/formatResource";
import { deriveEconomyStats } from "../../../../economy/deriveEconomyStats";
import { BASE_RUDDER_DISTANCE } from "../../../../constants/constants";

const CRAB_DISPLAY_SIZE = 96;
const CRAB_FRAME_COUNT = 6;
const CRAB_FRAME_MS = 180;
const CRAB_CLICKS_PER_SEC = 1;

export function createCrabOnShipEntity(opts: {
  crabImg: HTMLImageElement;
  shipSheet: SpriteSheet;
}): Entity {
  const crabFrameW = opts.crabImg.width / CRAB_FRAME_COUNT;
  const crabFrameH = opts.crabImg.height;

  function getCrabPos(canvas: HTMLCanvasElement) {
    const ship = getVisibleShipRect(canvas, opts.shipSheet);
    // Center between the two rudders (horizontally centered, at 50% height like rudders)
    const cx = ship.left + ship.width / 2;
    const cy = ship.top + ship.height * 0.5;
    return { x: cx - CRAB_DISPLAY_SIZE / 2, y: cy - CRAB_DISPLAY_SIZE / 2 };
  }

  let clickFlashUntil = 0;

  return {
    id: "crab-ship",
    zIndex: 11, // Above ship (10)
    cursor: "pointer",

    get tooltip() {
      return "Crab Crew";
    },

    getPickRect: ({ canvas, state }) => {
      const crabCount = state.crabs ?? 0;
      if (crabCount === 0) {
        return { left: -9999, top: -9999, width: 0, height: 0 };
      }
      const pos = getCrabPos(canvas);
      return { left: pos.x, top: pos.y, width: CRAB_DISPLAY_SIZE, height: CRAB_DISPLAY_SIZE };
    },

    onClick: (state, nowMs) => {
      const crabCount = state.crabs ?? 0;
      if (crabCount === 0) return null;
      const cost = getNextCrabCost(crabCount);
      if (state.resources.gold < cost) return null;
      clickFlashUntil = nowMs + 120;
      return { type: "crabs/purchased", quantity: 1, totalCost: cost };
    },

    draw: ({ ctx, canvas, state, nowMs }) => {
      const crabCount = state.crabs ?? 0;
      if (crabCount === 0) return;

      const pos = getCrabPos(canvas);
      ctx.imageSmoothingEnabled = false;
      const frameIdx = Math.floor(nowMs / CRAB_FRAME_MS) % CRAB_FRAME_COUNT;

      const isFlashing = nowMs < clickFlashUntil;
      if (isFlashing) {
        const progress = 1 - (clickFlashUntil - nowMs) / 120;
        const scale = 1 + 0.15 * (1 - progress);
        const cx = pos.x + CRAB_DISPLAY_SIZE / 2;
        const cy = pos.y + CRAB_DISPLAY_SIZE / 2;
        ctx.drawImage(
          opts.crabImg,
          frameIdx * crabFrameW, 0, crabFrameW, crabFrameH,
          cx - (CRAB_DISPLAY_SIZE * scale) / 2,
          cy - (CRAB_DISPLAY_SIZE * scale) / 2,
          CRAB_DISPLAY_SIZE * scale,
          CRAB_DISPLAY_SIZE * scale,
        );
      } else {
        ctx.drawImage(
          opts.crabImg,
          frameIdx * crabFrameW, 0, crabFrameW, crabFrameH,
          pos.x, pos.y, CRAB_DISPLAY_SIZE, CRAB_DISPLAY_SIZE,
        );
      }

    },
  };
}

/** Build tooltip text for the crab entity */
export function getCrabTooltipText(state: {
  crabs: number;
  ship: any;
  resources: any;
  activeEffects?: any[];
}, nowMs: number): string {
  const count = state.crabs ?? 0;
  const rudderLevel = state.ship.upgrades.rudder?.level ?? 0;
  const distPerClick = BASE_RUDDER_DISTANCE + rudderLevel * 0.5;
  const econ = deriveEconomyStats(state as any, nowMs);
  const goldPerClick = distPerClick * econ.goldPerMeter * econ.goldMultiplier;
  const clicksPerSec = count * CRAB_CLICKS_PER_SEC;
  const goldPerSec = goldPerClick * clicksPerSec;
  const nextCost = getNextCrabCost(count);

  const lines = [
    `Crab Crew (${count})`,
    `${formatResource(goldPerSec)}/s gold`,
    `Next: ${formatResource(nextCost)} gold`,
  ];
  return lines.join("\n");
}
