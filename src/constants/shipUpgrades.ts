import { ModifierUpgradeEffects } from "../types/Modifiers";

export type ShipUpgradeId = 'sail' | 'engine' | 'nets' | 'refinery'

export const SHIP_UPGRADE_DEFINITIONS: Record<ShipUpgradeId, ModifierUpgradeEffects> = {
  sail: { kind: "addBaseSpeed", amountPerLevel: 0.1 },
  engine: { kind: "mulSpeed", factorPerLevel: 1.05 },
  nets: { kind: "addGoldPerMeter", amountPerLevel: 0.05 },
  refinery: { kind: "mulGold", factorPerLevel: 1.1 },
}
