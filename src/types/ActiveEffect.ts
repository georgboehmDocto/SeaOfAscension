/**
 * A timed effect active on the player.
 * Effects are persisted in game state and tick down even while offline.
 *
 * To add a new effect kind:
 * 1. Add a new entry to `ActiveEffectKind`
 * 2. Handle it in `getActiveEffectModifiers` (for economy effects)
 *    or in `getActiveSpawnRateMultiplier` (for spawn effects)
 *    or in whatever new system consumes it.
 * 3. Add corresponding shop items in `shopItems.ts`.
 */
export type ActiveEffectKind =
  | "speed"       // Multiplies ship speed
  | "spawnRate"   // Multiplies collectible spawn rate
  | "goldBoost";  // Multiplies gold earned

export type ActiveEffect = {
  id: string;
  kind: ActiveEffectKind;
  /** Multiplier value (e.g. 2 = double) */
  magnitude: number;
  /** When the effect started (epoch ms) */
  startMs: number;
  /** Duration in ms */
  durationMs: number;
  /** Display name for the HUD */
  name: string;
  /** Asset path for the HUD icon */
  iconPath: string;
};

/** Check if an effect is still active */
export function isEffectActive(effect: ActiveEffect, nowMs: number): boolean {
  return nowMs < effect.startMs + effect.durationMs;
}

/** Get remaining ms for an effect */
export function getEffectRemainingMs(effect: ActiveEffect, nowMs: number): number {
  return Math.max(0, effect.startMs + effect.durationMs - nowMs);
}

/** Filter to only active effects */
export function getActiveEffects(effects: ActiveEffect[], nowMs: number): ActiveEffect[] {
  return effects.filter((e) => isEffectActive(e, nowMs));
}
