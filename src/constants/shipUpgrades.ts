import { ModifierUpgradeEffects } from "../types/Modifiers";

export type ShipUpgradeId = 'sail' | 'engine' | 'luckBucket' | 'rudder'

export const SHIP_UPGRADE_DEFINITIONS: Record<ShipUpgradeId, ModifierUpgradeEffects> = {
  sail: { kind: "addBaseSpeed", amountPerLevel: 0.1 },
  engine: { kind: "mulSpeed", factorPerLevel: 1.05 },
  luckBucket: { kind: "mulSpawnRate", factorPerLevel: 1.2 },
  rudder: { kind: "addRudderDistance", amountPerLevel: 0.5 },
}
