import type { Entity } from "../types";
import { drawSprite } from "../../../../sprites/drawSprite";
import { rectAt } from "../../../../hitTest/rectHelpers";

const ICON_SIZE = 48;
const DRIFT_SPEED = 15; // pixels per second downward

// Fish rarity tiers based on variant index (0=common, 6=legendary)
const FISH_GOLD_RANGES: [number, number][] = [
  [10, 20],   // variant 0 - common
  [15, 25],   // variant 1 - common
  [20, 40],   // variant 2 - uncommon
  [30, 50],   // variant 3 - uncommon
  [40, 70],   // variant 4 - rare
  [50, 80],   // variant 5 - rare
  [70, 100],  // variant 6 - legendary
];

function rollGoldAmount(variant: number): number {
  const range = FISH_GOLD_RANGES[variant] ?? [10, 20];
  return Math.floor(Math.random() * (range[1] - range[0] + 1)) + range[0];
}

function getRarityLabel(variant: number): string {
  if (variant <= 1) return "Common";
  if (variant <= 3) return "Uncommon";
  if (variant <= 5) return "Rare";
  return "Legendary";
}

export function createFishEntity(opts: {
  entityId: string;
  fishImg: HTMLImageElement;
  variant: number;
  x: number;
  y: number;
  spawnMs: number;
}): Entity {
  const goldAmount = rollGoldAmount(opts.variant);
  const rarity = getRarityLabel(opts.variant);

  function getCurrentY(nowMs: number): number {
    const elapsed = (nowMs - opts.spawnMs) / 1000;
    return opts.y + elapsed * DRIFT_SPEED;
  }

  return {
    id: opts.entityId,
    zIndex: 5,
    cursor: "pointer",
    tooltip: `${rarity} Fish (+${goldAmount} gold)`,
    selfDestructOnClick: true,

    getPickRect: ({ nowMs }) =>
      rectAt(opts.x, getCurrentY(nowMs), { width: ICON_SIZE, height: ICON_SIZE }),

    draw: ({ ctx, nowMs }) => {
      const rect = rectAt(opts.x, getCurrentY(nowMs), {
        width: ICON_SIZE,
        height: ICON_SIZE,
      });
      drawSprite(ctx, { kind: "image", img: opts.fishImg }, rect, nowMs);
    },

    onClick: () => ({ type: "fish/collected", goldAmount }),
  };
}
