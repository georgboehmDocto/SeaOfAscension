import { getShipEconomyModifiers } from "./getShipEconomyModifiers";
import { EconomyStats, EconomyModifier } from "../types/EconomyStats";
import { GameState } from "../types/GameState";
import { applyEconomyModifiers } from "./applyEconomyModifiers";
import { getCaptainEconomyModifiers } from "./getCaptainModifiers";
import { getActiveEffectModifiers } from "./getActiveEffectModifiers";

export function deriveEconomyStats(
  state: GameState,
  nowMs: number
): EconomyStats {
  const base: EconomyStats = {
    baseSpeed: state.ship.base.baseSpeed,
    speedMultiplier: 1,
    goldPerMeter: 1,
    goldMultiplier: 1,
  };

  const modifiers: EconomyModifier[] = [
    ...getShipEconomyModifiers(state.ship),
    ...(state.captain ? getCaptainEconomyModifiers(state.captain) : []),
    ...getActiveEffectModifiers(state.activeEffects ?? [], nowMs),
    // ...crewModifiers(state.crew),
    // later: totems, artifacts, difficulty scaling, etc.
  ];

  return applyEconomyModifiers(base, modifiers);
}
