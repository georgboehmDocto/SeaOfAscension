import { getShipEconomyModifiers } from "./getShipEconomyModifiers";
import { EconomyStats, EconomyModifier } from "../types/EconomyStats";
import { GameState } from "../types/GameState";
import { applyEconomyModifiers } from "./applyEconomyModifiers";
import { getActiveEffectModifiers } from "./getActiveEffectModifiers";

export function deriveEconomyStats(
  state: GameState,
  nowMs: number
): EconomyStats {
  const base: EconomyStats = {
    baseSpeed: state.ship.base.baseSpeed,
    speedMultiplier: 1,
  };

  const modifiers: EconomyModifier[] = [
    ...getShipEconomyModifiers(state.ship),
    ...getActiveEffectModifiers(state.activeEffects ?? [], nowMs),
  ];

  return applyEconomyModifiers(base, modifiers);
}
