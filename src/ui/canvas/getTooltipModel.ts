import type { GameState } from "../../types/GameState";
import type { TooltipModel } from "../tooltip/tooltip";
import { getCrabTooltipText } from "./entities/world/crabOnShip";

export function getTooltipModel(
  state: GameState,
  entityId: string,
  x: number,
  y: number,
  _nowMs: number,
  entityTooltip?: string
): TooltipModel | null {
  if (entityId === "mast") {
    const current = state.ship.upgrades.sail;
    const currentBonus = `+${(current.level * 0.1).toFixed(1)} speed`;
    const nextCost = Math.round(current.cost);
    const nextBonus = `+${(current.level * 0.1 + 0.1).toFixed(1)} speed`;

    return {
      x,
      y,
      title: "Mast (Sail Upgrade)",
      current: { level: current.level, bonus: currentBonus },
      next: { cost: nextCost, bonus: nextBonus },
    };
  }

  if (entityId === "luckBucket") {
    const luckBucket = state.ship.upgrades.luckBucket;
    const spawnBonus = `x${Math.pow(1.2, luckBucket.level).toFixed(1)} spawn rate`;
    const nextCost = Math.round(luckBucket.cost);
    const nextBonus = `x${Math.pow(1.2, luckBucket.level + 1).toFixed(1)} spawn rate`;

    return {
      x,
      y,
      title: "Luck Bucket",
      current: { level: luckBucket.level, bonus: spawnBonus },
      next: { cost: nextCost, bonus: nextBonus },
      details: "Increases fish & gem spawn rate",
    };
  }

  if (entityId === "crab-ship") {
    const text = getCrabTooltipText(state, _nowMs);
    const lines = text.split("\n");
    return {
      x,
      y,
      title: lines[0],
      details: lines.slice(1).join("\n"),
    };
  }

  // Fish and gem entities: use the tooltip string from the entity
  if (entityTooltip && (entityId.startsWith("fish-") || entityId.startsWith("gem-"))) {
    return {
      x,
      y,
      title: entityTooltip,
    };
  }

  return null;
}
