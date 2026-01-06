import { SKILLS } from "../constants/skills";
import { CaptainState } from "../types/CaptainState";
import { EconomyModifier } from "../types/EconomyStats";

export function getCaptainEconomyModifiers(
  captain: CaptainState
): EconomyModifier[] {
  
  const modifiers: EconomyModifier[] = [];

  for (const skillId in captain.skills) {
    const level = captain.skills[skillId];
    const effect = SKILLS[skillId].effect.effect;

    if (level <= 0) continue;

    switch (effect.kind) {
      case "addBaseSpeed":
        modifiers.push({
          kind: "addBaseSpeed",
          value: effect.amountPerRank * level,
          source: "captain",
        });
        break;

      case "mulSpeed":
        modifiers.push({
          kind: "mulSpeed",
          value: Math.pow(effect.factorPerRank, level),
          source: "captain",
        });
        break;

      case "addGoldPerMeter":
        modifiers.push({
          kind: "addGoldPerMeter",
          value: effect.amountPerRank * level,
          source: "captain",
        });
        break;

      case "mulGold":
        modifiers.push({
          kind: "mulGold",
          value: Math.pow(effect.factorPerRank, level),
          source: "captain",
        });
        break;
    }
  }

  return modifiers;
}
