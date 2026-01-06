import { CAPTAIN_CLASS_SKILLSETS } from "../constants/captainSkills";
import { CREW_CLASS_SKILLSETS } from "../constants/crewSkills";
import { SkillOwner, SkillId } from "../constants/skills";

export function getSkillset(owner: SkillOwner): SkillId[] {
  switch (owner.kind) {
    case "crew":
      return CREW_CLASS_SKILLSETS[owner.classId];
    case "captain":
      return CAPTAIN_CLASS_SKILLSETS[owner.classId];
  }
}