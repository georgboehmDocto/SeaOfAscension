export type ModifierId = "speed" | "speedMultiplier";

export type ModifierUpgradeEffects =
  | { kind: "addBaseSpeed"; amountPerLevel: number; }
  | { kind: "mulSpeed"; factorPerLevel: number }
  | { kind: "mulSpawnRate"; factorPerLevel: number }
  | { kind: "addRudderDistance"; amountPerLevel: number }
