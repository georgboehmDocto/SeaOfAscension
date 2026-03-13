import { EconomyModifier } from "../types/EconomyStats";
import type { ShipState } from "../types/ShipState";
import { SHIP_UPGRADE_DEFINITIONS } from "../constants/shipUpgrades";

export function getShipEconomyModifiers(ship: ShipState): EconomyModifier[] {
  const modifiers: EconomyModifier[] = [];

  for (const key in ship.upgrades) {
    const upgrade = ship.upgrades[key as keyof typeof ship.upgrades];
    const def = SHIP_UPGRADE_DEFINITIONS[key as keyof typeof ship.upgrades];
    const level = upgrade.level;

    if (level <= 0) continue;

    switch (def.kind) {
      case "addBaseSpeed":
        modifiers.push({
          kind: "addBaseSpeed",
          value: def.amountPerLevel * upgrade.level,
          source: 'ship'
        });
        break;

      case "mulSpeed":
        modifiers.push({
          kind: "mulSpeed",
          value: Math.pow(def.factorPerLevel, upgrade.level),
          source: 'ship'
        });
        break;

      case "mulSpawnRate":
        // Spawn rate is handled outside the economy system
        break;
    }
  }

  return modifiers;
}
