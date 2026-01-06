export type EconomyStats = {
  baseSpeed: number;
  speedMultiplier: number;
  goldPerMeter: number;
  goldMultiplier: number;
};

export type AdditiveEconomyModifier = | "addBaseSpeed" | "addGoldPerMeter"
export type MultiplicativeEconomyModifier = | "mulSpeed" | "mulGold";

export type EconomyModifierKind = AdditiveEconomyModifier | MultiplicativeEconomyModifier
  

export type EconomyModifier = {
  kind: EconomyModifierKind;
  value: number;
  source: string;
};
