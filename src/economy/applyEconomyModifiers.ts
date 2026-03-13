import { EconomyModifier, EconomyStats } from "../types/EconomyStats";

export function applyEconomyModifiers(
  base: EconomyStats,
  modifiers: EconomyModifier[]
): EconomyStats {
  return modifiers.reduce((stats, mod) => {
    switch (mod.kind) {
      case "addBaseSpeed":
        return { ...stats, baseSpeed: stats.baseSpeed + mod.value };

      case "mulSpeed":
        return { ...stats, speedMultiplier: stats.speedMultiplier * mod.value };

      default:
        return stats;
    }
  }, base);
}
