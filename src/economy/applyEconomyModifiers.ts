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

      case "addGoldPerMeter":
        return { ...stats, goldPerMeter: stats.goldPerMeter + mod.value };

      case "mulGold":
        return { ...stats, goldMultiplier: stats.goldMultiplier * mod.value };

      default:
        return stats;
    }
  }, base);
}
