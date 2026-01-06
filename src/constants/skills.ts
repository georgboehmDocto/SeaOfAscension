import { CaptainId } from "../types/CaptainState";
import { AdditiveEconomyModifier, MultiplicativeEconomyModifier } from "../types/EconomyStats";

export type CrewClassId = "gunner" | "swordsman" | "brawler";

export type SkillOwner =
  | { kind: "crew"; classId: CrewClassId }
  | { kind: "captain"; classId: CaptainId };

export type SkillId = string; // or union later

// what the skill does (passive vs active)
export type PassiveEffect =
  | { kind: AdditiveEconomyModifier; amountPerRank: number; }
  | { kind: MultiplicativeEconomyModifier; factorPerRank: number; }

export type ActiveEffect =
  | { kind: "grantGold"; amountPerRank: number }
  | { kind: "goldRush"; durationSeconds: number; goldMultiplierPerRank: number }
  | {
      kind: "speedBurst";
      durationSeconds: number;
      speedMultiplierPerRank: number;
    };

export type SkillEffect =
  | { type: "passive"; effect: PassiveEffect }
  | { type: "active"; effect: ActiveEffect; cooldownSeconds: number };

export type SkillMilestone = {
  atLevel: number; // champion level
  rank: number; // skill rank after reaching that level
};

export type SkillDefinition = {
  id: SkillId;
  name: string;
  description?: string;
  effect: SkillEffect;
  milestones: SkillMilestone[]; // sorted ascending by atLevel
};

export const SKILLS: Record<SkillId, SkillDefinition> = {
  magnetism: {
    id: "magnetism",
    name: "Magnetism",
    effect: { type: "passive", effect: { kind: "addGoldPerMeter", amountPerRank: 0.1 } },
    milestones: [
      { atLevel: 1, rank: 1 },
      { atLevel: 3, rank: 2 },
      { atLevel: 5, rank: 3 },
    ],
  },

  lightweight: {
    id: "lightweight",
    name: "Lightweight",
    effect: { type: "passive", effect: { kind: "mulSpeed", factorPerRank: 1.1 } },
    milestones: [
      { atLevel: 2, rank: 1 },
      { atLevel: 4, rank: 2 },
      { atLevel: 6, rank: 3 },
    ],
  },

  goldPunch: {
    id: "goldPunch",
    name: "Gold Punch",
    effect: { type: "active", effect: { kind: "grantGold", amountPerRank: 120 }, cooldownSeconds: 30 },
    milestones: [
      { atLevel: 1, rank: 1 },
      { atLevel: 3, rank: 2 },
      { atLevel: 7, rank: 3 },
    ],
  },
} as const;