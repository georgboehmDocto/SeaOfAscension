import { computeDistanceGain } from "./computeDistanceGain";
import { deriveEconomyStats } from "../economy/deriveEconomyStats";
import { GameState } from "../types/GameState";
import { getIslandType } from "../types/IslandState";

export function updateGameState(
  gameState: GameState,
  deltaInSeconds: number,
  now: number,
) {
  // Ship is docked at an island — no movement
  if (gameState.island.docked) {
    return {
      ...gameState,
      lastTick: now,
    };
  }

  const economyStats = deriveEconomyStats(gameState, now);
  const distanceGain = computeDistanceGain(economyStats, deltaInSeconds);
  const newDistance = gameState.resources.distance + distanceGain;

  // Check if we've reached the next island
  const reachedIsland = newDistance >= gameState.island.nextIslandAt;

  return {
    ...gameState,
    resources: {
      ...gameState.resources,
      distance: reachedIsland ? gameState.island.nextIslandAt : newDistance,
    },
    lastTick: now,
    island: reachedIsland
      ? {
          ...gameState.island,
          docked: true,
          chestOpened: false,
          shopItemPurchased: false,
          purchasedShopItemId: null,
          shopItemIds: null,
          islandType: getIslandType(gameState.island.islandsVisited),
        }
      : gameState.island,
  };
}
