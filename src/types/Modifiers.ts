export type ModifierId = "speed" | "speedMultiplier" | "goldPerMeter" | "goldMultiplier";

export type ModifierUpgradeEffects =
  | { kind: "addBaseSpeed"; amountPerLevel: number; }
  | { kind: "mulSpeed"; factorPerLevel: number }
  | { kind: "addGoldPerMeter"; amountPerLevel: number }
  | { kind: "mulGold"; factorPerLevel: number }