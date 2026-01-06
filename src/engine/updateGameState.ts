import { applyResourceGain } from "./applyResourceGain";
import { computeResourceGain } from "./computeResourceGain";
import { deriveEconomyStats } from "../economy/deriveEconomyStats";
import { GameState } from "../types/GameState";

export function updateGameState(
  gameState: GameState,
  deltaInSeconds: number,
  now: number
) {
  const economyStats = deriveEconomyStats(gameState, now);

  const resourceGain = computeResourceGain(
    economyStats,
    gameState.resources.lifeTimeGoldEarned,
    deltaInSeconds
  );
  const newResources = applyResourceGain(gameState.resources, resourceGain);

  return {
    ...gameState,
    resources: newResources,
    lastTick: now,
  };
}
