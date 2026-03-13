export type EconomyStats = {
  baseSpeed: number;
  speedMultiplier: number;
};

export type AdditiveEconomyModifier = "addBaseSpeed";
export type MultiplicativeEconomyModifier = "mulSpeed";

export type EconomyModifierKind = AdditiveEconomyModifier | MultiplicativeEconomyModifier;

export type EconomyModifier = {
  kind: EconomyModifierKind;
  value: number;
  source: string;
};
