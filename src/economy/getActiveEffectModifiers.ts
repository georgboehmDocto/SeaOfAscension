import type { ActiveEffect } from "../types/ActiveEffect";
import { isEffectActive } from "../types/ActiveEffect";
import type { EconomyModifier } from "../types/EconomyStats";

/**
 * Convert active timed effects into economy modifiers.
 * Only economy-affecting effects (speed, goldBoost) are handled here.
 * Spawn rate effects are handled separately in main.ts.
 */
export function getActiveEffectModifiers(
  effects: ActiveEffect[],
  nowMs: number,
): EconomyModifier[] {
  const modifiers: EconomyModifier[] = [];

  for (const effect of effects) {
    if (!isEffectActive(effect, nowMs)) continue;

    switch (effect.kind) {
      case "speed":
        modifiers.push({
          kind: "mulSpeed",
          value: effect.magnitude,
          source: `effect:${effect.id}`,
        });
        break;
      case "goldBoost":
        modifiers.push({
          kind: "mulGold",
          value: effect.magnitude,
          source: `effect:${effect.id}`,
        });
        break;
      // spawnRate is not an economy modifier — handled in main.ts
    }
  }

  return modifiers;
}

/** Get the combined spawn rate multiplier from active effects */
export function getActiveSpawnRateMultiplier(
  effects: ActiveEffect[],
  nowMs: number,
): number {
  let multiplier = 1;
  for (const effect of effects) {
    if (!isEffectActive(effect, nowMs)) continue;
    if (effect.kind === "spawnRate") {
      multiplier *= effect.magnitude;
    }
  }
  return multiplier;
}
