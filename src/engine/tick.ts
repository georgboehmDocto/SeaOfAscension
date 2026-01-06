import { GameState } from "../types/GameState";
import { computeDeltaSeconds } from "./computeDeltaSeconds";
import { updateGameState } from "./updateGameState";

export function tick(gameState: GameState, nowMs: number): GameState {
  const deltaInSeconds = computeDeltaSeconds(gameState.lastTick, nowMs);
  
  if (deltaInSeconds === 0) {
    return gameState;
  }

  return updateGameState(gameState, deltaInSeconds, nowMs);
}
