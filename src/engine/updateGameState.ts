import { applyResourceGain } from "./applyResourceGain";
import { computeResourceGain } from "./computeResourceGain";
import { deriveEconomyStats } from "../economy/deriveEconomyStats";
import { GameState } from "../types/GameState";

export function updateGameState(
  gameState: GameState,
  deltaInSeconds: number,
  now: number
) {
  // Ship is docked at an island — no resource gain
  if (gameState.island.docked) {
    return {
      ...gameState,
      lastTick: now,
    };
  }

  const economyStats = deriveEconomyStats(gameState, now);

  const resourceGain = computeResourceGain(
    economyStats,
    gameState.resources.lifeTimeGoldEarned,
    deltaInSeconds
  );

  const newResources = applyResourceGain(gameState.resources, resourceGain);

  // Check if we've reached the next island
  const reachedIsland = newResources.distance >= gameState.island.nextIslandAt;

  return {
    ...gameState,
    resources: newResources,
    lastTick: now,
    island: reachedIsland
      ? { ...gameState.island, docked: true, chestOpened: false }
      : gameState.island,
  };
}
