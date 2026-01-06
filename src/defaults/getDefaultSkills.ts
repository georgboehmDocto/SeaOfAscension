import { SkillOwner, SKILLS } from "../constants/skills";
import { getSkillset } from "../helpers/getSkillset";

export function getDefaultSkills(owner: SkillOwner):Record<string, number>  {
    const availableSkills = getSkillset(owner)

    return Object.fromEntries(
    availableSkills.map(skill => [skill, 0])
  );
}