import { CrewClassId, SkillId } from "./skills";

export const CREW_CLASS_SKILLSETS: Record<CrewClassId, SkillId[]> = {
  gunner: ["magnetism", "goldPunch"],
  swordsman: ["lightweight"],
  brawler: ["magnetism", "lightweight"],
};