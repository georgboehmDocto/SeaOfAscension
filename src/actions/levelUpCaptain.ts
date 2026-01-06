import {
  SkillDefinition,
  SkillId,
  SkillOwner,
  SKILLS,
} from "../constants/skills";
import { getSkillset } from "../helpers/getSkillset";
import { CaptainState } from "../types/CaptainState";
import { CrewMemberStats } from "../types/CrewMember";
import { GameState } from "../types/GameState";

export function levelUpCaptain(captain: CaptainState): CaptainState {
  const newLevel = captain.level + 1;
  const newStats = incrementStats(captain.stats);
  const newSkills = applyLevelUpSkills(
    { kind: "captain", classId: captain.id },
    newLevel,
    captain.skills
  );

  return {
    ...captain,
    level: newLevel,
    stats: newStats,
    skills: newSkills,
  };
}

function incrementStats(stats: CrewMemberStats): CrewMemberStats {
  return {
    vitality: stats.vitality + 1,
    strength: stats.strength + 1,
    magic: stats.magic + 1,
    precision: stats.precision + 1,
  };
}

function applyLevelUpSkills(
  owner: SkillOwner,
  newLevel: number,
  currentRanks: Record<SkillId, number>
): Record<SkillId, number> {
  const skillIds = getSkillset(owner);

  for (const id of skillIds) {
    const def = SKILLS[id];

    const newRank = rankAtLevel(def, newLevel);
    const oldRank = currentRanks[id] ?? 0;

    if (newRank > oldRank) {
      currentRanks[id] = newRank;
      // optionally: emit events like "skillUnlocked" / "skillUpgraded"
    }
  }

  return currentRanks;
}

function rankAtLevel(def: SkillDefinition, level: number): number {
  let rank = 0;
  for (const m of def.milestones) {
    if (m.atLevel <= level) rank = m.rank;
    else break;
  }
  return rank;
}
