import { deriveEconomyStats } from "../../economy/deriveEconomyStats";
import type { GameState } from "../../types/GameState";
import type { TooltipModel } from "../tooltip/tooltip";

export function getTooltipModel(
  state: GameState,
  entityId: string,
  x: number,
  y: number,
  nowMs: number
): TooltipModel | null {
  switch (entityId) {
    case "mast": {
      const current = state.ship.upgrades.sail;
      // You decide how you compute these; placeholders:
      const currentBonus = `+${current.level * 0.1} speed`;
      const nextCost = Math.round(current.cost); // or your real formula
      const nextBonus = `+${current.level * 0.1 + 0.1 } speed`;

      return {
        x,
        y,
        title: "Mast",
        current: { level: current.level, bonus: currentBonus },
        next: { cost: nextCost, bonus: nextBonus },
      };
    }

    case "chest":
      const economy = deriveEconomyStats(state, nowMs);
      const details = [
        `Gold: ${state.resources.gold.toFixed()}`,
      ].join("\n");

      return { x, y, title: "Resources", details: `${details}` };

    default:
      return null;
  }
}
