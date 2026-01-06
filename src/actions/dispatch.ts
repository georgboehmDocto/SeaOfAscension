import { tick } from "../engine/tick";
import { GameState } from "../types/GameState";
import { GameAction } from "./GameAction";
import { reduce } from "./reduce";

export function dispatch(
  state: GameState,
  now: number,
  action: GameAction
): GameState {
  const settled = tick(state, now);

  return reduce(settled, action);
}
