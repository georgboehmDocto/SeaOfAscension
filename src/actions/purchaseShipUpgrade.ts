import { COST_GROWTH_FACTOR } from "../constants/constants";
import { ShipUpgradeId } from "../constants/shipUpgrades";
import { GameState } from "../types/GameState";

export function purchaseShipUpgrade(
  gameState: GameState,
  upgradeId: ShipUpgradeId
): GameState {
  const current = gameState.ship.upgrades[upgradeId];
  const remainingGold = gameState.resources.gold - current.cost;

  if (remainingGold < 0) return gameState;

  const next = {
    ...current,
    level: current.level + 1,
    cost: current.cost * COST_GROWTH_FACTOR ** (current.level + 1),
  };

  return {
    ...gameState,
    ship: {
      ...gameState.ship,
      upgrades: {
        ...gameState.ship.upgrades,
        [upgradeId]: next,
      },
    },
    resources: {
      ...gameState.resources,
      gold: remainingGold,
    },
  };
}
