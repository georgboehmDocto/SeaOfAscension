import { CAPTAIN_CLASS_SKILLSETS } from "../constants/captainSkills";
import { CaptainId, CaptainState } from "../types/CaptainState";
import { getDefaultStats } from "./getDefaultStats";

export function getDefaultCaptainState(captainId: CaptainId): CaptainState {
  return {
    id: captainId,
    level: 0,
    stats: getDefaultStats(),
    skills: Object.fromEntries(CAPTAIN_CLASS_SKILLSETS[captainId].map((skill) => [skill, 0]))
  };
}
